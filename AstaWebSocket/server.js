const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let oggettoAsta = {
    nome: "Orologio",
    descrizione: "Rolex Datejust 41mm",
    prezzoIniziale: 9000
};

let offertaCorrente = oggettoAsta.prezzoIniziale;

io.on("connection", (socket) => {
    console.log("Nuovo client connesso:", socket.id);

    // Invia info al nuovo client connesso
    socket.emit("datiIniziali", {
        oggetto: oggettoAsta,
        offerta: offertaCorrente
    });

    // Ricezione puntata
    socket.on("nuovaOfferta", (valore) => {
        const puntata = parseFloat(valore);

        if (isNaN(puntata)) {
            socket.emit("errore", "L'offerta deve essere un numero valido.");
            return;
        }

        if (puntata <= offertaCorrente) {
            socket.emit("errore", "L'offerta deve essere maggiore dell'offerta corrente.");
            return;
        }

        //aggiorno l'offerta
        offertaCorrente = puntata;

        console.log("Nuova offerta:", offertaCorrente);

        //Trasmette a tutti
        io.emit("aggiornaOfferta", offertaCorrente);
    });
});

server.listen(3000, () => {
    console.log("Server avviato su http://localhost:3000");
});