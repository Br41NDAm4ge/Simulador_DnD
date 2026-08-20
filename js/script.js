const mapGrid = document.getElementById('map-grid');

// Posição inicial no centro do mapa (convertido para pixels negativos)
let posX = -(1500 - window.innerWidth / 2);
let posY = -(1500 - window.innerHeight / 2);

const speed = 12;     // Velocidade do movimento
const threshold = 60; // Distância (em pixels) da borda para disparar o scroll

let mouseX = -1;
let mouseY = -1;

// Captura a posição do mouse na tela
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Se o mouse sair da janela, para o movimento
window.addEventListener('mouseleave', () => {
    mouseX = -1;
    mouseY = -1;
});

function gameLoop() {
    if (mouseX !== -1 && mouseY !== -1) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Movimento Horizontal (Esquerda / Direita)
        if (mouseX < threshold) {
            posX += speed; // Move o mapa para a direita (revelando a esquerda)
        } else if (mouseX > screenWidth - threshold) {
            posX -= speed; // Move o mapa para a esquerda (revelando a direita)
        }

        // Movimento Vertical (Cima / Baixo)
        if (mouseY < threshold) {
            posY += speed; // Move o mapa para baixo (revelando o topo)
        } else if (mouseY > screenHeight - threshold) {
            posY -= speed; // Move o mapa para cima (revelando a base)
        }

        // Limites para o mapa não sumir totalmente da tela
        const minX = -(3000 - screenWidth);
        const minY = -(3000 - screenHeight);
        
        posX = Math.min(0, Math.max(posX, minX));
        posY = Math.min(0, Math.max(posY, minY));

        // Aplica a movimentação de forma ultra-suave via GPU
        mapGrid.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    requestAnimationFrame(gameLoop);
}

// Inicia o loop de animação
requestAnimationFrame(gameLoop);