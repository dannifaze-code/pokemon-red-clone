class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = { x: 0, y: 1 }; // Facing down
        this.name = 'RED';
        this.badges = [];
        this.isMoving = false;
        this.moveProgress = 0; // 0 to 1
        this.moveElapsedMs = 0;
        this.walkFrame = 0;
        this.walkFrameTimer = 0;
        this.moveSpeed = 250; // Milliseconds per tile (lower is faster)
        this.runSpeedMultiplier = 1.8; // How much faster running is
        this.isRunning = false;
        this.isBiking = false; // Future proofing
        this.moveFrom = { x: x, y: y };
        this.moveTo = { x: x, y: y };
        this.walkFrameIntervalMs = 80;
        this.justCompletedMove = false;
        
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
        if (this.isMoving) return false;
        
        this.direction = { x: dx, y: dy };
        
        const targetX = this.x + dx;
        const targetY = this.y + dy;
        
        if (map.isWalkable(targetX, targetY)) {
            this.isMoving = true;
            this.moveProgress = 0;
            this.walkFrame = 0;
            this.walkFrameTimer = 0;
            this.moveFrom = { x: this.x, y: this.y };
            this.moveTo = { x: targetX, y: targetY };
            return true;
        }

        return false;
    }

    canAcceptMovementInput() {
        return !this.isMoving && this.moveProgress === 0;
    }
    
    update(deltaTime) {
        this.justCompletedMove = false;

        if (this.isMoving) {
            const currentSpeed = this.isBiking ? this.moveSpeed / 2.5 : 
                                 this.isRunning ? this.moveSpeed / this.runSpeedMultiplier : 
                                 this.moveSpeed;

            this.moveElapsedMs += deltaTime;
            this.moveProgress = Math.min(1, this.moveElapsedMs / currentSpeed);

            this.walkFrameTimer += deltaTime;
            if (this.walkFrameTimer >= 80) {
                this.walkFrameTimer = 0;
                this.walkFrame = (this.walkFrame + 1) % 4;
            }
            
            if (this.moveProgress >= 1) {
                this.x = this.moveTo.x;
                this.y = this.moveTo.y;
                this.isMoving = false;
                this.moveProgress = 0;
                this.moveElapsedMs = 0;
                this.walkFrame = 0; // Reset to idle
                this.walkFrameTimer = 0;
                this.justCompletedMove = true;
            }
        } else {
            this.walkFrame = 0;
            this.walkFrameTimer = 0;
        }
    }
    
    getRenderPosition(alpha = 0) {
        if (!this.isMoving) {
            return { x: this.x * this.TILE_SIZE, y: this.y * this.TILE_SIZE };
        }
        
        // Smooth interpolation between frames
        const t = this.moveProgress;
        const x = this.moveFrom.x + (this.moveTo.x - this.moveFrom.x) * t;
        const y = this.moveFrom.y + (this.moveTo.y - this.moveFrom.y) * t;
        
        return { x: x * this.TILE_SIZE, y: y * this.TILE_SIZE };
    }
    
    render(ctx, alpha = 0) {
        const pos = this.getRenderPosition(alpha);
        const x = pos.x;
        const y = pos.y;
        const size = this.TILE_SIZE;
        
        // Walking animation bob - apply before drawing
        ctx.save();
        if (this.isMoving) {
            const bob = Math.sin(this.moveProgress * Math.PI * 4) * 2;
            ctx.translate(0, bob);
        }
        
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
            ctx.fillRect(x + 11, y + 12, 2, 2);
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
        
        ctx.restore();
    }
}
