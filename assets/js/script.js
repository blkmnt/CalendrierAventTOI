document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-container');
    const today = new Date();

    cards.forEach(card => {
        const cardDate = new Date(card.getAttribute('data-date'));

        if (cardDate < today) {
            card.querySelector('.card-back').style.display = 'none';
        } else if (cardDate.toDateString() === today.toDateString()) {
            card.querySelector('.card-back').style.display = 'flex';
            card.querySelector('.card-back button').onclick = () => flipCard(card.querySelector('.card'));
        } else {
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
