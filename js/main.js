import { initGrid, updateTransform } from './map_logic.js';
import { setupUI } from './ui_logic.js';

let posX = -(1200 - window.innerWidth / 2);
let posY = -(1200 - window.innerHeight / 2);
let scale = 1;
const speed = 12;
const threshold = 60;
let mouseX = -1;
let mouseY = -1;

document.addEventListener('DOMContentLoaded', () => {
    initGrid();
    setupUI();
    updateTransform(posX, posY, scale);
});

// Movimento de câmera com as bordas da tela
window.addEventListener('mousemove', (e) => {
    const sidebar = document.getElementById('sidebar');
    if (e.clientX <= sidebar.offsetWidth) {
        mouseX = -1;
        mouseY = -1;
        return;
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
});

document.addEventListener('mouseleave', () => { mouseX = -1; mouseY = -1; });
window.addEventListener('blur', () => { mouseX = -1; mouseY = -1; });

// Zoom com scroll
window.addEventListener('wheel', (e) => {
    const sidebar = document.getElementById('sidebar');
    if (e.clientX <= sidebar.offsetWidth) return;
    e.preventDefault();
    scale += (e.deltaY < 0 ? 0.1 : -0.1);
    scale = Math.min(Math.max(scale, 0.5), 2.5);
    updateTransform(posX, posY, scale);
}, { passive: false });

function gameLoop() {
    if (mouseX !== -1 && mouseY !== -1) {
        const sidebar = document.getElementById('sidebar');
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        if (mouseX < threshold + sidebar.offsetWidth) posX += speed; 
        else if (mouseX > screenWidth - threshold) posX -= speed; 

        if (mouseY < threshold) posY += speed; 
        else if (mouseY > screenHeight - threshold) posY -= speed; 

        const minX = -(2400 - screenWidth);
        const minY = -(2400 - screenHeight);
        
        posX = Math.min(sidebar.offsetWidth, Math.max(posX, minX));
        posY = Math.min(0, Math.max(posY, minY));

        updateTransform(posX, posY, scale);
    }
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);