const { base, io } = require("../app");
const { win } = require("./winFunc");
const { vez } = require("./vezFunc");

const { usuarios, games } = base

const correr = (socket)=>{
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
};

module.exports = {correr};
