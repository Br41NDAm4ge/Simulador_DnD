export const gridSize = 60;
export const cells = [];
export let selectedColor = '#4b7c3e';
export let currentTool = 'paint';
let isMouseDown = false;
let startCellCoord = null;
let selectedAreaCells = [];
let isMovingArea = false;
let moveBuffer = null;
let moveSourceBounds = null;

export function setSelectedColor(color) { selectedColor = color; }
export function setCurrentTool(tool) { 
    currentTool = tool; 
    isMovingArea = false;
    moveBuffer = null;
    startCellCoord = null;
    clearSelectionPreview();
}

export function updateTransform(x, y, scale) {
    const mapGrid = document.getElementById('map-grid');
    mapGrid.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
}

export function initGrid() {
    const mapGrid = document.getElementById('map-grid');
    const sidebar = document.getElementById('sidebar');
    mapGrid.innerHTML = '';

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
                } else if (currentTool === 'rectangle' || (currentTool === 'move' && !isMovingArea)) {
                    startCellCoord = { row: r, col: c };
                }
            });

            cell.addEventListener('mouseenter', () => {
                if (!isMouseDown) return;
                const r = parseInt(cell.dataset.row);
                const c = parseInt(cell.dataset.col);

                if (currentTool === 'paint') {
                    paintCell(cell);
                } else if ((currentTool === 'rectangle' || currentTool === 'move') && startCellCoord) {
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
}

export function generateRandomTerrain() {
    let inputSize = prompt("Digite o tamanho do terreno (ex: 10 a 25):", "15");
    let radius = parseInt(inputSize);
    if (isNaN(radius) || radius < 5) radius = 10;
    if (radius > 25) radius = 25;

    let centerR = Math.floor(gridSize / 2);
    let centerC = Math.floor(gridSize / 2);

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            cells[r][c].className = 'grid-cell';
            cells[r][c].style.backgroundColor = '';
            cells[r][c].style.backgroundImage = '';
            cells[r][c].style.border = '';
        }
    }

    for (let r = centerR - radius - 4; r <= centerR + radius + 4; r++) {
        for (let c = centerC - radius - 4; c <= centerC + radius + 4; c++) {
            if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) continue;
            let dist = Math.sqrt(Math.pow(r - centerR, 2) + Math.pow(c - centerC, 2));
            
            if (dist <= radius + 4) {
                if (dist > radius) {
                    cells[r][c].className = 'grid-cell water-tile';
                } else if (dist > radius - 3) {
                    cells[r][c].className = 'grid-cell earth-tile';
                } else {
                    cells[r][c].className = 'grid-cell grass-tile';
                }
            }
        }
    }

    updateBorders();
}

function getBounds(r1, c1, r2, c2) {
    return { minR: Math.min(r1, r2), maxR: Math.max(r1, r2), minC: Math.min(c1, c2), maxC: Math.max(c1, c2) };
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
                bgColor: cell.style.backgroundColor,
                bgImage: cell.style.backgroundImage
            });
        }
    }
    return data;
}

function clearArea(b) {
    for (let r = b.minR; r <= b.maxR; r++) {
        for (let c = b.minC; c <= b.maxC; c++) {
            cells[r][c].className = 'grid-cell';
            cells[r][c].style.backgroundColor = '';
            cells[r][c].style.backgroundImage = '';
        }
    }
}

function pasteAreaData(targetR, targetC, bufferData) {
    bufferData.forEach(item => {
        const destR = targetR + item.relRow;
        const destC = targetC + item.relCol;
        if (destR < gridSize && destC < gridSize) {
            cells[destR][destC].className = item.className;
            cells[destR][destC].style.backgroundColor = item.bgColor;
            cells[destR][destC].style.backgroundImage = item.bgImage;
        }
    });
}

function paintCellWithoutBorderUpdate(cell) {
    cell.style.backgroundColor = '';
    cell.style.backgroundImage = '';
    
    if (selectedColor === 'default') {
        cell.className = 'grid-cell';
    } else if (selectedColor === '#3498db') {
        cell.className = 'grid-cell water-tile';
    } else if (selectedColor === '#4b7c3e') {
        cell.className = 'grid-cell grass-tile';
    } else if (selectedColor === '#8d6e63') {
        cell.className = 'grid-cell earth-tile';
    } else if (selectedColor === '#7f8c8d') {
        cell.className = 'grid-cell stone-tile';
    } else {
        cell.className = 'grid-cell'; 
        cell.style.backgroundColor = selectedColor;
    }
}

function paintCell(cell) {
    paintCellWithoutBorderUpdate(cell);
    updateBorders();
}

function updateBorders() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const cell = cells[row][col];

            cell.classList.remove(
                'stone-border-t', 'stone-border-b', 'stone-border-l', 'stone-border-r',
                'earth-border-t', 'earth-border-b', 'earth-border-l', 'earth-border-r'
            );

            if (cell.classList.contains('stone-tile')) {
                if (row === 0 || !cells[row - 1][col].classList.contains('stone-tile')) cell.classList.add('stone-border-t');
                if (row === gridSize - 1 || !cells[row + 1][col].classList.contains('stone-tile')) cell.classList.add('stone-border-b');
                if (col === 0 || !cells[row][col - 1].classList.contains('stone-tile')) cell.classList.add('stone-border-l');
                if (col === gridSize - 1 || !cells[row][col + 1].classList.contains('stone-tile')) cell.classList.add('stone-border-r');
            }

            if (cell.classList.contains('earth-tile')) {
                if (row > 0 && cells[row - 1][col].classList.contains('water-tile')) cell.classList.add('earth-border-t');
                if (row < gridSize - 1 && cells[row + 1][col].classList.contains('water-tile')) cell.classList.add('earth-border-b');
                if (col > 0 && cells[row][col - 1].classList.contains('water-tile')) cell.classList.add('earth-border-l');
                if (col < gridSize - 1 && cells[row][col + 1].classList.contains('water-tile')) cell.classList.add('earth-border-r');
            }
        }
    }
}