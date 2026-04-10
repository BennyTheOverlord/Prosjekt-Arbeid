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

// Eksempel på en rute som henter alle fjell, beskrivelse, høydene og bilde deres
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

    if (!øvelser) {
        return response.status(400).json({ feil: "Ugyldige data" });
    }
    const okt = db.prepare("INSERT INTO Treningsøkt (BrukerID, Start, Slutt) VALUES (?,?,?)").run(1,null,null);
    const oktID = okt.lastInsertRowid;
    øvelser.forEach(øvelse => {
        const navn = øvelse.navn;
        const settArray = øvelse.sett;
        const ovelse = db.prepare("SELECT * FROM Øvelse WHERE Navn = ?").get(navn)
        const ovelsePerOkt = db.prepare("INSERT INTO Øvelse_I_Økt (ØktID, ØvelseID) VALUES (?,?)").run(oktID, ovelse.ØvelseID)
        const ovelseIØktID = ovelsePerOkt.lastInsertRowid
        settArray.forEach(sett => {
            const vekt = sett.vekt;
            const reps = sett.reps;

            const settInfo =  db.prepare("INSERT INTO Sett (Reps, Vekt, Varighet, ØvelseIØktID) Values (?,?,?,?)").run(reps,vekt,null, ovelseIØktID);
        })
    });

//Jobb videre med å validere requuesten og gi beskjed til brukeren om det gikk gjennom eller ikke

});