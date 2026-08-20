const mapGrid = document.getElementById('map-grid');
const sidebar = document.getElementById('sidebar');
const btnEstruturas = document.getElementById('btn-estruturas');
const structuresSubmenu = document.getElementById('structures-submenu');
const colorButtons = document.querySelectorAll('.color-btn');

const btnFerramentas = document.getElementById('btn-ferramentas');
const toolsSubmenu = document.getElementById('tools-submenu');
const toolButtons = document.querySelectorAll('.tool-btn');

let posX = -(1500 - window.innerWidth / 2);
let posY = -(1500 - window.innerHeight / 2);
let scale = 1; 

const speed = 12;     
const threshold = 60; 

let mouseX = -1;
let mouseY = -1;
let selectedColor = '#4b7c3e'; 
let currentTool = 'paint'; 
let isMouseDown = false; 

let startCellCoord = null;
let selectedAreaCells = [];

let isMovingArea = false;
let moveBuffer = null;
let moveSourceBounds = null;

const gridSize = 60;
const cells = []; 

// Alternar sub-menus
btnEstruturas.addEventListener('click', () => {
    structuresSubmenu.classList.toggle('hidden');
    toolsSubmenu.classList.add('hidden');
});

btnFerramentas.addEventListener('click', () => {
    toolsSubmenu.classList.toggle('hidden');
    structuresSubmenu.classList.add('hidden');
});

colorButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedColor = button.getAttribute('data-color');
        colorButtons.forEach(b => b.style.outline = 'none');
        button.style.outline = '3px solid #fff';
    });
});

toolButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tool = button.getAttribute('data-tool');
        
        // Se clicar em Gerar Terreno, executa a função imediatamente
        if (tool === 'generate') {
            generateRandomTerrain();
            return;
        }

        currentTool = tool;
        toolButtons.forEach(b => b.classList.remove('active-tool'));
        button.classList.add('active-tool');
        clearSelectionPreview();
        isMovingArea = false;
        moveBuffer = null;
    });
});

// 1. Gerar o grid dinamicamente
for (let row = 0; row < gridSize; row++) {
    cells[row] = [];
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener('mousedown', (e) => {
            if (e.button !== 0 || e.clientX <= sidebar.offsetWidth) return;
            e.stopPropagation();
            isMouseDown = true;

            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);

            if (currentTool === 'paint') {
                paintCell(cell);
            } else if (currentTool === 'rectangle') {
                startCellCoord = { row: r, col: c };
            } else if (currentTool === 'move') {
                if (!isMovingArea) {
                    startCellCoord = { row: r, col: c };
                }
            }
        });

        cell.addEventListener('mouseenter', () => {
            if (!isMouseDown) return;
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);

            if (currentTool === 'paint') {
                paintCell(cell);
            } else if (currentTool === 'rectangle' && startCellCoord) {
                highlightArea(startCellCoord.row, startCellCoord.col, r, c);
            } else if (currentTool === 'move' && startCellCoord && !isMovingArea) {
                highlightArea(startCellCoord.row, startCellCoord.col, r, c);
            }
        });

        mapGrid.appendChild(cell);
        cells[row][col] = cell;
    }
}

window.addEventListener('mouseup', (e) => {
    if (!isMouseDown) return;
    isMouseDown = false;

    const target = e.target.closest('.grid-cell');
    if (!target) return;

    const endRow = parseInt(target.dataset.row);
    const endCol = parseInt(target.dataset.col);

    if (currentTool === 'rectangle' && startCellCoord) {
        applyRectangle(startCellCoord.row, startCellCoord.col, endRow, endCol);
        startCellCoord = null;
        clearSelectionPreview();
    } else if (currentTool === 'move') {
        if (!isMovingArea && startCellCoord) {
            moveSourceBounds = getBounds(startCellCoord.row, startCellCoord.col, endRow, endCol);
            moveBuffer = extractAreaData(moveSourceBounds);
            clearArea(moveSourceBounds);
            
            isMovingArea = true;
            startCellCoord = null;
            clearSelectionPreview();
            updateBorders();
        } else if (isMovingArea && moveBuffer) {
            pasteAreaData(endRow, endCol, moveBuffer);
            isMovingArea = false;
            moveBuffer = null;
            moveSourceBounds = null;
            updateBorders();
        }
    }
});

