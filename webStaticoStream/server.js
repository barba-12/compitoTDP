/*
Realizzare un piccolo server web statico utilizzando solo Node.js puro (senza Express o altri framework).
Il server deve essere in grado di servire file HTML, CSS, JS e immagini a seconda della richiesta del client.

Quando un browser richiede una pagina (es. http://localhost:8080/pippo),
il server deve:

Interpretare l’URL richiesto dal client.

Capire quale file deve essere inviato (es. pippo.html).

Cercare il file nella cartella corretta in base alla sua estensione:
.html → cartella html
.css → cartella css
.js → cartella js
.jpg, .png → cartella img

Leggere il file con fs.readFile() e inviarlo al client con il giusto Content-Type. Se il file non esiste, rispondere con un errore 404.
Inoltre il server deve essere completamente asincrono, utilizzando async/await.

34
*/

const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const PORT = 8080;

const server = http.createServer(async (req, res) => {
    let fileName = req.url.slice(1) || 'index';  // es: "pippo"
    let ext = path.extname(fileName);            // restituisce l'estensione del file se è presente

    if(!ext){
        fileName += ".html";
    }

    try {
        if(ext === "" || ext === ".html"){
            console.log("html inviato");
            const data = await fs.readFile(`html/${fileName}`, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        } else if (ext === ".css"){
            console.log("css inviato");
            const data = await fs.readFile(`css/${fileName}`, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        } else if (ext === ".js") {
            console.log("js inviato");
            const data = await fs.readFile(`js/${fileName}`, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        } else if (ext === ".png" || ext === ".jpeg" || ext === ".jpg" || ext === ".gif") {
            let ext1 = ext.slice(1);
            if(ext1 === "jpg") ext1 = "jpeg";
            console.log("immagine inviata");
            const data = await fs.readFile(`img/${fileName}`);
            res.writeHead(200, { 'Content-Type': `image/${ext1}` });
            res.end(data);
        } else if (ext === ".mp4") {
            const stream = fsSync.createReadStream(`${__dirname}/video/${fileName}`);
            stream.on('open', () => {
                res.writeHead(200, { 'Content-Type': "video/mp4" });
                stream.pipe(res);
            });
            stream.on('error', () => {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File video non trovato');
            });
            console.log("video inviato");
        } else {
            res.writeHead(415, { 'Content-Type': 'text/plain' });
            res.end('Tipo di file non supportato');
        }
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('errore 404');
    }
});

server.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});