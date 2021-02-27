const { base, io } = require("../app");

const {nick, usuarios, games, codGame} = base

const disconnect = (socket) =>{
    console.log(`${socket.id}[${nick.get(socket.id)}] DESCONECTADO`);
    
    const G = games.get(usuarios.get(socket.id));
    if (G == null) return

    if(socket.id == G.p1.id && G.p2 != null){
        io.to(G.p2.id).emit("RivalOff"); }
    else{ 
        io.to(G.p1.id).emit("RivalOff"); }

    if(G.gameCod == codGame[0]){ codGame[1] = 0; }
    G.end(nick, usuarios, games);
}

module.exports = {disconnect};
