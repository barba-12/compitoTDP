const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

//rotta prodotti
app.get('/prodotti', (req, res) => {
    const data = {
        titoloPagina: "Tech Shop",
        utente: "Mario Rossi",
        listaProdotti: [
            { 
                id: 1, 
                nome: "Smartphone Pro", 
                prezzo: 899.99, 
                categoria: "Elettronica", 
                disponibile: true, 
                sconto: 10 
            },
            { 
                id: 2, 
                nome: "Cuffie Wireless", 
                prezzo: 150.00, 
                categoria: "Audio", 
                disponibile: false, 
                sconto: 0 
            },
            { 
                id: 3, 
                nome: "Monitor 4K", 
                prezzo: 450.00, 
                categoria: "Informatica", 
                disponibile: true, 
                sconto: 25 
            }
        ]
    };

    res.render('prodotti', data);
});

// Rotta Home
app.get('/', (req, res) => {
    res.render('index', { 
        titoloPagina: "Home - Tech Shop", 
        utente: "Mario Rossi" 
    });
});

// Rotta Contatti
app.get('/contatti', (req, res) => {
    res.render('contatti', { 
        titoloPagina: "Contattaci", 
        utente: "Mario Rossi" 
    });
});

app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});