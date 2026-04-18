# Prosjekt-Arbeid

## Teknologi

Backend:

I prosjektarbeidet har jeg brukt express...

```js 
// Brukt i Treningslogg.js for å sette opp en express app
const express = require('express');
const app = express();
```
samt Node.js for å kjøre serveren

Frontend:

- Jeg har brukt HTML for å strukturere nettsiden
- CSS har blitt brukt til styling
- jeg har brukt JS til å skape interkasjon og dynamisk innhold

Database:

Jeg har brukt SQLiteStudio til å lage databasen, og Drawio ble brukt til å planlegge databasen i starten av prosjektet.

Kommunikasjon: 

Fetch() har blitt brukt til kommunikasjon mellom frontend og backend, og var en viktig del av prosjektet.




## Datamodell/Beskrivelse av databasen

Brukt SQlitestudio for å lage databasen, samt Drawio for å illusrere/planlegge databasen (Se vedlagt bilde)

![Databasen](/Bilder/Database.png)

Bruker tabellen lagrer informasjon om brukeren i systemet (brukeren er hardkodet)

- Hver bruker får en unik id "BrukerID" slik at man kan koble dem til treningsøktene deres
- BrukerID er en PK 
- Bruker tabellen lagrer også brukerens fornavn og etternavn

Treningsøkt tabellen holder en brukers treningsøkt

- Treningsøkt-tabellen er koblet til Bruker-tabellen med BrukerID som FK
- Trenignsøkt-tabellen har ØktID som PK - Gir en unik ID for hver økt
- Tabellen har også kolonner for start og slutt
- En bruker kan ha mange treningsøkter, men en treningsøkt kan kun ha en bruker (en til mange forhold)

Øvelse_i_økt kobler sammen Treningsøkt og Øvelse, og unngår mange til mange forhold

- Har ØvelseIØktID som PK
- Økt ID som FK (For å koble til Treningsøkt-tabellen)
- Har ØvelseID som FK (For å koble til Øvelse-tabellen)
- En økt kan ha mange øvelser, og en øvelse kan være i flere økter. Derfor lager man en koblingstabell for å unngå mange til mange forhold

Øvelse inneholder alle øvelsene som er i systemet

- Har ØvelseID som PK
- Har en kolonne for navn på øvelsen

Sett tabellen lagrer informasjon om hvert sett som blir gjort i en øvelse

- Har SettID som PK
- Har en kolonne for Reps, Vekt, Varighet (ikke brukt) og ØvelseIØktID (FK)
- ØvelseIØktID brukes for å koble Sett-tabellen til Øvelse_i_økt-tabellen
- Hver øvelse i en økt kan ha flere sett (en til mange forhold)

Samlet forklaring

1. En bruker gjennomfører en treningsøkt
2. En treningsøkt består av flere øvelser
3. Hver øvelse i økten kobles ved hjelp av Øvekse_i_økt
4. Hver av øvelsene kan ha flere sett med blant annet reps og vekt

## Beskrivelse av API-endepunkter (ruter), og hva de gjør

Rute -  Url: "/Okt-Registrering"

```js
app.get('/api/Okt-registrering', (req, res) => {
    const øvelseData = db.prepare('SELECT ØvelseID, Navn, Beskrivelse FROM Øvelse').all();
    res.json(øvelseData);
});
```

Koden over definerer en rute som, når den får en request, bruker metoden GET for å skjør SQl-spørringen og hente ØvelseID, Navn og Beskrivelse fra Øvelse kolonnen i databasemodellen. Og lagre det i variabelen "øvelseData"

- Denne ruten brukes for å hente informasjon fra databasen til frontend, slik at jeg kan gjøre den om til JSON-format og jobbe med dataen i frontend (se vedlagt kode nedenfor)

```js
async function hentData() { // Definerer en async funksjon som henter dataen fra api-en, og gjør den om til et JS objekt
    const response = await fetch("http://localhost:3000/api/Okt-registrering")
    const øvelseData = await response.json();
    console.log(øvelseData);
```

Rute - Url: "/registrer_okt"

```js
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

```

Ruten og koden ovenfor brukes til å lagre en ny treningsøkt inn i databasen

- Bruker metoden POST
- Backend tar i mot data fra frontend og lagrer en treningsøkt med øvelsene, settene etc i databasen
- Backend mottar brukerens info på formen:

```js
{
    "øvelser": [
        {
            "navn": "navnet på øvelsen",
            "sett": [
                { "reps": "antall reps", "vekt": "antall vekt"},
                { "reps": "antall reps", "vekt": "antall vekt"},
            ]
        }
    ]
}
```

Og opretter nye rader i databasen basert på infoen, gjennom SQL spørringen:

```js
const settInfo =  db.prepare("INSERT INTO Sett (Reps, Vekt, Varighet, ØvelseIØktID) Values (?,?,?,?)").run(reps,vekt,null, ovelseIØktID);
```

## Beskrivelse av frontend (hvilke sider, hva de gjør, og hvordan de kommuniserer med backend)

Sidene i frontend består av en forside, som per nå kun har en link til registrering av en ny treningsøkt, samt siden for registrering av treningsøkten.

I siden for registrering av treningsøkten kan brukeren gå tilbake til forsiden, oppe ved navigasjonsbaren. I tillegg kan brukeren trykke på en knapp for å legge til en ny øvelse, hvor det da kommer et select element med dataen fra øvelsene i databasen, der brukeren kan velge øvelsen han ønsker å registere. Når brukeren velger en øvelse, kommer det også 3 sett, hvor brukeren kan registrere både vekt (Kg) og antall repitisjoner. Det er også en submit knapp brukeren kan trykke på for å registrere treningsøkten og sende den til databasen.

Når brukeren klikker på submit knappen, samles all infoen i et JS-objekt, som sendes til backend ved hjelp av ruten: "/registrer_okt". Dataen er hardkodet på formen: 

```js
{
    "øvelser": [
        {
            "navn": "navnet på øvelsen",
            "sett": [
                { "reps": "antall reps", "vekt": "antall vekt"},
                { "reps": "antall reps", "vekt": "antall vekt"},
            ]
        }
    ]
}
```
Når dataen når backend, blir den viderebehandlet og sendt til databasen.

- Frontend kommuniserer altså med backend gjennom fetch() med methods POST og GET.