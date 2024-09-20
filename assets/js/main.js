// Sélectionner les cartes
const cards = document.querySelectorAll('.card-container');

// Parcourir les cartes
cards.forEach(cardContainer => {
    const button = cardContainer.querySelector('.btn-discover');
    
    // Activer l'effet de flip pour le jour J
    if (button.classList.contains('active')) {
        button.addEventListener('click', () => {
            cardContainer.classList.toggle('flipped');
        });
    }
});
