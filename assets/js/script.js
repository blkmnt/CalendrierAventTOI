async function generateCards() {
    const response = await fetch('assets/gifts.csv');
    const csvData = await response.text();
    const rows = csvData.split('\n'); // Découpage des lignes du CSV
    const headers = rows[0].split(';'); // Extraction des en-têtes

    const today = new Date();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Date sans l'heure
    const contentSection = document.querySelector('.content');

    // Réinitialiser le contenu de la section pour éviter les doublons
    contentSection.innerHTML = '';

    // Tableau des mois en français
    const mois = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    // Boucle à partir de la deuxième ligne (les données)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue; // Ignorer les lignes vides
        const [date, activite, description, image] = row.split(';');

        // Conversion de la date CSV (JJ/MM/AAAA) en objet Date
        const [day, month, year] = date.split('/').map(Number); // Séparer JJ, MM, AAAA
        const csvDate = new Date(year, month - 1, day); // Mois commence à 0 en JS
        const csvDateOnly = new Date(csvDate.getFullYear(), csvDate.getMonth(), csvDate.getDate()); // Date sans heure

        // Vérification si la date est valide
        if (isNaN(csvDate.getTime())) {
            console.error(`Date invalide trouvée : ${date}`);
            continue; // Ignorer les lignes avec une date invalide
        }

        const dayOfMonth = csvDate.getDate(); // Jour du mois (1-31)
        const formattedDate = `${dayOfMonth} ${mois[month - 1]}`; // Ex : "25 Décembre"

        // Création de l'élément HTML pour la carte
        let cardHTML = '';

        if (csvDateOnly < todayDateOnly) {
            // Carte des jours passés
            cardHTML = `
                <div class="card cardPast">
                    <div class="card-image-container">
                        <img src="${image}" alt="${activite}">
                    </div>
                    <div class="card-content">
                        <h1>${formattedDate}</h1>
                        <h2>${activite}</h2>
                        <p>${description}</p>
                    </div>
                </div>
            `;
        } else if (csvDateOnly.getTime() === todayDateOnly.getTime()) {
            // Carte du jour
            const colorClass = dayOfMonth % 2 === 0 ? 'card-green' : 'card-red';
            cardHTML = `
                <div class="card cardToday ${colorClass}" id="cardToday">
                    <div class="card-image-container">
                        <img src="${image}" alt="${activite}">
                    </div>
                    <div class="card-content">
                        <h1 id="cardDate">${formattedDate}</h1>
                        <h2 id="cardTitle" style="display: none;">${activite}</h2>
                        <p id="cardDescription" style="display: none;">${description}</p>
                        <button id="openButton" class="button" style="">🎁 Ouvrir</button>
                    </div>
                </div>
            `;
        } else {
            // Carte des jours futurs
            const colorClass = dayOfMonth % 2 === 0 ? 'card-green' : 'card-red';
            cardHTML = `
                <div class="card cardFuture ${colorClass}">
                    <div class="card-image-container">
                        <img src="${image}" alt="${activite}">
                    </div>
                    <div class="card-content">
                        <h1>${formattedDate}</h1>
                        <button class="button">🔒 Verrouillé</button>
                    </div>
                </div>
            `;
        }

        // Ajouter la carte à la section .content
        contentSection.innerHTML += cardHTML;
    }
}

// Appeler la fonction pour générer les cartes
generateCards();




// Fonction qui ajoute l'événement "Ouvrir" au bouton après un délai
function openCard() {
    setTimeout(function () {
        const h2 = document.getElementById('cardTitle');
        const p = document.getElementById('cardDescription');
        const button = document.getElementById('openButton');

        if (h2 && p && button) {
            button.addEventListener('click', function () {
                // Ajouter une classe pour le fade out du bouton
                button.classList.add('fade-out');

                // Faire apparaître les emojis 🎁 en même temps que h2 et p
                createSnowfall();

                // Afficher h2 et p avec un fade in immédiatement
                h2.style.display = 'block';
                p.style.display = 'block';
                h2.classList.add('fade-in');
                p.classList.add('fade-in');

                // Masquer le bouton après le fade-out
                setTimeout(() => {
                    button.style.display = 'none';
                }, 500);
            });
        } else {
            console.error("Les éléments nécessaires n'ont pas été trouvés.");
        }
    }, 500); // Délai pour attendre que la carte soit visible
}

// Fonction pour créer les emojis qui tombent
function createSnowfall() {
    const container = document.body;
    const snowflakeCount = 100; // Nombre de flocons/emoji 🎁

    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = '🎁';

        // Position initiale aléatoire
        snowflake.style.left = Math.random() * 100 + 'vw';

        // Ajouter un délai initial aléatoire avant le début de l'animation
        const delay = Math.random() * 3; // Jusqu'à 3 secondes de délai
        snowflake.style.animationDelay = delay + 's';

        // Durée de l'animation pour atteindre le bas
        snowflake.style.animationDuration = 2 + Math.random() + 's'; // Vitesse aléatoire

        container.appendChild(snowflake);

        // Supprimer le flocon après son animation
        snowflake.addEventListener('animationend', () => {
            snowflake.remove();
        });
    }
}

// Appeler openCard lorsque le DOM est prêt
document.addEventListener('DOMContentLoaded', function () {
    openCard(); // Appel de la fonction openCard
});


// Fonction pour masquer ou afficher les cartes "cardPast" en fonction du toggle
function togglePastCards() {
    // Sélectionner l'élément du toggle
    const toggle = document.getElementById('toggleCards');

    // Vérifier si le toggle existe
    if (!toggle) {
        console.error("Le toggle avec l'ID 'toggleCards' n'a pas été trouvé.");
        return;
    }

    // Ajouter un écouteur d'événement pour le changement d'état du toggle
    toggle.addEventListener('change', () => {
        // Ajouter un délai de 500ms avant d'exécuter le masquage/réaffichage des cartes
        setTimeout(() => {
            // Sélectionner toutes les cartes avec la classe 'cardPast'
            const pastCards = document.querySelectorAll('.card.cardPast');

            // Vérifier l'état du toggle
            if (toggle.checked) {
                // Masquer les cartes (affichage = none)
                pastCards.forEach(card => {
                    card.style.display = 'none';
                });
            } else {
                // Réafficher les cartes
                pastCards.forEach(card => {
                    card.style.display = '';
                });
            }
        }, 500); // Délai de 500ms
    });
}

// Appel de la fonction après que le DOM soit entièrement chargé
document.addEventListener('DOMContentLoaded', function () {
    togglePastCards(); // Initialisation de la gestion du toggle
});

// Fonction pour démarrer le compte à rebours
function startChristmasCountdown() {
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    // Date cible (25 décembre de cette année)
    const targetDate = new Date("December 25, 2024 00:00:00").getTime();

    // Mise à jour du compte à rebours toutes les secondes
    const interval = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            document.getElementById("countdown-timer").innerHTML = "Joyeux Noël !";
        } else {
            // Calcul du temps restant en jours, heures, minutes et secondes
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Affichage du compte à rebours
            daysElement.textContent = days < 10 ? "0" + days : days;
            hoursElement.textContent = hours < 10 ? "0" + hours : hours;
            minutesElement.textContent = minutes < 10 ? "0" + minutes : minutes;
            secondsElement.textContent = seconds < 10 ? "0" + seconds : seconds;
        }
    }, 1000);
}

// Démarrer le compte à rebours dès que la page est chargée
window.onload = startChristmasCountdown;
