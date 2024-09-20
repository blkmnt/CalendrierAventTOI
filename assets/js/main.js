document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-container');
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    cards.forEach(card => {
        const cardDate = card.getAttribute('data-date');
        
        if (cardDate < today) {
            // Si le jour est passé, afficher uniquement la face recto
            card.querySelector('.card-back').style.display = 'none';
        } else if (cardDate === today) {
            // Si c'est le jour J, afficher la face verso et gérer le flip
            card.querySelector('.card-back').style.display = 'flex';
            card.querySelector('.card-back button').onclick = () => flipCard(card);
        } else {
            // Si c'est un jour futur, afficher uniquement la face verso avec bouton inactif
            card.querySelector('.card-back').style.display = 'flex';
            card.querySelector('.card-back button').classList.add('inactive');
            card.querySelector('.card-back button').setAttribute('disabled', true);
            card.querySelector('.card-back button').innerText = "Futur";
        }
    });
});

function flipCard(cardContainer) {
    cardContainer.classList.toggle('flipped');
}
