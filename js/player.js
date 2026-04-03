class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = { x: 0, y: -1 }; // facing up
        
        this.isMoving = false;
        this.moveProgress = 0;
        this.moveSpeed = 0.15; // tiles per frame
        this.moveFrom = { x: x, y: y };
        this.moveTo = { x: x, y: y };
        
        this.TILE_SIZE = 32;
        
        // Simple sprite representation
        this.colors = {
            skin: '#f4c2a1',
            hat: '#ff6b6b',
            shirt: '#4169e1',
            pants: '#2c3e50',
            shoes: '#1a1a1a'
        };
    }
    
    move(dx, dy, map) {
        if (this.isMoving) return;
        
        this.direction = { x: dx, y: dy };
        
        const targetX = this.x + dx;
        const targetY = this.y + dy;
        
        if (map.isWalkable(targetX, targetY)) {
            this.isMoving = true;
            this.moveProgress = 0;
            this.moveFrom = { x: this.x, y: this.y };
            this.moveTo = { x: targetX, y: targetY };
        }
    }
    
    update(deltaTime) {
        if (this.isMoving) {
            this.moveProgress += this.moveSpeed;
            
            if (this.moveProgress >= 1) {
                this.x = this.moveTo.x;
                this.y = this.moveTo.y;
                this.isMoving = false;
                this.moveProgress = 0;
            }
        }
    }
    
    getRenderPosition() {
        if (!this.isMoving) {
            return { x: this.x * this.TILE_SIZE, y: this.y * this.TILE_SIZE };
        }
        
        const t = this.moveProgress;
        const x = this.moveFrom.x + (this.moveTo.x - this.moveFrom.x) * t;
        const y = this.moveFrom.y + (this.moveTo.y - this.moveFrom.y) * t;
        
        return { x: x * this.TILE_SIZE, y: y * this.TILE_SIZE };
    }
    
    render(ctx) {
        const pos = this.getRenderPosition();
        const x = pos.x;
        const y = pos.y;
        const size = this.TILE_SIZE;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(x + 4, y + size - 4, size - 8, 4);
        
        // Body (simple chibi style)
        // Hat
        ctx.fillStyle = this.colors.hat;
        ctx.fillRect(x + 6, y + 2, size - 12, 8);
        ctx.fillRect(x + 4, y + 8, size - 8, 4);
        
        // Face
        ctx.fillStyle = this.colors.skin;
        ctx.fillRect(x + 8, y + 10, size - 16, 8);
        
        // Eyes (simple dots)
        ctx.fillStyle = '#000';
        if (this.direction.x === 1) { // facing right
            ctx.fillRect(x + 14, y + 12, 2, 2);
        } else if (this.direction.x === -1) { // facing left
            ctx.fillRect(x + 16, y + 12, 2, 2);
        } else { // facing up/down
            ctx.fillRect(x + 11, y + 12, 2, 2);
            ctx.fillRect(x + 19, y + 12, 2, 2);
        }
        
        // Shirt
        ctx.fillStyle = this.colors.shirt;
        ctx.fillRect(x + 4, y + 18, size - 8, 10);
        
        // Backpack stripe
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x + 6, y + 18, 2, 10);
        ctx.fillRect(x + 24, y + 18, 2, 10);
        
        // Pants
        ctx.fillStyle = this.colors.pants;
        ctx.fillRect(x + 4, y + 26, 10, 6);
        ctx.fillRect(x + 18, y + 26, 10, 6);
        
        // Shoes
        ctx.fillStyle = this.colors.shoes;
        ctx.fillRect(x + 4, y + 30, 10, 2);
        ctx.fillRect(x + 18, y + 30, 10, 2);
        
        // Walking animation bob
        if (this.isMoving) {
            const bob = Math.sin(this.moveProgress * Math.PI * 4) * 2;
            // Re-render with offset would be better, but this is simplified
        }
    }
}
