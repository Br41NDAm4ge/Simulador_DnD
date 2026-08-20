export function inicializarPaleta(aoSelecionarTileCallback) {
    const paleta = document.getElementById('paleta-tiles');
    
    // Cria a estrutura visual da paleta com a imagem inteira
    paleta.innerHTML = `
        <div id="tileset-container">
            <img id="tileset-img" src="assets/images/Tileset_Preview_1.png" alt="Tileset">
            <div id="tile-selecao-cursor"></div>
        </div>
    `;

    const img = document.getElementById('tileset-img');
    const cursor = document.getElementById('tile-selecao-cursor');

    // Tamanho em pixels de cada quadradinho individual dentro do seu spritesheet original
    const tamanhoTileOriginal = 16; // Geralmente tiles de pixel art são 16x16 ou 32x32. Vamos testar 16.

    img.addEventListener('click', (e) => {
        const rect = img.getBoundingClientRect();
        
5        // Posição do clique dentro da imagem em pixels da tela
        const xNaTela = e.clientX - rect.left;
        const yNaTela = e.clientY - rect.top;

        // Calcula a escala caso a imagem esteja redimensionada na tela
        const escalaX = img.naturalWidth / img.clientWidth;
        const escalaY = img.naturalHeight / img.clientHeight;

        const xReal = Math.floor((xNaTela * escalaX) / tamanhoTileOriginal);
        const yReal = Math.floor((yNaTela * escalaY) / tamanhoTileOriginal);

        // Posiciona o quadrado vermelho de seleção em cima do tile clicado
        cursor.style.display = 'block';
        cursor.style.left = `${xReal * (tamanhoTileOriginal / escalaX)}px`;
        cursor.style.top = `${yReal * (tamanhoTileOriginal / escalaY)}px`;
        cursor.style.width = `${tamanhoTileOriginal / escalaX}px`;
        cursor.style.height = `${tamanhoTileOriginal / escalaY}px`;

        // Informa para o sistema qual tile foi escolhido (coordenadas da matriz)
        aoSelecionarTileCallback({ x: xReal, y: yReal, tamanho: tamanhoTileOriginal });
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