const Baralho = require('./baralho.js');

class Game{
    constructor(cod, P1){
        this.gameCod = cod;
        this.p1 = P1;
        this.p2 = null;
        this.deck = null;
        this.mesa = []
        this.vez = null;

        this.partida = false;
        this.rodada = null;

        P1.gameCod = cod;
    }

    setp2(P2){
        this.p2 = P2;
        P2.gameCod = this.gameCod;
    }

    setvez(){
        this.vez = !this.vez;
    }

    start(){
        this.partida = !this.partida;
        this.rodada = 0;

        this.deck = new Baralho();
        this.deck.distribui(this.p1);
        this.deck.distribui(this.p2);
        
        this.p1.ptMesa = 0;
        this.p2.ptMesa = 0;

        delete(this.deck);
        this.vez = this.partida;
    }
}

module.exports = Game;