const porta = process.env.PORT || 3000;
const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost";

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

const nick = new Map; //socket id e nick
const usuarios = new Map; // socket id e codGame
const games = new Map; // codGame e game;

let codGame = [0 ,0]; // Codigo do game e se a mesa já está ok

io.on('connection', socket => {// Identifica conexões
    console.log(`${socket.id} CONECTADO`);
    // LOGIN
    socket.on("username", usu =>{
        let dup = 0;
        
        usu = usu.trim();

        dup = [...nick.values()].indexOf(usu); //Se não existe retorna -1;

        if (dup == -1) {
            console.log(`USU: ${usu} OK`);
            nick.set(socket.id, usu);
            socket.emit("userOk", usu);
        } else {
            console.log(`USU: ${usu} INDISPONIVEL`);
            socket.emit("userNok");
        }
    });
    // Find game
    socket.on("newGame", usu =>{
        let J = new Jogador(usu, socket.id);

        if (codGame[1] == 0){
            let G = new Game(codGame[0], J);
            games.set(codGame[0], G); // Guarda o jogo
            codGame[1] = 1;
            usuarios.set(socket.id, codGame[0]); // Marca em qual jogo o usuario está
        }else{
            let G = games.get(codGame[0]);
            G.setp2(J);
            usuarios.set(socket.id, codGame[0]); // Marca em qual jogo o usuario está
            G.start();

            codGame[1] = 0;
            codGame[0]++;

            io.to(G.p1.id).emit("cards", G.p1);
            socket.emit("cards", J);
            vez(G);
        }
    });
    // TRUCO
    socket.on("TrucoAtiv", ()=>{
        const G = games.get(usuarios.get(socket.id));
        
        if ((G.p2 == null) || (G.p1.pts == 10 || G.p2.pts == 10)) return;

        if((G.p1.id == socket.id && G.vez) && !G.p1.truco){
            io.to(G.p2.id).emit("TrucoPasv", true);
            G.p1.truco = true;
            G.p2.truco = false;
           
        }else if ((G.p2.id == socket.id && !G.vez) && !G.p2.truco){
            io.to(G.p1.id).emit("TrucoPasv", true); 
            G.p1.truco = false;
            G.p2.truco = true;
            
        }else{
            return;
        }
        switch (G.rodadaValor) {
            case 2:
                t = 'Truco';
                break;
            case 4:
                t = 'Mei saco';
                break;
            case 6:
                t = 'Oito';
                break;
            case 8:
                t = 'É deiz';
                break;
            case 6:
                t = 'Vale o jogo ladrão';
                break;
            default:
                t = 'Chegou no limite já kj';
        }


        io.to(G.p1.id).emit("SttTruco", {stt: true, text: t});
        io.to(G.p2.id).emit("SttTruco", {stt: true, text: t});
        G.truco = true;
    });
    socket.on("Aceitar", ()=>{
        const G = games.get(usuarios.get(socket.id));

        io.to(G.p1.id).emit("SttTruco", {stt: false, text: null});
        io.to(G.p2.id).emit("SttTruco", {stt: false, text: null});

        G.truco = false;
        G.rodadaValor+=2;
    });
    socket.on("Correr", ()=>{
        const G = games.get(usuarios.get(socket.id));

        io.to(G.p1.id).emit("SttTruco", {stt: false, text: null});
        io.to(G.p2.id).emit("SttTruco", {stt: false, text: null});

        if(G.p1.id == socket.id){
            G.p2.pts += G.rodadaValor;
            io.to(G.p1.id).emit("los", G.rodadaValor);
            io.to(G.p2.id).emit("win", G.rodadaValor);
        }else if (G.p2.id == socket.id){
            G.p1.pts += G.rodadaValor;
            io.to(G.p1.id).emit("win", G.rodadaValor);
            io.to(G.p2.id).emit("los", G.rodadaValor);
        }
        G.p1.truco = false;
        G.p2.truco = false;
        G.truco = false;
        win(G);
        vez(G);
    });
    //Jogar carta e verificar vitória
    socket.on("cardAtk", x =>{
        const G = games.get(usuarios.get(socket.id));
       
        let J1, J2;
        
        if((G.p1.id == socket.id && G.vez) && !G.truco){
            J1 = G.p1;
            J2 = G.p2;
        }else if ((G.p2.id == socket.id && !G.vez) && !G.truco){
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

            let win = -1;

            if(c1.ordem < c2.ordem){
                win = 1;
            }else if(c1.ordem > c2.ordem){
                win = 0; 
            }else{
                G.p1.ptMesa++;
                G.p2.ptMesa++;
                G.setvez();
            }
            
            if(win == 1){
                if(m1[0] == G.p1.id){
                    G.p1.ptMesa++;
                    G.vez = true;
                }else{
                    G.p2.ptMesa++;
                    G.vez = false;
                }
            }else if(win == 0){
                if(m1[0] == G.p1.id){
                    G.p2.ptMesa++;
                    G.vez = false;                   
                }else{
                    G.p1.ptMesa++;
                    G.vez = true;       
                }
            }
            G.mesa = [];

        }else{
            G.setvez();
        }
        
        if ((G.rodada == 3) || ((G.p1.ptMesa >= 2 || G.p2.ptMesa >= 2) && G.p1.ptMesa != G.p2.ptMesa)){
            if(G.p1.ptMesa > G.p2.ptMesa){
                io.to(G.p1.id).emit("win", G.rodadaValor);
                io.to(G.p2.id).emit("los", G.rodadaValor);
                G.p1.pts += G.rodadaValor;

            }else if(G.p1.ptMesa < G.p2.ptMesa){
                io.to(G.p2.id).emit("win", G.rodadaValor);
                io.to(G.p1.id).emit("los", G.rodadaValor);
                G.p2.pts += G.rodadaValor;
                
            }
            
            setTimeout(function(){win(G);}, 600);
        }
        
        setTimeout(function(){vez(G);}, 700);
    });
    // Disconect
    socket.on("disconnect", () =>{
        console.log(`${socket.id}[${nick.get(socket.id)}] DESCONECTADO`);
        
        const G = games.get(usuarios.get(socket.id));
        if (G == null) return

        if(socket.id == G.p1.id && G.p2 != null){
            io.to(G.p2.id).emit("RivalOff"); }
        else{ 
            io.to(G.p1.id).emit("RivalOff"); }

        if(G.gameCod == codGame[0]){ codGame[1] = 0; }
        G.end(nick, usuarios, games);
    });    
});

