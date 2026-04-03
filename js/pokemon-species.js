// ============================================
// POKEMON SPECIES DATABASE - Base stats, types, learnsets
// ============================================

const POKEMON_SPECIES = {
    // Starters
    BULBASAUR: {
        id: 1,
        name: 'BULBASAUR',
        types: ['grass', 'poison'],
        baseStats: { hp: 45, attack: 49, defense: 49, spAttack: 65, spDefense: 65, speed: 45 },
        learnset: {
            1: ['TACKLE', 'GROWL'],
            7: ['VINE_WHIP'],
            13: ['ABSORB'],
            20: ['RAZOR_LEAF']
        },
        evolution: { level: 16, into: 'IVYSAUR' },
        catchRate: 45,
        expYield: 64,
        growthRate: 'medium_slow'
    },
    IVYSAUR: {
        id: 2,
        name: 'IVYSAUR',
        types: ['grass', 'poison'],
        baseStats: { hp: 60, attack: 62, defense: 63, spAttack: 80, spDefense: 80, speed: 60 },
        learnset: {
            1: ['TACKLE', 'GROWL', 'VINE_WHIP'],
            13: ['ABSORB'],
            22: ['RAZOR_LEAF']
        },
        evolution: { level: 32, into: 'VENUSAUR' },
        catchRate: 45,
        expYield: 142,
        growthRate: 'medium_slow'
    },
    VENUSAUR: {
        id: 3,
        name: 'VENUSAUR',
        types: ['grass', 'poison'],
        baseStats: { hp: 80, attack: 82, defense: 83, spAttack: 100, spDefense: 100, speed: 80 },
        learnset: { 1: ['TACKLE', 'GROWL', 'VINE_WHIP', 'ABSORB'] },
        evolution: null,
        catchRate: 45,
        expYield: 236,
        growthRate: 'medium_slow'
    },
    
    CHARMANDER: {
        id: 4,
        name: 'CHARMANDER',
        types: ['fire'],
        baseStats: { hp: 39, attack: 52, defense: 43, spAttack: 60, spDefense: 50, speed: 65 },
        learnset: {
            1: ['SCRATCH', 'GROWL'],
            7: ['EMBER'],
            13: ['SAND_ATTACK']
        },
        evolution: { level: 16, into: 'CHARMELEON' },
        catchRate: 45,
        expYield: 62,
        growthRate: 'medium_slow'
    },
    CHARMELEON: {
        id: 5,
        name: 'CHARMELEON',
        types: ['fire'],
        baseStats: { hp: 58, attack: 64, defense: 58, spAttack: 80, spDefense: 65, speed: 80 },
        learnset: {
            1: ['SCRATCH', 'GROWL', 'EMBER'],
            20: ['FLAMETHROWER']
        },
        evolution: { level: 36, into: 'CHARIZARD' },
        catchRate: 45,
        expYield: 142,
        growthRate: 'medium_slow'
    },
    CHARIZARD: {
        id: 6,
        name: 'CHARIZARD',
        types: ['fire', 'flying'],
        baseStats: { hp: 78, attack: 84, defense: 78, spAttack: 109, spDefense: 85, speed: 100 },
        learnset: { 1: ['SCRATCH', 'GROWL', 'EMBER', 'FLAMETHROWER'] },
        evolution: null,
        catchRate: 45,
        expYield: 240,
        growthRate: 'medium_slow'
    },
    
    SQUIRTLE: {
        id: 7,
        name: 'SQUIRTLE',
        types: ['water'],
        baseStats: { hp: 44, attack: 48, defense: 65, spAttack: 50, spDefense: 64, speed: 43 },
        learnset: {
            1: ['TACKLE', 'TAIL_WHIP'],
            7: ['WATER_GUN'],
            13: ['BUBBLE']
        },
        evolution: { level: 16, into: 'WARTORTLE' },
        catchRate: 45,
        expYield: 63,
        growthRate: 'medium_slow'
    },
    WARTORTLE: {
        id: 8,
        name: 'WARTORTLE',
        types: ['water'],
        baseStats: { hp: 59, attack: 63, defense: 80, spAttack: 65, spDefense: 80, speed: 58 },
        learnset: {
            1: ['TACKLE', 'TAIL_WHIP', 'WATER_GUN'],
            20: ['BUBBLE', 'SURF']
        },
        evolution: { level: 36, into: 'BLASTOISE' },
        catchRate: 45,
        expYield: 142,
        growthRate: 'medium_slow'
    },
    BLASTOISE: {
        id: 9,
        name: 'BLASTOISE',
        types: ['water'],
        baseStats: { hp: 79, attack: 83, defense: 100, spAttack: 85, spDefense: 105, speed: 78 },
        learnset: { 1: ['TACKLE', 'TAIL_WHIP', 'WATER_GUN', 'SURF'] },
        evolution: null,
        catchRate: 45,
        expYield: 239,
        growthRate: 'medium_slow'
    },
    
    // Early route Pokemon
    PIDGEY: {
        id: 16,
        name: 'PIDGEY',
        types: ['normal', 'flying'],
        baseStats: { hp: 40, attack: 45, defense: 40, spAttack: 35, spDefense: 35, speed: 56 },
        learnset: {
            1: ['GUST', 'SAND_ATTACK'],
            5: ['TACKLE']
        },
        evolution: { level: 18, into: 'PIDGEOTTO' },
        catchRate: 255,
        expYield: 50,
        growthRate: 'medium_slow'
    },
    PIDGEOTTO: {
        id: 17,
        name: 'PIDGEOTTO',
        types: ['normal', 'flying'],
        baseStats: { hp: 63, attack: 60, defense: 55, spAttack: 50, spDefense: 50, speed: 71 },
        learnset: { 1: ['GUST', 'SAND_ATTACK', 'TACKLE'] },
        evolution: { level: 36, into: 'PIDGEOT' },
        catchRate: 120,
        expYield: 122,
        growthRate: 'medium_slow'
    },
    PIDGEOT: {
        id: 18,
        name: 'PIDGEOT',
        types: ['normal', 'flying'],
        baseStats: { hp: 83, attack: 80, defense: 75, spAttack: 70, spDefense: 70, speed: 101 },
        learnset: { 1: ['GUST', 'SAND_ATTACK', 'TACKLE', 'QUICK_ATTACK'] },
        evolution: null,
        catchRate: 45,
        expYield: 216,
        growthRate: 'medium_slow'
    },
    
    RATTATA: {
        id: 19,
        name: 'RATTATA',
        types: ['normal'],
        baseStats: { hp: 30, attack: 56, defense: 35, spAttack: 25, spDefense: 35, speed: 72 },
        learnset: {
            1: ['TACKLE', 'TAIL_WHIP'],
            4: ['QUICK_ATTACK']
        },
        evolution: { level: 20, into: 'RATICATE' },
        catchRate: 255,
        expYield: 51,
        growthRate: 'medium_fast'
    },
    RATICATE: {
        id: 20,
        name: 'RATICATE',
        types: ['normal'],
        baseStats: { hp: 55, attack: 81, defense: 60, spAttack: 50, spDefense: 70, speed: 97 },
        learnset: { 1: ['TACKLE', 'TAIL_WHIP', 'QUICK_ATTACK'] },
        evolution: null,
        catchRate: 127,
        expYield: 145,
        growthRate: 'medium_fast'
    },
    
    CATERPIE: {
        id: 10,
        name: 'CATERPIE',
        types: ['bug'],
        baseStats: { hp: 45, attack: 30, defense: 35, spAttack: 20, spDefense: 20, speed: 45 },
        learnset: { 1: ['TACKLE', 'STRING_SHOT'] },
        evolution: { level: 7, into: 'METAPOD' },
        catchRate: 255,
        expYield: 39,
        growthRate: 'medium_fast'
    },
    METAPOD: {
        id: 11,
        name: 'METAPOD',
        types: ['bug'],
        baseStats: { hp: 50, attack: 20, defense: 55, spAttack: 25, spDefense: 25, speed: 30 },
        learnset: { 1: ['TACKLE', 'STRING_SHOT'] },
        evolution: { level: 10, into: 'BUTTERFREE' },
        catchRate: 120,
        expYield: 72,
        growthRate: 'medium_fast'
    },
    BUTTERFREE: {
        id: 12,
        name: 'BUTTERFREE',
        types: ['bug', 'flying'],
        baseStats: { hp: 60, attack: 45, defense: 50, spAttack: 90, spDefense: 80, speed: 70 },
        learnset: { 1: ['TACKLE', 'STRING_SHOT', 'GUST'] },
        evolution: null,
        catchRate: 45,
        expYield: 178,
        growthRate: 'medium_fast'
    },
    
    // Pikachu line
    PIKACHU: {
        id: 25,
        name: 'PIKACHU',
        types: ['electric'],
        baseStats: { hp: 35, attack: 55, defense: 40, spAttack: 50, spDefense: 50, speed: 90 },
        learnset: {
            1: ['THUNDER_SHOCK', 'TAIL_WHIP'],
            5: ['GROWL'],
            10: ['QUICK_ATTACK'],
            26: ['THUNDERBOLT']
        },
        evolution: { item: 'THUNDER_STONE', into: 'RAICHU' },
        catchRate: 190,
        expYield: 112,
        growthRate: 'medium_fast'
    },
    RAICHU: {
        id: 26,
        name: 'RAICHU',
        types: ['electric'],
        baseStats: { hp: 60, attack: 90, defense: 55, spAttack: 90, spDefense: 80, speed: 110 },
        learnset: { 1: ['THUNDER_SHOCK', 'TAIL_WHIP', 'THUNDERBOLT', 'QUICK_ATTACK'] },
        evolution: null,
        catchRate: 75,
        expYield: 218,
        growthRate: 'medium_fast'
    },
    
    // Legendary (for endgame)
    MEWTWO: {
        id: 150,
        name: 'MEWTWO',
        types: ['psychic'],
        baseStats: { hp: 106, attack: 110, defense: 90, spAttack: 154, spDefense: 90, speed: 130 },
        learnset: {
            1: ['TACKLE', 'RECOVER'],
            10: ['QUICK_ATTACK'],
            20: ['PSYCHIC'] // Placeholder
        },
        evolution: null,
        catchRate: 3,
        expYield: 306,
        growthRate: 'slow',
        isLegendary: true
    }
};

// Growth rate formulas
const GROWTH_RATES = {
    fast: (level) => Math.floor(0.8 * Math.pow(level, 3)),
    medium_fast: (level) => Math.pow(level, 3),
    medium_slow: (level) => Math.floor(1.2 * Math.pow(level, 3) - 15 * Math.pow(level, 2) + 100 * level - 140),
    slow: (level) => Math.floor(1.25 * Math.pow(level, 3))
};

// Get species data
function getSpecies(speciesId) {
    return POKEMON_SPECIES[speciesId] || null;
}

// Get learnable moves at a given level
function getLearnableMoves(speciesId, level) {
    const species = getSpecies(speciesId);
    if (!species) return [];
    
    const moves = [];
    for (const [moveLevel, moveList] of Object.entries(species.learnset)) {
        if (parseInt(moveLevel) <= level) {
            moves.push(...moveList);
        }
    }
    return [...new Set(moves)]; // Remove duplicates
}

// Calculate experience needed for next level
function getExpForLevel(growthRate, level) {
    const formula = GROWTH_RATES[growthRate] || GROWTH_RATES.medium_fast;
    return formula(level);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POKEMON_SPECIES, GROWTH_RATES, getSpecies, getLearnableMoves, getExpForLevel };
}
