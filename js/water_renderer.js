// js/water_renderer.js

export class WaterRenderer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 40;
        this.canvas.height = 40;
    }

    getWaterTileDataUrl(timeOffset, row, col) {
        const ctx = this.ctx;
        
        // Aumentamos a frequência e a amplitude para gerar uma onda de cores marcante
        let wave = Math.sin(col * 0.2 + timeOffset * 3) + Math.cos(row * 0.2 - timeOffset * 1.5);
        
        // Variação de brilho bem mais perceptível (-25% até +25%)
        let factor = 1 + (wave * 0.25);
        
        // Cores base (Azul vibrante)
        let r = Math.floor(41 * factor);
        let g = Math.floor(128 * factor);
        let b = Math.floor(185 * factor);

        // Limita os valores entre 0 e 255
        r = Math.min(255, Math.max(0, r));
        g = Math.min(255, Math.max(0, g));
        b = Math.min(255, Math.max(0, b));

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(0, 0, 40, 40);

        return this.canvas.toDataURL();
    }
}