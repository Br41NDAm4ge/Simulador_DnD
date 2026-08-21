import { setSelectedColor, setCurrentTool, generateRandomTerrain } from './map_logic.js';

export function setupUI() {
    console.log("setupUI foi chamada com sucesso!");

    const btnEstruturas = document.getElementById('btn-estruturas');
    const structuresSubmenu = document.getElementById('structures-submenu');
    const btnFerramentas = document.getElementById('btn-ferramentas');
    const toolsSubmenu = document.getElementById('tools-submenu');

    if (btnEstruturas && structuresSubmenu) {
        btnEstruturas.addEventListener('click', (e) => {
            e.stopPropagation();
            structuresSubmenu.classList.toggle('hidden');
            if (toolsSubmenu) toolsSubmenu.classList.add('hidden');
            console.log("Clique em Estruturas funcionou!");
        });
    } else {
        console.warn("Elemento de estruturas não encontrado no DOM!");
    }

    if (btnFerramentas && toolsSubmenu) {
        btnFerramentas.addEventListener('click', (e) => {
            e.stopPropagation();
            toolsSubmenu.classList.toggle('hidden');
            if (structuresSubmenu) structuresSubmenu.classList.add('hidden');
            console.log("Clique em Ferramentas funcionou!");
        });
    } else {
        console.warn("Elemento de ferramentas não encontrado no DOM!");
    }

    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            setSelectedColor(button.getAttribute('data-color'));
            colorButtons.forEach(b => b.style.outline = 'none');
            button.style.outline = '3px solid #fff';
        });
    });

    const toolButtons = document.querySelectorAll('.tool-btn');
    toolButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tool = button.getAttribute('data-tool');
            if (tool === 'generate') {
                generateRandomTerrain();
                return;
            }
            setCurrentTool(tool);
            toolButtons.forEach(b => b.classList.remove('active-tool'));
            button.classList.add('active-tool');
        });
    });
}