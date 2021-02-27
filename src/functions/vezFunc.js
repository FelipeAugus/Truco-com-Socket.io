const { io } = require("../app");

function vez(G){
    
    if(G.vez){
        io.to(G.p1.id).emit("vezS");
        io.to(G.p2.id).emit("vezN", G.p1.nick);
    }else{
        io.to(G.p2.id).emit("vezS");
        io.to(G.p1.id).emit("vezN", G.p2.nick);
    }
}

module.exports = {vez}
