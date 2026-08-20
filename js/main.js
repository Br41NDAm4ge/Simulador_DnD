import { inicializarGrid } from './grid.js';

// Espera a tela carregar para iniciar tudo
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    inicializarGrid(container);
});