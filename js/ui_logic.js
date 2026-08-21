document.addEventListener("DOMContentLoaded", () => {
    const tilesList = document.getElementById('tiles-list');
    
    // Pré-carrega as imagens e cria os botões na sidebar
    tileFiles.forEach(filename => {
        const imgSrc = `assets/tiles/${filename}`;
        
        // Cache da imagem para o canvas desenhar rápido
        const img = new Image();
        img.src = imgSrc;
        appState.loadedImages[filename] = img;

        // Cria o elemento visual na sidebar
        const div = document.createElement('div');
        div.className = 'tile-item';
        div.style.backgroundImage = `url('${imgSrc}')`;
        div.title = filename;

        div.addEventListener('click', () => {
            // Remove seleção anterior
            document.querySelectorAll('.tile-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            appState.selectedTile = filename;
        });

        tilesList.appendChild(div);
    });

    // Lógica das Abas
    document.getElementById('btn-tiles').onclick = (e) => switchTab(e, 'tiles-panel');
    document.getElementById('btn-monsters').onclick = (e) => switchTab(e, 'monsters-panel');

    function switchTab(event, panelId) {
        document.querySelectorAll('.panel').forEach(p => p.style.display = 'none');
        document.querySelectorAll('.tabs button').forEach(b => b.classList.remove('active'));
        document.getElementById(panelId).style.display = 'block';
        event.target.classList.add('active');
    }
});