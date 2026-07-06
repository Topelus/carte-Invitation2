// Fonction pour fermer le message
function closeWarning() {
    document.getElementById("warning").style.display = "none";
}

function initConfetti() {
    const header = document.querySelector('.carte_section.carte_header');
    const layer = header?.querySelector('.confetti-layer');

    if (!header || !layer) return;

    layer.innerHTML = '';
    const pieceCount = 40;
    const colors = ['#8b4513', '#a0522d', '#c19a3d', '#d4af37', '#b8860b'];

    for (let i = 0; i < pieceCount; i++) {
        const piece = document.createElement('span');
        piece.className = 'confetti-piece';

        const size = 6 + Math.random() * 8;
        const duration = 4 + Math.random() * 4;
        const delay = Math.random() * -8;
        const xStart = (Math.random() - 0.5) * 220;
        const xEnd = (Math.random() - 0.5) * 220;

        piece.style.width = `${size}px`;
        piece.style.height = `${size * 1.4}px`;
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.setProperty('--duration', `${duration}s`);
        piece.style.setProperty('--delay', `${delay}s`);
        piece.style.setProperty('--x-start', `${xStart}px`);
        piece.style.setProperty('--x-end', `${xEnd}px`);
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;

        layer.appendChild(piece);
    }
}

// Affiche le message après chargement de la page
window.onload = () => {
    document.getElementById("warning").style.display = "flex";
    initConfetti();
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.2
});

const items = document.querySelectorAll('section');
items.forEach(item => observer.observe(item));

function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
}

const guestId = getQueryParam('id');
const eventId = getQueryParam('eventId');

if (guestId && eventId) {
    fetch(`https://carte-invitation.onrender.com/assets/scripts/api.php?id=${encodeURIComponent(guestId)}&eventId=${encodeURIComponent(eventId)}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.querySelector('.guest-name').textContent = data.error;
                return;
            }
            // Affiche les infos dans la page
            document.querySelector('.guest-name').textContent = data.fullName;
            document.querySelector('.group-size').textContent = data.groupSize > 1 ? `Valable pour ${data.groupSize} personnes` : "Valable pour une personne";
            document.querySelector('.table-name').textContent = data.tableName;
            document.getElementById('table-number').textContent = data.tableNumber;

            // // Puis colorer la table en fonction du nouveau numéro
            const numero = data.tableNumber;  // prends directement la valeur de la réponse JSON

            // // Colorer la bonne table
            const elementsToColor = document.querySelectorAll(".cls-1.T" + numero);
            const tableNumber = document.querySelectorAll(".cls-3.T" + numero + ", .cls-4.T" + numero );
            elementsToColor.forEach(el => el.style.fill = "#ffbb00");
            tableNumber.forEach(tn => {tn.style.fill = "#cf6400";});

            // Générer le QR code (avec la librairie QRCode.js par exemple)
            new QRCode(document.querySelector('.qrcode'), {
                text: guestId,
                width: 128,
                height: 128,
            });
        })
        .catch(err => {
            document.querySelector('.guest-name').textContent = "Erreur lors du chargement.";
            console.error(err);
        });
} else {
    document.querySelector('.guest-name').textContent = "Elise Dupont";
}


