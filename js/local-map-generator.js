class LocalMapGenerator {
    constructor() {
        this.previewTileSize = 6;
        this.biomeConfigs = {
            temperate: {
                encounterTableKey: 'fernvale_routes',
                baseTile: 'grass',
                obstacleTile: 'tree',
                accentTile: 'water',
                pathTile: 'path',
                grassTile: 'tall_grass',
                areaKey: 'fernvale_routes'
            },
            forest: {
                encounterTableKey: 'mossgrove',
                baseTile: 'grass',
                obstacleTile: 'dark_tree',
                accentTile: 'water',
                pathTile: 'path',
                grassTile: 'tall_grass',
                areaKey: 'mossgrove'
            },
            swamp: {
                encounterTableKey: 'mirefall_routes',
                baseTile: 'swamp',
                obstacleTile: 'dark_tree',
                accentTile: 'water',
                pathTile: 'path',
                grassTile: 'tall_grass',
                areaKey: 'mirefall_routes'
            },
            volcanic: {
                encounterTableKey: 'ashfall_pass',
                baseTile: 'ash_ground',
                obstacleTile: 'mountain',
                accentTile: 'lava',
                pathTile: 'path',
                grassTile: 'tall_grass',
                areaKey: 'ashfall_pass'
            },
            coastal: {
                encounterTableKey: 'dustway_routes',
                baseTile: 'grass',
                obstacleTile: 'tree',
                accentTile: 'water',
                pathTile: 'path',
                grassTile: 'tall_grass',
                areaKey: 'dustway_routes'
            }
        };

        this.tilePreviewColors = {
            grass: '#5a9a5a',
            path: '#b08a62',
            tall_grass: '#2f6d38',
            tree: '#255328',
            dark_tree: '#173b1c',
            water: '#3d77c6',
            swamp: '#42543a',
            ash_ground: '#7d7d84',
            mountain: '#5d616d',
            lava: '#d45818',
            door: '#6c3b1b',
            heal_center: '#d47a9a',
            gym: '#5a5d7b',
            building: '#8d6a48'
        };
    }

    generate(config) {
        const normalized = this.normalizeConfig(config);
        const biome = this.biomeConfigs[normalized.biome];
        const rng = this.createSeededRandom(normalized.seed);
        const tiles = this.createGrid(normalized.width, normalized.height, biome.baseTile);
        const areaGrid = this.createGrid(normalized.width, normalized.height, biome.areaKey);
        const decorations = [];
        const facilityRegistry = {};
        const healCenterDoors = [];
        const gymDoors = {};

        this.paintBorder(tiles, biome.obstacleTile);
        this.paintAccentZones(tiles, normalized, biome, rng);
        this.paintObstacleClusters(tiles, normalized, biome, rng);
        this.paintTallGrass(tiles, normalized, biome, rng);
        const spawn = this.paintMainPath(tiles, normalized, biome);
        this.ensureSpawnClear(tiles, spawn, biome);
        this.addLandmarks(tiles, normalized, biome, rng, spawn, decorations, facilityRegistry, healCenterDoors, gymDoors);
        this.addScenicDecorations(tiles, normalized, biome, rng, spawn, decorations);

        const previewImage = this.buildPreviewImage(tiles);
        const summary = this.summarizeTiles(tiles);

        return {
            mapName: `${this.capitalize(normalized.biome)} Wilds ${normalized.seed}`,
            seed: normalized.seed,
            biome: normalized.biome,
            width: normalized.width,
            height: normalized.height,
            tiles,
            areaGrid,
            spawn,
            decorations,
            facilityRegistry,
            healCenterDoors,
            gymDoors,
            previewImage,
            encounterTableKey: biome.encounterTableKey,
            summary
        };
    }

    normalizeConfig(config) {
        const width = this.clamp(Math.round(Number(config.width) || 96), 48, 180);
        const height = this.clamp(Math.round(Number(config.height) || 72), 36, 140);
        const biome = this.biomeConfigs[config.biome] ? config.biome : 'temperate';
        const seed = String(config.seed || 'KANTO-RED').trim() || 'KANTO-RED';
        const grassDensity = ['low', 'medium', 'high'].includes(config.grassDensity) ? config.grassDensity : 'medium';
        const obstacleDensity = ['low', 'medium', 'high'].includes(config.obstacleDensity) ? config.obstacleDensity : 'medium';

        return {
            seed,
            biome,
            width,
            height,
            grassDensity,
            obstacleDensity
        };
    }

    createGrid(width, height, fillValue) {
        return Array.from({ length: height }, () => Array(width).fill(fillValue));
    }

    paintBorder(tiles, borderTile) {
        const height = tiles.length;
        const width = tiles[0].length;
        for (let x = 0; x < width; x++) {
            tiles[0][x] = borderTile;
            tiles[height - 1][x] = borderTile;
        }
        for (let y = 0; y < height; y++) {
            tiles[y][0] = borderTile;
            tiles[y][width - 1] = borderTile;
        }
    }

    paintAccentZones(tiles, config, biome, rng) {
        const height = tiles.length;
        const width = tiles[0].length;
        const zoneCount = config.biome === 'coastal' ? 3 : 2;

        for (let i = 0; i < zoneCount; i++) {
            const zoneWidth = Math.max(6, Math.floor(width * (0.12 + rng() * 0.12)));
            const zoneHeight = Math.max(5, Math.floor(height * (0.08 + rng() * 0.14)));
            const startX = Math.floor(rng() * Math.max(1, width - zoneWidth - 2)) + 1;
            const startY = Math.floor(rng() * Math.max(1, height - zoneHeight - 2)) + 1;
            for (let y = startY; y < Math.min(height - 1, startY + zoneHeight); y++) {
                for (let x = startX; x < Math.min(width - 1, startX + zoneWidth); x++) {
                    if (rng() > 0.14) {
                        tiles[y][x] = biome.accentTile;
                    }
                }
            }
        }

        if (config.biome === 'coastal') {
            const coastWidth = Math.max(6, Math.floor(width * 0.18));
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x <= coastWidth; x++) {
                    if (rng() > 0.08) {
                        tiles[y][x] = 'water';
                    }
                }
            }
        }
    }

    paintObstacleClusters(tiles, config, biome, rng) {
        const height = tiles.length;
        const width = tiles[0].length;
        const densityFactor = { low: 0.035, medium: 0.055, high: 0.08 }[config.obstacleDensity];
        const clusterCount = Math.max(4, Math.floor(width * height * densityFactor / 18));

        for (let i = 0; i < clusterCount; i++) {
            const cx = Math.floor(rng() * (width - 4)) + 2;
            const cy = Math.floor(rng() * (height - 4)) + 2;
            const radius = 1 + Math.floor(rng() * 4);
            for (let y = cy - radius; y <= cy + radius; y++) {
                for (let x = cx - radius; x <= cx + radius; x++) {
                    if (y <= 0 || y >= height - 1 || x <= 0 || x >= width - 1) continue;
                    const distance = Math.abs(x - cx) + Math.abs(y - cy);
                    if (distance <= radius && rng() > 0.2) {
                        if (!['water', 'lava'].includes(tiles[y][x])) {
                            tiles[y][x] = biome.obstacleTile;
                        }
                    }
                }
            }
        }
    }

    paintTallGrass(tiles, config, biome, rng) {
        const height = tiles.length;
        const width = tiles[0].length;
        const densityFactor = { low: 0.06, medium: 0.11, high: 0.17 }[config.grassDensity];
        const patchCount = Math.max(5, Math.floor(width * height * densityFactor / 24));

        for (let i = 0; i < patchCount; i++) {
            const cx = Math.floor(rng() * (width - 6)) + 3;
            const cy = Math.floor(rng() * (height - 6)) + 3;
            const radiusX = 2 + Math.floor(rng() * 5);
            const radiusY = 2 + Math.floor(rng() * 4);
            for (let y = cy - radiusY; y <= cy + radiusY; y++) {
                for (let x = cx - radiusX; x <= cx + radiusX; x++) {
                    if (y <= 0 || y >= height - 1 || x <= 0 || x >= width - 1) continue;
                    const nx = (x - cx) / radiusX;
                    const ny = (y - cy) / radiusY;
                    if ((nx * nx) + (ny * ny) <= 1.1 && rng() > 0.18) {
                        if ([biome.baseTile, biome.pathTile].includes(tiles[y][x])) {
                            tiles[y][x] = biome.grassTile;
                        }
                    }
                }
            }
        }
    }

    paintMainPath(tiles, config, biome) {
        const height = tiles.length;
        const width = tiles[0].length;
        const pathX = Math.floor(width / 2);

        for (let y = 1; y < height - 1; y++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = this.clamp(pathX + dx, 1, width - 2);
                tiles[y][x] = biome.pathTile;
            }
        }

        const horizontalY = Math.floor(height * 0.55);
        for (let x = 1; x < width - 1; x++) {
            for (let dy = -1; dy <= 1; dy++) {
                const y = this.clamp(horizontalY + dy, 1, height - 2);
                tiles[y][x] = biome.pathTile;
            }
        }

        return { x: pathX, y: height - 5 };
    }

    ensureSpawnClear(tiles, spawn, biome) {
        for (let y = spawn.y - 1; y <= spawn.y + 1; y++) {
            for (let x = spawn.x - 1; x <= spawn.x + 1; x++) {
                if (tiles[y] && tiles[y][x] !== undefined) {
                    tiles[y][x] = biome.pathTile;
                }
            }
        }
    }

    addLandmarks(tiles, config, biome, rng, spawn, decorations, facilityRegistry, healCenterDoors, gymDoors) {
        const height = tiles.length;
        const width = tiles[0].length;
        const centerX = Math.floor(width / 2);
        const townY = Math.max(4, Math.floor(height * 0.22));

        const healCenter = this.paintBuilding(tiles, centerX - 10, townY, 7, 5, 'heal_center', biome.pathTile);
        const gym = this.paintBuilding(tiles, centerX + 4, townY, 7, 5, 'gym', biome.pathTile);

        const sideBuildingY = Math.max(6, Math.floor(height * 0.62));
        const plaza = this.paintBuilding(tiles, Math.max(2, centerX - 18), sideBuildingY, 6, 4, 'building', biome.pathTile);

        const landmarkX = this.clamp(spawn.x + 8 + Math.floor(rng() * 8), 4, width - 8);
        const landmarkY = this.clamp(spawn.y - 14 - Math.floor(rng() * 8), 4, height - 10);
        const homeA = this.paintBuilding(tiles, landmarkX, landmarkY, 6, 4, 'building', biome.pathTile);

        const homeBX = this.clamp(centerX + 13, 4, width - 10);
        const homeBY = this.clamp(Math.floor(height * 0.48), 4, height - 10);
        const homeB = this.paintBuilding(tiles, homeBX, homeBY, 6, 4, 'building', biome.pathTile);

        decorations.push({ assetKey: 'health_center', x: centerX - 10, y: townY - 1, width: 7, height: 7, mode: 'contain', zIndex: 4 });
        decorations.push({ assetKey: 'medicine_plaza', x: Math.max(2, centerX - 18), y: sideBuildingY - 1, width: 6, height: 6, mode: 'contain', zIndex: 4 });
        decorations.push({ assetKey: 'civilian_home', x: landmarkX, y: landmarkY - 1, width: 6, height: 6, mode: 'contain', zIndex: 4 });
        decorations.push({ assetKey: 'civilian_home', x: homeBX, y: homeBY - 1, width: 6, height: 6, mode: 'contain', zIndex: 4 });

        healCenterDoors.push(`${healCenter.doorX},${healCenter.doorY}`);
        gymDoors[`${gym.doorX},${gym.doorY}`] = 'gym_brix';
        facilityRegistry[`${plaza.doorX},${plaza.doorY}`] = {
            type: 'plaza',
            title: 'Medicine Plaza',
            image: 'assets/Medicine Plaza Interior.png',
            description: 'A generated-town Medicine Plaza carrying standard healing and capture supplies.'
        };
        facilityRegistry[`${homeA.doorX},${homeA.doorY}`] = {
            type: 'home',
            title: 'Civilian Home',
            image: 'assets/Civilian Home interior.png',
            description: 'One of the many civilian homes woven into this generated region.'
        };
        facilityRegistry[`${homeB.doorX},${homeB.doorY}`] = {
            type: 'home',
            title: 'Civilian Home',
            image: 'assets/Civilian Home interior.png',
            description: 'A second common house placed to make generated towns feel lived in.'
        };
    }

    addScenicDecorations(tiles, config, biome, rng, spawn, decorations) {
        const width = tiles[0].length;
        const height = tiles.length;
        const pathX = spawn.x;

        decorations.push({ assetKey: 'roadside_trees', x: this.clamp(pathX - 4, 1, width - 5), y: 3, width: 3, height: Math.max(8, Math.floor(height * 0.34)), mode: 'cover', zIndex: 2 });
        decorations.push({ assetKey: 'roadside_trees', x: this.clamp(pathX + 2, 1, width - 5), y: Math.max(3, Math.floor(height * 0.3)), width: 3, height: Math.max(8, Math.floor(height * 0.34)), mode: 'cover', zIndex: 2 });
        decorations.push({ assetKey: 'flower_meadow', x: this.clamp(spawn.x - 14, 2, width - 12), y: this.clamp(spawn.y - 6, 2, height - 8), width: 8, height: 6, mode: 'contain', zIndex: 3 });
        decorations.push({ assetKey: 'flower_patch', x: this.clamp(spawn.x + 8, 2, width - 6), y: this.clamp(spawn.y - 10, 2, height - 6), width: 4, height: 4, mode: 'contain', zIndex: 3 });

        if (biome.accentTile === 'water') {
            decorations.push({ assetKey: 'grass_lake_scene', x: 2, y: this.clamp(Math.floor(height * 0.58), 2, height - 12), width: Math.max(12, Math.floor(width * 0.28)), height: 10, mode: 'cover', zIndex: 2 });
        }

        if (biome.obstacleTile === 'tree' || biome.obstacleTile === 'dark_tree') {
            decorations.push({ assetKey: 'forest_canopy', x: this.clamp(Math.floor(width * 0.62), 2, width - 22), y: 1, width: Math.max(18, Math.floor(width * 0.24)), height: Math.max(12, Math.floor(height * 0.22)), mode: 'cover', zIndex: 1 });
        }

        if (biome.obstacleTile === 'mountain') {
            decorations.push({ assetKey: 'mountain_tops', x: this.clamp(Math.floor(width * 0.58), 2, width - 20), y: 2, width: Math.max(16, Math.floor(width * 0.2)), height: Math.max(10, Math.floor(height * 0.2)), mode: 'cover', zIndex: 2 });
        }
    }

    paintBuilding(tiles, startX, startY, width, height, tileType, pathTile) {
        const maxY = Math.min(tiles.length - 2, startY + height - 1);
        const maxX = Math.min(tiles[0].length - 2, startX + width - 1);
        const doorX = Math.floor((startX + maxX) / 2);

        for (let y = startY; y < maxY; y++) {
            for (let x = startX; x <= maxX; x++) {
                if (tiles[y] && tiles[y][x] !== undefined) {
                    tiles[y][x] = tileType;
                }
            }
        }

        for (let x = startX; x <= maxX; x++) {
            if (tiles[maxY]) {
                tiles[maxY][x] = x === doorX ? 'door' : pathTile;
            }
        }

        for (let y = maxY + 1; y <= Math.min(tiles.length - 2, maxY + 2); y++) {
            if (tiles[y] && tiles[y][doorX] !== undefined) {
                tiles[y][doorX] = pathTile;
                if (doorX - 1 >= 1) tiles[y][doorX - 1] = pathTile;
                if (doorX + 1 < tiles[0].length - 1) tiles[y][doorX + 1] = pathTile;
            }
        }

        return { startX, startY, maxX, maxY, doorX, doorY: maxY };
    }

    summarizeTiles(tiles) {
        const summary = {
            walkable: 0,
            tallGrass: 0,
            water: 0,
            obstacles: 0,
            landmarks: 0
        };

        tiles.forEach(row => {
            row.forEach(tile => {
                if (['grass', 'path', 'door', 'tall_grass', 'swamp', 'ash_ground'].includes(tile)) {
                    summary.walkable++;
                }
                if (tile === 'tall_grass') summary.tallGrass++;
                if (tile === 'water') summary.water++;
                if (['tree', 'dark_tree', 'mountain', 'lava'].includes(tile)) summary.obstacles++;
                if (['building', 'heal_center', 'gym'].includes(tile)) summary.landmarks++;
            });
        });

        return summary;
    }

    drawPreview(canvas, mapData) {
        const ctx = canvas.getContext('2d');
        const scale = Math.min(
            canvas.width / mapData.width,
            canvas.height / mapData.height
        );
        const tileSize = Math.max(2, Math.floor(scale));
        const drawWidth = mapData.width * tileSize;
        const drawHeight = mapData.height * tileSize;
        const offsetX = Math.floor((canvas.width - drawWidth) / 2);
        const offsetY = Math.floor((canvas.height - drawHeight) / 2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#dce8ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (let y = 0; y < mapData.height; y++) {
            for (let x = 0; x < mapData.width; x++) {
                ctx.fillStyle = this.tilePreviewColors[mapData.tiles[y][x]] || '#5a9a5a';
                ctx.fillRect(offsetX + (x * tileSize), offsetY + (y * tileSize), tileSize, tileSize);
            }
        }

        ctx.fillStyle = '#ffec7a';
        ctx.fillRect(offsetX + (mapData.spawn.x * tileSize), offsetY + (mapData.spawn.y * tileSize), tileSize, tileSize);

        ctx.strokeStyle = '#0d1328';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, drawWidth, drawHeight);
    }

    buildPreviewImage(tiles) {
        const canvas = document.createElement('canvas');
        canvas.width = tiles[0].length;
        canvas.height = tiles.length;
        const ctx = canvas.getContext('2d');

        for (let y = 0; y < tiles.length; y++) {
            for (let x = 0; x < tiles[0].length; x++) {
                ctx.fillStyle = this.tilePreviewColors[tiles[y][x]] || '#5a9a5a';
                ctx.fillRect(x, y, 1, 1);
            }
        }

        return canvas.toDataURL('image/png');
    }

    buildSummaryMarkup(mapData) {
        const summary = mapData.summary;
        return `
            <div class="generator-summary-card">
                <h3>${mapData.mapName}</h3>
                <div class="generator-summary-grid">
                    <div><strong>Seed:</strong> ${mapData.seed}</div>
                    <div><strong>Biome:</strong> ${this.capitalize(mapData.biome)}</div>
                    <div><strong>Size:</strong> ${mapData.width} × ${mapData.height}</div>
                    <div><strong>Spawn:</strong> ${mapData.spawn.x}, ${mapData.spawn.y}</div>
                    <div><strong>Walkable Tiles:</strong> ${summary.walkable}</div>
                    <div><strong>Tall Grass:</strong> ${summary.tallGrass}</div>
                    <div><strong>Water:</strong> ${summary.water}</div>
                    <div><strong>Landmarks:</strong> ${summary.landmarks}</div>
                </div>
            </div>
        `;
    }

    createSeededRandom(seed) {
        let h = 2166136261;
        for (let i = 0; i < seed.length; i++) {
            h ^= seed.charCodeAt(i);
            h = Math.imul(h, 16777619);
        }

        return () => {
            h += h << 13;
            h ^= h >>> 7;
            h += h << 3;
            h ^= h >>> 17;
            h += h << 5;
            return ((h >>> 0) % 1000000) / 1000000;
        };
    }

    capitalize(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
    }

    clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
}
