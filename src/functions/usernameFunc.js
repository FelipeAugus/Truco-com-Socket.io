const { base } = require("../app");

const {nick} = base

const username = (usu, socket) =>{
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
};

module.exports = {username};
