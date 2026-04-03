// ============================================
// MOVE DATABASE - All moves with PP, power, accuracy, priority
// ============================================

// Move categories for Physical/Special split
const DAMAGE_CATEGORY = {
    PHYSICAL: 'physical',
    SPECIAL: 'special',
    STATUS: 'status'
};

// Move target types
const MOVE_TARGET = {
    SELF: 'self',
    ENEMY: 'enemy',
    ALLY: 'ally',
    ALL_ENEMIES: 'all_enemies',
    ALL_ALLIES: 'all_allies',
    FIELD: 'field'
};

// Complete move database
const MOVE_DATABASE = {
    // Normal-type moves
    TACKLE: {
        name: 'TACKLE',
        type: 'normal',
        category: DAMAGE_CATEGORY.PHYSICAL,
        power: 40,
        accuracy: 100,
        pp: 35,
        maxPp: 35,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        description: 'Charges the target with a full-body tackle.'
    },
    GROWL: {
        name: 'GROWL',
        type: 'normal',
        category: DAMAGE_CATEGORY.STATUS,
        power: 0,
        accuracy: 100,
        pp: 40,
        maxPp: 40,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { stat: 'attack', stages: -1 },
        description: 'Growls cutely to lower the target\'s Attack.'
    },
    SCRATCH: {
        name: 'SCRATCH',
        type: 'normal',
        category: DAMAGE_CATEGORY.PHYSICAL,
        power: 40,
        accuracy: 100,
        pp: 35,
        maxPp: 35,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        description: 'Scratches the target with sharp claws.'
    },
    TAIL_WHIP: {
        name: 'TAIL WHIP',
        type: 'normal',
        category: DAMAGE_CATEGORY.STATUS,
        power: 0,
        accuracy: 100,
        pp: 30,
        maxPp: 30,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { stat: 'defense', stages: -1 },
        description: 'Wags tail to lower the target\'s Defense.'
    },
    SAND_ATTACK: {
        name: 'SAND ATTACK',
        type: 'ground',
        category: DAMAGE_CATEGORY.STATUS,
        power: 0,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { stat: 'accuracy', stages: -1 },
        description: 'Throws sand in the target\'s face to lower accuracy.'
    },
    GUST: {
        name: 'GUST',
        type: 'flying',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 40,
        accuracy: 100,
        pp: 35,
        maxPp: 35,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        description: 'Strikes the target with a gust of wind.'
    },
    STRING_SHOT: {
        name: 'STRING SHOT',
        type: 'bug',
        category: DAMAGE_CATEGORY.STATUS,
        power: 0,
        accuracy: 95,
        pp: 40,
        maxPp: 40,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { stat: 'speed', stages: -1 },
        description: 'Binds the target with silk to lower Speed.'
    },
    
    // Fire-type moves
    EMBER: {
        name: 'EMBER',
        type: 'fire',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 40,
        accuracy: 100,
        pp: 25,
        maxPp: 25,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { condition: 'burn', chance: 10 },
        description: 'Weak fire attack. May burn the target.'
    },
    FLAMETHROWER: {
        name: 'FLAMETHROWER',
        type: 'fire',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 90,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { condition: 'burn', chance: 10 },
        description: 'Powerful flame breath. May burn the target.'
    },
    FIRE_PUNCH: {
        name: 'FIRE PUNCH',
        type: 'fire',
        category: DAMAGE_CATEGORY.PHYSICAL, // Physical/Special split example
        power: 75,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { condition: 'burn', chance: 10 },
        description: 'Fiery punch. May burn the target.'
    },
    
    // Water-type moves
    WATER_GUN: {
        name: 'WATER GUN',
        type: 'water',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 40,
        accuracy: 100,
        pp: 25,
        maxPp: 25,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        description: 'Squirts water to attack.'
    },
    BUBBLE: {
        name: 'BUBBLE',
        type: 'water',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 40,
        accuracy: 100,
        pp: 30,
        maxPp: 30,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { stat: 'speed', stages: -1, chance: 10 },
        description: 'Bubble attack. May lower Speed.'
    },
    SURF: {
        name: 'SURF',
        type: 'water',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 90,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        isHM: true,
        description: 'Creates a huge wave. Can be used to travel on water.'
    },
    
    // Grass-type moves
    VINE_WHIP: {
        name: 'VINE WHIP',
        type: 'grass',
        category: DAMAGE_CATEGORY.PHYSICAL,
        power: 45,
        accuracy: 100,
        pp: 25,
        maxPp: 25,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        description: 'Strikes with slender vines.'
    },
    RAZOR_LEAF: {
        name: 'RAZOR LEAF',
        type: 'grass',
        category: DAMAGE_CATEGORY.PHYSICAL,
        power: 55,
        accuracy: 95,
        pp: 25,
        maxPp: 25,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        highCrit: true,
        description: 'Cuts with sharp leaves. High crit ratio.'
    },
    ABSORB: {
        name: 'ABSORB',
        type: 'grass',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 20,
        accuracy: 100,
        pp: 25,
        maxPp: 25,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        drain: 0.5, // Heal 50% of damage dealt
        description: 'Drains HP from the target.'
    },
    
    // Electric-type moves
    THUNDER_SHOCK: {
        name: 'THUNDER SHOCK',
        type: 'electric',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 40,
        accuracy: 100,
        pp: 30,
        maxPp: 30,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { condition: 'paralyze', chance: 10 },
        description: 'Electric shock. May paralyze.'
    },
    THUNDERBOLT: {
        name: 'THUNDERBOLT',
        type: 'electric',
        category: DAMAGE_CATEGORY.SPECIAL,
        power: 90,
        accuracy: 100,
        pp: 15,
        maxPp: 15,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        effect: { condition: 'paralyze', chance: 10 },
        description: 'Strong electric blast. May paralyze.'
    },
    
    // Priority moves
    QUICK_ATTACK: {
        name: 'QUICK ATTACK',
        type: 'normal',
        category: DAMAGE_CATEGORY.PHYSICAL,
        power: 40,
        accuracy: 100,
        pp: 30,
        maxPp: 30,
        priority: 1, // +1 priority
        target: MOVE_TARGET.ENEMY,
        description: 'Always strikes first.'
    },
    
    // High power moves with trade-offs
    TAKE_DOWN: {
        name: 'TAKE DOWN',
        type: 'normal',
        category: DAMAGE_CATEGORY.PHYSICAL,
        power: 90,
        accuracy: 85,
        pp: 20,
        maxPp: 20,
        priority: 0,
        target: MOVE_TARGET.ENEMY,
        recoil: 0.25, // 25% recoil damage
        description: 'Tackle with recoil damage to user.'
    },
    
    // Status healing
    RECOVER: {
        name: 'RECOVER',
        type: 'normal',
        category: DAMAGE_CATEGORY.STATUS,
        power: 0,
        accuracy: 100,
        pp: 10,
        maxPp: 10,
        priority: 0,
        target: MOVE_TARGET.SELF,
        healPercent: 50,
        description: 'Restores HP by half max HP.'
    }
};

// Get move data
function getMove(moveId) {
    return MOVE_DATABASE[moveId] || null;
}

// Check if move can be used (has PP)
function canUseMove(moveId, currentPp) {
    const move = getMove(moveId);
    if (!move) return false;
    return currentPp > 0;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MOVE_DATABASE, DAMAGE_CATEGORY, MOVE_TARGET, getMove, canUseMove };
}
