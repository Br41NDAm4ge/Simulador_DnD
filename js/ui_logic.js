document.addEventListener("DOMContentLoaded", () => {
    const tilesList = document.getElementById('tiles-list');
    const monstersList = document.getElementById('monsters-list');
    
    // 1. Carrega os Tiles na aba de Tiles
    tileFiles.forEach(filename => {
        const imgSrc = `assets/tiles/${filename}`;
        
        const img = new Image();
        img.src = imgSrc;
        appState.loadedImages[filename] = img;

        const div = document.createElement('div');
        div.className = 'tile-item';
        div.style.backgroundImage = `url('${imgSrc}')`;
        div.title = filename;

        div.addEventListener('click', () => {
            document.querySelectorAll('.tile-item, .monster-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            appState.activeToolType = 'tile';
            appState.selectedTile = filename;
        });

        tilesList.appendChild(div);
    });

    // 2. Cria dinamicamente os itens na aba de Monstros baseando-se na Spritesheet
    const totalMonsters = 70; // Quantidade aproximada de animais na sua imagem
    for (let i = 0; i < totalMonsters; i++) {
        const div = document.createElement('div');
        div.className = 'tile-item monster-item';
        
        const col = i % monsterConfig.columns;
        const row = Math.floor(i / monsterConfig.columns);
        
        div.style.backgroundImage = `url('${monsterConfig.sheetSrc}')`;
        div.style.backgroundPosition = `-${col * 32}px -${row * 32}px`;
        div.style.backgroundSize = '300px';

        div.addEventListener('click', () => {
            document.querySelectorAll('.tile-item, .monster-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            appState.activeToolType = 'monster';
            appState.selectedMonsterIndex = i;
        });

        monstersList.appendChild(div);
    }

    // 3. Lógica de Alternância de Abas
    const btnTiles = document.getElementById('btn-tiles');
    const btnMonsters = document.getElementById('btn-monsters');
    const tilesPanel = document.getElementById('tiles-panel');
    const monstersPanel = document.getElementById('monsters-panel');

    btnTiles.onclick = () => {
        tilesPanel.style.display = 'block';
        monstersPanel.style.display = 'none';
        btnTiles.classList.add('active');
        btnMonsters.classList.remove('active');
    };

    btnMonsters.onclick = () => {
        tilesPanel.style.display = 'none';
        monstersPanel.style.display = 'block';
        btnMonsters.classList.add('active');
        btnTiles.classList.remove('active');
    };
});