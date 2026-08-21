const canvas = document.getElementById('mapCanvas');
const ctx = canvas.getContext('2d');

const GRID_COLS = 200;
const GRID_ROWS = 200;
const TILE_SIZE = 32;

// Matriz do mapa (200x200 vazia)
let mapGrid = Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));

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

// Pega a posição do mouse
canvas.addEventListener('mousemove', (e) => {
    mouse.screenX = e.clientX - canvas.getBoundingClientRect().left;
    mouse.screenY = e.clientY - canvas.getBoundingClientRect().top;
    
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
    
    if (e.deltaY < 0) camera.zoom += zoomAmount; // Zoom in
    else camera.zoom -= zoomAmount; // Zoom out
    
    camera.zoom = Math.max(0.5, Math.min(camera.zoom, 3)); // Limites do zoom (50% a 300%)
    
    // Ajusta a câmera para o zoom focar no mouse
    camera.x = mouse.screenX - (mouse.screenX - camera.x) * (camera.zoom / oldZoom);
    camera.y = mouse.screenY - (mouse.screenY - camera.y) * (camera.zoom / oldZoom);
});

// Pinta o grid
function paintTile() {
    if (!appState.selectedTile) return;

    // Converte a posição da tela para a posição na matriz do grid
    const gridX = Math.floor((mouse.screenX - camera.x) / (TILE_SIZE * camera.zoom));
    const gridY = Math.floor((mouse.screenY - camera.y) / (TILE_SIZE * camera.zoom));

    // Verifica se está dentro dos limites de 200x200
    if (gridX >= 0 && gridX < GRID_COLS && gridY >= 0 && gridY < GRID_ROWS) {
        mapGrid[gridY][gridX] = appState.selectedTile;
    }
}

// --- RENDERIZAÇÃO E MOVIMENTO DE CÂMERA ---
function gameLoop() {
    // 1. Movimenta a câmera se o mouse estiver nas bordas
    const edgeSize = 40; // Pixels da borda para ativar o movimento
    const moveSpeed = 5;

    if (mouse.screenX < edgeSize) camera.x += moveSpeed;
    if (mouse.screenX > canvas.width - edgeSize) camera.x -= moveSpeed;
    if (mouse.screenY < edgeSize) camera.y += moveSpeed;
    if (mouse.screenY > canvas.height - edgeSize) camera.y -= moveSpeed;

    // 2. Limpa o canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 3. Aplica o Zoom e Pan
    ctx.save();
    ctx.translate(camera.x, camera.y);
    ctx.scale(camera.zoom, camera.zoom);

    // 4. Desenha os Tiles pintados
    for (let y = 0; y < GRID_ROWS; y++) {
        for (let x = 0; x < GRID_COLS; x++) {
            let tileName = mapGrid[y][x];
            if (tileName && appState.loadedImages[tileName]) {
                ctx.drawImage(appState.loadedImages[tileName], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }

    // 5. Desenha as linhas do Grid (apenas na área visível para otimizar)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1 / camera.zoom; // Mantém a linha fina independente do zoom

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
    
    // Chama o loop novamente na próxima atualização de tela (60fps)
    requestAnimationFrame(gameLoop);
}

// Inicia o loop
requestAnimationFrame(gameLoop);