// Cuida apenas de salvar e carregar os dados
export function carregarGrid() {
    return JSON.parse(localStorage.getItem('dndGridState')) || {};
}

export function salvarGrid(estado) {
    localStorage.setItem('dndGridState', JSON.stringify(estado));
}