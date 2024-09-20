document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-container');
    const today = new Date(); // Utilisation de la date actuelle sans formatage

    cards.forEach(card => {
        const cardDate = new Date(card.getAttribute('data-date')); // Création d'un objet Date

        if (cardDate < today) {
            // Si le jour est passé, afficher uniquement la face recto
            card.querySelector('.card-back').style.display = 'none';
        } else if (cardDate.toDateString() === today.toDateString()) {
            // Si c'est le jour J, afficher la face verso et gérer le flip
            card.querySelector('.card-back').style.display = 'flex';
            card.querySelector('.card-back button').onclick = () => flipCard(card.querySelector('.card'));
        } else {
            // Si c'est un jour futur, afficher uniquement la face verso avec bouton inactif
            card.querySelector('.card-back').style.display = 'flex';
            const button = card.querySelector('.card-back button');
            button.classList.add('inactive');
            button.innerText = "Futur";
            button.disabled = true;
        }
    });
});

function flipCard(card) {
    card.classList.toggle('flipped');
}
