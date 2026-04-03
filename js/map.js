class GameMap {
    constructor() {
        this.TILE_SIZE = 32;
        this.width = 30;
        this.height = 30;
        
        // Generate a simple Pallet Town-like map
        this.tiles = [];
        this.generateMap();

        // NPC registry — maps "x,y" to story NPC IDs
        this.npcRegistry = {
            '20,12': 'rival_dray',
            '10,15': 'townsperson_1',
            '17,17': 'townsperson_2',
            '22,20': 'veil_grunt',
            '8,20':  'veil_commander'
        };

        // Sign registry — maps "x,y" to story sign IDs
        this.signRegistry = {
            '13,9':  'sign_fernvale',
            '15,22': 'sign_mossgrove'
        };

        // Professor lab door faces tile below door
        this.professorPos = { x: 15, y: 6 };

        // Stamp NPC/sign tiles from registries
        for (const key of Object.keys(this.npcRegistry)) {
            const [nx, ny] = key.split(',').map(Number);
            if (this.tiles[ny]) this.tiles[ny][nx] = 'npc';
        }
        for (const key of Object.keys(this.signRegistry)) {
            const [sx, sy] = key.split(',').map(Number);
            if (this.tiles[sy]) this.tiles[sy][sx] = 'sign';
        }
    }
    
    generateMap() {
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                // Default grass
                this.tiles[y][x] = 'grass';
                
                // Create paths
                if (y === 10 || y === 20) {
                    this.tiles[y][x] = 'path';
                }
                if (x === 15 && y > 8 && y < 22) {
                    this.tiles[y][x] = 'path';
                }
                
                // Buildings
                if ((x >= 8 && x <= 12 && y >= 5 && y <= 8) ||
                    (x >= 18 && x <= 22 && y >= 5 && y <= 8)) {
                    if (x === 10 && y === 8) {
                        this.tiles[y][x] = 'door';
                    } else if (y === 8) {
                        this.tiles[y][x] = 'path';
                    } else {
                        this.tiles[y][x] = 'building';
                    }
                }
                
                // Professor Oak's Lab
                if (x >= 13 && x <= 17 && y >= 2 && y <= 5) {
                    if (x === 15 && y === 5) {
                        this.tiles[y][x] = 'door';
                    } else if (y === 5) {
                        this.tiles[y][x] = 'path';
                    } else {
                        this.tiles[y][x] = 'lab';
                    }
                }
                
                // Trees around the edges
                if (x < 2 || x >= this.width - 2 || y < 2 || y >= this.height - 2) {
                    this.tiles[y][x] = 'tree';
                }
                
                // Tree clusters
                if ((x > 3 && x < 7 && y > 12 && y < 18) ||
                    (x > 23 && x < 27 && y > 12 && y < 18)) {
                    this.tiles[y][x] = 'tree';
                }
                
                // Water
                if (x > 5 && x < 10 && y > 22) {
                    this.tiles[y][x] = 'water';
                }
                
                // Signs
                if (x === 13 && y === 9) {
                    this.tiles[y][x] = 'sign';
                }
                
                // NPCs
                if ((x === 20 && y === 12) || (x === 10 && y === 15)) {
                    this.tiles[y][x] = 'npc';
                }
            }
        }
    }
    
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return 'wall';
        }
        return this.tiles[y][x];
    }
    
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        const walkable = ['grass', 'path', 'door'];
        return walkable.includes(tile);
    }

    getNpcAt(x, y) {
        return this.npcRegistry[`${x},${y}`] || null;
    }

    getSignAt(x, y) {
        return this.signRegistry[`${x},${y}`] || null;
    }

    isProfessorFacing(x, y) {
        return x === this.professorPos.x && y === this.professorPos.y;
    }
    
    update() {
        // Animate water tiles or other animated elements
    }
    
    render(ctx, offsetX, offsetY, viewWidth, viewHeight, graphics = null) {
        // Calculate visible tile range
        const startX = Math.floor(offsetX / this.TILE_SIZE);
        const startY = Math.floor(offsetY / this.TILE_SIZE);
        const endX = Math.min(this.width, startX + Math.ceil(viewWidth / this.TILE_SIZE) + 1);
        const endY = Math.min(this.height, startY + Math.ceil(viewHeight / this.TILE_SIZE) + 1);
        
        // Render visible tiles
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.getTile(x, y);
                const screenX = x * this.TILE_SIZE;
                const screenY = y * this.TILE_SIZE;
                
                if (graphics) {
                    // Use enhanced graphics
                    graphics.drawTile(screenX, screenY, tile, ctx);
                } else {
                    // Fallback to simple rendering
                    this.drawSimpleTile(screenX, screenY, tile, ctx);
                }
            }
        }
    }
    
    drawSimpleTile(x, y, tile, ctx) {
        const colors = {
            grass: '#5a9a5a',
            path: '#a08060',
            building: '#806040',
            lab: '#6080a0',
            tree: '#2d5a2d',
            water: '#4080c0',
            door: '#603020',
            sign: '#c0a060',
            npc: '#ff8080',
            wall: '#404040'
        };
        
        // Base tile
        ctx.fillStyle = colors[tile] || colors.grass;
        ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
        
        // Add details based on tile type
        this.renderTileDetails(ctx, tile, x, y);
    }
    
    renderTileDetails(ctx, tile, x, y) {
        const size = this.TILE_SIZE;
        
        switch(tile) {
            case 'grass':
                // Add some grass tufts
                ctx.fillStyle = '#4a8a4a';
                ctx.fillRect(x + 4, y + 4, 2, 2);
                ctx.fillRect(x + 20, y + 12, 2, 2);
                ctx.fillRect(x + 12, y + 22, 2, 2);
                break;
                
            case 'tree':
                // Tree trunk
                ctx.fillStyle = '#4a3020';
                ctx.fillRect(x + 12, y + 20, 8, 12);
                // Tree leaves
                ctx.fillStyle = '#3a7a3a';
                ctx.fillRect(x + 4, y + 4, 24, 20);
                ctx.fillRect(x + 8, y, 16, 4);
                // Highlight
                ctx.fillStyle = '#4a9a4a';
                ctx.fillRect(x + 8, y + 6, 6, 6);
                break;
                
            case 'building':
            case 'lab':
                // Roof
                ctx.fillStyle = tile === 'lab' ? '#406080' : '#604020';
                ctx.fillRect(x, y, size, 8);
                // Door
                if (tile === 'building') {
                    ctx.fillStyle = '#503010';
                    ctx.fillRect(x + 12, y + 16, 8, 16);
                    ctx.fillStyle = '#402000';
                    ctx.fillRect(x + 14, y + 18, 4, 14);
                }
                break;
                
            case 'door':
                ctx.fillStyle = '#a08060';
                ctx.fillRect(x, y, size, size);
                ctx.fillStyle = '#603020';
                ctx.fillRect(x + 8, y + 4, 16, 28);
                break;
                
            case 'sign':
                ctx.fillStyle = '#5a9a5a';
                ctx.fillRect(x, y, size, size);
                // Sign post
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(x + 12, y + 16, 8, 16);
                // Sign board
                ctx.fillStyle = '#d4a060';
                ctx.fillRect(x + 4, y + 4, 24, 14);
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(x + 6, y + 6, 20, 2);
                ctx.fillRect(x + 6, y + 10, 20, 2);
                break;
                
            case 'water':
                // Water animation
                const offset = (Date.now() / 1000) % 1;
                ctx.fillStyle = '#3080c0';
                ctx.fillRect(x + 2, y + 4 + offset * 2, 4, 2);
                ctx.fillRect(x + 18, y + 8 + offset * 2, 4, 2);
                break;
                
            case 'npc':
                ctx.fillStyle = '#5a9a5a';
                ctx.fillRect(x, y, size, size);
                // Simple NPC
                ctx.fillStyle = '#ff8080';
                ctx.fillRect(x + 8, y + 8, 16, 16);
                ctx.fillStyle = '#000';
                ctx.fillRect(x + 10, y + 12, 2, 2);
                ctx.fillRect(x + 18, y + 12, 2, 2);
                break;
        }
        
    }
}
