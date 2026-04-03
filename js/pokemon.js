// ============================================
// POKEMON CLASS - Individual Pokemon with stats, IVs, EVs
// ============================================

class Pokemon {
    constructor(speciesId, level = 5, options = {}) {
        this.speciesId = speciesId;
        this.species = getSpecies(speciesId);
        this.level = level;
        this.nickname = options.nickname || null;
        
        // Individual Values (IVs) - genetic potential, 0-15 in Gen 1 style
        this.ivs = options.ivs || this.generateIVs();
        
        // Effort Values (EVs/Stat Exp) - 0-65535 in Gen 1
        this.evs = options.evs || { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 };
        
        // Experience points
        this.exp = options.exp || this.calculateExpForLevel(level);
        
        // Nature (for flavor, affects stats slightly)
        this.nature = options.nature || this.generateNature();
        
        // Current moves (max 4)
        this.moves = options.moves || this.generateStartingMoves();
        
        // Calculate initial stats
        this.recalculateStats();
        
        // Current HP (set AFTER recalculateStats sets maxHp)
        this.currentHp = options.currentHp ?? this.maxHp;
    }
    
    generateIVs() {
        // Gen 1 style: 0-15 for each stat
        return {
            hp: Math.floor(Math.random() * 16),
            attack: Math.floor(Math.random() * 16),
            defense: Math.floor(Math.random() * 16),
            spAttack: Math.floor(Math.random() * 16),
            spDefense: Math.floor(Math.random() * 16),
            speed: Math.floor(Math.random() * 16)
        };
    }
    
    generateNature() {
        const natures = ['hardy', 'lonely', 'brave', 'adamant', 'naughty',
                        'bold', 'docile', 'relaxed', 'impish', 'lax',
                        'timid', 'hasty', 'serious', 'jolly', 'naive',
                        'modest', 'mild', 'quiet', 'bashful', 'rash',
                        'calm', 'gentle', 'sassy', 'careful', 'quirky'];
        return natures[Math.floor(Math.random() * natures.length)];
    }
    
    generateStartingMoves() {
        const learnableMoves = getLearnableMoves(this.speciesId, this.level);
        // Take up to 4 most recent moves
        return learnableMoves.slice(-4).map(moveId => {
            const moveData = getMove(moveId);
            if (!moveData) {
                console.warn('Move not found:', moveId);
                return { id: moveId, pp: 0, maxPp: 0 };
            }
            return {
                id: moveId,
                pp: moveData.pp || 0,
                maxPp: moveData.pp || 0
            };
        }).filter(m => m.pp > 0 || getMove(m.id)); // Filter out invalid moves
    }
    
    calculateExpForLevel(level) {
        if (!this.species) return 0;
        return getExpForLevel(this.species.growthRate, level);
    }
    
    // Gen 1 Stat Formula with modern split (Sp. Attack/Sp. Defense separated)
    recalculateStats() {
        if (!this.species) return;
        
        const base = this.species.baseStats;
        const level = this.level;
        
        // Gen 1 formula adapted for modern stat split
        // Stat = floor((2 * Base + IV + floor(EV/4)) * Level / 100) + 5
        // HP = floor((2 * Base + IV + floor(EV/4)) * Level / 100) + Level + 10
        
        this.maxHp = Math.floor(
            ((2 * base.hp + this.ivs.hp + Math.floor(this.evs.hp / 4)) * level) / 100
        ) + level + 10;
        
        this.attack = Math.floor(
            ((2 * base.attack + this.ivs.attack + Math.floor(this.evs.attack / 4)) * level) / 100
        ) + 5;
        
        this.defense = Math.floor(
            ((2 * base.defense + this.ivs.defense + Math.floor(this.evs.defense / 4)) * level) / 100
        ) + 5;
        
        this.spAttack = Math.floor(
            ((2 * base.spAttack + this.ivs.spAttack + Math.floor(this.evs.spAttack / 4)) * level) / 100
        ) + 5;
        
        this.spDefense = Math.floor(
            ((2 * base.spDefense + this.ivs.spDefense + Math.floor(this.evs.spDefense / 4)) * level) / 100
        ) + 5;
        
        this.speed = Math.floor(
            ((2 * base.speed + this.ivs.speed + Math.floor(this.evs.speed / 4)) * level) / 100
        ) + 5;
        
        // Apply nature modifiers (10% boost/drop)
        this.applyNatureModifiers();
    }
    
    applyNatureModifiers() {
        const natureEffects = {
            adamant: { boost: 'attack', drop: 'spAttack' },
            bold: { boost: 'defense', drop: 'attack' },
            brave: { boost: 'attack', drop: 'speed' },
            calm: { boost: 'spDefense', drop: 'attack' },
            careful: { boost: 'spDefense', drop: 'spAttack' },
            gentle: { boost: 'spDefense', drop: 'defense' },
            hasty: { boost: 'speed', drop: 'defense' },
            impish: { boost: 'defense', drop: 'spAttack' },
            jolly: { boost: 'speed', drop: 'spAttack' },
            lonely: { boost: 'attack', drop: 'defense' },
            mild: { boost: 'spAttack', drop: 'defense' },
            modest: { boost: 'spAttack', drop: 'attack' },
            naive: { boost: 'speed', drop: 'spDefense' },
            naughty: { boost: 'attack', drop: 'spDefense' },
            quiet: { boost: 'spAttack', drop: 'speed' },
            rash: { boost: 'spAttack', drop: 'spDefense' },
            relaxed: { boost: 'defense', drop: 'speed' },
            sassy: { boost: 'spDefense', drop: 'speed' },
            timid: { boost: 'speed', drop: 'attack' }
        };
        
        const effect = natureEffects[this.nature];
        if (effect) {
            this[effect.boost] = Math.floor(this[effect.boost] * 1.1);
            this[effect.drop] = Math.floor(this[effect.drop] * 0.9);
        }
    }
    
