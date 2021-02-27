const { aceitar } = require("./functions/aceitarFunc");
const { cardAtk } = require("./functions/cardAtkFunc");
const { correr } = require("./functions/correrFunc");
const { disconnect } = require("./functions/disconnectFunc");
const { newGame } = require("./functions/newGameFunc");
const { trucoAtiv } = require("./functions/trucoAtivFunc");
const { username } = require("./functions/usernameFunc");

const sockets = (socket) =>{
    console.log(`${socket.id} CONECTADO`);
    socket.on("username", (usu) => username(usu, socket));
    
    socket.on("newGame", (usu) => newGame(usu, socket));

    socket.on("TrucoAtiv", () => trucoAtiv(socket));

    socket.on("Aceitar", () => aceitar(socket));
    
    socket.on("Correr", () => correr(socket));

    socket.on("cardAtk", (x) => cardAtk(x, socket));

    socket.on("disconnect", () => disconnect(socket));
};

module.exports = {sockets};
