const porta = process.env.PORT || 5757;
const host = process.env.HEROKU_APP_NAME ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com` : "http://localhost";

const { Server, io } = require("./app");
const { sockets } = require("./sockets");
const server = Server;

io.on('connection', socket =>  sockets(socket));

server.listen(porta, function(){
    const portaStr = porta === 80 ? '' :  ':' + porta

    if (process.env.HEROKU_APP_NAME) 
        console.log('Servidor iniciado. Abra o navegador em ' + host);
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr);
});
