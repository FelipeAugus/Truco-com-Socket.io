const Baralho = require('./baralho.js');

class Game{
    constructor(cod, P1){
        this.gameCod = cod;
        this.p1 = P1;
        this.p2 = null;
        this.truco = null;
        this.deck = null;
        this.mesa = []
        this.vez = null;
        this.rodada = null;
        this.partida = false;

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
        this.p1.truco = false;
        this.p2.truco = false;
        this.truco = false;
        
        this.rodada = 0;
        this.partida = !this.partida;
        this.rodadaValor = 2;

        this.deck = new Baralho();
        this.deck.distribui(this.p1);
        this.deck.distribui(this.p2);
        
        this.mesa = []
        this.p1.ptMesa = 0;
        this.p2.ptMesa = 0;

        delete(this.deck);
        this.vez = this.partida;
    }
    
    end(nick, usuarios, games){
        nick.delete(this.p1.id);
        usuarios.delete(this.p1.id);
        if(this.p2 != null){
            nick.delete(this.p2.id);
            usuarios.delete(this.p2.id);
        }
        games.delete(this.gameCod);        
    }
}

module.exports = Game;
