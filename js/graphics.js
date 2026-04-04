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

        this.playerSpriteSheet = new Image();
        this.playerSpriteLoaded = false;
        this.playerSpriteFailed = false;
        this.playerSpriteSheet.src = 'assets/mainplayablespriteset.png';
        this.playerSpriteSheet.onload = () => {
            this.playerSpriteLoaded = true;
        };
        this.playerSpriteSheet.onerror = () => {
            this.playerSpriteFailed = true;
        };
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
            case 'lab':
                this.drawLabTile(x, y, ctx);
                break;
            case 'door':
                this.drawDoorTile(x, y, ctx);
                break;
            case 'sign':
                this.drawSignTile(x, y, ctx);
                break;
            case 'npc':
                this.drawNpcTile(x, y, ctx);
                break;
            case 'wall':
                this.drawWallTile(x, y, ctx);
                break;
            case 'tall_grass':
                this.drawTallGrassTile(x, y, ctx);
                break;
            case 'mountain':
                this.drawMountainTile(x, y, ctx);
                break;
            case 'swamp':
                this.drawSwampTile(x, y, ctx);
                break;
            case 'lava':
                this.drawLavaTile(x, y, ctx);
                break;
            case 'heal_center':
                this.drawHealCenterTile(x, y, ctx);
                break;
            case 'gym':
                this.drawGymTile(x, y, ctx);
                break;
            case 'dark_tree':
                this.drawDarkTreeTile(x, y, ctx);
                break;
            case 'ash_ground':
                this.drawAshGroundTile(x, y, ctx);
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

    drawLabTile(x, y, ctx) {
        const size = 32;
        ctx.fillStyle = '#6f8fa8';
        ctx.fillRect(x, y + 8, size, size - 8);
        ctx.fillStyle = '#8fb7d6';
        ctx.fillRect(x - 2, y + 4, size + 4, 8);
        ctx.fillStyle = '#cfe7f7';
        ctx.fillRect(x + 7, y + 14, 6, 6);
        ctx.fillRect(x + 19, y + 14, 6, 6);
        ctx.fillStyle = '#35506a';
        ctx.fillRect(x + 12, y + 22, 8, 10);
    }

    drawDoorTile(x, y, ctx) {
        const size = 32;
        ctx.fillStyle = '#9f8163';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#5f3d22';
        ctx.fillRect(x + 8, y + 4, 16, 28);
        ctx.fillStyle = '#2a1a0f';
        ctx.fillRect(x + 20, y + 17, 2, 2);
    }

    drawSignTile(x, y, ctx) {
        const size = 32;
        ctx.fillStyle = '#5a9a5a';
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 12, y + 16, 8, 16);
        ctx.fillStyle = '#d4a060';
        ctx.fillRect(x + 4, y + 4, 24, 14);
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 6, y + 6, 20, 2);
        ctx.fillRect(x + 6, y + 10, 20, 2);
    }

    drawNpcTile(x, y, ctx) {
        const size = 32;
        ctx.fillStyle = '#5a9a5a';
        ctx.fillRect(x, y, size, size);

        ctx.fillStyle = '#ff8080';
        ctx.fillRect(x + 9, y + 9, 14, 14);
        ctx.fillStyle = '#f4c2a1';
        ctx.fillRect(x + 11, y + 11, 10, 8);
        ctx.fillStyle = '#000';
        ctx.fillRect(x + 13, y + 13, 2, 2);
        ctx.fillRect(x + 17, y + 13, 2, 2);
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x + 11, y + 19, 10, 4);
    }

    drawWallTile(x, y, ctx) {
        ctx.fillStyle = '#3c3c3c';
        ctx.fillRect(x, y, 32, 32);
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(x + 2, y + 2, 28, 2);
        ctx.fillRect(x + 2, y + 16, 28, 2);
    }
    
    drawDefaultTile(x, y, colors, ctx) {
        ctx.fillStyle = colors[0];
        ctx.fillRect(x, y, 32, 32);
    }

    drawTallGrassTile(x, y, ctx) {
        const s = 32;
        ctx.fillStyle = '#3a6e3a';
        ctx.fillRect(x, y, s, s);
        ctx.fillStyle = '#2e5a2e';
        ctx.fillRect(x + 3, y + 8, 3, 16);
        ctx.fillRect(x + 8, y + 4, 3, 20);
        ctx.fillRect(x + 14, y + 6, 3, 18);
        ctx.fillRect(x + 20, y + 3, 3, 22);
        ctx.fillRect(x + 26, y + 7, 3, 17);
        ctx.fillStyle = '#4a8e4a';
        ctx.fillRect(x + 4, y + 6, 2, 4);
        ctx.fillRect(x + 15, y + 4, 2, 4);
        ctx.fillRect(x + 22, y + 2, 2, 4);
    }

    drawMountainTile(x, y, ctx) {
        const s = 32;
        ctx.fillStyle = '#5a5a6a';
        ctx.fillRect(x, y, s, s);
        ctx.fillStyle = '#6a6a7a';
        ctx.fillRect(x + 4, y + 4, 24, 20);
        ctx.fillStyle = '#8a8a9a';
        ctx.fillRect(x + 10, y + 2, 12, 8);
        ctx.fillRect(x + 6, y + 8, 6, 4);
        ctx.fillRect(x + 20, y + 10, 6, 4);
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(x + 2, y + 22, 28, 10);
        ctx.fillRect(x, y + 28, 32, 4);
    }

    drawSwampTile(x, y, ctx) {
        const s = 32;
        ctx.fillStyle = '#2e3e2e';
        ctx.fillRect(x, y, s, s);
        ctx.fillStyle = '#3a4e3a';
        ctx.fillRect(x + 4, y + 6, 10, 6);
        ctx.fillRect(x + 18, y + 16, 10, 6);
        ctx.fillStyle = '#4a6e4a';
        ctx.fillRect(x + 2, y + 20, 4, 4);
        ctx.fillRect(x + 24, y + 8, 4, 4);
        ctx.fillStyle = '#1a2e1a';
        ctx.fillRect(x + 8, y + 14, 6, 3);
        ctx.fillRect(x + 20, y + 24, 6, 3);
    }

    drawLavaTile(x, y, ctx) {
        const s = 32;
        const t = Date.now() / 800;
        ctx.fillStyle = '#3a1a00';
        ctx.fillRect(x, y, s, s);
        ctx.fillStyle = '#c04000';
        ctx.fillRect(x + 4, y + 8, 12, 8);
        ctx.fillRect(x + 18, y + 18, 10, 6);
        const glow = Math.sin(t) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255,100,0,${glow * 0.8})`;
        ctx.fillRect(x + 6, y + 10, 8, 4);
        ctx.fillRect(x + 20, y + 20, 6, 3);
        ctx.fillStyle = `rgba(255,200,0,${glow * 0.6})`;
        ctx.fillRect(x + 8, y + 11, 4, 2);
    }

    drawHealCenterTile(x, y, ctx) {
        const s = 32;
        ctx.fillStyle = '#d47a9a';
        ctx.fillRect(x, y + 8, s, s - 8);
        ctx.fillStyle = '#e8a0b8';
        ctx.fillRect(x - 2, y + 4, s + 4, 8);
        ctx.fillStyle = '#f0d0e0';
        ctx.fillRect(x + 6, y + 14, 6, 6);
        ctx.fillRect(x + 20, y + 14, 6, 6);
        ctx.fillStyle = '#cc2244';
        ctx.fillRect(x + 13, y + 18, 6, 2);
        ctx.fillRect(x + 15, y + 16, 2, 6);
        ctx.fillStyle = '#3a2030';
        ctx.fillRect(x + 12, y + 22, 8, 10);
    }

    drawGymTile(x, y, ctx) {
        const s = 32;
        ctx.fillStyle = '#4a4a5e';
        ctx.fillRect(x, y + 8, s, s - 8);
        ctx.fillStyle = '#5a5a6e';
        ctx.fillRect(x - 2, y + 4, s + 4, 8);
        ctx.fillStyle = '#8888aa';
        ctx.fillRect(x + 6, y + 14, 6, 6);
        ctx.fillRect(x + 20, y + 14, 6, 6);
        ctx.fillStyle = '#cccc44';
        ctx.fillRect(x + 11, y + 11, 10, 2);
        ctx.fillRect(x + 14, y + 9, 4, 2);
        ctx.fillStyle = '#2a2a3a';
        ctx.fillRect(x + 12, y + 22, 8, 10);
        ctx.fillStyle = '#cccc44';
        ctx.fillRect(x + 15, y + 24, 2, 2);
    }

    drawDarkTreeTile(x, y, ctx) {
        const s = 32;
        ctx.fillStyle = '#3a2e1e';
        ctx.fillRect(x + 12, y + 20, 8, 12);
        ctx.fillStyle = '#1e3a1e';
        ctx.fillRect(x + 4, y + 8, 24, 20);
        ctx.fillStyle = '#264a26';
        ctx.fillRect(x + 6, y + 10, 20, 16);
        ctx.fillStyle = '#2e5a2e';
        ctx.fillRect(x + 8, y + 12, 16, 12);
        ctx.fillStyle = '#3a6e3e';
        ctx.fillRect(x + 10, y + 14, 4, 4);
        ctx.fillRect(x + 18, y + 16, 3, 3);
        ctx.fillStyle = '#1a2a1a';
        ctx.fillRect(x + 16, y + 13, 2, 2);
    }

    drawAshGroundTile(x, y, ctx) {
        const s = 32;
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(x, y, s, s);
        ctx.fillStyle = '#6a6a6a';
        ctx.fillRect(x + 3, y + 4, 3, 3);
        ctx.fillRect(x + 12, y + 8, 3, 3);
        ctx.fillRect(x + 22, y + 6, 3, 3);
        ctx.fillRect(x + 6, y + 18, 3, 3);
        ctx.fillRect(x + 16, y + 15, 3, 3);
        ctx.fillRect(x + 25, y + 22, 3, 3);
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(x + 8, y + 12, 2, 2);
        ctx.fillRect(x + 20, y + 24, 2, 2);
        ctx.fillRect(x + 28, y + 14, 2, 2);
    }
    
    // Draw player sprite from sheet (fallback to procedural while loading/error)
    drawPlayerSprite(x, y, player, ctx, alpha = 0) {
        const destSize = 32;

        if (!this.playerSpriteLoaded || this.playerSpriteFailed) {
            this.drawProceduralPlayerSprite(x, y, player, ctx);
            return;
        }

        const sheet = this.playerSpriteSheet;
        const frameW = Math.floor(sheet.width / 4);
        const frameH = Math.floor(sheet.height / 4);
        const frameCol = player.isMoving ? (player.walkFrame % 4) : 0;
        const frameRow = this.getPlayerSpriteRow(player.direction);
        const srcX = frameCol * frameW;
        const srcY = frameRow * frameH;

        const prevSmoothing = ctx.imageSmoothingEnabled;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sheet, srcX, srcY, frameW, frameH, x, y, destSize, destSize);
        ctx.imageSmoothingEnabled = prevSmoothing;
    }

    getPlayerSpriteRow(direction) {
        if (direction.x > 0) return 3;
        if (direction.x < 0) return 2;
        if (direction.y < 0) return 1;
        return 0;
    }

    drawProceduralPlayerSprite(x, y, player, ctx) {
        const size = 32;
        const frame = player.isMoving ? player.walkFrame : 0;
        const legSwing = frame % 2 === 0 ? -1 : 1;
        const armSwing = -legSwing;
        const facingVertical = player.direction.y !== 0;
        const facingUp = player.direction.y < 0;

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(x + size/2, y + size - 4, size/3, size/6, 0, 0, Math.PI * 2);
        ctx.fill();

        const bob = 0;

        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(x + 8 + legSwing, y + 24 + bob, 6, 8);
        ctx.fillRect(x + 18 - legSwing, y + 24 + bob, 6, 8);

        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(x + 6 + legSwing, y + 30 + bob, 10, 2);
        ctx.fillRect(x + 16 - legSwing, y + 30 + bob, 10, 2);

        ctx.fillStyle = '#4169e1';
        ctx.fillRect(x + 6, y + 16 + bob, 20, 10);

        ctx.fillStyle = '#f4c2a1';
        ctx.fillRect(x + 2 + armSwing, y + 18 + bob, 6, 8);
        ctx.fillRect(x + 24 - armSwing, y + 18 + bob, 6, 8);

        ctx.fillStyle = '#f4c2a1';
        ctx.fillRect(x + 8, y + 10 + bob, 16, 10);

        ctx.fillStyle = '#ff6b6b';
        ctx.fillRect(x + 6, y + 6 + bob, 20, 6);
        ctx.fillRect(x + 4, y + 10 + bob, 24, 4);

        ctx.fillStyle = '#000';
        if (player.direction.x === 1) {
            ctx.fillRect(x + 16, y + 14 + bob, 2, 2);
        } else if (player.direction.x === -1) {
            ctx.fillRect(x + 14, y + 14 + bob, 2, 2);
        } else if (facingVertical && facingUp) {
            ctx.fillRect(x + 12, y + 13 + bob, 2, 2);
            ctx.fillRect(x + 18, y + 13 + bob, 2, 2);
        } else {
            ctx.fillRect(x + 12, y + 14 + bob, 2, 2);
            ctx.fillRect(x + 18, y + 14 + bob, 2, 2);
        }

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
