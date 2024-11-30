let namesList = [];
let spinSchedule = [];
let history = [];

const spinButton = document.getElementById("spin-button");
const countdownDisplay = document.getElementById("countdown");
const nextSpinTimeDisplay = document.getElementById("next-spin-time");
const historyTableBody = document.querySelector("#history-table tbody");

// Charge les données CSV
async function loadCSV(file) {
    const response = await fetch(file);
    const text = await response.text();
    return text.split('\n').map(line => line.trim()).filter(line => line);
}

// Initialisation des données et démarrage
async function initialize() {
    namesList = await loadCSV("assets/roue_listNames.csv");
    spinSchedule = await loadCSV("assets/roue_planning.csv");

    // Afficher la prochaine date et heure
    updateNextSpinTime();
    // Afficher l'historique des gagnants
    loadHistory();
    // Mettre à jour l'état du bouton (actif ou inactif)
    updateSpinButtonState();
}

// Mettre à jour la date et l'heure du prochain tirage
function updateNextSpinTime() {
    const nextSpin = spinSchedule[0]; // Exemple : obtenir le prochain créneau
    nextSpinTimeDisplay.textContent = nextSpin;
    startCountdown(new Date(nextSpin));
}

// Démarre un compte à rebours
function startCountdown(targetTime) {
    const interval = setInterval(() => {
        const now = new Date();
        const remainingTime = targetTime - now;
        if (remainingTime <= 0) {
            clearInterval(interval);
            countdownDisplay.textContent = "Tirage maintenant !";
            spinButton.disabled = false;
        } else {
            const hours = Math.floor(remainingTime / (1000 * 60 * 60));
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
            countdownDisplay.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }, 1000);
}

// Mise à jour de l'état du bouton de la roue
function updateSpinButtonState() {
    const now = new Date();
    const nextSpin = new Date(spinSchedule[0]); // Exemple : prochain créneau
    if (now < nextSpin) {
        spinButton.disabled = true;
    } else {
        spinButton.disabled = false;
    }
}

// Fonction pour démarrer la roue et tirer un gagnant
function spinWheel() {
    const winner = namesList[Math.floor(Math.random() * namesList.length)];
    addWinnerToHistory(winner);
    updateHistoryTable();
    saveWinnerToCSV(winner);
    alert(`Le gagnant est : ${winner}`);
}

// Ajouter le gagnant à l'historique
function addWinnerToHistory(winner) {
    const now = new Date();
    history.push({ date: now, winner });
}

// Mettre à jour le tableau de l'historique des gagnants
function updateHistoryTable() {
    historyTableBody.innerHTML = '';
    history.forEach(entry => {
        const row = document.createElement("tr");
        const dateCell = document.createElement("td");
        dateCell.textContent = entry.date.toLocaleString();
        const winnerCell = document.createElement("td");
        winnerCell.textContent = entry.winner;
        row.appendChild(dateCell);
        row.appendChild(winnerCell);
        historyTableBody.appendChild(row);
    });
}

// Sauvegarder le gagnant dans le CSV (simulé)
function saveWinnerToCSV(winner) {
    // Cette fonction enregistre les données dans un fichier CSV, mais cela nécessite un backend en Node.js ou une autre solution serveur.
}

// Initialiser les données au chargement de la page
window.onload = initialize;

// Ajouter un écouteur d'événements au bouton
spinButton.addEventListener("click", spinWheel);
