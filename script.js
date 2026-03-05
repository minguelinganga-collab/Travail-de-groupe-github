const form = document.getElementById("formulaire");
const input = document.getElementById("input");
const dashboard = document.getElementById("dashboard");
const erreur = document.getElementById("erreur");
const btnGeo = document.getElementById("btnGeo");

const apiKey = "0e628e594ef3218e171f4032b602fda7";

// ===== RECHERCHE PAR VILLE =====
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    obtenirPrevisionsParVille(input.value.trim());
});

// ===== LOCALISATION GPS =====
btnGeo.addEventListener("click", () => {

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(async (position) => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            obtenirPrevisionsParCoordonnees(lat, lon);

        }, () => {
            erreur.textContent = "Impossible d'obtenir la localisation";
        });
    } else {
        erreur.textContent = "Géolocalisation non supportée";
    }

});

// ===== PREVISION PAR VILLE =====
async function obtenirPrevisionsParVille(ville){

    if(ville === ""){
        erreur.textContent = "Entrez une ville";
        return;
    }

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${apiKey}&units=metric&lang=fr`
        );

        if(!response.ok){
            throw new Error("Ville introuvable");
        }

        const data = await response.json();
        afficherPrevisions(data);

    }catch(err){
        erreur.textContent = err.message;
    }
}

// ===== PREVISION PAR COORDONNEES GPS =====
async function obtenirPrevisionsParCoordonnees(lat, lon){

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`
        );

        const data = await response.json();
        afficherPrevisions(data);

    }catch(err){
        erreur.textContent = "Erreur météo";
    }
}

// ===== AFFICHAGE PREVISIONS =====
function afficherPrevisions(data){

    dashboard.innerHTML = `
        <h2>${data.city.name}, ${data.city.country}</h2>
        <h3>Prévisions 5 jours</h3>
    `;

    const jours = data.list.filter((item, index) => index % 8 === 0).slice(0,5);

    jours.forEach(jour => {

        const date = new Date(jour.dt * 1000);

        dashboard.innerHTML += `
            <div class="meteo-card">
                <h3>${date.toLocaleDateString("fr-FR")}</h3>
                <p>🌡️ Temp : ${jour.main.temp} °C</p>
                <p>💧 Humidité : ${jour.main.humidity} %</p>
                <p>☁️ ${jour.weather[0].description}</p>
            </div>
        `;
    });
}