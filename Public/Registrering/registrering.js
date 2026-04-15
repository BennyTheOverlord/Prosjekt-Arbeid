const minForm = document.getElementById("minForm"); // Lager en konstant variabel: minForm som html elementet med id-en "minForm"
const leggTilØvelse = document.getElementById("leggTilØvelse"); // Lager en konstant variabel: leggTilØvelse som html elementet "leggTilØvelse"




minForm.addEventListener("submit", async function(event) { // Legger til en eventlistener med typen submit til minForm, med en async funksjon
    event.preventDefault(); // Hindrer siden i å refreshe når brukeren submiter, slik at dataen ikke går tapt

const alleØvelser = document.querySelectorAll(".øvelses-Blokk"); // Definerer en konstant vartiabel: alleØvelser som alle elementer med klassen "øvelses-Blokk"

    const registrertData = { // Lager et tomt objekt slik at jeg kan pushe data om brukerens treningsøkt i den senere
    øvelser: []
}
    
    alleØvelser.forEach(blokk => { // Går gjennom alle øvelsesblokkene og definerer valgt øvelse og allesett
    const valgtØvelse = blokk.querySelector(".øvelse-Valg").value; // Definerer valgt øvelse som verdien brukeren valgte i elementet med klassen "øvelse-Valg"
    const alleSett = blokk.querySelectorAll(".sett-Rad"); // Definerer allesett som alle elementene med klassen "sett-Rad"

    const settArray = []; // Lager en array som jeg senere kan pushe informasjonen i settene i

        alleSett.forEach(rad => { // Går gjennom alle elementene med klassen "sett-Rad" og definerer vekt og reps
    const vekt = rad.querySelector(".vekt-Input").value; // Definerer vekt som verdien til elementet med klassen "vekt-Input"
    const reps = rad.querySelector(".reps-Input").value; // Definerer reps som verdien til elementet med klassen "reps-Input"

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

console.log(registrertData); // Logger registrertData for å sjekke at dataen fungerer som den skal

const response = await fetch("/api/registrer_okt", { // Poster dataen til databasen, og gjør informasjonen lagret i registrertData om til JSON format slik at det kan leses på backend
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(registrertData)
});

// Husk å skrive ferdig her senere, og ordne det på backend, slik at det kan sendes til databasen

})

leggTilØvelse.addEventListener("click", () => { // Legger til enn eventlistener på typen "click" og kaller da på funksjonen lagØvelse();
    lagØvelse();
})

function lagØvelse() { // Definerer en skjult funksjon ved navn lagØvelse
    hentData(); // Kaller funksjonen hentData

async function hentData() { // Definerer en async funksjon som henter dataen fra api-en, og gjør den om til et JS objekt
    const response = await fetch("http://localhost:3000/api/Okt-registrering")
    const øvelseData = await response.json();
    console.log(øvelseData);

    let øvelsesBlokk = document.createElement("div");
    let overskrift = document.createElement("h2");
    let settContainer = document.createElement("div"); 
    let brukerØvelseValg = document.createElement("select");

    øvelsesBlokk.classList.add("øvelses-Blokk");
    brukerØvelseValg.classList.add("øvelse-Valg");
   
    for (const Navn of øvelseData) {
        const option = document.createElement("option");
        option.value = Navn.Navn;
        option.textContent = Navn.Navn;
        brukerØvelseValg.appendChild(option);
    }
    øvelsesBlokk.append(overskrift, settContainer, brukerØvelseValg);
    minForm.appendChild(øvelsesBlokk)
 
    brukerØvelseValg.addEventListener("change", () => {
        settContainer.innerHTML = "";
        
        overskrift.textContent = brukerØvelseValg.value

        for (let i = 1; i <= 3; i = i + 1) {
            let div = document.createElement("div");
            let settnr = document.createElement("span");
            let vekt = document.createElement("input");
            let reps = document.createElement("input");
            
            settnr.textContent = i;
            vekt.type = "number";
            vekt.placeholder = "Kg";
            reps.type = "number";
            reps.placeholder = "Reps";

            div.classList.add("sett-Rad");
            vekt.classList.add("vekt-Input");
            reps.classList.add("reps-Input");

            div.append(settnr, vekt, reps); // Hva er forskjellen på variabel.append(); og variabel.appendchild(); ?
            settContainer.appendChild(div);
        }
        
    });
    }
}

 



// hentData();

// async function hentData() {
//     const response = await fetch("http://localhost:3000/api/Okt-registrering")
//     const øvelseData = await response.json();
//     console.log(øvelseData); 
    
//     for (const Navn of øvelseData) {
//     const option = document.createElement("option");
//     option.value = Navn.Navn;
//     option.textContent = Navn.Navn;
//     brukerØvelseValg.appendChild(option);
//     console.log(Navn.Navn)

   
// }

// brukerØvelseValg.addEventListener("change", () => {
//     settContainer.innerHTML = "";

//     overskrift = document.createElement("h2");
//     overskrift.innerHTML = brukerØvelseValg.value
//     øvelseOverskrift.appendChild(overskrift);

//     for (let i = 1; i <= 3; i = i + 1) {
//         let div = document.createElement("div");
//         let settnr = document.createElement("span");
//         let vekt = document.createElement("input");
//         let reps = document.createElement("input");
        
//         settnr.textContent = i;
        
//         vekt.type = "number";
//         vekt.placeholder = "Kg";

//         reps.type = "number";
//         reps.placeholder = "Reps";

//         div.append(settnr, vekt, reps); // Hva er forskjellen på variabel.append(); og variabel.appendchild(); ?
//         settContainer.appendChild(div);

//         }
//     });
// }

