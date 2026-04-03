// ============================================
// TYPE SYSTEM - Complete with Gen 1 quirks + Modern split
// ============================================

const TYPES = {
    NORMAL: 'normal',
    FIRE: 'fire',
    WATER: 'water',
    ELECTRIC: 'electric',
    GRASS: 'grass',
    ICE: 'ice',
    FIGHTING: 'fighting',
    POISON: 'poison',
    GROUND: 'ground',
    FLYING: 'flying',
    PSYCHIC: 'psychic',
    BUG: 'bug',
    ROCK: 'rock',
    GHOST: 'ghost',
    DRAGON: 'dragon',
    // Modern additions
    DARK: 'dark',
    STEEL: 'steel',
    FAIRY: 'fairy'
};

// Gen 1 Type Chart (with quirks preserved + modern types added)
const TYPE_CHART = {
    [TYPES.NORMAL]: {
        weakTo: [TYPES.FIGHTING],
        immuneTo: [TYPES.GHOST],
        resists: [],
        superEffective: [],
        notVeryEffective: [TYPES.ROCK, TYPES.STEEL],
        noEffect: [TYPES.GHOST]
    },
    [TYPES.FIRE]: {
        weakTo: [TYPES.WATER, TYPES.GROUND, TYPES.ROCK],
        immuneTo: [],
        resists: [TYPES.FIRE, TYPES.GRASS, TYPES.ICE, TYPES.BUG, TYPES.STEEL, TYPES.FAIRY],
        superEffective: [TYPES.GRASS, TYPES.ICE, TYPES.BUG, TYPES.STEEL],
        notVeryEffective: [TYPES.FIRE, TYPES.WATER, TYPES.ROCK, TYPES.DRAGON],
        noEffect: []
    },
    [TYPES.WATER]: {
        weakTo: [TYPES.ELECTRIC, TYPES.GRASS],
        immuneTo: [],
        resists: [TYPES.FIRE, TYPES.WATER, TYPES.ICE, TYPES.STEEL],
        superEffective: [TYPES.FIRE, TYPES.GROUND, TYPES.ROCK],
        notVeryEffective: [TYPES.WATER, TYPES.GRASS, TYPES.DRAGON],
        noEffect: []
    },
    [TYPES.ELECTRIC]: {
        weakTo: [TYPES.GROUND],
        immuneTo: [],
        resists: [TYPES.ELECTRIC, TYPES.FLYING, TYPES.STEEL],
        superEffective: [TYPES.WATER, TYPES.FLYING],
        notVeryEffective: [TYPES.ELECTRIC, TYPES.GRASS, TYPES.DRAGON],
        noEffect: [TYPES.GROUND]
    },
    [TYPES.GRASS]: {
        weakTo: [TYPES.FIRE, TYPES.ICE, TYPES.POISON, TYPES.FLYING, TYPES.BUG],
        immuneTo: [],
        resists: [TYPES.WATER, TYPES.ELECTRIC, TYPES.GRASS, TYPES.GROUND],
        superEffective: [TYPES.WATER, TYPES.GROUND, TYPES.ROCK],
        notVeryEffective: [TYPES.FIRE, TYPES.GRASS, TYPES.POISON, TYPES.FLYING, TYPES.BUG, TYPES.DRAGON, TYPES.STEEL],
        noEffect: []
    },
    [TYPES.ICE]: {
        weakTo: [TYPES.FIRE, TYPES.FIGHTING, TYPES.ROCK, TYPES.STEEL],
        immuneTo: [],
        resists: [TYPES.ICE],
        superEffective: [TYPES.GRASS, TYPES.GROUND, TYPES.FLYING, TYPES.DRAGON],
        notVeryEffective: [TYPES.FIRE, TYPES.WATER, TYPES.ICE, TYPES.STEEL],
        noEffect: []
    },
    [TYPES.FIGHTING]: {
        weakTo: [TYPES.FLYING, TYPES.PSYCHIC, TYPES.FAIRY],
        immuneTo: [],
        resists: [TYPES.BUG, TYPES.ROCK, TYPES.DARK],
        superEffective: [TYPES.NORMAL, TYPES.ICE, TYPES.ROCK, TYPES.DARK, TYPES.STEEL],
        notVeryEffective: [TYPES.POISON, TYPES.FLYING, TYPES.PSYCHIC, TYPES.BUG, TYPES.FAIRY],
        noEffect: [TYPES.GHOST]
    },
    [TYPES.POISON]: {
        weakTo: [TYPES.GROUND, TYPES.PSYCHIC],
        immuneTo: [],
        resists: [TYPES.GRASS, TYPES.FIGHTING, TYPES.POISON, TYPES.BUG, TYPES.FAIRY],
        superEffective: [TYPES.GRASS, TYPES.FAIRY],
        notVeryEffective: [TYPES.POISON, TYPES.GROUND, TYPES.ROCK, TYPES.GHOST],
        noEffect: [TYPES.STEEL]
    },
    [TYPES.GROUND]: {
        weakTo: [TYPES.WATER, TYPES.GRASS, TYPES.ICE],
        immuneTo: [TYPES.ELECTRIC],
        resists: [TYPES.POISON, TYPES.ROCK],
        superEffective: [TYPES.FIRE, TYPES.ELECTRIC, TYPES.POISON, TYPES.ROCK, TYPES.STEEL],
        notVeryEffective: [TYPES.GRASS, TYPES.BUG],
        noEffect: [TYPES.FLYING]
    },
    [TYPES.FLYING]: {
        weakTo: [TYPES.ELECTRIC, TYPES.ICE, TYPES.ROCK],
        immuneTo: [TYPES.GROUND],
        resists: [TYPES.GRASS, TYPES.FIGHTING, TYPES.BUG],
        superEffective: [TYPES.GRASS, TYPES.FIGHTING, TYPES.BUG],
        notVeryEffective: [TYPES.ELECTRIC, TYPES.ROCK, TYPES.STEEL],
        noEffect: []
    },
    [TYPES.PSYCHIC]: {
        weakTo: [TYPES.BUG, TYPES.GHOST, TYPES.DARK],
        immuneTo: [],
        resists: [TYPES.FIGHTING, TYPES.PSYCHIC],
        superEffective: [TYPES.FIGHTING, TYPES.POISON],
        notVeryEffective: [TYPES.PSYCHIC, TYPES.STEEL],
        noEffect: [TYPES.DARK] // Gen 1 bug: was immune to Ghost, fixed here
    },
    [TYPES.BUG]: {
        weakTo: [TYPES.FIRE, TYPES.FLYING, TYPES.ROCK],
        immuneTo: [],
        resists: [TYPES.GRASS, TYPES.FIGHTING, TYPES.GROUND],
        superEffective: [TYPES.GRASS, TYPES.PSYCHIC, TYPES.DARK],
        notVeryEffective: [TYPES.FIRE, TYPES.FIGHTING, TYPES.POISON, TYPES.FLYING, TYPES.GHOST, TYPES.STEEL, TYPES.FAIRY],
        noEffect: []
    },
    [TYPES.ROCK]: {
        weakTo: [TYPES.WATER, TYPES.GRASS, TYPES.FIGHTING, TYPES.GROUND, TYPES.STEEL],
        immuneTo: [],
        resists: [TYPES.NORMAL, TYPES.FIRE, TYPES.POISON, TYPES.FLYING],
        superEffective: [TYPES.FIRE, TYPES.ICE, TYPES.FLYING, TYPES.BUG],
        notVeryEffective: [TYPES.FIGHTING, TYPES.GROUND, TYPES.STEEL],
        noEffect: []
    },
    [TYPES.GHOST]: {
        weakTo: [TYPES.GHOST, TYPES.DARK],
        immuneTo: [TYPES.NORMAL, TYPES.FIGHTING],
        resists: [TYPES.POISON, TYPES.BUG],
        superEffective: [TYPES.PSYCHIC, TYPES.GHOST],
        notVeryEffective: [TYPES.DARK],
        noEffect: [TYPES.NORMAL]
    },
    [TYPES.DRAGON]: {
        weakTo: [TYPES.ICE, TYPES.DRAGON, TYPES.FAIRY],
        immuneTo: [],
        resists: [TYPES.FIRE, TYPES.WATER, TYPES.ELECTRIC, TYPES.GRASS],
        superEffective: [TYPES.DRAGON],
        notVeryEffective: [TYPES.STEEL],
        noEffect: [TYPES.FAIRY]
    },
    // Modern types
    [TYPES.DARK]: {
        weakTo: [TYPES.FIGHTING, TYPES.BUG, TYPES.FAIRY],
        immuneTo: [TYPES.PSYCHIC],
        resists: [TYPES.GHOST, TYPES.DARK],
        superEffective: [TYPES.PSYCHIC, TYPES.GHOST],
        notVeryEffective: [TYPES.FIGHTING, TYPES.DARK, TYPES.FAIRY],
        noEffect: []
    },
    [TYPES.STEEL]: {
        weakTo: [TYPES.FIRE, TYPES.FIGHTING, TYPES.GROUND],
        immuneTo: [TYPES.POISON],
        resists: [TYPES.NORMAL, TYPES.GRASS, TYPES.ICE, TYPES.FLYING, TYPES.PSYCHIC, TYPES.BUG, TYPES.ROCK, TYPES.DRAGON, TYPES.STEEL, TYPES.FAIRY],
        superEffective: [TYPES.ICE, TYPES.ROCK, TYPES.FAIRY],
        notVeryEffective: [TYPES.FIRE, TYPES.WATER, TYPES.ELECTRIC, TYPES.STEEL],
        noEffect: []
    },
    [TYPES.FAIRY]: {
        weakTo: [TYPES.POISON, TYPES.STEEL],
        immuneTo: [TYPES.DRAGON],
        resists: [TYPES.FIGHTING, TYPES.BUG, TYPES.DARK],
        superEffective: [TYPES.FIGHTING, TYPES.DRAGON, TYPES.DARK],
        notVeryEffective: [TYPES.FIRE, TYPES.POISON, TYPES.STEEL],
        noEffect: []
    }
};

