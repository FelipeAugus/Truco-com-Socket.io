function newBase(){
    const nick = new Map; //socket id e nick
    const usuarios = new Map; // socket id e codGame
    const games = new Map; // codGame e game;
    let codGame = [0 ,0]; // Codigo do game e se a mesa já está ok
    
    return {
        nick,
        usuarios,
        games,
        codGame
    };
};

module.exports = {newBase};
