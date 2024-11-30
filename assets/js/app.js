let names = []; // Liste des noms
let schedule = []; // Liste des créneaux horaires
let winnerHistory = []; // Historique des gagnants
let nextAvailableTime = null; // Temps du prochain créneau où la roue peut tourner

// Charger les données depuis les fichiers CSV
function loadCSVFiles() {
  // Simuler le chargement des fichiers CSV (à remplacer par des appels AJAX vers le backend)
  // Exemple de données
  names = ["Alice", "Bob", "Charlie", "Diana"];
  schedule = [
    { date: "2024-12-01", time: "14:00", winner: null },
    { date: "2024-12-01", time: "16:00", winner: null },
  ];
  winnerHistory = [...schedule]; // Initialiser avec les créneaux horaires
  
  renderWheel();
  updateButtonState();
  renderHistory();
}

// Dessiner la roue avec les noms
function renderWheel() {
  const canvas = document.getElementById("wheel");
  const ctx = canvas.getContext("2d");
  const segments = names.length;
  const angle = 2 * Math.PI / segments;
  const radius = canvas.width / 2;

  // Dessiner chaque segment avec un nom
  names.forEach((name, index) => {
    const startAngle = index * angle;
    const endAngle = (index + 1) * angle;
    ctx.fillStyle = index % 2 === 0 ? "#FFDDC1" : "#FFC107"; // Couleurs alternées
    ctx.beginPath();
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.lineTo(radius, radius);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(name, radius + Math.cos(startAngle + angle / 2) * radius / 2, radius + Math.sin(startAngle + angle / 2) * radius / 2);
  }
}

// Activer ou désactiver le bouton
function updateButtonState() {
  const currentTime = new Date();
  const nextAvailable = getNextAvailableSlot(currentTime);
  
  if (nextAvailable) {
    const remainingTime = calculateTimeDifference(currentTime, nextAvailable);
    document.getElementById("countdown").innerText = `Prochain créneau: ${remainingTime} secondes`;
    document.getElementById("spinButton").disabled = false;
  } else {
    document.getElementById("countdown").innerText = "Aucun créneau disponible aujourd'hui";
    document.getElementById("spinButton").disabled = true;
  }
}

// Fonction pour calculer la différence en secondes entre deux dates
function calculateTimeDifference(currentTime, nextAvailable) {
  return Math.floor((nextAvailable - currentTime) / 1000);
}

// Trouver le prochain créneau disponible
function getNextAvailableSlot(currentTime) {
  for (let i = 0; i < schedule.length; i++) {
    const slot = new Date(`${schedule[i].date} ${schedule[i].time}`);
    if (slot > currentTime && !schedule[i].winner) {
      return slot;
    }
  }
  return null;
}

// Faire tourner la roue
function spinWheel() {
  const winnerIndex = Math.floor(Math.random() * names.length);
  const winner = names[winnerIndex];
  
  // Simuler l'animation de la roue
  const wheel = document.getElementById("wheel");
  let rotation = 0;
  const spinInterval = setInterval(() => {
    rotation += 10;
    wheel.style.transform = `rotate(${rotation}deg)`;
    if (rotation >= 360 * 3) {
      clearInterval(spinInterval);
      schedule.forEach(slot => {
        if (!slot.winner) {
          slot.winner = winner;
          updateHistoryTable(slot);
        }
      });
      renderHistory();
    }
  }, 10);
  
  // Mettre à jour le CSV (via backend, ici simulation)
  updateCSV(winner);
}

// Mettre à jour l'historique des gagnants
function updateHistoryTable(slot) {
  const tableBody = document.getElementById("history").querySelector("tbody");
  const row = document.createElement("tr");
  const date = new Date(`${slot.date} ${slot.time}`);
  row.innerHTML = `
    <td>${slot.date}</td>
    <td>${slot.time}</td>
    <td>${slot.winner}</td>
  `;
  tableBody.appendChild(row);
}

// Mettre à jour le fichier CSV sur le backend (simulation)
function updateCSV(winner) {
  // Simuler une requête pour enregistrer l'historique dans le fichier CSV
  console.log(`Gagnant enregistré : ${winner}`);
}

// Mettre à jour l'historique
function renderHistory() {
  schedule.forEach(slot => {
    if (slot.winner) {
      updateHistoryTable(slot);
    }
  });
}

// Charger les fichiers CSV au démarrage
loadCSVFiles();
