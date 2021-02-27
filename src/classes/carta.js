class Carta {
    constructor(ordem, nipe, num, cod){
        this.cod = cod; // Num de referencia
        this.ordem = ordem; // 0 a 13
        this.num = num; // 1 a 10
        this.nipe = nipe;  // 3 - paus / 2 – copas / 1 – espadas / 4 - ouro;
    }
} 

module.exports = Carta;
