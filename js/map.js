// ============================================
// ENCOUNTER TABLES — keyed by area name
// ============================================
const ENCOUNTER_TABLES = {
    fernvale_routes: { species: ['SKYWING', 'SCRATCHCLAW', 'SILKWORM'],            minLevel: 3,  maxLevel: 8  },
    dustway_routes:  { species: ['SKYWING', 'SCRATCHCLAW', 'SILKWORM'],            minLevel: 5,  maxLevel: 10 },
    mossgrove:       { species: ['SKYWING', 'FANGSTRIKER', 'BURROWMOLE'],          minLevel: 10, maxLevel: 16 },
    mirefall_routes: { species: ['FANGSTRIKER', 'SILKWORM', 'VOLTAJOLT'],          minLevel: 18, maxLevel: 25 },
    thornway_ridge:  { species: ['ROCKCRUSH', 'VOLTAJOLT'],                        minLevel: 22, maxLevel: 30 },
    cinderholm_area: { species: ['INFERNOBEAST', 'VOLTAJOLT', 'FANGSTRIKER'],      minLevel: 28, maxLevel: 38 },
    ashfall_pass:    { species: ['INFERNOBEAST', 'ROCKCRUSH'],                     minLevel: 35, maxLevel: 44 },
    summit_peak:     { species: ['INFERNOBEAST', 'FANGSTRIKER'],                   minLevel: 40, maxLevel: 50 }
};

class GameMap {
    constructor() {
        this.TILE_SIZE = 32;
        this.width  = 150;
        this.height = 100;

        this.tiles = [];
        this.generateMap();

        // ── NPC registry ──────────────────────────────────
        this.npcRegistry = {
            // Fernvale
            '67,85':  'professor',
            '61,85':  'rival_dray',
            '81,85':  'townsperson_1',
            '90,85':  'townsperson_2',
            '57,86':  'gym_brix',
            // Dustway Route
            '74,72':  'route_trainer_1',
            // Mossgrove
            '74,65':  'veil_patrol',
            // Mirefall
            '57,55':  'gym_sylva',
            '67,56':  'townsperson_3',
            '84,56':  'veil_grunt',
            '91,56':  'veil_commander',
            // Cinderholm
            '57,35':  'gym_cinder',
            '82,35':  'townsperson_4',
            '67,35':  'veil_commander',
            // Summit
            '74,9':   'mira'
        };

        // ── Sign registry ─────────────────────────────────
        this.signRegistry = {
            '71,85':  'sign_fernvale',
            '74,73':  'sign_dustway',
            '74,63':  'sign_mossgrove',
            '74,47':  'sign_mirefall',
            '74,43':  'sign_thornway',
            '74,26':  'sign_cinderholm',
            '74,19':  'sign_ashfall',
            '74,4':   'sign_summit'
        };

        // ── Lab door position ─────────────────────────────
        this.professorPos = { x: 66, y: 84 };

        // ── Heal-centre door positions ────────────────────
        this.healCenterDoors = new Set([
            '89,84',   // Fernvale
            '89,53',   // Mirefall
            '89,33'    // Cinderholm
        ]);

        // ── Gym door positions → leader ID ────────────────
        this.gymDoors = {
            '57,92': 'gym_brix',   // fillBuilding(54,87,60,92,'gym',57) → door y=92
            '57,53': 'gym_sylva',  // fillBuilding(54,48,60,53,'gym',57) → door y=53
            '57,33': 'gym_cinder'  // fillBuilding(54,28,60,33,'gym',57) → door y=33
        };

        // Stamp NPC / sign tiles
        for (const key of Object.keys(this.npcRegistry)) {
            const [nx, ny] = key.split(',').map(Number);
            if (this.tiles[ny]) this.tiles[ny][nx] = 'npc';
        }
        for (const key of Object.keys(this.signRegistry)) {
            const [sx, sy] = key.split(',').map(Number);
            if (this.tiles[sy]) this.tiles[sy][sx] = 'sign';
        }
    }

