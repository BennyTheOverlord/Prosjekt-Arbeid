const minForm = document.getElementById("minForm")

minForm.addEventListener("submit", async function(event) {
    event.preventDefault();
})

let brukerØvelseValg = document.getElementById("brukerØvelseValg");



hentData();

async function hentData() {
    const response = await fetch("http://localhost:3000/api/Okt-registrering")
    const øvelseData = await response.json();
    console.log(øvelseData); 
    
    for (const Navn of øvelseData) {
    const option = document.createElement("option");
    option.value = Navn.Navn;
    option.textContent = Navn.Navn;
    brukerØvelseValg.appendChild(option);
    console.log(Navn.Navn)

   
}

brukerØvelseValg.addEventListener("change", () => {
    minForm.innerHTML = "";
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

        div.append(settnr, vekt, reps); // Hva er forskjellen på variabel.append(); og variabel.appendchild(); ?
        minForm.appendChild(div);

        }
    });
}
