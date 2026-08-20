const mapGrid = document.getElementById('map-grid');
const sidebar = document.getElementById('sidebar');
const btnEstruturas = document.getElementById('btn-estruturas');
const structuresSubmenu = document.getElementById('structures-submenu');
const colorButtons = document.querySelectorAll('.color-btn');

let posX = -(1500 - window.innerWidth / 2);
let posY = -(1500 - window.innerHeight / 2);

const speed = 12;     
const threshold = 60; 

let mouseX = -1;
let mouseY = -1;
let selectedColor = null; 
let isMouseDown = false; 

// Controla o clique do mouse de forma global na janela inteira
window.addEventListener('mousedown', (e) => {
    if (e.button === 0 && e.clientX > sidebar.offsetWidth) { // Apenas botão esquerdo do mouse
        isMouseDown = true;
    }
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
});

// Função para pintar a célula verificando se é água ou cor comum
function paintCell(cell) {
    if (!selectedColor) return;

    if (selectedColor === '#3498db') {
        cell.className = 'grid-cell water-tile';
        cell.style.backgroundColor = ''; 
    } else {
        cell.className = 'grid-cell'; 
        cell.style.backgroundColor = selectedColor;
    }
}

// 1. Gerar o grid dinamicamente (60x60 células)
const gridSize = 60;
for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    
    // Inicia a pintura ao clicar na célula
    cell.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isMouseDown = true;
        paintCell(cell);
    });

    // Pinta ao passar o mouse por cima caso o botão esquerdo esteja pressionado
    cell.addEventListener('mouseenter', () => {
        if (isMouseDown) {
            paintCell(cell);
        }
    });

    mapGrid.appendChild(cell);
}

// 2. Controlar abertura do sub-menu de estruturas
btnEstruturas.addEventListener('click', () => {
    structuresSubmenu.classList.toggle('hidden');
});

// 3. Selecionar a cor ao clicar nas opções do menu
colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedColor = button.getAttribute('data-color');
        colorButtons.forEach(b => b.style.outline = 'none');
        button.style.outline = '3px solid #fff';
    });
});

// Captura a posição do mouse para mover o mapa nas bordas
window.addEventListener('mousemove', (e) => {
    if (e.clientX <= sidebar.offsetWidth) {
        mouseX = -1;
        mouseY = -1;
        return;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseleave', () => {
    mouseX = -1;
    mouseY = -1;
    isMouseDown = false;
});

window.addEventListener('blur', () => {
    mouseX = -1;
    mouseY = -1;
    isMouseDown = false;
});

function gameLoop() {
    if (mouseX !== -1 && mouseY !== -1) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (mouseX < threshold + sidebar.offsetWidth) {
            posX += speed; 
        } else if (mouseX > screenWidth - threshold) {
            posX -= speed; 
        }

        if (mouseY < threshold) {
            posY += speed; 
        } else if (mouseY > screenHeight - threshold) {
            posY -= speed; 
        }

        const minX = -(3000 - screenWidth);
        const minY = -(3000 - screenHeight);
        
        posX = Math.min(sidebar.offsetWidth, Math.max(posX, minX));
        posY = Math.min(0, Math.max(posY, minY));

        mapGrid.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);