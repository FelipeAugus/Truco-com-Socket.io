const express = require('express');
const path = require('path'); 
const { newBase } = require('./db/db');

const app = express();
const Server = require('http').createServer(app);  // Protocolo http
const io = require('socket.io')(Server);  // Define o protocolo do web socket

// Definir onde está o que será exibido no front /rotas 
app.use(express.static(path.join(__dirname, 'public')));

// Definir as views como html e não ejs que é padrão do node
app.set('views', path.join(__dirname, 'public'));  
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => { res.render('index.html'); });

const base = newBase();

module.exports = {Server, io, base}
