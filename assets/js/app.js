// Selectors
const wheelCanvas = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const countdown = document.getElementById('countdown');
const historyTable = document.getElementById('history-table').querySelector('tbody');

const ctx = wheelCanvas.getContext('2d');
let names = []; // Liste des noms pour la roue
let planning = []; // Créneaux horaires depuis le CSV
let currentAngle = 0;

// Load CSV data
function loadCSV(file, callback) {
    console.log("Loading file:", file); // Debug: Affiche le chemin du fichier chargé
    Papa.parse(file, {
        download: true, // Télécharger le fichier depuis le chemin fourni
        header: true,   // Utiliser la première ligne comme en-tête
        complete: (results) => {
            if (results.errors.length > 0) {
                console.error("Errors during parsing:", results.errors); // Afficher les erreurs
            } else {
                callback(results.data); // Passer les données analysées à la fonction de rappel
            }
        },
        error: (error) => {
            console.error("Error loading file:", error); // Gestion des erreurs de chargement
        }
    });
}

// Draw the wheel
function drawWheel() {
    const numSegments = names.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    names.forEach((name, index) => {
        ctx.beginPath();
        ctx.fillStyle = index % 2 === 0 ? '#FFDDC1' : '#FFABAB'; // Couleurs alternées
        ctx.moveTo(250, 250); // Centre de la roue
        ctx.arc(250, 250, 250, currentAngle, currentAngle + segmentAngle);
        ctx.lineTo(250, 250);
        ctx.fill();
        ctx.closePath();

        // Ajouter le texte dans chaque segment
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#333';
        ctx.font = '16px Arial';
        ctx.fillText(name, 240, 10);
        ctx.restore();

        currentAngle += segmentAngle;
    });
}

// Spin the wheel
function spinWheel() {
    let spins = Math.random() * 3 + 3; // Nombre aléatoire de tours (3 à 6)
    let spinAngle = Math.random() * (2 * Math.PI); // Décalage aléatoire pour le tirage

    const animation = setInterval(() => {
        currentAngle += 0.1;
        ctx.clearRect(0, 0, 500, 500);
        drawWheel();

        if (spins <= 0 && currentAngle % (2 * Math.PI) < spinAngle) {
            clearInterval(animation);
            const winnerIndex = Math.floor((currentAngle + spinAngle) / ((2 * Math.PI) / names.length)) % names.length;
            const winner = names[winnerIndex];
            updateHistory(winner);
            alert(`The winner is ${winner}!`);
        }
        spins -= 0.01;
    }, 16);
}

// Update history table
function updateHistory(winner) {
    const now = new Date();
    const date = now.toISOString().split('T')[0]; // Date au format AAAA-MM-JJ
    const row = `<tr><td class="border px-4 py-2">${date}</td><td class="border px-4 py-2">${winner}</td></tr>`;
    historyTable.innerHTML += row;
}

// Check schedule and enable/disable the spin button
function checkSchedule() {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const activeSlot = planning.find((slot) => {
        const [startHour, startMinute] = slot.start_time.split(':').map(Number);
        const [endHour, endMinute] = slot.end_time.split(':').map(Number);
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
        const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);
        return now >= startTime && now <= endTime;
    });

    if (activeSlot) {
        spinButton.disabled = false;
        countdown.textContent = 'Le bouton est actif, tirez la roue !';
    } else {
        spinButton.disabled = true;

        // Trouver le prochain créneau actif
        const nextSlot = planning.find((slot) => {
            const [startHour, startMinute] = slot.start_time.split(':').map(Number);
            const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
            return startTime > now;
        });

        if (nextSlot) {
            countdown.textContent = `Prochain créneau : ${nextSlot.date} à ${nextSlot.start_time}`;
        } else {
            countdown.textContent = 'Aucun créneau disponible prochainement.';
        }
    }
}

// Initialize app
function init() {
    // Charger les noms pour la roue
    loadCSV('assets/roue_listName.csv', (data) => {
        names = data.map(row => row.name); // Récupérer les noms depuis le fichier CSV
        drawWheel();
    });

    // Charger le planning
    loadCSV('assets/roue_planning.csv', (data) => {
        planning = data; // Stocker les créneaux horaires
        checkSchedule(); // Vérifier l'état actuel du bouton
    });

    // Mettre à jour l'état du bouton toutes les minutes
    setInterval(checkSchedule, 60000); // Vérification périodique
}

// Event Listeners
spinButton.addEventListener('click', spinWheel);

// Start app
init();
