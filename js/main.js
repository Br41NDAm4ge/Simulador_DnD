import { inicializarGrid } from './grid.js';
import { inicializarCamera } from './camera.js'; // Importamos a câmera nova

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    inicializarGrid(container);
    inicializarCamera(); // Ligamos a câmera!
});