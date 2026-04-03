// ============================================
// ENHANCED GRAPHICS SYSTEM - High quality pixel art
// ============================================

class GraphicsEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        // Color palettes for different environments
        this.palettes = {
            day: {
                grass: ['#4a7c4a', '#5a8c5a', '#6a9c6a'],
                water: ['#2a4a7a', '#3a5a8a', '#4a6a9a'],
                path: ['#8a7a6a', '#9a8a7a', '#aa9a8a'],
                tree: ['#2a4a2a', '#3a5a3a', '#4a6a4a'],
                building: ['#6a6a7a', '#7a7a8a', '#8a8a9a']
            },
            night: {
                grass: ['#2a3c2a', '#3a4c3a', '#4a5c4a'],
                water: ['#1a2a4a', '#2a3a5a', '#3a4a6a'],
                path: ['#5a4a3a', '#6a5a4a', '#7a6a5a'],
                tree: ['#1a2a1a', '#2a3a2a', '#3a4a3a'],
                building: ['#3a3a4a', '#4a4a5a', '#5a5a6a']
            }
        };
        
        this.currentPalette = this.palettes.day;
        this.timeOfDay = 'day';
        this.particles = [];
        this.screenShake = { x: 0, y: 0, duration: 0 };
    }
    
    // Set time of day for ambient lighting
    setTimeOfDay(time) {
        this.timeOfDay = time;
        this.currentPalette = this.palettes[time] || this.palettes.day;
    }
    
    // Add screen shake effect
    addScreenShake(intensity, duration) {
        this.screenShake = {
            x: (Math.random() - 0.5) * intensity,
            y: (Math.random() - 0.5) * intensity,
            duration: duration
        };
    }
    
    // Update screen shake
    updateScreenShake(deltaTime) {
        if (this.screenShake.duration > 0) {
            this.screenShake.duration -= deltaTime;
            if (this.screenShake.duration <= 0) {
                this.screenShake.x = 0;
                this.screenShake.y = 0;
            } else {
                this.screenShake.x = (Math.random() - 0.5) * this.screenShake.duration * 0.5;
                this.screenShake.y = (Math.random() - 0.5) * this.screenShake.duration * 0.5;
            }
        }
    }
    
    // Draw enhanced tile with depth and detail
    drawTile(x, y, tileType, ctx) {
        const colors = this.currentPalette[tileType] || this.palettes.day.grass;
        
        switch(tileType) {
            case 'grass':
                this.drawGrassTile(x, y, colors, ctx);
                break;
            case 'water':
                this.drawWaterTile(x, y, colors, ctx);
                break;
            case 'path':
                this.drawPathTile(x, y, colors, ctx);
                break;
            case 'tree':
                this.drawTreeTile(x, y, colors, ctx);
                break;
            case 'building':
                this.drawBuildingTile(x, y, colors, ctx);
                break;
            default:
                this.drawDefaultTile(x, y, colors, ctx);
        }
    }
    
    drawGrassTile(x, y, colors, ctx) {
        const size = 32;
        
        // Base grass
        ctx.fillStyle = colors[0];
        ctx.fillRect(x, y, size, size);
        
        // Deterministic grass texture (stable across frames)
        ctx.fillStyle = colors[1];
        ctx.fillRect(x + 4, y + 6, 2, 2);
        ctx.fillRect(x + 11, y + 15, 2, 2);
        ctx.fillRect(x + 20, y + 9, 2, 2);
        ctx.fillRect(x + 26, y + 21, 2, 2);
        ctx.fillRect(x + 14, y + 26, 2, 2);

        // Deterministic highlights
        ctx.fillStyle = colors[2];
        ctx.fillRect(x + 7, y + 10, 1, 3);
        ctx.fillRect(x + 18, y + 5, 1, 3);
        ctx.fillRect(x + 24, y + 17, 1, 3);
    }
    
    drawWaterTile(x, y, colors, ctx) {
        const size = 32;
        const time = Date.now() / 1000;
        
        // Base water
        ctx.fillStyle = colors[0];
        ctx.fillRect(x, y, size, size);
        
        // Animated waves
        for (let i = 0; i < 3; i++) {
            const waveX = x + (Math.sin(time + i) * 10) + 16;
            const waveY = y + (i * 10) + 5;
            ctx.fillStyle = colors[1];
            ctx.fillRect(waveX, waveY, 8, 2);
        }
        
        // Reflection highlights
        ctx.fillStyle = colors[2];
        ctx.fillRect(x + 5, y + 5, 3, 3);
        ctx.fillRect(x + 20, y + 15, 2, 2);
    }
    
    drawPathTile(x, y, colors, ctx) {
        const size = 32;
        
        // Base path
        ctx.fillStyle = colors[0];
        ctx.fillRect(x, y, size, size);
        
        // Deterministic stone texture (stable across frames)
        ctx.fillStyle = colors[1];
        ctx.fillRect(x + 3, y + 4, 3, 3);
        ctx.fillRect(x + 12, y + 8, 3, 3);
        ctx.fillRect(x + 22, y + 6, 3, 3);
        ctx.fillRect(x + 6, y + 18, 3, 3);
        ctx.fillRect(x + 16, y + 15, 3, 3);
        ctx.fillRect(x + 25, y + 20, 3, 3);
        ctx.fillRect(x + 10, y + 25, 3, 3);
        ctx.fillRect(x + 20, y + 27, 3, 3);
        
        // Wear patterns
        ctx.fillStyle = colors[2];
        ctx.fillRect(x + 10, y + 10, 12, 2);
        ctx.fillRect(x + 8, y + 20, 16, 1);
    }
    
    drawTreeTile(x, y, colors, ctx) {
        const size = 32;
        
        // Tree trunk
        ctx.fillStyle = '#4a3a2a';
        ctx.fillRect(x + 12, y + 20, 8, 12);
        
        // Tree crown (layered)
        ctx.fillStyle = colors[0];
        ctx.fillRect(x + 4, y + 8, 24, 20);
        
        ctx.fillStyle = colors[1];
        ctx.fillRect(x + 6, y + 10, 20, 16);
        
        ctx.fillStyle = colors[2];
        ctx.fillRect(x + 8, y + 12, 16, 12);
        
        // Highlights
        ctx.fillStyle = '#6a8c6a';
        ctx.fillRect(x + 10, y + 14, 4, 4);
        ctx.fillRect(x + 18, y + 16, 3, 3);
    }
    
    drawBuildingTile(x, y, colors, ctx) {
        const size = 32;
        
        // Building base
        ctx.fillStyle = colors[0];
        ctx.fillRect(x, y + 8, size, size - 8);
        
        // Roof
        ctx.fillStyle = '#6a4a3a';
        ctx.fillRect(x - 2, y + 4, size + 4, 8);
        
        // Windows
        ctx.fillStyle = '#4a6a8a';
        ctx.fillRect(x + 6, y + 14, 6, 6);
        ctx.fillRect(x + 20, y + 14, 6, 6);
        
        // Door
        ctx.fillStyle = '#4a3a2a';
        ctx.fillRect(x + 12, y + 22, 8, 10);
        
        // Details
        ctx.fillStyle = colors[1];
        ctx.fillRect(x + 2, y + 10, 2, 2);
        ctx.fillRect(x + 28, y + 10, 2, 2);
    }
    
    drawDefaultTile(x, y, colors, ctx) {
        ctx.fillStyle = colors[0];
        ctx.fillRect(x, y, 32, 32);
    }
    
    // Draw enhanced player sprite
    drawPlayerSprite(x, y, player, ctx, alpha = 0) {
        const size = 32;
        const frame = player.isMoving ? player.walkFrame : 0;
        const legSwing = frame % 2 === 0 ? -1 : 1;
        const armSwing = -legSwing;
        const facingVertical = player.direction.y !== 0;
        const facingUp = player.direction.y < 0;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(x + size/2, y + size - 4, size/3, size/6, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Keep vertical position stable to avoid hopping between tiles
        const bob = 0;
        
        // Body layers
        // Legs
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x + 8 + legSwing, y + 24 + bob, 6, 8);
        ctx.fillRect(x + 18 - legSwing, y + 24 + bob, 6, 8);
        
        // Shoes
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 6 + legSwing, y + 30 + bob, 10, 2);
        ctx.fillRect(x + 16 - legSwing, y + 30 + bob, 10, 2);
        
        // Torso
        ctx.fillStyle = '#4169e1';
        ctx.fillRect(x + 6, y + 16 + bob, 20, 10);
        
        // Arms
        ctx.fillStyle = '#f4c2a1';
        ctx.fillRect(x + 2 + armSwing, y + 18 + bob, 6, 8);
        ctx.fillRect(x + 24 - armSwing, y + 18 + bob, 6, 8);
        
        // Head
        ctx.fillStyle = '#f4c2a1';
        ctx.fillRect(x + 8, y + 10 + bob, 16, 10);
        
        // Hat
        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(x + 6, y + 6 + bob, 20, 6);
        ctx.fillRect(x + 4, y + 10 + bob, 24, 4);
        
        // Eyes based on direction
        ctx.fillStyle = '#000';
        if (player.direction.x === 1) { // right
            ctx.fillRect(x + 16, y + 14 + bob, 2, 2);
        } else if (player.direction.x === -1) { // left
            ctx.fillRect(x + 14, y + 14 + bob, 2, 2);
        } else if (facingVertical && facingUp) { // up
            ctx.fillRect(x + 12, y + 13 + bob, 2, 2);
            ctx.fillRect(x + 18, y + 13 + bob, 2, 2);
        } else { // down
            ctx.fillRect(x + 12, y + 14 + bob, 2, 2);
            ctx.fillRect(x + 18, y + 14 + bob, 2, 2);
        }
        
        // Backpack
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 4, y + 16 + bob, 4, 10);
        ctx.fillRect(x + 24, y + 16 + bob, 4, 10);
    }
    
    // Apply screen shake to context
    applyScreenShake(ctx) {
        if (this.screenShake.duration > 0) {
            ctx.translate(this.screenShake.x, this.screenShake.y);
        }
    }
    
    // Draw particle effects
    drawParticles(ctx) {
        this.particles = this.particles.filter(particle => {
            particle.life -= 0.02;
            if (particle.life <= 0) return false;
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // gravity
            
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life;
            ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
            ctx.globalAlpha = 1;
            
            return true;
        });
    }
    
    // Add particle burst
    addParticleBurst(x, y, color, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * 3 + 1,
                color: color,
                life: 1
            });
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GraphicsEngine };
}
