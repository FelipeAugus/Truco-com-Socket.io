class Jogador{
    constructor(name, id){
        this.id = id;
        this.nick = name;
        this.gameCod = null;
        this.mao = [null, null, null];
        this.ptMesa = null;
        this.pts = 0;

    }

    recebe(card){
        this.mao = card;
    }
}

module.exports = Jogador;