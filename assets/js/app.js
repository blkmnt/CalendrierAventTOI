const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');
const countdown = document.getElementById('countdown');

let names = ["Alice", "Bob", "Charlie", "Diana", "Eve"]; // Placeholder for CSV data
let currentAngle = 0;

// Draw the wheel
function drawWheel() {
    const numSegments = names.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    names.forEach((name, index) => {
        // Set color for each segment
        ctx.beginPath();
        ctx.fillStyle = index % 2 === 0 ? "#FFDDC1" : "#FFABAB";
        ctx.moveTo(250, 250); // Center of the wheel
        ctx.arc(250, 250, 250, currentAngle, currentAngle + segmentAngle);
        ctx.lineTo(250, 250);
        ctx.fill();
        ctx.closePath();

        // Add text to segment
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(currentAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#333";
        ctx.font = "16px Arial";
        ctx.fillText(name, 240, 10);
        ctx.restore();

        currentAngle += segmentAngle;
    });
}

// Animate spinning
function spinWheel() {
    let spins = Math.floor(Math.random() * 5) + 3; // Number of spins
    let spinAngle = (Math.random() * 2 * Math.PI) / names.length; // Offset for randomness

    const animation = setInterval(() => {
        currentAngle += 0.1;
        ctx.clearRect(0, 0, 500, 500);
        drawWheel();

        if (spins <= 0 && currentAngle % (2 * Math.PI) < spinAngle) {
            clearInterval(animation);
            const winnerIndex = Math.floor((currentAngle + spinAngle) / ((2 * Math.PI) / names.length)) % names.length;
            alert(`The winner is ${names[winnerIndex]}!`);
            // TODO: Update history and save result
        }
        spins -= 0.005;
    }, 16);
}

spinButton.addEventListener('click', spinWheel);

drawWheel();

