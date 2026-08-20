export function inicializarCamera() {
    const viewport = document.getElementById('viewport');
    const container = document.getElementById('grid-container');

    // Variáveis de estado da câmera
    let escala = 1;
    let posX = 0;
    let posY = 0;

    // Configurações de movimento de borda
    const margemBorda = 50; // Quão perto da borda o mouse precisa chegar (em pixels)
    const velocidadePan = 8; // Velocidade que o mapa anda
    let movimentoX = 0;
    let movimentoY = 0;
    let animacaoPan = null;

    // --- FUNÇÃO DE ZOOM (Roda do Mouse) ---
    viewport.addEventListener('wheel', (e) => {
        // Previne rolar a página inteira
        e.preventDefault(); 

        const direcao = e.deltaY > 0 ? -1 : 1;
        const fatorZoom = 0.1;
        const novaEscala = Math.min(Math.max(0.3, escala + (direcao * fatorZoom)), 3); // Limites de zoom: 30% a 300%

        // Matemática avançada de VTT: faz o zoom ir na direção do ponteiro do mouse
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        posX = mouseX - ((mouseX - posX) * (novaEscala / escala));
        posY = mouseY - ((mouseY - posY) * (novaEscala / escala));
        escala = novaEscala;

        atualizarCamera();
    });

    // --- DETECTAR MOUSE NA BORDA ---
    window.addEventListener('mousemove', (e) => {
        movimentoX = 0;
        movimentoY = 0;

        // Verifica os 4 cantos da tela
        if (e.clientX < margemBorda) movimentoX = velocidadePan; // Mouse na esquerda
        else if (e.clientX > window.innerWidth - margemBorda) movimentoX = -velocidadePan; // Mouse na direita
        
        if (e.clientY < margemBorda) movimentoY = velocidadePan; // Mouse no topo
        else if (e.clientY > window.innerHeight - margemBorda) movimentoY = -velocidadePan; // Mouse no fundo

        // Se o mouse estiver na borda, começa a mover. Se sair, para.
        if ((movimentoX !== 0 || movimentoY !== 0) && !animacaoPan) {
            animacaoPan = requestAnimationFrame(moverCamera);
        } else if (movimentoX === 0 && movimentoY === 0 && animacaoPan) {
            cancelAnimationFrame(animacaoPan);
            animacaoPan = null;
        }
    });

    // --- MOVER A CÂMERA DE FATO ---
    function moverCamera() {
        posX += movimentoX;
        posY += movimentoY;
        atualizarCamera();

        // Continua rodando em loop enquanto o mouse estiver na borda
        if (movimentoX !== 0 || movimentoY !== 0) {
            animacaoPan = requestAnimationFrame(moverCamera);
        }
    }

    // --- APLICAR NA TELA ---
    function atualizarCamera() {
        container.style.transform = `translate(${posX}px, ${posY}px) scale(${escala})`;
    }
}