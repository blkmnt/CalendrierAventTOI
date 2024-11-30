// Selectors
const wheelCanvas = document.getElementById('wheel');
const spinButton = document.getElementById('spin-button');
const countdown = document.getElementById('countdown');
const historyTable = document.getElementById('history-table').querySelector('tbody');

const ctx = wheelCanvas.getContext('2d');
let names = [];
let planning = [];
let currentAngle = 0;

// Load CSV data
function loadCSV(file, callback) {
    Papa.parse(file, {
        download: true,
        header: true,
        complete: (results) => callback(results.data),
    });
}

// Draw the wheel
function drawWheel() {
    const numSegments = names.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    names.forEach((name, index) => {
        ctx.beginPath();
        ctx.fillStyle = index % 2 === 0 ? '#FFDDC1' : '#FFABAB';
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, currentAngle, currentAngle + segmentAngle);
        ctx.lineTo(250, 250);
        ctx.fill();
        ctx.closePath();

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
    let spins = Math.random() * 3 + 3;
    let spinAngle = Math.random() * (2 * Math.PI);

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

// Update history
function updateHistory(winner) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const row = `<tr><td class="border px-4 py-2">${date}</td><td class="border px-4 py-2">${winner}</td></tr>`;
    historyTable.innerHTML += row;
}

// Initialize app
function init() {
    loadCSV('roue_listName.csv', (data) => {
        names = data.map((row) => row.name);
        drawWheel();
        spinButton.disabled = false;
    });

    loadCSV('roue_planning.csv', (data) => {
        planning = data;
        checkSchedule();
    });
}

// Check schedule
function checkSchedule() {
    const now = new Date();
    const currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    const activeSlot = planning.find((slot) => {
        const [startHour, startMinute] = slot.start_time.split(':').map(Number);
        const [endHour, endMinute] = slot.end_time.split(':').map(Number);
        const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute);
        const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute);
        return now >= startTime && now <= endTime;
    });

    if (activeSlot) {
        spinButton.disabled = false;
        countdown.textContent = 'The button is active!';
    } else {
        spinButton.disabled = true;
        countdown.textContent = 'Next active slot: ...'; // TODO: Calculate next slot
    }
}

// Event Listeners
spinButton.addEventListener('click', spinWheel);

// Start app
init();
