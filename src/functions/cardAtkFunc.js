const { base, io } = require("../app");
const { win } = require("./winFunc");
const { vez } = require("./vezFunc");

const { usuarios, games } = base

const cardAtk = (x, socket) =>{
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
}

module.exports = {cardAtk};
