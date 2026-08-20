import { carregarGrid, salvarGrid } from './storage.js';

const tamanhoQuadrado = 50; 
let estadoGrid = carregarGrid();

export function inicializarGrid(container) {
    const colunas = Math.floor(window.innerWidth / tamanhoQuadrado);
    const linhas = Math.floor(window.innerHeight / tamanhoQuadrado);

    container.style.gridTemplateColumns = `repeat(${colunas}, ${tamanhoQuadrado}px)`;
    container.style.gridTemplateRows = `repeat(${linhas}, ${tamanhoQuadrado}px)`;

    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            const quadrado = document.createElement('div');
            quadrado.classList.add('square');
            
            const idPosicao = `${l}-${c}`;
            quadrado.dataset.pos = idPosicao;

            if (estadoGrid[idPosicao]) quadrado.classList.add('marked');

            quadrado.addEventListener('click', () => aoClicarNoQuadrado(quadrado, idPosicao));
            container.appendChild(quadrado);
        }
    }
}

function aoClicarNoQuadrado(quadrado, idPosicao) {
    quadrado.classList.toggle('marked');
    
    if (quadrado.classList.contains('marked')) {
        estadoGrid[idPosicao] = true;
    } else {
        delete estadoGrid[idPosicao];
    }
    
    salvarGrid(estadoGrid);
}