    // ====================================================
    // MAIN GENERATOR
    // ====================================================
    generateMap() {
        // Default everything to mountain (impassable)
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = new Array(this.width).fill('mountain');
        }

        this.generateFernvale();
        this.generateDustwayRoute();
        this.generateMossgrove();
        this.generateMirefall();
        this.generateThornwayRidge();
        this.generateCinderholm();
        this.generateAshfallPass();
        this.generateSummitPeak();
        this.generateWorldSpine();
    }

    // ── Helper: fill a rectangular area ──────────────────
    fill(x0, y0, x1, y1, tile) {
        for (let y = y0; y <= y1; y++) {
            for (let x = x0; x <= x1; x++) {
                if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
                    this.tiles[y][x] = tile;
                }
            }
        }
    }

    // ── Helper: building block (tiles + front-path row + door) ──
    fillBuilding(x0, y0, x1, y1, tileType, doorX) {
        for (let y = y0; y <= y1 - 1; y++) {
            for (let x = x0; x <= x1; x++) {
                this.tiles[y][x] = tileType;
            }
        }
        for (let x = x0; x <= x1; x++) {
            this.tiles[y1][x] = (x === doorX) ? 'door' : 'path';
        }
    }

    // ====================================================
    // ZONE: FERNVALE TOWN  (y 75–97)
    // ====================================================
    generateFernvale() {
        // Full zone background
        this.fill(2, 75, 147, 97, 'grass');

        // Tall-grass meadows (wild encounters)
        this.fill(2,  80, 51, 97, 'tall_grass');
        this.fill(99, 80, 147, 97, 'tall_grass');

        // South-west lake
        this.fill(2, 90, 32, 97, 'water');

        // Town tree line (north edge of buildings, with gap for spine)
        for (let x = 52; x <= 98; x++) {
            if (x < 72 || x > 77) this.tiles[78][x] = 'tree';
        }

        // Horizontal main street
        this.fill(52, 85, 98, 85, 'path');

        // Northern building row face-path (y=84)
        this.fill(52, 84, 98, 84, 'path');

        // ── Northern buildings (face south to main street y=85) ──
        // House 1 (Dray's house): x 54–60
        this.fillBuilding(54, 79, 60, 84, 'building', 57);
        // Prof Solen's Lab: x 63–69
        this.fillBuilding(63, 79, 69, 84, 'lab', 66);
        // House 2: x 77–83
        this.fillBuilding(77, 79, 83, 84, 'building', 80);
        // Heal Centre: x 86–92
        this.fillBuilding(86, 79, 92, 84, 'heal_center', 89);

        // ── Southern building row face-path (y=86) ──
        this.fill(52, 86, 98, 86, 'path');

        // Gym (BRIX): x 54–60, y 87–92
        this.fillBuilding(54, 87, 60, 92, 'gym', 57);
        // Pokemart: x 77–83, y 87–92
        this.fillBuilding(77, 87, 83, 92, 'building', 80);

        // Southern open area (tall grass + water)
        this.fill(52, 93, 98, 97, 'tall_grass');
        this.fill(52, 93, 70, 97, 'path');   // south path leading out
    }

    // ====================================================
    // ZONE: DUSTWAY ROUTE  (y 70–74)
    // ====================================================
    generateDustwayRoute() {
        // Wide open grassland
        this.fill(2, 70, 147, 74, 'grass');

        // Tall grass flanking the safe corridor
        this.fill(2,  70, 61,  74, 'tall_grass');
        this.fill(89, 70, 147, 74, 'tall_grass');

        // Safe walking corridor
        this.fill(62, 70, 88, 74, 'path');

        // Tree clusters
        this.fill(10, 70, 18, 74, 'tree');
        this.fill(130, 70, 140, 74, 'tree');
    }

    // ====================================================
    // ZONE: MOSSGROVE FOREST  (y 62–69)
    // ====================================================
    generateMossgrove() {
        // Dense dark forest background
        this.fill(2, 62, 147, 69, 'dark_tree');

        // Forest clearings (encounter zones)
        this.fill(20, 63, 55, 68, 'tall_grass');
        this.fill(95, 63, 130, 68, 'tall_grass');

        // Forest path
        this.fill(56, 66, 94, 66, 'path');
        this.fill(56, 65, 94, 67, 'path');
    }

    // ====================================================
    // ZONE: MIREFALL TOWN  (y 46–61)
    // ====================================================
    generateMirefall() {
        // Town core: grass; outer: swamp
        this.fill(2,  46, 147, 61, 'swamp');
        this.fill(50, 46, 100, 61, 'grass');

        // Swamp tall-grass on flanks (encounters)
        this.fill(2,  48, 48,  61, 'tall_grass');
        this.fill(102, 48, 147, 61, 'tall_grass');

        // Dock water (west)
        this.fill(2, 55, 35, 61, 'water');

        // Main street
        this.fill(50, 54, 100, 54, 'path');
        this.fill(50, 53, 100, 53, 'path');  // north face row

        // ── Northern buildings ──
        // Gym (SYLVA): x 54–60
        this.fillBuilding(54, 48, 60, 53, 'gym', 57);
        // House: x 63–69
        this.fillBuilding(63, 48, 69, 53, 'building', 66);
        // House 2: x 77–83
        this.fillBuilding(77, 48, 83, 53, 'building', 80);
        // Heal Centre: x 86–92
        this.fillBuilding(86, 48, 92, 53, 'heal_center', 89);

        // ── South of main street ──
        this.fill(50, 55, 100, 61, 'path');
        // Restore swamp south flanks
        this.fill(50, 58, 60, 61, 'swamp');
        this.fill(85, 58, 100, 61, 'swamp');
    }

    // ====================================================
    // ZONE: THORNWAY RIDGE  (y 42–45)
    // ====================================================
    generateThornwayRidge() {
        // Default mountain — just carve narrow walkable pass
        this.fill(60, 42, 89, 45, 'ash_ground');

        // Precarious ledge tall-grass (optional encounters)
        this.fill(60, 43, 67, 44, 'tall_grass');
        this.fill(82, 43, 89, 44, 'tall_grass');
    }

    // ====================================================
    // ZONE: CINDERHOLM CITY  (y 25–41)
    // ====================================================
    generateCinderholm() {
        // City background: ash ground
        this.fill(2,  25, 147, 41, 'mountain');
        this.fill(38, 25, 112, 41, 'ash_ground');

        // Flanking tall-grass (high-level)
        this.fill(38, 28, 52, 41, 'tall_grass');
        this.fill(98, 28, 112, 41, 'tall_grass');

        // Main street
        this.fill(50, 34, 100, 34, 'path');
        this.fill(50, 33, 100, 33, 'path');  // north face row

        // ── Northern buildings ──
        // Gym (CINDER): x 54–60
        this.fillBuilding(54, 28, 60, 33, 'gym', 57);
        // House: x 63–69
        this.fillBuilding(63, 28, 69, 33, 'building', 66);
        // House 2: x 77–83
        this.fillBuilding(77, 28, 83, 33, 'building', 80);
        // Heal Centre: x 86–92
        this.fillBuilding(86, 28, 92, 33, 'heal_center', 89);

        // Industrial factory block (west, decorative + impassable)
        this.fill(38, 27, 52, 40, 'building');

        // ── South of main street (walkable ash) ──
        this.fill(53, 35, 99, 41, 'ash_ground');
    }

    // ====================================================
    // ZONE: ASHFALL PASS  (y 18–24)
    // ====================================================
    generateAshfallPass() {
        // All mountain, carve pass
        this.fill(60, 18, 89, 24, 'ash_ground');

        // Lava cracks (decorative, impassable)
        this.fill(60, 19, 66, 21, 'lava');
        this.fill(83, 21, 89, 23, 'lava');

        // Narrow safe path
        this.fill(68, 18, 81, 24, 'ash_ground');
    }

    // ====================================================
    // ZONE: SUMMIT PEAK  (y 3–17)
    // ====================================================
    generateSummitPeak() {
        // Volcanic plateau
        this.fill(60, 3, 89, 17, 'ash_ground');
        this.fill(55, 3, 94, 17, 'ash_ground');

        // Lava pools
        this.fill(55, 5,  62, 9,  'lava');
        this.fill(87, 5,  94, 9,  'lava');
        this.fill(60, 14, 68, 16, 'lava');
        this.fill(81, 14, 89, 16, 'lava');

        // Approach path widened (must come BEFORE fortress to avoid overwriting door)
        this.fill(69, 10, 79, 17, 'ash_ground');

        // MIRA's fortress (last so door at 74,10 survives)
        this.fillBuilding(63, 3, 86, 10, 'building', 74);
    }

    // ====================================================
    // WORLD SPINE — main N/S path through all zones
    // ====================================================
    generateWorldSpine() {
        const buildingTypes = new Set([
            'building','lab','gym','heal_center','lava','water','dark_tree','door'
        ]);
        for (let y = 3; y < 98; y++) {
            for (let x = 72; x <= 77; x++) {
                const t = this.tiles[y][x];
                if (!buildingTypes.has(t)) {
                    this.tiles[y][x] = 'path';
                }
            }
        }
    }

    // ====================================================
    // QUERY METHODS
    // ====================================================
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 'wall';
        return this.tiles[y][x];
    }

    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        return ['grass','path','door','tall_grass','swamp','ash_ground'].includes(tile);
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

    isLabDoor(x, y) {
        return x === this.professorPos.x && y === this.professorPos.y;
    }

    isHealCenter(x, y) {
        return this.healCenterDoors.has(`${x},${y}`);
    }

    isGymDoor(x, y) {
        return Object.prototype.hasOwnProperty.call(this.gymDoors, `${x},${y}`);
    }

    getGymLeaderAt(x, y) {
        return this.gymDoors[`${x},${y}`] || null;
    }

    getAreaAt(x, y) {
        if (y < 18) return 'summit_peak';
        if (y < 25) return 'ashfall_pass';
        if (y < 42) return 'cinderholm_area';
        if (y < 46) return 'thornway_ridge';
        if (y < 62) return 'mirefall_routes';
        if (y < 70) return 'mossgrove';
        if (y < 75) return 'dustway_routes';
        return 'fernvale_routes';
    }

    update() {
        // Reserved for tile animations
    }

    render(ctx, offsetX, offsetY, viewWidth, viewHeight, graphics = null) {
        const startX = Math.floor(offsetX / this.TILE_SIZE);
        const startY = Math.floor(offsetY / this.TILE_SIZE);
        const endX = Math.min(this.width,  startX + Math.ceil(viewWidth  / this.TILE_SIZE) + 1);
        const endY = Math.min(this.height, startY + Math.ceil(viewHeight / this.TILE_SIZE) + 1);

        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile    = this.getTile(x, y);
                const screenX = x * this.TILE_SIZE;
                const screenY = y * this.TILE_SIZE;
                if (graphics) {
                    graphics.drawTile(screenX, screenY, tile, ctx);
                } else {
                    this.drawSimpleTile(screenX, screenY, tile, ctx);
                }
            }
        }
    }

    drawSimpleTile(x, y, tile, ctx) {
        const colors = {
            grass: '#5a9a5a', path: '#a08060', building: '#806040',
            lab: '#6080a0', tree: '#2d5a2d', water: '#4080c0',
            door: '#603020', sign: '#c0a060', npc: '#ff8080',
            wall: '#404040', mountain: '#5a5a6a', tall_grass: '#3a6e3a',
            swamp: '#2e3e2e', lava: '#8b2200', ash_ground: '#5a5a5a',
            dark_tree: '#1e3a1e', heal_center: '#d47a9a', gym: '#4a4a5e'
        };
        ctx.fillStyle = colors[tile] || '#5a9a5a';
        ctx.fillRect(x, y, this.TILE_SIZE, this.TILE_SIZE);
    }
}
