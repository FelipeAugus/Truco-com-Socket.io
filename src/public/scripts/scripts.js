const socket = io();

// LOGIN
$(document).ready(function(){
    $("#login").submit(function(e){
        e.preventDefault();
        let usu = $("input[name=nick]").val();
        socket.emit('username', usu);
    });
});
function userOk(usu){
    $("section:eq(0)").replaceWith($("section:eq(1)").fadeIn());
    socket.emit('newGame', usu);
};
function userNok(){
    alert("Nome de usuário indisponivel no momento.");
};
function userNok(){
    alert("Nome de usuário indisponivel no momento.");
};
// IMPRIMIR
function cards(J){
    for(let x = 0; x<3; x++){
        $(`#mao .cartas:eq(${x})`).html(`<a onclick="atk(${x})"><img src="./Cartas/${J.mao[x].num}-${J.mao[x].nipe}.png"></a>`);   
    }
}; 
// JOGAR
function atk(x) {
    socket.emit("cardAtk", x);
};
function AtkAtiv(c){
    if(c == null) return;
    else{
        let a = document.getElementById("minha").innerHTML
        if(a != '<img src="./Cartas/0.png">'){
            $(`#rival`).html('<img src="./Cartas/0.png">');
        }
        $(`#mao .cartas:eq(${c[0]})`).html('');
        $(`#minha`).html(`<img src="./Cartas/${c[1].num}-${c[1].nipe}.png">`);
    }
};
function AtkPasv(c){
    let a = document.getElementById("rival").innerHTML
    if(a != '<img src="./Cartas/0.png">'){
        $(`#minha`).html('<img src="./Cartas/0.png">');
    }
    $(`#rival`).html(`<img src="./Cartas/${c.num}-${c.nipe}.png">`);
}; 
// Calcular vitória 
function win(x){
    setTimeout(function(){clear();}, 500);
    $(`#ptMeu a`).html(Number($(`#ptMeu a`).text())+x);
};
function los(x){
    setTimeout(function(){clear();}, 500);
    $("#ptRiv a").html(Number($(`#ptRiv a`).text())+x);
};
function winGame(){
    alert("PARABÉNS VOCÊ VENCEU !!!");
    setTimeout(function(){location.reload();}, 500);
};
function losGame(){
    alert("Você perdeu, mais sorte na próxima !!!");
    setTimeout(function(){location.reload();}, 500);
};
// TRUCO -> Pedir / Aceitar
function truco() {
    socket.emit("TrucoAtiv");
};
let s = null;
function SttTruco(t){
    if(t.text!=null) $(`#sttTruco`).html(t.text);
    if(t.stt && t.stt!=57){
        s = setInterval(function(){$(`#sttTruco`).toggle();}, 1000);
    }else{
        clearInterval(s);
        $(`#sttTruco`).html("<br>");
    }  
    if(t.stt == 57) $(`#sttTruco`).html(t.text);
};
function TrucoPasv(t){
    if(t) $("#truco").html(`Seu oponente trucou: <a onclick="aceitar()">ACEITAR</a> || <a onclick="correr()">CORRER</a>`)
    else $("#truco").html(`Mão de 10: <a onclick="aceitar()">ACEITAR</a> || <a onclick="correr()">CORRER</a>`)
};
function aceitar(){
    $("#truco").html(`<a onclick="truco()">TRUCO</a>`);
    socket.emit("Aceitar");
};
function correr(){
    $("#truco").html(`<a onclick="truco()">TRUCO</a>`);
    socket.emit("Correr");
};
// Vez
function vezS(){
    $("#vez").html("SUA VEZ !");
};
function vezN(v){
    $("#vez").html(`Vez de ${v}!`);
};
// Oponente quitou
function RivalOff(){
    alert("SEU OPONENTE DESCONECTOU DA PARTIDA!");
    setTimeout(function(){location.reload();}, 500);
};
//FUNÇÕES
function clear(){
    $(`#minha`).html('<img src="./Cartas/0.png">');
    $(`#rival`).html('<img src="./Cartas/0.png">');
};
