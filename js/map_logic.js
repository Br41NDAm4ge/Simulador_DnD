const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

const GRID_COLS = 200;
const GRID_ROWS = 200;
const TILE_SIZE = 32;

// Três camadas: Base (chão), Overlay (poças/detalhes) e Monsters (entidades)
let mapGrid = {
    base: Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null)),
    overlay: Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null)),
    monsters: Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null))
};

// Câmera
let camera = { x: 0, y: 0, zoom: 1 };
let mouse = { x: 0, y: 0, screenX: 0, screenY: 0 };

function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- CONTROLES DE MOUSE ---

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.screenX = e.clientX - rect.left;
    mouse.screenY = e.clientY - rect.top;
    
    if (appState.isDrawing) paintTile();
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Clique esquerdo
        appState.isDrawing = true;
        paintTile();
    }
});

canvas.addEventListener('mouseup', () => appState.isDrawing = false);
canvas.addEventListener('mouseleave', () => appState.isDrawing = false);

// Zoom com o scroll do mouse
canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomAmount = 0.1;
    const oldZoom = camera.zoom;
    
    if (e.deltaY < 0) camera.zoom += zoomAmount;
    else camera.zoom -= zoomAmount;
    
    camera.zoom = Math.max(0.5, Math.min(camera.zoom, 3));
    
    camera.x = mouse.screenX - (mouse.screenX - camera.x) * (camera.zoom / oldZoom);
    camera.y = mouse.screenY - (mouse.screenY - camera.y) * (camera.zoom / oldZoom);
}, { passive: false });

// Pinta dependendo da ferramenta ativa
function paintTile() {
    const gridX = Math.floor((mouse.screenX - camera.x) / (TILE_SIZE * camera.zoom));
    const gridY = Math.floor((mouse.screenY - camera.y) / (TILE_SIZE * camera.zoom));

    if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
        if (appState.activeToolType === 'tile' && appState.selectedTile) {
            // Poças vão para a camada overlay para não apagar o chão debaixo
            if (appState.selectedTile.includes('Water_Hole')) {
                mapGrid.overlay[gridY][gridX] = appState.selectedTile;
            } else {
                mapGrid.base[gridY][gridX] = appState.selectedTile;
            }
        } else if (appState.activeToolType === 'monster' && appState.selectedMonsterIndex !== null) {
            mapGrid.monsters[gridY][gridX] = appState.selectedMonsterIndex;
        }
    }
}

// --- RENDERIZAÇÃO E MOVIMENTO DE CÂMERA ---
function gameLoop() {
    const isMouseInCanvas = 
        mouse.screenX >= 0 && 
        mouse.screenX <= canvas.width && 
        mouse.screenY >= 0 && 
        mouse.screenY <= canvas.height;

    const edgeSize = 40;
    const moveSpeed = 6;

    if (isMouseInCanvas) {
        if (mouse.screenX < edgeSize) camera.x += moveSpeed;
        if (mouse.screenX > canvas.width - edgeSize) camera.x -= moveSpeed;
        if (mouse.screenY < edgeSize) camera.y += moveSpeed;
        if (mouse.screenY > canvas.height - edgeSize) camera.y -= moveSpeed;
    }

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // 1. Desenha a Camada Base (Chão/Neve/Gelo)
    for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
            let tileName = mapGrid.base[y][x];
            if (tileName && appState.loadedImages[tileName]) {
                ctx.drawImage(appState.loadedImages[tileName], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // 2. Desenha a Camada Overlay (Poças de água)
    for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
            let tileName = mapGrid.overlay[y][x];
            if (tileName && appState.loadedImages[tileName]) {
                ctx.drawImage(appState.loadedImages[tileName], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // 3. Desenha a Camada de Monstros (Recortando direto da spritesheet)
    for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
            let monsterIndex = mapGrid.monsters[y][x];
            if (monsterIndex !== null && monsterConfig.image.complete) {
                const srcCol = monsterIndex % monsterConfig.columns;
                const srcRow = Math.floor(monsterIndex / monsterConfig.columns);
                
                ctx.drawImage(
                    monsterConfig.image,
                    srcCol * monsterConfig.spriteWidth, srcRow * monsterConfig.spriteHeight,
                    monsterConfig.spriteWidth, monsterConfig.spriteHeight,
                    x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE
                );
            }
        }
    }

    // 4. Desenha as linhas do Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1 / camera.zoom;

    ctx.beginPath();
    for (let x = 0; x <= GRID_COLS; x++) {
        ctx.moveTo(x * TILE_SIZE, 0);
        ctx.lineTo(x * TILE_SIZE, GRID_ROWS * TILE_SIZE);
    }
    for (let y = 0; y <= GRID_ROWS; y++) {
        ctx.moveTo(0, y * TILE_SIZE);
        ctx.lineTo(GRID_COLS * TILE_SIZE, y * TILE_SIZE);
    }
    ctx.stroke();

    ctx.restore();
    
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);