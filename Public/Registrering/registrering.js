const minForm = document.getElementById("minForm"); 
const leggTilØvelse = document.getElementById("leggTilØvelse"); 

minForm.addEventListener("submit", async function(event) { 
    event.preventDefault(); // Hindrer siden i å refreshe når brukeren submiter, slik at dataen ikke går tapt

const alleØvelser = document.querySelectorAll(".øvelses-Blokk"); 

    const registrertData = { // Lager et tomt objekt slik at jeg kan pushe data om brukerens treningsøkt til backend senere
    øvelser: []
}
    
    alleØvelser.forEach(blokk => { // Går gjennom alle øvelsesblokkene og definerer valgt øvelse og allesett
    const valgtØvelse = blokk.querySelector(".øvelse-Valg").value; // Definerer valgt øvelse som verdien brukeren valgte i elementet med klassen "øvelse-Valg"
    const alleSett = blokk.querySelectorAll(".sett-Rad"); // Definerer allesett som alle elementene med klassen "sett-Rad"

    const settArray = []; // Lager en array som jeg senere kan pushe informasjonen i settene i

        alleSett.forEach(rad => { // Går gjennom alle elementene med klassen "sett-Rad" og definerer vekt og reps
    const vekt = rad.querySelector(".vekt-Input").value; 
    const reps = rad.querySelector(".reps-Input").value; 

    if (vekt !== "" && reps !== "") { // Sjekker at vekt og reps ikke er tomme, og pusher da verdien deres til settarray
        settArray.push({
            vekt: Number(vekt),
            reps: Number(reps)
        })
    }
});
    if (settArray.length > 0) { // Hvis det er noe data i settArray så pushes dataen til registrertData.øvelser
        registrertData.øvelser.push({
        navn: valgtØvelse,
        sett: settArray

    })
    }
   
});

console.log(registrertData); 

const response = await fetch("/api/registrer_okt", { // Poster dataen til databasen, og gjør informasjonen lagret i registrertData om til JSON format slik at det kan leses på backend
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(registrertData)
});

})

leggTilØvelse.addEventListener("click", () => { 
    lagØvelse();
})

function lagØvelse() { 
    hentData(); 

async function hentData() { // Definerer en async funksjon som henter dataen fra api-en, og gjør den om til et JS objekt
    const response = await fetch("http://localhost:3000/api/Okt-registrering")
    const øvelseData = await response.json();
    console.log(øvelseData);

    let øvelsesBlokk = document.createElement("div");
    let overskrift = document.createElement("h2");
    let settContainer = document.createElement("div"); 
    let brukerØvelseValg = document.createElement("select");

    settContainer.classList.add("sett-Container");
    øvelsesBlokk.classList.add("øvelses-Blokk");
    brukerØvelseValg.classList.add("øvelse-Valg");
   
    for (const Navn of øvelseData) {
        const option = document.createElement("option");
        option.value = Navn.Navn;
        option.textContent = Navn.Navn;
        brukerØvelseValg.appendChild(option);
    } // Fyller selectmenyen med øvelsene som ble hentet fra databasen ved hjelp a hentData

    øvelsesBlokk.append(overskrift, settContainer, brukerØvelseValg);
    minForm.appendChild(øvelsesBlokk) 
    // Setter sammen øvelsesblokken med alle elementene jeg lagde i sted
 
    brukerØvelseValg.addEventListener("change", () => {
        settContainer.innerHTML = "";
    // Tømmer infoen om øvelsene hvis brukeren velger en ny øvelse
        
        overskrift.textContent = brukerØvelseValg.value // Viser en overskrift som navnet på øvelsen
    

        for (let i = 1; i <= 3; i = i + 1) {
            let div = document.createElement("div");
            let settnr = document.createElement("span");
            let vekt = document.createElement("input");
            let reps = document.createElement("input");
        // Lager en rad for hvert sett, med nummer, vekt og repetisjoner
            
            settnr.textContent = i;
            vekt.type = "number";
            vekt.placeholder = "Kg";
            reps.type = "number";
            reps.placeholder = "Reps";
            // Setter opp feltene på en semantisk måte

            div.classList.add("sett-Rad");
            vekt.classList.add("vekt-Input");
            reps.classList.add("reps-Input");
            // Gir elementene klassene som jeg bruker for styling og innhenting av data

            div.append(settnr, vekt, reps); 
            settContainer.appendChild(div);
        } // Plasserer innhold i settraden og plasserer raden i settcontaineren
        
    });
    }
}