function win(G){ 
    if(G.p1.pts >= 12){
        io.to(G.p1.id).emit("winGame");
        io.to(G.p2.id).emit("losGame");
        G.end(usuarios, nick, games);
        
    }else if(G.p2.pts >= 12){
        io.to(G.p1.id).emit("losGame");
        io.to(G.p2.id).emit("winGame");
        G.end(usuarios, nick, games);

    }else{
        G.start();
        if(G.p1.pts == 10 && G.p2.pts == 10){
            let a = new Object();
            x = {nipe: -1, num: -1}
            a.mao = [x, x, x]

            io.to(G.p1.id).emit("cards", a);
            io.to(G.p2.id).emit("cards", a);
            io.to(G.p1.id).emit("SttTruco", {stt: 57, text: 'Mão de ferro'});
            io.to(G.p2.id).emit("SttTruco", {stt: 57, text: 'Mão de ferro'});

        }else{ 
            if(G.p1.pts == 10){
                G.truco = true;
                io.to(G.p1.id).emit("SttTruco", {stt: true, text: 'Mão de dez'});
                io.to(G.p2.id).emit("SttTruco", {stt: true, text: 'Mão de dez'});
                io.to(G.p1.id).emit("TrucoPasv", false);

            }else if (G.p2.pts == 10){
                G.truco = true;
                io.to(G.p1.id).emit("SttTruco", {stt: true, text: 'Mão de dez'});
                io.to(G.p2.id).emit("SttTruco", {stt: true, text: 'Mão de dez'});
                io.to(G.p2.id).emit("TrucoPasv", false);

            }
            io.to(G.p1.id).emit("cards", G.p1);
            io.to(G.p2.id).emit("cards", G.p2);
        }
    }
}
function vez(G){
    
    if(G.vez){
        io.to(G.p1.id).emit("vezS");
        io.to(G.p2.id).emit("vezN", G.p1.nick);
    }else{
        io.to(G.p2.id).emit("vezS");
        io.to(G.p1.id).emit("vezN", G.p2.nick);
    }
}

server.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host);
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr);
});