    // Gain experience from battle
    gainExp(amount) {
        const oldLevel = this.level;
        this.exp += amount;
        
        // Check for level ups
        while (this.exp >= this.calculateExpForLevel(this.level + 1) && this.level < 100) {
            this.levelUp();
        }
        
        return { leveledUp: this.level > oldLevel, levelsGained: this.level - oldLevel };
    }
    
    levelUp() {
        this.level++;
        const oldMaxHp = this.maxHp;
        this.recalculateStats();
        
        // Heal HP gained from level up
        const hpGained = this.maxHp - oldMaxHp;
        this.currentHp += hpGained;
        
        // Learn new moves
        const newMoves = getLearnableMoves(this.speciesId, this.level);
        const currentMoveIds = this.moves.map(m => m.id);
        
        for (const moveId of newMoves) {
            if (!currentMoveIds.includes(moveId) && this.moves.length < 4) {
                const moveData = getMove(moveId);
                this.moves.push({
                    id: moveId,
                    pp: moveData.pp,
                    maxPp: moveData.pp
                });
            }
        }
        
        // Check evolution
        this.checkEvolution();
    }
    
    checkEvolution() {
        if (!this.species || !this.species.evolution) return null;
        
        const evo = this.species.evolution;
        if (evo.level && this.level >= evo.level) {
            return evo.into;
        }
        return null;
    }
    
    evolve(newSpeciesId) {
        this.speciesId = newSpeciesId;
        this.species = getSpecies(newSpeciesId);
        this.recalculateStats();
        this.currentHp = this.maxHp; // Full heal on evolution
        return this.species;
    }
    
    // Battle stat calculations
    getBattleStat(stat, modifiers = {}) {
        let value = this[stat];
        
        // Apply stat stage modifiers (-6 to +6)
        const stage = modifiers[stat] || 0;
        const stageMultipliers = [0.25, 0.285, 0.333, 0.4, 0.5, 0.666, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        const multiplier = stageMultipliers[stage + 6] || 1;
        value = Math.floor(value * multiplier);
        
        // Apply status effects
        if (this.status === 'paralyze' && stat === 'speed') {
            value = Math.floor(value * 0.25); // Paralysis quarters speed
        } else if (this.status === 'burn' && stat === 'attack') {
            value = Math.floor(value * 0.5); // Burn halves attack
        }
        
        return value;
    }
    
    // Critical hit rate based on Speed (Gen 1 style)
    getCritRate() {
        const baseSpeed = this.species.baseStats.speed;
        // Gen 1 formula: baseSpeed / 512 * 100 = crit chance %
        return Math.min(50, (baseSpeed / 512) * 100);
    }
    
    // Use a move (consume PP)
    useMove(moveIndex) {
        if (moveIndex < 0 || moveIndex >= this.moves.length) return false;
        
        const move = this.moves[moveIndex];
        if (move.pp <= 0) return false;
        
        move.pp--;
        return true;
    }
    
    // Take damage
    takeDamage(damage) {
        this.currentHp = Math.max(0, this.currentHp - damage);
        if (this.currentHp === 0) {
            this.isFainted = true;
            this.status = null; // Status cleared on faint
        }
        return this.currentHp;
    }
    
    // Heal HP
    heal(amount) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
        return this.currentHp;
    }
    
    // Full heal
    fullHeal() {
        this.currentHp = this.maxHp;
        this.status = null;
    }
    
    // Restore PP for all moves
    restorePP(amount = null) {
        for (const move of this.moves) {
            const moveData = getMove(move.id);
            if (amount === null) {
                move.pp = move.maxPp;
            } else {
                move.pp = Math.min(move.maxPp, move.pp + amount);
            }
        }
    }
    
    // Get display name
    getName() {
        return this.nickname || this.species?.name || '???';
    }
    
    // Serialize for saving
    serialize() {
        return {
            speciesId: this.speciesId,
            level: this.level,
            nickname: this.nickname,
            ivs: { ...this.ivs },
            evs: { ...this.evs },
            exp: this.exp,
            nature: this.nature,
            moves: this.moves.map(m => ({ ...m })),
            currentHp: this.currentHp,
            status: this.status,
            heldItem: this.heldItem,
            ability: this.ability,
            isFainted: this.isFainted,
            isCaught: this.isCaught
        };
    }
    
    // Deserialize from save
    static deserialize(data) {
        return new Pokemon(data.speciesId, data.level, data);
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Pokemon };
}
