// Estado global do aplicativo
const appState = {
    selectedTile: null,          // Tile selecionado atualmente
    selectedMonsterIndex: null,  // Índice do monstro selecionado na spritesheet
    activeToolType: 'tile',      // 'tile' ou 'monster'
    isDrawing: false,
    loadedImages: {}             // Cache das imagens dos tiles
};

// Configuração da Spritesheet de Monstros
const monsterConfig = {
    sheetSrc: 'assets/enemies/animals.png',
    image: new Image(),
    spriteWidth: 24,   // Largura padrão de cada célula na spritesheet
    spriteHeight: 24,  // Altura padrão de cada célula na spritesheet
    columns: 9         // Quantidade de sprites por linha horizontal na imagem
};

monsterConfig.image.src = monsterConfig.sheetSrc;

// Lista completa de tiles
const tileFiles = [
    "Cliff_Base_0.png", "Cliff_Base_1.png", "Cliff_Base_Left_0.png", "Cliff_Base_Left_1.png",
    "Cliff_Base_Right_0.png", "Cliff_Base_Right_1.png", "Cliff_Left_0.png", "Cliff_Left_1.png",
    "Cliff_Middle_0.png", "Cliff_Middle_1.png", "Cliff_Right_1.png", "Cliff_Top.png",
    "Cliff_Top_Left.png", "Cliff_Top_Right.png", "Ice.png", "Ice_Bottom_Inner_Corners_0.png",
    "Ice_Bottom_Inner_Corners_1.png", "Ice_Bottom_Inner_Corners_2.png", "Ice_Bottom_Left.png",
    "Ice_Bottom_Left_Inner_Corner.png", "Ice_Bottom_Middle.png", "Ice_Bottom_Right.png",
    "Ice_Bottom_Right_Inner_Corner.png", "Ice_Circle.png", "Ice_Circle_2.png",
    "Ice_Inner_Corners_0.png", "Ice_Inner_Corners_1.png", "Ice_Inner_Corners_10.png",
    "Ice_Inner_Corners_2.png", "Ice_Inner_Corners_3.png", "Ice_Inner_Corners_4.png",
    "Ice_Inner_Corners_5.png", "Ice_Inner_Corners_6.png", "Ice_Inner_Corners_7.png",
    "Ice_Inner_Corners_8.png", "Ice_Inner_Corners_9.png", "Ice_Left.png",
    "Ice_Left_Inner_Corner_0.png", "Ice_Left_Inner_Corner_1.png", "Ice_Left_Inner_Corner_2.png",
    "Ice_Right.png", "Ice_Right_Inner_Corner_0.png", "Ice_Right_Inner_Corner_1.png",
    "Ice_Right_Inner_Corner_2.png", "Ice_Square.png", "Ice_Top_Inner_Corners_0.png",
    "Ice_Top_Inner_Corners_1.png", "Ice_Top_Inner_Corners_2.png", "Ice_Top_Left.png",
    "Ice_Top_Left_Inner_Corner.png", "Ice_Top_Middle.png", "Ice_Top_Right.png",
    "Ice_Top_Right_Inner_Corner.png", "Round_Ice_Bottom.png", "Round_Ice_Left.png",
    "Round_Ice_Right.png", "Round_Ice_Top.png", "Snow_0.png", "Snow_1.png", "Snow_2.png",
    "Snow_3.png", "Snow_4.png", "Snow_5.png", "Stairs_0.png", "Stairs_1.png",
    "Water_Hole_0.png", "Water_Hole_1.png", "Water_Hole_2.png"
];