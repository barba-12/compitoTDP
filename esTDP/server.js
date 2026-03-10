const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true }));

const DATA_FILE = path.join(__dirname, 'data', 'abbonamenti.json');

// Helper: Leggi/Scrivi JSON
const getDb = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
const saveToDb = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// 1. GET / - Form di iscrizione
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/sottoscrivi', (req, res) => {
    const { nome, dataNascita, tipo, zona, studente, privacy, pagamento } = req.body;

    // 2. Validazione Radio Button
    const metodiValidi = ['carta', 'paypal', 'bonifico'];
    if (!metodiValidi.includes(pagamento)) {
        return res.render('index', { 
            errore: "metodo pagamento non valido", 
        });
    }

    // Validazione
    if (!privacy) {
        return res.render('index', { 
            errore: "consenso privacy mancante.", 
        });
    }

    // Validazione
    const nomeRegex = /^[A-Za-zÀ-ÿ ]{2,}$/;
    if (!nomeRegex.test(nome) || !dataNascita) {
        return res.status(400).render('errore', { 
            messaggio: "Dati non validi" 
        });
    }

    // Calcolo Prezzo
    const prezziBase = { 'Mensile': 40, 'Trimestrale': 100, 'Annuale': 350 };
    let prezzo = prezziBase[tipo];

    if (zona === 'Extra-urbana') prezzo *= 1.20;
    if (studente) prezzo *= 0.75;              

    const db = getDb();

    //calcolo ID
    const ultimoId = db.length > 0 ? parseInt(db[db.length - 1].id) : 0;
    const nuovoId = (ultimoId + 1).toString();

    const nuovoAbbonamento = {
        id: nuovoId,
        nome,
        dataNascita,
        tipo,
        zona,
        studente: !!studente,
        pagamento,
        prezzo: prezzo.toFixed(2),
        dataCreazione: new Date().toISOString()
    };

    db.push(nuovoAbbonamento);
    saveToDb(db);

    res.redirect(`/abbonamento/${nuovoId}`);
});

//abbonamento/:id
app.get('/abbonamento/:id', (req, res) => {
    const abbonamento = getDb().find(a => a.id === req.params.id);
    if (!abbonamento) return res.status(404).send("Abbonamento non trovato.");

    const oggi = new Date();
    const nascita = new Date(abbonamento.dataNascita);
    
    let eta = oggi.getFullYear() - nascita.getFullYear();
    const m = oggi.getMonth() - nascita.getMonth();
    if (m < 0 || (m === 0 && oggi.getDate() < nascita.getDate())) eta--;

    const isCompleanno = oggi.getDate() === nascita.getDate() && oggi.getMonth() === nascita.getMonth();

    res.render('riepilogo', { abbonamento, eta, isCompleanno });
});

//dashboard
app.get('/dashboard', (req, res) => {
    const db = getDb();
    const totale = db.length;

    if (totale === 0) return res.send("Nessun dato disponibile.");

    const urbani = db.filter(a => a.zona === 'Urbana').length;
    const extra = totale - urbani;

    const countTipi = db.reduce((acc, curr) => {
        acc[curr.tipo] = (acc[curr.tipo] || 0) + 1;
        return acc;
    }, {});

    const piuPopolare = Object.keys(countTipi).reduce((a, b) => countTipi[a] > countTipi[b] ? a : b);

    res.render('dashboard', { 
        percUrbana: ((urbani/totale)*100).toFixed(1),
        percExtra: ((extra/totale)*100).toFixed(1),
        piuPopolare 
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));