// Estado global do aplicativo
const appState = {
    selectedTile: null, // Imagem selecionada atualmente
    isDrawing: false,
    loadedImages: {} // Cache das imagens para não recarregar toda hora
};

// Lista de arquivos baseada na sua imagem 'image_761129.png'
const tileFiles = [
    'Cliff_Base_0.png', 'Cliff_Base_1.png', 'Cliff_Base_Left_0.png', 'Cliff_Base_Left_1.png',
    'Cliff_Base_Right_0.png', 'Cliff_Base_Right_1.png', 'Cliff_Left_0.png', 'Cliff_Left_1.png',
    'Cliff_Middle_0.png', 'Cliff_Middle_1.png', 'Cliff_Right_1.png', 'Cliff_Top_Left.png',
    'Cliff_Top_Right.png', 'Cliff_Top.png', 'Snow_0.png', 'Snow_1.png', 'Snow_2.png',
    'Snow_3.png', 'Snow_4.png', 'Snow_5.png'
];