// Fonction pour charger le fichier CSV et générer les cartes
async function generateCards() {
    const response = await fetch('assets/gifts.csv');
    const csvData = await response.text();
    const rows = csvData.split('\n'); // Découpage des lignes du CSV
    const headers = rows[0].split(';'); // Extraction des en-têtes

    const today = new Date();
    const contentSection = document.querySelector('.content');

    // Boucle à partir de la deuxième ligne (les données)
    for (let i = 1; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue; // Ignorer les lignes vides
        const [date, activite, description, image] = row.split(';');

        // Conversion de la date CSV en objet Date
        const csvDate = new Date(date);
        const dayOfMonth = csvDate.getDate(); // Jour du mois (1-31)

        // Création de l'élément HTML pour la carte
        let cardHTML = '';

        if (csvDate < today) {
            // Carte des jours passés
            cardHTML = `
                <div class="card cardPast">
                    <div class="card-image-container">
                        <img src="${image}" alt="${activite}">
                    </div>
                    <div class="card-content">
                        <h1>${date}</h1>
                        <h2>${activite}</h2>
                        <p>${description}</p>
                    </div>
                </div>
            `;
        } else if (csvDate.toDateString() === today.toDateString()) {
            // Carte du jour
            const colorClass = dayOfMonth % 2 === 0 ? 'card-green' : 'card-red';
            cardHTML = `
                <div class="card cardToday ${colorClass}">
                    <div class="card-image-container">
                        <img src="${image}" alt="${activite}">
                    </div>
                    <div class="card-content">
                        <h1>${date}</h1>
                        <button class="button">Ouvrir</button>
                    </div>
                </div>
            `;
        } else {
            // Carte des jours futurs
            const colorClass = dayOfMonth % 2 === 0 ? 'card-green' : 'card-red';
            cardHTML = `
                <div class="card cardPast ${colorClass}">
                    <div class="card-image-container">
                        <img src="${image}" alt="${activite}">
                    </div>
                    <div class="card-content">
                        <h1>${date}</h1>
                        <button class="button" disabled>Bientôt dispo</button>
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

