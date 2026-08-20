import { inicializarGrid, setFerramentaAtual } from './grid.js';
import { inicializarCamera } from './camera.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    inicializarGrid(container);
    inicializarCamera();

    // Adiciona a lógica de clique no menu de ferramentas
    const botoesMenu = document.querySelectorAll('.ferramenta-btn');
    
    botoesMenu.forEach(botao => {
        botao.addEventListener('click', (e) => {
            // Pega o texto do botão, tira acentos e joga pra minúsculo (Ex: "Estrutura" vira "estrutura")
            let nomeFerramenta = e.target.innerText.toLowerCase();
            setFerramentaAtual(nomeFerramenta);
            console.log(`Ferramenta selecionada: ${nomeFerramenta}`);
        });
    });
});