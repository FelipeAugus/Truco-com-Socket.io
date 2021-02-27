const { base, io } = require("../app");

const { usuarios, games } = base

const trucoAtiv = (socket)=>{
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
}

module.exports = {trucoAtiv};
