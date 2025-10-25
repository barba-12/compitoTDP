const fs = require('fs');
const path = require('path');

// Percorsi dei file
const inputFile = path.join(__dirname, 'input.txt');  //__dirname directory relativa
const outputFile = path.join(__dirname, 'output.txt');

const readStream = fs.createReadStream(inputFile);
const writeStream = fs.createWriteStream(outputFile);

readStream.pipe(writeStream);

readStream.on('error', (err) => console.error('Errore lettura:', err));
writeStream.on('error', (err) => console.error('Errore scrittura:', err));
writeStream.on('finish', () => console.log('Copia completata con successo!'));