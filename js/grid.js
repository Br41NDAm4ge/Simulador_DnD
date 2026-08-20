import { carregarGrid, salvarGrid } from './storage.js';

const tamanhoQuadrado = 50; 
let estadoGrid = carregarGrid();
let ferramentaAtual = 'estrutura'; // Começa com a estrutura selecionada

// Função para o main.js avisar qual ferramenta foi clicada
export function setFerramentaAtual(ferramenta) {
    ferramentaAtual = ferramenta;
}

export function inicializarGrid(container) {
    const colunas = 100;
    const linhas = 100;

    container.style.gridTemplateColumns = `repeat(${colunas}, ${tamanhoQuadrado}px)`;
    container.style.gridTemplateRows = `repeat(${linhas}, ${tamanhoQuadrado}px)`;

    for (let l = 0; l < linhas; l++) {
        for (let c = 0; c < colunas; c++) {
            const quadrado = document.createElement('div');
            quadrado.className = 'square';
            
            const idPosicao = `${l}-${c}`;
            quadrado.dataset.pos = idPosicao;

            // Se tem algo salvo aqui, pinta com a classe correta
            if (estadoGrid[idPosicao]) {
                quadrado.classList.add(estadoGrid[idPosicao]);
            }

            quadrado.addEventListener('click', () => aoClicarNoQuadrado(quadrado, idPosicao));
            container.appendChild(quadrado);
        }
    }
}

function aoClicarNoQuadrado(quadrado, idPosicao) {
    // Se clicar com a MESMA ferramenta, funciona como borracha
    if (quadrado.classList.contains(ferramentaAtual)) {
        quadrado.className = 'square'; // Limpa tudo
        delete estadoGrid[idPosicao];
    } else {
        // Limpa a classe antiga e aplica a ferramenta nova
        quadrado.className = `square ${ferramentaAtual}`;
        estadoGrid[idPosicao] = ferramentaAtual;
    }
    
    salvarGrid(estadoGrid);
}