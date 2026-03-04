const apiKey = "0e628e594ef3218e171f4032b602fda7"
const form = document.getElementById("formulaire");
const input = document.getElementById("input");
const dashboard = document.getElementById("dashboard");
const erreur = document.getElementById("erreur");
const btnGeo = document.getElementById("btnGeo");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const ville = input.value.trim();

    if (ville === "") {
        erreur.textContent = "Veuillez entrer une ville.";
        return;
          }

    getWeatherByCity(ville);
});
btnGeo.addEventListener("click", function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherByCoords(lat, lon);
        }, () => {
            erreur.textContent = "Localisation refusée.";
        });
    }
});
function getWeatherByCity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=fr`)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                erreur.textContent = "Ville introuvable.";
                return;
            }

            afficherMeteo(data);
        })
        .catch(() => {
            erreur.textContent = "Erreur de connexion.";
        });
}
function getWeatherByCoords(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=fr`)
        .then(response => response.json())
        .then(data => {
            afficherMeteo(data);
        });
}
function afficherMeteo(data) {
    erreur.textContent = "";

    dashboard.innerHTML = `
    <h2>${data.name}</h2>
    <p>Température : ${data.main.temp} °C</p>
    <p>Météo : ${data.weather[0].description}</p>
    <p>Vent : ${data.wind.speed} m/s</p>
    <p>Humidité : ${data.main.humidity}%</p>
     `;
}