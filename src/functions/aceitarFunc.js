const { base, io } = require("../app");

const { usuarios, games } = base

const aceitar = (socket)=>{
    const G = games.get(usuarios.get(socket.id));

    io.to(G.p1.id).emit("SttTruco", {stt: false, text: null});
    io.to(G.p2.id).emit("SttTruco", {stt: false, text: null});

    G.truco = false;
    G.rodadaValor+=2;
};

module.exports = {aceitar};