// Get effectiveness multiplier for a move type against target types
function getEffectiveness(moveType, targetTypes) {
    if (!Array.isArray(targetTypes)) targetTypes = [targetTypes];
    
    let multiplier = 1;
    let effectivenessText = '';
    
    for (const targetType of targetTypes) {
        const chart = TYPE_CHART[moveType];
        if (!chart) continue;
        
        if (chart.noEffect.includes(targetType)) {
            multiplier *= 0;
            effectivenessText = 'No effect';
        } else if (chart.notVeryEffective.includes(targetType)) {
            multiplier *= 0.5;
        } else if (chart.superEffective.includes(targetType)) {
            multiplier *= 2;
        }
    }
    
    // Determine text feedback
    if (multiplier === 0) effectivenessText = 'No effect';
    else if (multiplier >= 4) effectivenessText = 'Super duper effective!';
    else if (multiplier >= 2) effectivenessText = 'Super effective!';
    else if (multiplier <= 0.25) effectivenessText = 'Barely effective...';
    else if (multiplier <= 0.5) effectivenessText = 'Not very effective...';
    else effectivenessText = '';
    
    return { multiplier, text: effectivenessText };
}

// Get STAB (Same Type Attack Bonus) - 1.5x damage
function getStabMultiplier(moveType, userTypes) {
    if (!Array.isArray(userTypes)) userTypes = [userTypes];
    return userTypes.includes(moveType) ? 1.5 : 1;
}

// Check if type is immune to another type
function isImmuneTo(attackingType, defendingType) {
    const chart = TYPE_CHART[defendingType];
    return chart && chart.immuneTo.includes(attackingType);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TYPES, TYPE_CHART, getEffectiveness, getStabMultiplier, isImmuneTo };
}
