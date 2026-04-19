// Importerer express, som jeg bruker til å lage serveren og API-rutene
const express = require('express');
const app = express(); // app er selve server-objektet

const PORT = 3000;

// Importerer better-sqlite3 og kobler den til databasen
const Database = require('better-sqlite3');
const db = new Database('Treningslog.db'); // db er det jeg bruker til å kjøre sql-spørringer

// CORS-middleware for å tillate forespørsler fra andre domener
const cors = require('cors');
app.use(cors());

// API-rute som henter valgt data, og lagrer dem i variabelen "øvelseData" som blir gjort om til json format
app.get('/api/Okt-registrering', (req, res) => {
    const øvelseData = db.prepare('SELECT ØvelseID, Navn, Beskrivelse FROM Øvelse').all();
    res.json(øvelseData); // Sender resultatet tilbake til frontend i JSON-format
});

// Åpner en viss port på serveren, og starter serveren
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});

//Gjør at nettleseren henter filene direkte fra Public mappen når brukeren gir en request
app.use(express.static("Public"));

// POST-rute som mottar den registrerte treningsøkten fra frontend 
app.post("/api/registrer_okt", express.json(), (request, response) => {
    const {øvelser} = request.body;
    // Henter ut øvelsene som frontend sendte 

    console.log(øvelser)

   // Sjekker om øvelser finnes, om det er en array og at den ikke er tom
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
        const ovelsePerOkt = db.prepare("INSERT INTO Øvelse_I_Økt (ØktID, ØvelseID) VALUES (?,?)").run(oktID, ovelse.ØvelseID) // Lager en kobling mellom øvelsen og den nye treningsøkten
        const ovelseIØktID = ovelsePerOkt.lastInsertRowid // Finner ID-en til koblingen, slik at jeg kan koble settene til riktig øvelse

        for (const sett of settArray) {
            const vekt = sett.vekt;
            const reps = sett.reps;
            // Henter verdiene for hvert sett

            const settInfo =  db.prepare("INSERT INTO Sett (Reps, Vekt, Varighet, ØvelseIØktID) Values (?,?,?,?)").run(reps,vekt,null, ovelseIØktID);
        } // Lagrer settene i sett-tabellen i databasen, og passer på at hvert sett blir koblet til riktig øvelse ved hjelp av ovelseIØktID
    }
         response.json({ alert: "Økten er registrert!"})
});

   
