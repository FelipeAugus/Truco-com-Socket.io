const Jogador = require('../classes/jogador.js');
const Game = require('../classes/game.js');

const { base, io } = require("../app");
const { vez } = require("./vezFunc");

const { usuarios, games, codGame} = base

const newGame = (usu, socket) =>{
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
};

module.exports = {newGame};
