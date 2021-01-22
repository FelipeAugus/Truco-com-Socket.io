const porta = 3000;

const Jogador = require('./classes/jogador.js');
const Game = require('./classes/game.js');


const express = require('express');
const path = require('path'); 

const app = express();
const server = require('http').createServer(app);  // Protocolo http
const io = require('socket.io')(server);  // Define o protocolo do web socket

// Definir oq é front
app.use(express.static(path.join(__dirname, 'public')));

// Definir as views como html e não ejs que é padrão do node
app.set('views', path.join(__dirname, 'public'));  
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

const usuarios = new Map; //socket id e nick
const nick = new Map; // nick e codGame
const games = new Map; // codGame e game;

let codGame = [0 ,0]; // Codigo do game e se a mesa já está ok


io.on('connection', socket => {// Identifica conexões
    console.log(`${socket.id} CONECTADO`);
    // LOGIN
    socket.on('username', usu =>{
        let dup = 0;

        dup = [...usuarios.values()].indexOf(usu); //Se não existe retorna -1;

        if (dup == -1) {
            console.log(`USU: ${usu} OK`);
            usuarios.set(socket.id, usu);
            socket.emit("userOk", usu);
        } else {
            console.log(`USU: ${usu} INDISPONIVEL`);
            socket.emit("userNok");
        }
    });
    // Find game
    socket.on('newGame', usu =>{
        let J = new Jogador(usu, socket.id);

        if (codGame[1] == 0){
            let G = new Game(codGame[0], J);
            games.set(codGame[0], G); // Guarda o jogo
            codGame[1] = 1;
            nick.set(usu, codGame[0]); // Marca em qual jogo o usuario está
        }else{
            let G = games.get(codGame[0]);
            G.setp2(J);
            nick.set(usu, codGame[0]); // Marca em qual jogo o usuario está
            G.start();

            codGame[1] = 0;
            codGame[0]++;

            io.to(G.p1.id).emit("cards", G.p1);
            socket.emit("cards", J);
        }
    });

    //Jogar carta
    socket.on("cardAtk", x =>{
        const G = games.get(nick.get(usuarios.get(socket.id)));
        let J1, J2;
        
        if(G.p1.id == socket.id && G.vez){
            J1 = G.p1;
            J2 = G.p2;
        }else if (G.p2.id == socket.id && !G.vez){
            J1 = G.p2;
            J2 = G.p1;
        }else{
            socket.emit("AtkAtiv", null);
            return;
        }

        G.mesa.push([J1.id, J1.mao[x]]) // Armazena as cartas para o calculo de vencedor
        socket.emit("AtkAtiv", [x, J1.mao[x]]);
        io.to(J2.id).emit("AtkPasv", J1.mao[x]);


        //Calcula vitória da mesa
        if(G.mesa.length == 2){
            G.rodada++;

            let m1 = G.mesa[0]; //[id, carta]
            let m2 = G.mesa[1];
            
            let c1 = m1[1]; // carta
            let c2 = m2[1];

            let win;

            if(c1.ordem < c2.ordem){
                win = true;
            }else if(c1.ordem > c2.ordem){
                win = false; 
            }else{
                G.setvez();
                return;
            }

            if(win){
                if(m1[0] == G.p1.id){
                    G.p1.ptMesa++;
                    G.vez = true;
                }else{
                    G.p2.ptMesa++;
                    G.vez = false;
                }
            }else{
                if(m1[0] == G.p1.id){
                    G.p2.ptMesa++;
                    G.vez = false;                   
                }else{
                    G.p1.ptMesa++;
                    G.vez = true;       
                }
            }
            G.mesa = [];
            console.log(`J1: ${G.p1.ptMesa}, J2: ${G.p2.ptMesa}`);

        }else{
            G.setvez();
        }

        if(G.rodada == 3){
            
            if(G.p1.ptMesa > G.p2.ptMesa){
                io.to(G.p1.id).emit("win");
                io.to(G.p2.id).emit("los");
                G.p1.pts++;

            }else if(G.p1.ptMesa < G.p2.ptMesa){
                io.to(G.p2.id).emit("win");
                io.to(G.p1.id).emit("los");
                G.p2.pts++;

            }else{
                io.to(G.p1.id).emit("win");
                io.to(G.p2.id).emit("los");

                io.to(G.p2.id).emit("win");
                io.to(G.p1.id).emit("los");
                G.p1.pts++;
                G.p2.pts++;

            }

            G.start();
            io.to(G.p1.id).emit("cards", G.p1);
            io.to(G.p2.id).emit("cards", G.p2);
            console.log(`J1s: ${G.p1.pts}, J2s: ${G.p2.pts}`);
        }
        
    });

    // Disconect
    socket.on("disconnect", () =>{
        console.log(`${socket.id}[${usuarios.get(socket.id)}] DESCONECTADO`);
        usuarios.delete(socket.id);
    });
});

server.listen(porta, function(){
    console.log(`Server rodando na porta ${porta}; Para encerrar CTRL+C\n\n`);
}); 