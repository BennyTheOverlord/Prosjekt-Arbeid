// Server-bit, setter opp en Express-app
const express = require('express');
const app = express();

const PORT = 3000;

// Databasen
const Database = require('better-sqlite3');
const db = new Database('Treningslog.db');

// CORS-middleware for å tillate forespørsler fra andre domener
const cors = require('cors');
app.use(cors());

// API-rute som henter valgt data, og lagrer dem i variabelen "øvelseData" som blir gjort om til json format
app.get('/api/Okt-registrering', (req, res) => {
    const øvelseData = db.prepare('SELECT ØvelseID, Navn, Beskrivelse FROM Øvelse').all();
    res.json(øvelseData);
});

// Åpner en viss port på serveren, og starter serveren
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});

//Gjør at nettleseren henter filene direkte fra Public mappen når brukeren gir en request
app.use(express.static("Public"));


app.post("/api/registrer_okt", express.json(), (request, response) => {
    const {øvelser} = request.body;

    console.log(øvelser)

    if (!øvelser || !Array.isArray(øvelser) || øvelser.length === 0) {
        return response.status(400).json({ feil: "Ugyldige data" });
    }
    const okt = db.prepare("INSERT INTO Treningsøkt (BrukerID, Start, Slutt) VALUES (?,?,?)").run(1,null,null);
    const oktID = okt.lastInsertRowid;
   for (const øvelse of øvelser) {
        const navn = øvelse.navn;
        const settArray = øvelse.sett;
        const ovelse = db.prepare("SELECT * FROM Øvelse WHERE Navn = ?").get(navn)
         if (!ovelse) { // Sjekker om ovelse eksisterer, i tilfelle den ikke gjør det
            return response.status(400).json({ feil: `Fant ikke øvelse: ${navn}`}); // Hvis ovelse ikke eksisterer stopper koden, og den gir status 400 "Fant ikke øvelse: "navn på øvelse"
            }
        const ovelsePerOkt = db.prepare("INSERT INTO Øvelse_I_Økt (ØktID, ØvelseID) VALUES (?,?)").run(oktID, ovelse.ØvelseID)
        const ovelseIØktID = ovelsePerOkt.lastInsertRowid

        for (const sett of settArray) {
            const vekt = sett.vekt;
            const reps = sett.reps;

            const settInfo =  db.prepare("INSERT INTO Sett (Reps, Vekt, Varighet, ØvelseIØktID) Values (?,?,?,?)").run(reps,vekt,null, ovelseIØktID);
        }
    }
         response.json({ alert: "Økten er registrert!"})
});

   

//Jobb videre med å validere requesten og gi beskjed til brukeren om det gikk gjennom eller ikke
