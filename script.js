
// CONFIGURATION

const API_KEY = "TA_CLE_API_ICI";
const dashboard = document.getElementById("dashboard");
const form = document.getElementById("formulaire");
const input = document.getElementById("input");
const erreur = document.getElementById("erreur");
const btnGeo = document.getElementById("btnGeo");
const messageVide = document.getElementById("messagevide");

let villesEnregistrees = [];


// EVENT FORMULAIRE (AJOUT VILLE)

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ville = input.value.trim();
    if (!ville) return;

    try {
        erreur.textContent = "";
        ajouterVille(ville);
        input.value = "";
    } catch (err) {
        erreur.textContent = "Villentrouvable.";
    }
})

// BOUTON GEOLOCALISATIO

btnGeo.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await chargerMeteoParCoordonnees(latitude, longitude, "Ma position");
            },
            () => {
                erreur.textContent = "Permission refusée pour la géolocalisation.";
            }
        );
    } else {
        erreur.textContent = "Géolocalisation non supportée.";
    }
});


// AJOUTER UNE VILLE
async function ajouterVille(ville) {
    if (villesEnregistrees.includes(ville.toLowerCase())) return;

    const coordonnees = await getCoordonneesVille(ville);
    await chargerMeteoParCoordonnees(
        coordonnees.lat,
        coordonnees.lon,
        coordonnees.name
    );

    villesEnregistrees.push(ville.toLowerCase());
}

// OBTENIR COORDONNÉES D'UNE VILLE

async function getCoordonneesVille(ville) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${ville}&limit=1&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.length) throw new Error("Ville non trouvée");

    return data[0];
}


// CHARGER METEO 7 JOURS

async function chargerMeteoParCoordonnees(lat, lon, nomVille) {
    messageVide.style.display = "none";

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    afficherCarte(data, nomVille);
}

// AFFICHAGE DASHBOARD
function afficherCarte(data, nomVille) {
    const carte = document.createElement("div");
    carte.classList.add("carte");

    const jours = data.daily.slice(0, 7);

    const joursHTML = jours.map(jour => {
        const date = new Date(jour.dt * 1000).toLocaleDateString("fr-FR", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });

        return `
            <div class="jour">
                <p><strong>${date}</strong></p>
                <img src="https://openweathermap.org/img/wn/${jour.weather[0].icon}@2x.png">
                <p>${jour.weather[0].description}</p>
                <p>🌡️ ${Math.round(jour.temp.day)}°C</p>
                <p>💨 ${jour.wind_speed} m/s</p>
            </div>
        `;
    }).join("");

    carte.innerHTML = `
        <h2>${nomVille}</h2>
        <div class="jours-container">
            ${joursHTML}
        </div>
    `;

    dashboard.appendChild(carte);
}