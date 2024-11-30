let namesList = [];
let spinSchedule = [];
let history = [];

const spinButton = document.getElementById("spin-button");
const countdownDisplay = document.getElementById("countdown");
const nextSpinTimeDisplay = document.getElementById("next-spin-time");
const historyTableBody = document.querySelector("#history-table tbody");
const wheelCanvas = document.getElementById("wheel");
const wheelContext = wheelCanvas.getContext("2d");

// Charge les données CSV
async function loadCSV(file) {
    try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`Erreur lors du chargement du fichier : ${file}`);
        const text = await response.text();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        return lines;
    } catch (error) {
        console.error(`Erreur lors du chargement de ${file}: `, error);
        return [];
    }
}

// Dessiner la roue
function drawWheel() {
    const numSegments = namesList.length;
    const radius = 200;
    const centerX = wheelCanvas.width / 2;
    const centerY = wheelCanvas.height / 2;
    const angle = (2 * Math.PI) / numSegments;

    // Effacer le canvas avant de redessiner
    wheelContext.clearRect(0, 0, wheelCanvas.width, wheelCanvas.height);

    // Dessiner chaque segment de la roue
    namesList.forEach((name, index) => {
        const startAngle = angle * index;
        const endAngle = startAngle + angle;
        wheelContext.fillStyle = index % 2 === 0 ? "#FFDDC1" : "#FFABAB"; // Alternance des couleurs
        wheelContext.beginPath();
        wheelContext.moveTo(centerX, centerY);
        wheelContext.arc(centerX, centerY, radius, startAngle, endAngle);
        wheelContext.lineTo(centerX, centerY);
        wheelContext.fill();

        // Ajouter le texte du nom au centre de chaque segment
        const textAngle = startAngle + angle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius - 30);
        const textY = centerY + Math.sin(textAngle) * (radius - 30);
        wheelContext.fillStyle = "#000";
        wheelContext.font = "16px Arial";
        wheelContext.textAlign = "center";
        wheelContext.textBaseline = "middle";
        wheelContext.fillText(name, textX, textY);
    });
}

// Initialisation des données et démarrage
async function initialize() {
    namesList = await loadCSV("assets/roue_listNames.csv");
    spinSchedule = await loadCSV("assets/roue_planning.csv");

    // Dessiner la roue dès que les noms sont chargés
    drawWheel();

    // Afficher la prochaine date et heure de tirage
    updateNextSpinTime();
    // Afficher l'historique des gagnants
    loadHistory();
    // Mettre à jour l'état du bouton (actif ou inactif)
    updateSpinButtonState();
}

// Mettre à jour la date et l'heure du prochain tirage
function updateNextSpinTime() {
    const nextSpin = getNextValidSpinTime();
    if (nextSpin) {
        nextSpinTimeDisplay.textContent = `${nextSpin.date} ${nextSpin.startTime}`;
        startCountdown(new Date(`${nextSpin.date}T${nextSpin.startTime}`));
    } else {
        nextSpinTimeDisplay.textContent = "Aucun tirage programmé";
    }
}

// Trouver le prochain créneau valide dans la planification
function getNextValidSpinTime() {
    const now = new Date();
    for (const entry of spinSchedule) {
        const startDate = new Date(`${entry.date}T${entry.startTime}`);
        const endDate = new Date(`${entry.date}T${entry.endTime}`);
        if (now >= startDate && now <= endDate && !entry.winner) {
            return entry;
        }
    }
    return null;
}

// Démarre un compte à rebours jusqu'à la prochaine session de tirage
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
    const nextSpin = getNextValidSpinTime();
    if (nextSpin && now < new Date(`${nextSpin.date}T${nextSpin.startTime}`)) {
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
