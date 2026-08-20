// js/tileset.js
export function inicializarPaleta(aoSelecionarTileCallback) {
    const paleta = document.getElementById('paleta-tiles');
    const tilesGrid = document.getElementById('tiles-grid');

    // Exemplo de coordenadas de recortes do seu spritesheet (em pixels de background-position)
    // Cada tile tem um X e Y proporcional na imagem
    const tilesDisponiveis = [
        { id: 'parede-1', x: 0, y: 0 },
        { id: 'parede-2', x: -50, y: 0 },
        { id: 'parede-3', x: -100, y: 0 },
        { id: 'chao-1', x: 0, y: -50 },
        { id: 'chao-2', x: -50, y: -50 },
    ];

    tilesGrid.innerHTML = '';

    tilesDisponiveis.forEach(tile => {
        const div = document.createElement('div');
        div.className = 'tile-opcao';
        div.style.backgroundPosition = `${tile.x}px ${tile.y}px`;

        div.addEventListener('click', () => {
            // Remove seleção anterior
            document.querySelectorAll('.tile-opcao').forEach(el => el.classList.remove('selecionado'));
            div.classList.add('selecionado');

            // Avisa o grid qual tile desenhar
            aoSelecionarTileCallback(tile);
        });

        tilesGrid.appendChild(div);
    });
}

export function alternarVisibilidadePaleta(mostrar) {
    const paleta = document.getElementById('paleta-tiles');
    if (mostrar) {
        paleta.classList.remove('escondido');
    } else {
        paleta.classList.add('escondido');
    }
}