// ==========================================
// GERADOR PROCEDURAL DE TERRENO (ÁGUA -> TERRA -> GRAMA)
// ==========================================
function generateRandomTerrain() {
    let inputSize = prompt("Digite o tamanho máximo aproximado do terreno (ex: 20 a 40):", "25");
    let maxSize = parseInt(inputSize);
    if (isNaN(maxSize) || maxSize < 5) maxSize = 20;
    if (maxSize > 50) maxSize = 50;

    // Escolhe um ponto central aleatório no grid
    let centerR = Math.floor(Math.random() * (gridSize - maxSize)) + Math.floor(maxSize / 2);
    let centerC = Math.floor(Math.random() * (gridSize - maxSize)) + Math.floor(maxSize / 2);

    // 1. Limpa o grid primeiro
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            cells[r][c].className = 'grid-cell';
            cells[r][c].style.backgroundColor = '';
        }
    }

    // 2. Gera Água em formato orgânico (com expansão aleatória)
    let waterCells = [];
    let queue = [{r: centerR, c: centerC}];
    let visited = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));

    let waterLimit = maxSize * maxSize * 0.7;
    let count = 0;

    while (queue.length > 0 && count < waterLimit) {
        // Pega um elemento aleatório da fila para dar formato orgânico/circular
        let index = Math.floor(Math.random() * queue.length);
        let current = queue.splice(index, 1)[0];

        if (current.r < 0 || current.r >= gridSize || current.c < 0 || current.c >= gridSize) continue;
        if (visited[current.r][current.c]) continue;

        visited[current.r][current.c] = true;
        cells[current.r][current.c].className = 'grid-cell water-tile';
        waterCells.push(current);
        count++;

        // Adiciona vizinhos com chance aleatória
        const directions = [{r:-1, c:0}, {r:1, c:0}, {r:0, c:-1}, {r:0, c:1}];
        directions.forEach(d => {
            if (Math.random() > 0.3) {
                queue.push({r: current.r + d.r, c: current.c + d.c});
            }
        });
    }

    // 3. Gera Grama menor em cima da água (uma ilha interna)
    let grassLimit = waterCells.length * 0.55;
    let grassCount = 0;
    // Escolhe um ponto interno da água para começar a grama
    let grassQueue = [waterCells[Math.floor(waterCells.length / 2)]];
    let grassVisited = Array(gridSize).fill(0).map(() => Array(gridSize).fill(false));

    while (grassQueue.length > 0 && grassCount < grassLimit) {
        let index = Math.floor(Math.random() * grassQueue.length);
        let current = grassQueue.splice(index, 1)[0];

        if (current.r < 0 || current.r >= gridSize || current.c < 0 || current.c >= gridSize) continue;
        if (grassVisited[current.r][current.c]) continue;

        grassVisited[current.r][current.c] = true;
        cells[current.r][current.c].className = 'grid-cell grass-tile';
        grassCount++;

        const directions = [{r:-1, c:0}, {r:1, c:0}, {r:0, c:-1}, {r:0, c:1}];
        directions.forEach(d => {
            if (Math.random() > 0.25) {
                grassQueue.push({r: current.r + d.r, c: current.c + d.c});
            }
        });
    }

    // 4. Preenche as brechas entre Água e Grama com blocos de Terra
    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            // Se o tile for água, checa se tem grama vizinha. Se tiver, coloca terra no meio!
            if (cells[r][c].classList.contains('water-tile')) {
                let hasGrassNeighbor = false;
                const neighbors = [{r:r-1, c}, {r:r+1, c}, {r, c:c-1}, {r, c:c+1}];
                neighbors.forEach(n => {
                    if (n.r >= 0 && n.r < gridSize && n.c >= 0 && n.c < gridSize) {
                        if (cells[n.r][n.c].classList.contains('grass-tile')) {
                            hasGrassNeighbor = true;
                        }
                    }
                });
                if (hasGrassNeighbor && Math.random() > 0.2) {
                    cells[r][c].className = 'grid-cell earth-tile';
                }
            }
        }
    }

    updateBorders();
}

// Funções utilitárias
function getBounds(r1, c1, r2, c2) {
    return {
        minR: Math.min(r1, r2), maxR: Math.max(r1, r2),
        minC: Math.min(c1, c2), maxC: Math.max(c1, c2)
    };
}

function highlightArea(r1, c1, r2, c2) {
    clearSelectionPreview();
    const b = getBounds(r1, c1, r2, c2);
    for (let r = b.minR; r <= b.maxR; r++) {
        for (let c = b.minC; c <= b.maxC; c++) {
            cells[r][c].classList.add('selection-preview');
            selectedAreaCells.push(cells[r][c]);
        }
    }
}

function clearSelectionPreview() {
    selectedAreaCells.forEach(cell => cell.classList.remove('selection-preview'));
    selectedAreaCells = [];
}

function applyRectangle(r1, c1, r2, c2) {
    const b = getBounds(r1, c1, r2, c2);
    for (let r = b.minR; r <= b.maxR; r++) {
        for (let c = b.minC; c <= b.maxC; c++) {
            paintCellWithoutBorderUpdate(cells[r][c]);
        }
    }
    updateBorders();
}

function extractAreaData(b) {
    const data = [];
    for (let r = b.minR; r <= b.maxR; r++) {
        for (let c = b.minC; c <= b.maxC; c++) {
            const cell = cells[r][c];
            data.push({
                relRow: r - b.minR,
                relCol: c - b.minC,
                className: cell.className.replace(' selection-preview', ''),
                bgColor: cell.style.backgroundColor
            });
        }
    }
    return data;
}

function clearArea(b) {
    for (let r = b.minR; r <= b.maxR; r++) {
        for (let c = b.minC; c <= b.maxC; c++) {
            const cell = cells[r][c];
            cell.className = 'grid-cell';
            cell.style.backgroundColor = '';
        }
    }
}

