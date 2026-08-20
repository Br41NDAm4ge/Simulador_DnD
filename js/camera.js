export function inicializarCamera() {
    const viewport = document.getElementById('viewport');
    const container = document.getElementById('grid-container');

    // Variáveis de estado da câmera
    let escala = 1;
    let posX = 0;
    let posY = 0;

    // Configurações de movimento de borda
    const margemBorda = 50; 
    const velocidadePan = 8; 
    let movimentoX = 0;
    let movimentoY = 0;
    let animacaoPan = null;

    // --- FUNÇÃO DE ZOOM (Roda do Mouse) ---
    viewport.addEventListener('wheel', (e) => {
        // IGNORA O ZOOM SE O MOUSE ESTIVER NO MENU
        if (e.target.closest('#ferramentas-menu')) return;

        e.preventDefault(); 

        const direcao = e.deltaY > 0 ? -1 : 1;
        const fatorZoom = 0.1;
        const novaEscala = Math.min(Math.max(0.3, escala + (direcao * fatorZoom)), 3); 

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        posX = mouseX - ((mouseX - posX) * (novaEscala / escala));
        posY = mouseY - ((mouseY - posY) * (novaEscala / escala));
        escala = novaEscala;

        atualizarCamera();
    });

    // --- DETECTAR MOUSE NA BORDA ---
    window.addEventListener('mousemove', (e) => {
        // NOVA REGRA: Se o mouse estiver em cima do menu, cancela o movimento e ignora a borda
        if (e.target.closest('#ferramentas-menu')) {
            movimentoX = 0;
            movimentoY = 0;
            if (animacaoPan) {
                cancelAnimationFrame(animacaoPan);
                animacaoPan = null;
            }
            return; // Sai da função aqui, sem olhar as bordas
        }

        movimentoX = 0;
        movimentoY = 0;

        // Verifica os 4 cantos da tela
        if (e.clientX < margemBorda) movimentoX = velocidadePan; 
        else if (e.clientX > window.innerWidth - margemBorda) movimentoX = -velocidadePan; 
        
        if (e.clientY < margemBorda) movimentoY = velocidadePan; 
        else if (e.clientY > window.innerHeight - margemBorda) movimentoY = -velocidadePan; 

        // Se o mouse estiver na borda, começa a mover. Se sair, para.
        if ((movimentoX !== 0 || movimentoY !== 0) && !animacaoPan) {
            animacaoPan = requestAnimationFrame(moverCamera);
        } else if (movimentoX === 0 && movimentoY === 0 && animacaoPan) {
            cancelAnimationFrame(animacaoPan);
            animacaoPan = null;
        }
    });

    // --- PARAR SE O MOUSE SAIR DA TELA ---
    window.addEventListener('mouseout', (e) => {
        if (e.relatedTarget === null) {
            movimentoX = 0;
            movimentoY = 0;
            if (animacaoPan) {
                cancelAnimationFrame(animacaoPan);
                animacaoPan = null;
            }
        }
    });

    // --- MOVER A CÂMERA DE FATO ---
    function moverCamera() {
        posX += movimentoX;
        posY += movimentoY;
        atualizarCamera();

        if (movimentoX !== 0 || movimentoY !== 0) {
            animacaoPan = requestAnimationFrame(moverCamera);
        }
    }

    // --- APLICAR NA TELA ---
    function atualizarCamera() {
        container.style.transform = `translate(${posX}px, ${posY}px) scale(${escala})`;
    }
}