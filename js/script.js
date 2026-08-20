const viewport = document.getElementById('viewport');

// Variáveis de controle
let scrollX = 1000; // Posição inicial X no mapa gigante
let scrollY = 1000; // Posição inicial Y no mapa gigante
const speed = 15;     // Velocidade de movimento
const threshold = 50; // Distância em pixels da borda para ativar o movimento

let mouseX = 0;
let mouseY = 0;

// Atualiza a posição atual do mouse na tela
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function updateScroll() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Verifica borda esquerda ou direita
    if (mouseX < threshold) {
        scrollX -= speed; // Move para a esquerda
    } else if (mouseX > screenWidth - threshold) {
        scrollX += speed; // Move para a direita
    }

    // Verifica borda superior ou inferior
    if (mouseY < threshold) {
        scrollY -= speed; // Move para cima
    } else if (mouseY > screenHeight - threshold) {
        scrollY += speed; // Move para baixo
    }

    // Limita o movimento para não sair de dentro dos 3000px do mapa
    scrollX = Math.max(0, Math.min(scrollX, 3000 - screenWidth));
    scrollY = Math.max(0, Math.min(scrollY, 3000 - screenHeight));

    // Aplica a rolagem na janela
    window.scrollTo(scrollX, scrollY);

    requestAnimationFrame(updateScroll);
}

// Inicializa a posição da página no meio do mapa e ativa o loop
window.scrollTo(scrollX, scrollY);
requestAnimationFrame(updateScroll);