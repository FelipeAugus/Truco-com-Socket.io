const { base, io } = require("../app");

const { nick, usuarios, games } = base

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

module.exports = {win};
