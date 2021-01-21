const Carta = require('./carta.js');

class Baralho{
    constructor(){
        const cartas = [];
        let o = 0, c = 0, i, np;
        
        cartas.push(new Carta(o, 3, 4, c)); // Zap
        o++; c++;
        cartas.push(new Carta(o, 2, 7, c)); // Copas
        o++; c++;
        cartas.push(new Carta(o, 1, 1, c)); // Espadas
        o++; c++;
        cartas.push(new Carta(o, 4, 7, c)); // 7Ouro
        o++; c++;

        for( i = 3; i>0; i--){ //inserir as cartas 3, 2 e 1 = A;
            for(np = 1; np<=4; np++){ // Insere todos os nipes 
                if(i!=1 || np!=3){ //já inseriu o epada então não reenserir
                    cartas.push(new Carta(o, np, i, c));
                    c++;
                }
                
            }
            o++;
        }

        for( i = 10; i>=4; i--){ // inserir as cartas 10 = K, 9 = J, 8 = Q, 7, 6, 5 e 4;
            for(np = 1; np<=4; np++){
                if((i!=7 || np!=2) && (i!=7 || np!=4) && (i!=4 || np!=1)){ //já inseriu as outras manilhas então não reenserir
                    cartas.push(new Carta(o, np, i, c));
                    c++;
                }
            }
            o++;
        }

        this.cartas = cartas;
    }

     distribui(J){
        let x;
        const card = [];
        
        for (let i = 0; i < 3; i++) {
            x = Math.round(Math.random()*this.cartas.length);
            card.push(this.cartas[x]);

            this.cartas.splice(this.cartas.indexOf(this.cartas[x]), 1);
        }

        J.recebe(card);
    }
}

module.exports = Baralho;