function pasteAreaData(targetR, targetC, bufferData) {
    bufferData.forEach(item => {
        const destR = targetR + item.relRow;
        const destC = targetC + item.relCol;
        if (destR < gridSize && destC < gridSize) {
            const cell = cells[destR][destC];
            cell.className = item.className;
            cell.style.backgroundColor = item.bgColor;
        }
    });
}

function paintCellWithoutBorderUpdate(cell) {
    if (selectedColor === 'default') {
        cell.className = 'grid-cell';
        cell.style.backgroundColor = '';
    } else if (selectedColor === '#3498db') {
        cell.className = 'grid-cell water-tile';
        cell.style.backgroundColor = ''; 
    } else if (selectedColor === '#4b7c3e') {
        cell.className = 'grid-cell grass-tile';
        cell.style.backgroundColor = '';
    } else if (selectedColor === '#8d6e63') {
        cell.className = 'grid-cell earth-tile';
        cell.style.backgroundColor = '';
    } else if (selectedColor === '#7f8c8d') {
        cell.className = 'grid-cell stone-tile';
        cell.style.backgroundColor = '';
    } else {
        cell.className = 'grid-cell'; 
        cell.style.backgroundColor = selectedColor;
    }
}

function paintCell(cell) {
    paintCellWithoutBorderUpdate(cell);
    updateBorders();
}

// Atualização inteligente de bordas (A Terra só ganha borda se encostar na água)
function updateBorders() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = cells[row][col];

            cell.classList.remove(
                'grass-border-t', 'grass-border-b', 'grass-border-l', 'grass-border-r',
                'stone-border-t', 'stone-border-b', 'stone-border-l', 'stone-border-r',
                'earth-border-t', 'earth-border-b', 'earth-border-l', 'earth-border-r'
            );

            // Bordas da Grama
            if (cell.classList.contains('grass-tile')) {
                if (row === 0 || !cells[row - 1][col].classList.contains('grass-tile')) cell.classList.add('grass-border-t');
                if (row === gridSize - 1 || !cells[row + 1][col].classList.contains('grass-tile')) cell.classList.add('grass-border-b');
                if (col === 0 || !cells[row][col - 1].classList.contains('grass-tile')) cell.classList.add('grass-border-l');
                if (col === gridSize - 1 || !cells[row][col + 1].classList.contains('grass-tile')) cell.classList.add('grass-border-r');
            }

            // Bordas da Pedra
            if (cell.classList.contains('stone-tile')) {
                if (row === 0 || !cells[row - 1][col].classList.contains('stone-tile')) cell.classList.add('stone-border-t');
                if (row === gridSize - 1 || !cells[row + 1][col].classList.contains('stone-tile')) cell.classList.add('stone-border-b');
                if (col === 0 || !cells[row][col - 1].classList.contains('stone-tile')) cell.classList.add('stone-border-l');
                if (col === gridSize - 1 || !cells[row][col + 1].classList.contains('stone-tile')) cell.classList.add('stone-border-r');
            }

            // Bordas da Terra (Aplicadas APENAS se o vizinho naquela direção for Água)
            if (cell.classList.contains('earth-tile')) {
                if (row > 0 && cells[row - 1][col].classList.contains('water-tile')) cell.classList.add('earth-border-t');
                if (row < gridSize - 1 && cells[row + 1][col].classList.contains('water-tile')) cell.classList.add('earth-border-b');
                if (col > 0 && cells[row][col - 1].classList.contains('water-tile')) cell.classList.add('earth-border-l');
                if (col < gridSize - 1 && cells[row][col + 1].classList.contains('water-tile')) cell.classList.add('earth-border-r');
            }
        }
    }
}

// Zoom com Scroll
window.addEventListener('wheel', (e) => {
    if (e.clientX <= sidebar.offsetWidth) return;
    e.preventDefault();
    scale += (e.deltaY < 0 ? 0.1 : -0.1);
    scale = Math.min(Math.max(scale, 0.5), 2.5);
    updateTransform();
}, { passive: false });

function updateTransform() {
    mapGrid.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}

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
    mouseX = -1; mouseY = -1; isMouseDown = false;
});

window.addEventListener('blur', () => {
    mouseX = -1; mouseY = -1; isMouseDown = false;
});

function gameLoop() {
    if (mouseX !== -1 && mouseY !== -1) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (mouseX < threshold + sidebar.offsetWidth) posX += speed; 
        else if (mouseX > screenWidth - threshold) posX -= speed; 

        if (mouseY < threshold) posY += speed; 
        else if (mouseY > screenHeight - threshold) posY -= speed; 

        const minX = -(3000 - screenWidth);
        const minY = -(3000 - screenHeight);
        
        posX = Math.min(sidebar.offsetWidth, Math.max(posX, minX));
        posY = Math.min(0, Math.max(posY, minY));

        updateTransform();
    }
    requestAnimationFrame(gameLoop);
}

updateTransform();
requestAnimationFrame(gameLoop);