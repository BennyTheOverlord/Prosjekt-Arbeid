const minForm = document.getElementById("minForm");
const leggTilØvelse = document.getElementById("leggTilØvelse");




minForm.addEventListener("submit", async function(event) {
    event.preventDefault();

const alleØvelser = document.querySelectorAll(".øvelses-Blokk");

    const registrertData = {
    øvelser: []
}
    
    alleØvelser.forEach(blokk => {
    const valgtØvelse = blokk.querySelector(".øvelse-Valg").value;
    const alleSett = blokk.querySelectorAll(".sett-Rad");

    const settArray = [];

        alleSett.forEach(rad => {
    const vekt = rad.querySelector(".vekt-Input").value;
    const reps = rad.querySelector(".reps-Input").value;

    if (vekt !== "" && reps !== "") {
        settArray.push({
            vekt: Number(vekt),
            reps: Number(reps)
        })
    }
});
    if (settArray.length > 0) {
        registrertData.øvelser.push({
        navn: valgtØvelse,
        sett: settArray

    })
    }
   
});

console.log(registrertData);

const response = await fetch("/api/registrer_okt", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(registrertData)
});

// Husk å skrive ferdig her senere, og ordne det på backend, slik at det kan sendes til databasen

})

leggTilØvelse.addEventListener("click", () => {
    lagØvelse();
})

function lagØvelse() {
    hentData();

async function hentData() {
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

