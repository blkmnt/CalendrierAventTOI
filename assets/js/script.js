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
                        <button id="openButton" class="button" style="">Ouvrir</button>
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
                        <button class="button">Non-disponible</button>
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




function openCard() {
    // Sélectionner les éléments h2, p et le bouton à partir de leurs id
    const h2 = document.getElementById('cardTitle');
    const p = document.getElementById('cardDescription');
    const button = document.getElementById('openButton');

    // Modifier le style de h2 et p pour les rendre visibles
    h2.style.display = 'block';
    p.style.display = 'block';

    // Cacher le bouton
    button.style.display = 'none';
}

// S'assurer que le DOM est prêt avant d'ajouter l'événement
document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('openButton');
    button.addEventListener('click', openCard);
});


