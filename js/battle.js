// ============================================
// COMPLETE BATTLE SYSTEM - Turn-based with PP, Priority, Types
// ============================================

class BattleSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.turn = 0;
        this.battleType = 'wild'; // 'wild' or 'trainer'
        
        // Combatants
        this.playerParty = []; // Array of Pokemon objects
        this.playerActive = null; // Currently active Pokemon
        this.enemyParty = [];
        this.enemyActive = null;
        
        // Battle state
        this.battleState = 'intro'; // intro, menu, fight, item, switch, animate, resolve, end
        this.menuSelection = { row: 0, col: 0 }; // For 2x2 grid menus
        this.moveSelection = 0;
        this.partySelection = 0;
        this.itemSelection = 0;
        
        // Battle queue
        this.actionQueue = []; // Stores actions to execute
        this.currentAction = null;
        this.animationTimer = 0;
        
        // UI messages
        this.message = '';
        this.messageQueue = [];
        this.showingMessage = false;
        
        // Battle modifiers
        this.weather = null; // rain, sun, sand, hail
        this.terrain = null; // grassy, electric, etc.
        this.playerStatStages = { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
        this.enemyStatStages = { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
        
        // Visual effects
        this.screenShake = 0;
        this.runAttempts = 0;
    }
    
    // Start a wild battle
    startWildBattle(wildSpecies, level = null) {
        // Determine level based on area if not specified
        const wildLevel = level || this.getWildLevel();
        
        // Create wild Pokemon
        const wildPokemon = new Pokemon(wildSpecies, wildLevel);
        
        this.startBattle([wildPokemon], 'wild');
    }
    
    // Start trainer battle
    startTrainerBattle(trainerParty, trainerName = 'TRAINER') {
        const enemyParty = trainerParty.map(p => new Pokemon(p.species, p.level, p.options || {}));
        this.startBattle(enemyParty, 'trainer', trainerName);
    }
    
    // Generic battle start
    startBattle(enemyParty, battleType = 'wild', opponentName = null) {
        this.active = true;
        this.battleType = battleType;
        this.opponentName = opponentName;
        
        // Set parties
        this.playerParty = this.game.party || [];
        this.enemyParty = enemyParty;
        
        // Get first non-fainted Pokemon from each side
        this.playerActive = this.playerParty.find(p => !p.isFainted) || null;
        this.enemyActive = this.enemyParty[0];
        
        if (!this.playerActive) {
            this.game.showDialog('No Pokemon able to battle!');
            this.end();
            return;
        }
        
        // Mark enemy as seen in pokedex
        if (this.enemyActive) {
            this.game.registerPokedexEncounter(this.enemyActive.speciesId, false);
        }
        
        // Reset battle state
        this.turn = 0;
        this.runAttempts = 0;
        this.battleState = 'intro';
        this.playerStatStages = { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
        this.enemyStatStages = { attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0, accuracy: 0, evasion: 0 };
        this.message = '';
        this.messageQueue = [];
        
        // Queue intro messages
        if (battleType === 'wild') {
            this.queueMessage(`Wild ${this.enemyActive.getName()} appeared!`);
        } else {
            this.queueMessage(`${opponentName} wants to fight!`);
            this.queueMessage(`${opponentName} sent out ${this.enemyActive.getName()}!`);
        }
        this.queueMessage(`Go! ${this.playerActive.getName()}!`);
        
        // Start battle loop
        this.processMessageQueue();
    }
    
    getWildLevel() {
        // Based on player's highest level Pokemon with some variance
        const highestLevel = Math.max(...this.playerParty.map(p => p.level));
        const variance = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(2, Math.min(100, highestLevel + variance));
    }
    
    // Message handling
    queueMessage(text) {
        this.messageQueue.push(text);
    }
    
    processMessageQueue() {
        if (this.messageQueue.length > 0) {
            this.message = this.messageQueue.shift();
            this.showingMessage = true;
            this.battleState = 'message';
        } else {
            this.showingMessage = false;
            this.battleState = 'menu';
        }
    }
    
    // Input handling
    handleInput(key) {
        if (this.showingMessage) {
            if (key === 'z' || key === ' ' || key === 'Enter') {
                this.processMessageQueue();
            }
            return;
        }
        
        switch (this.battleState) {
            case 'menu':
                this.handleMenuInput(key);
                break;
            case 'fight':
                this.handleFightInput(key);
                break;
            case 'item':
                this.handleItemInput(key);
                break;
            case 'switch':
                this.handleSwitchInput(key);
                break;
        }
    }
    
    handleMenuInput(key) {
        const options = [
            ['FIGHT', 'BAG'],
            ['POKéMON', 'RUN']
        ];
        
        switch (key) {
            case 'ArrowUp':
                this.menuSelection.row = Math.max(0, this.menuSelection.row - 1);
                break;
            case 'ArrowDown':
                this.menuSelection.row = Math.min(1, this.menuSelection.row + 1);
                break;
            case 'ArrowLeft':
                this.menuSelection.col = Math.max(0, this.menuSelection.col - 1);
                break;
            case 'ArrowRight':
                this.menuSelection.col = Math.min(1, this.menuSelection.col + 1);
                break;
            case 'z':
            case ' ':
            case 'Enter':
                this.selectMenuOption();
                break;
            case 'x':
                // Cancel (no effect on main menu)
                break;
        }
    }
    
    selectMenuOption() {
        const option = ['fight', 'item', 'switch', 'run'];
        const index = this.menuSelection.row * 2 + this.menuSelection.col;
        const choice = option[index];
        
        switch (choice) {
            case 'fight':
                if (this.playerActive.moves.length > 0) {
                    this.battleState = 'fight';
                    this.moveSelection = 0;
                } else {
                    this.queueMessage('No moves!');
                    this.processMessageQueue();
                }
                break;
            case 'item':
                this.battleState = 'item';
                this.itemSelection = 0;
                break;
            case 'switch':
                this.battleState = 'switch';
                this.partySelection = 0;
                break;
            case 'run':
                this.attemptRun();
                break;
        }
    }
    
    handleFightInput(key) {
        const numMoves = this.playerActive.moves.length;
        
        switch (key) {
            case 'ArrowUp':
                this.moveSelection = Math.max(0, this.moveSelection - 2);
                break;
            case 'ArrowDown':
                this.moveSelection = Math.min(numMoves - 1, this.moveSelection + 2);
                break;
            case 'ArrowLeft':
                if (this.moveSelection % 2 === 1) this.moveSelection--;
                break;
            case 'ArrowRight':
                if (this.moveSelection % 2 === 0 && this.moveSelection + 1 < numMoves) this.moveSelection++;
                break;
            case 'z':
            case ' ':
            case 'Enter':
                this.selectMove();
                break;
            case 'x':
                this.battleState = 'menu';
                break;
        }
    }
    
    selectMove() {
        const moveSlot = this.playerActive.moves[this.moveSelection];
        if (!moveSlot || moveSlot.pp <= 0) {
            this.queueMessage('No PP left!');
            this.processMessageQueue();
            return;
        }
        
        // Queue player action
        const moveData = getMove(moveSlot.id);
        this.actionQueue.push({
            type: 'move',
            user: 'player',
            move: moveData,
            moveSlot: this.moveSelection,
            priority: moveData.priority || 0,
            speed: this.playerActive.getBattleStat('speed', this.playerStatStages)
        });
        
        // AI selects move
        this.selectEnemyMove();
        
        // Execute turn
        this.executeTurn();
    }
    
    selectEnemyMove() {
        // Simple AI: pick random move with PP
        const availableMoves = this.enemyActive.moves.filter(m => m.pp > 0);
        if (availableMoves.length === 0) {
            // Struggle if no PP
            this.actionQueue.push({
                type: 'struggle',
                user: 'enemy',
                priority: 0,
                speed: this.enemyActive.getBattleStat('speed', this.enemyStatStages)
            });
            return;
        }
        
        const moveSlot = availableMoves[Math.floor(Math.random() * availableMoves.length)];
        const moveData = getMove(moveSlot.id);
        
        this.actionQueue.push({
            type: 'move',
            user: 'enemy',
            move: moveData,
            priority: moveData.priority || 0,
            speed: this.enemyActive.getBattleStat('speed', this.enemyStatStages)
        });
    }
    
    handleItemInput(key) {
        // Simplified for now - just go back
        if (key === 'x') {
            this.battleState = 'menu';
        }
    }
    
    handleSwitchInput(key) {
        const partySize = this.playerParty.length;
        
        switch (key) {
            case 'ArrowUp':
                this.partySelection = Math.max(0, this.partySelection - 1);
                break;
            case 'ArrowDown':
                this.partySelection = Math.min(partySize - 1, this.partySelection + 1);
                break;
            case 'z':
            case ' ':
            case 'Enter':
                this.switchPokemon(this.partySelection);
                break;
            case 'x':
                this.battleState = 'menu';
                break;
        }
    }
    
    switchPokemon(index) {
        const newPokemon = this.playerParty[index];
        if (newPokemon.isFainted) {
            this.queueMessage(`${newPokemon.getName()} is fainted!`);
            this.processMessageQueue();
            return;
        }
        if (newPokemon === this.playerActive) {
            this.queueMessage(`${newPokemon.getName()} is already in battle!`);
            this.processMessageQueue();
            return;
        }
        
        // Recall current
        if (this.playerActive) {
            this.queueMessage(`${this.playerActive.getName()}, come back!`);
        }
        
        // Send out new
        this.playerActive = newPokemon;
        this.queueMessage(`Go! ${this.playerActive.getName()}!`);
        
        // If switching as an action (not forced), end turn
        if (this.battleState === 'switch') {
            this.actionQueue.push({
                type: 'switch',
                user: 'player',
                priority: 6, // Switching has high priority
                speed: 999
            });
            this.selectEnemyMove();
            this.executeTurn();
        } else {
            this.processMessageQueue();
        }
    }
    
    attemptRun() {
        if (this.battleType === 'trainer') {
            this.queueMessage('No! There\'s no running from a trainer battle!');
            this.processMessageQueue();
            return;
        }
        
        // Run formula based on speeds
        const playerSpeed = this.playerActive.getBattleStat('speed', this.playerStatStages);
        const enemySpeed = this.enemyActive.getBattleStat('speed', this.enemyStatStages);
        
        // Gen 1 run formula: A = player speed, B = enemy speed, C = attempts
        // F = (A * 128 / B) + 30 * C
        // If random(0-255) < F, escape
        this.runAttempts++;
        const escapeOdds = (playerSpeed * 128 / enemySpeed) + 30 * this.runAttempts;
        const roll = Math.random() * 256;
        
        if (roll < escapeOdds || playerSpeed > enemySpeed) {
            this.queueMessage('Got away safely!');
            this.battleState = 'end';
            setTimeout(() => this.end(), 1500);
        } else {
            this.queueMessage('Can\'t escape!');
            this.selectEnemyMove();
            this.executeTurn();
        }
        
        this.processMessageQueue();
    }
    
    // Execute the turn
    executeTurn() {
        this.battleState = 'animate';
        
        // Sort by priority, then speed
        this.actionQueue.sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return b.speed - a.speed;
        });
        
        // Execute actions
        this.executeNextAction();
    }
    
    executeNextAction() {
        if (this.actionQueue.length === 0) {
            // Turn complete
            this.checkBattleEnd();
            return;
        }
        
        const action = this.actionQueue.shift();
        this.currentAction = action;
        
        switch (action.type) {
            case 'move':
                this.executeMove(action);
                break;
            case 'struggle':
                this.executeStruggle(action);
                break;
            case 'switch':
                // Switching already handled
                this.executeNextAction();
                break;
        }
    }
    
    executeMove(action) {
        const attacker = action.user === 'player' ? this.playerActive : this.enemyActive;
        const defender = action.user === 'player' ? this.enemyActive : this.playerActive;
        const attackerStages = action.user === 'player' ? this.playerStatStages : this.enemyStatStages;
        const defenderStages = action.user === 'player' ? this.enemyStatStages : this.playerStatStages;
        
        const move = action.move;
        
        // Consume PP
        if (action.user === 'player') {
            attacker.useMove(action.moveSlot);
        } else {
            const moveIndex = attacker.moves.findIndex(m => m.id === action.move.id);
            if (moveIndex >= 0) attacker.useMove(moveIndex);
        }
        
        // Announce move
        this.queueMessage(`${attacker.getName()} used ${move.name}!`);
        
        // Check accuracy
        if (move.accuracy < 100) {
            const accuracyMultiplier = this.getStatStageMultiplier(attackerStages.accuracy);
            const evasionMultiplier = this.getStatStageMultiplier(-defenderStages.evasion);
            const hitChance = (move.accuracy / 100) * accuracyMultiplier / evasionMultiplier;
            
            if (Math.random() > hitChance) {
                this.queueMessage('But it missed!');
                this.processMessageQueue();
                this.animationTimer = setTimeout(() => this.executeNextAction(), 1000);
                return;
            }
        }
        
        // Handle status moves
        if (move.category === 'status' && move.effect) {
            this.applyStatusEffect(move, attacker, defender, attackerStages, defenderStages);
            this.processMessageQueue();
            this.animationTimer = setTimeout(() => this.executeNextAction(), 1000);
            return;
        }
        
        // Calculate damage
        const { damage, isCrit } = this.calculateDamage(move, attacker, defender, attackerStages, defenderStages);
        
        // Apply damage
        if (damage > 0) {
            defender.takeDamage(damage);
            this.screenShake = 10;
            
            // Critical hit was already determined in calculateDamage
            if (isCrit) {
                this.queueMessage('A critical hit!');
            }
            
            // Check type effectiveness
            const effectiveness = getEffectiveness(move.type, defender.species.types);
            if (effectiveness.text) {
                this.queueMessage(effectiveness.text);
            }
            
            // Check faint
            if (defender.isFainted) {
                this.queueMessage(`${defender.getName()} fainted!`);
                if (action.user === 'player') {
                    this.queueMessage(`${attacker.getName()} gained ${this.calculateExpGain(defender)} Exp. Points!`);
                }
            }
        }
        
        // Apply move effects (burn, etc.)
        if (move.effect && move.effect.condition && Math.random() < (move.effect.chance / 100)) {
            defender.status = move.effect.condition;
            this.queueMessage(`${defender.getName()} was ${move.effect.condition}ed!`);
        }
        
        // Apply recoil
        if (move.recoil && damage > 0) {
            const recoilDamage = Math.floor(damage * move.recoil);
            attacker.takeDamage(recoilDamage);
            this.queueMessage(`${attacker.getName()} was hurt by recoil!`);
        }
        
        // Apply drain
        if (move.drain && damage > 0) {
            const drainHeal = Math.floor(damage * move.drain);
            attacker.heal(drainHeal);
            this.queueMessage(`${attacker.getName()} drained HP!`);
        }
        
        this.processMessageQueue();
        this.animationTimer = setTimeout(() => this.executeNextAction(), 1000);
    }
    
    executeStruggle(action) {
        const attacker = action.user === 'player' ? this.playerActive : this.enemyActive;
        const defender = action.user === 'player' ? this.enemyActive : this.playerActive;
        
        this.queueMessage(`${attacker.getName()} is out of PP!`);
        this.queueMessage(`${attacker.getName()} used Struggle!`);
        
        // Struggle is typeless 50 power physical move
        const damage = Math.max(1, Math.floor(
            ((2 * attacker.level / 5 + 2) * 50 * (attacker.attack / defender.defense)) / 50 + 2
        ));
        
        defender.takeDamage(damage);
        this.screenShake = 10;
        
        // Recoil is 25% of max HP
        const recoil = Math.floor(attacker.maxHp * 0.25);
        attacker.takeDamage(recoil);
        this.queueMessage(`${attacker.getName()} was hurt by recoil!`);
        
        if (defender.isFainted) {
            this.queueMessage(`${defender.getName()} fainted!`);
        }
        if (attacker.isFainted) {
            this.queueMessage(`${attacker.getName()} fainted!`);
        }
        
        this.processMessageQueue();
        this.animationTimer = setTimeout(() => this.executeNextAction(), 1000);
    }
    
    calculateDamage(move, attacker, defender, attackerStages, defenderStages) {
        if (!move.power) return 0;
        
        // Determine which stats to use based on move category
        const isPhysical = move.category === 'physical';
        const attackStat = isPhysical ? 'attack' : 'spAttack';
        const defenseStat = isPhysical ? 'defense' : 'spDefense';
        
        const attack = attacker.getBattleStat(attackStat, attackerStages);
        const defense = defender.getBattleStat(defenseStat, defenderStages);
        
        // Base damage formula (Gen 1 inspired)
        let damage = Math.floor(
            ((2 * attacker.level / 5 + 2) * move.power * (attack / defense)) / 50 + 2
        );
        
        // STAB (Same Type Attack Bonus)
        const stab = getStabMultiplier(move.type, attacker.species.types);
        damage = Math.floor(damage * stab);
        
        // Type effectiveness
        const effectiveness = getEffectiveness(move.type, defender.species.types);
        damage = Math.floor(damage * effectiveness.multiplier);
        
        // Random factor (85-100%)
        const randomFactor = 0.85 + Math.random() * 0.15;
        damage = Math.floor(damage * randomFactor);
        
        // Critical hit (2x damage, 1.5x in later gens but keeping 2x for retro feel)
        const critChance = attacker.getCritRate() / 100;
        const isCrit = Math.random() < critChance;
        if (isCrit) {
            damage *= 2;
        }
        
        return { damage: Math.max(1, damage), isCrit };
    }
    
    applyStatusEffect(move, attacker, defender, attackerStages, defenderStages) {
        if (!move.effect) return;
        
        const effect = move.effect;
        
        if (effect.stat) {
            // Stat stage change
            const targetStages = move.target === 'self' ? attackerStages : defenderStages;
            const oldStage = targetStages[effect.stat] || 0;
            targetStages[effect.stat] = Math.max(-6, Math.min(6, oldStage + effect.stages));
            
            const statName = effect.stat.toUpperCase();
            if (effect.stages > 0) {
                this.queueMessage(`${effect.stages >= 2 ? `${statName} sharply rose!` : `${statName} rose!`}`);
            } else {
                this.queueMessage(`${effect.stages <= -2 ? `${statName} harshly fell!` : `${statName} fell!`}`);
            }
        }
    }
    
    getStatStageMultiplier(stage) {
        // Gen 1 stat stage multipliers
        const multipliers = [0.25, 0.285, 0.333, 0.4, 0.5, 0.666, 1, 1.5, 2, 2.5, 3, 3.5, 4];
        return multipliers[Math.max(0, Math.min(12, stage + 6))];
    }
    
    calculateExpGain(defeatedPokemon) {
        // Gen 1 EXP formula - with Gen 6 XP Share behavior (full EXP to all)
        const a = defeatedPokemon.species.expYield;
        const L = defeatedPokemon.level;
        // Gen 6+ XP Share: All party members get full EXP
        const s = this.game.settings?.xpShare ? 1 : 1;
        
        return Math.floor((a * L) / (7 * s));
    }
    
    checkBattleEnd() {
        // Check win/loss conditions
        const playerLost = this.playerParty.every(p => p.isFainted);
        const enemyLost = this.enemyParty.every(p => p.isFainted);
        
        if (playerLost) {
            this.queueMessage('You whited out!');
            this.battleState = 'end';
            setTimeout(() => this.end(true), 2000);
        } else if (enemyLost) {
            if (this.battleType === 'trainer') {
                this.queueMessage(`${this.opponentName} was defeated!`);
                // Award money for trainer battles
                const moneyWon = this.calculateMoneyWon();
                this.queueMessage(`You got $${moneyWon} for winning!`);
            }
            this.battleState = 'end';
            setTimeout(() => this.end(), 2000);
        } else if (this.playerActive.isFainted) {
            // Player's Pokemon fainted, force switch
            this.battleState = 'switch';
            this.queueMessage('Choose a Pokemon to send out!');
            this.processMessageQueue();
        } else {
            // Continue to next turn
            this.turn++;
            this.actionQueue = [];
            this.battleState = 'menu';
        }
    }
    
    calculateMoneyWon() {
        // Based on enemy party levels
        const totalLevels = this.enemyParty.reduce((sum, p) => sum + p.level, 0);
        return totalLevels * 20;
    }
    
    end(playerLost = false) {
        this.active = false;
        clearTimeout(this.animationTimer);
        
        // Handle post-battle
        if (playerLost) {
            // Heal party and return to last Pokemon Center
            this.playerParty.forEach(p => p.fullHeal());
            // Reset player position to last heal point
            this.game.player.x = this.game.lastHealX || 10;
            this.game.player.y = this.game.lastHealY || 8;
        }
        
        // Award XP if won
        if (!playerLost) {
            this.awardExperience();
        }
        
        this.game.state = 'world';
        
        // Clear battle UI
        this.message = '';
        this.battleState = 'intro';
    }
    
    awardExperience() {
        // Award EXP to all participants (simplified for now)
        for (const pokemon of this.playerParty) {
            if (!pokemon.isFainted) {
                const expPerPokemon = this.calculateExpGain(this.enemyActive);
                pokemon.gainExp(expPerPokemon);
            }
        }
    }
    
    // Rendering
    render(ctx) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
        // Screen shake effect
        if (this.screenShake > 0) {
            ctx.save();
            const dx = (Math.random() - 0.5) * this.screenShake;
            const dy = (Math.random() - 0.5) * this.screenShake;
            ctx.translate(dx, dy);
            this.screenShake *= 0.9;
            if (this.screenShake < 0.5) this.screenShake = 0;
        }
        
        // Battle background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#202020');
        gradient.addColorStop(1, '#404040');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Enemy platform
        ctx.fillStyle = '#606060';
        ctx.beginPath();
        ctx.ellipse(width * 0.75, height * 0.35, 80, 30, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Player platform
        ctx.fillStyle = '#606060';
        ctx.beginPath();
        ctx.ellipse(width * 0.25, height * 0.65, 100, 40, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw Pokemon
        if (this.enemyActive) {
            this.drawPokemon(ctx, this.enemyActive, width * 0.75, height * 0.25, true);
            this.drawHPBar(ctx, this.enemyActive, width * 0.55, height * 0.15, 150, true);
        }
        
        if (this.playerActive) {
            this.drawPokemon(ctx, this.playerActive, width * 0.25, height * 0.55, false);
            this.drawHPBar(ctx, this.playerActive, width * 0.15, height * 0.75, 150, false);
        }
        
        // Message/command box
        this.drawCommandBox(ctx, width, height);
        
        if (this.screenShake > 0) {
            ctx.restore();
        }
    }
    
    drawPokemon(ctx, pokemon, x, y, isEnemy) {
        const size = isEnemy ? 64 : 80;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + size/2, size/2, size/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body color based on primary type
        const typeColors = {
            normal: '#a8a878', fire: '#f08030', water: '#6890f0', electric: '#f8d030',
            grass: '#78c850', ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0',
            ground: '#e0c068', flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
            rock: '#b8a038', ghost: '#705898', dragon: '#7038f8', dark: '#705848',
            steel: '#b8b8d0', fairy: '#ee99ac'
        };
        
        ctx.fillStyle = typeColors[pokemon.species.types[0]] || '#888';
        
        // Simple body shape
        ctx.beginPath();
        ctx.arc(x, y, size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Face
        ctx.fillStyle = '#fff';
        const eyeOffset = size/5;
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset/2, size/8, 0, Math.PI * 2);
        ctx.arc(x + eyeOffset, y - eyeOffset/2, size/8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(x - eyeOffset, y - eyeOffset/2, size/16, 0, Math.PI * 2);
        ctx.arc(x + eyeOffset, y - eyeOffset/2, size/16, 0, Math.PI * 2);
        ctx.fill();
        
        // Status indicator
        if (pokemon.status) {
            ctx.fillStyle = this.getStatusColor(pokemon.status);
            ctx.fillRect(x - size/2 - 5, y - size/2, 8, 8);
        }
        
        // Name and level
        ctx.fillStyle = '#fff';
        ctx.font = '16px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${pokemon.getName()} Lv${pokemon.level}`, x, y - size/2 - 15);
        ctx.textAlign = 'left';
    }
    
    getStatusColor(status) {
        const colors = {
            poison: '#a040a0',
            burn: '#f08030',
            paralyze: '#f8d030',
            sleep: '#888888',
            freeze: '#98d8d8'
        };
        return colors[status] || '#fff';
    }
    
    drawHPBar(ctx, pokemon, x, y, width, isEnemy) {
        const height = 12;
        
        // Background
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, width, height);
        
        // HP bar
        const hpPercent = pokemon.currentHp / pokemon.maxHp;
        let hpColor = '#20c020';
        if (hpPercent < 0.5) hpColor = '#f0e020';
        if (hpPercent < 0.2) hpColor = '#f02020';
        
        ctx.fillStyle = hpColor;
        ctx.fillRect(x + 2, y + 2, Math.max(0, (width - 4) * hpPercent), height - 4);
        
        // HP text
        ctx.fillStyle = '#fff';
        ctx.font = '12px "Courier New", monospace';
        if (!isEnemy) {
            ctx.fillText(`${pokemon.currentHp}/${pokemon.maxHp}`, x, y - 5);
        }
    }
    
    drawCommandBox(ctx, width, height) {
        // Main command box
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.fillRect(20, height - 140, width - 40, 120);
        ctx.strokeRect(20, height - 140, width - 40, 120);
        
        switch (this.battleState) {
            case 'menu':
                this.drawMainMenu(ctx, width, height);
                break;
            case 'fight':
                this.drawFightMenu(ctx, width, height);
                break;
            case 'message':
                this.drawMessage(ctx, width, height);
                break;
            case 'item':
                this.drawItemMenu(ctx, width, height);
                break;
            case 'switch':
                this.drawSwitchMenu(ctx, width, height);
                break;
            default:
                this.drawMessage(ctx, width, height);
        }
    }
    
    drawMainMenu(ctx, width, height) {
        const menuX = width - 180;
        const menuY = height - 130;
        
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.fillRect(menuX, menuY, 140, 100);
        ctx.strokeRect(menuX, menuY, 140, 100);
        
        const options = [['FIGHT', 'BAG'], ['POKéMON', 'RUN']];
        ctx.font = '16px "Courier New", monospace';
        ctx.fillStyle = '#000';
        
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 2; col++) {
                const x = menuX + 10 + col * 65;
                const y = menuY + 25 + row * 40;
                
                // Highlight selected
                if (this.menuSelection.row === row && this.menuSelection.col === col) {
                    ctx.fillStyle = '#4060a0';
                    ctx.fillRect(x - 5, y - 15, 60, 25);
                    ctx.fillStyle = '#fff';
                } else {
                    ctx.fillStyle = '#000';
                }
                
                ctx.fillText(options[row][col], x, y);
            }
        }
        
        // Message area
        ctx.fillStyle = '#000';
        ctx.font = '18px "Courier New", monospace';
        ctx.fillText('What will', 40, height - 100);
        ctx.fillText(`${this.playerActive?.getName()} do?`, 40, height - 75);
    }
    
    drawFightMenu(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = '16px "Courier New", monospace';
        
        // Draw moves in 2x2 grid
        for (let i = 0; i < 4; i++) {
            const row = Math.floor(i / 2);
            const col = i % 2;
            const x = 40 + col * 280;
            const y = height - 110 + row * 40;
            
            if (i < this.playerActive.moves.length) {
                const move = this.playerActive.moves[i];
                const moveData = getMove(move.id);
                
                // Highlight
                if (this.moveSelection === i) {
                    ctx.fillStyle = '#4060a0';
                    ctx.fillRect(x - 5, y - 15, 250, 30);
                    ctx.fillStyle = '#fff';
                } else {
                    ctx.fillStyle = move.pp === 0 ? '#888' : '#000';
                }
                
                ctx.fillText(`${moveData.name}`, x, y);
                ctx.fillText(`PP ${move.pp}/${move.maxPp}`, x + 160, y);
            }
        }
        
        // Show move info for selected
        const selectedMove = this.playerActive.moves[this.moveSelection];
        if (selectedMove) {
            const moveData = getMove(selectedMove.id);
            ctx.fillStyle = '#666';
            ctx.font = '14px "Courier New", monospace';
            ctx.fillText(`Type: ${moveData.type.toUpperCase()} | Power: ${moveData.power || '-'} | Acc: ${moveData.accuracy}%`, 40, height - 45);
        }
    }
    
    drawMessage(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = '18px "Courier New", monospace';
        
        // Wrap text if needed
        const maxWidth = width - 60;
        const words = this.message.split(' ');
        let line = '';
        let y = height - 100;
        
        for (const word of words) {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line, 40, y);
                line = word + ' ';
                y += 25;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, 40, y);
        
        // Continue indicator
        ctx.fillStyle = '#4060a0';
        ctx.beginPath();
        ctx.moveTo(width - 50, height - 50);
        ctx.lineTo(width - 40, height - 40);
        ctx.lineTo(width - 50, height - 30);
        ctx.fill();
    }
    
    drawItemMenu(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = '16px "Courier New", monospace';
        ctx.fillText('Items:', 40, height - 110);
        ctx.fillText('[Items not yet implemented in UI]', 40, height - 80);
        ctx.fillText('Press X to go back', 40, height - 50);
    }
    
    drawSwitchMenu(ctx, width, height) {
        ctx.fillStyle = '#000';
        ctx.font = '16px "Courier New", monospace';
        ctx.fillText('Switch to:', 40, height - 110);
        
        for (let i = 0; i < this.playerParty.length; i++) {
            const p = this.playerParty[i];
            const y = height - 85 + i * 25;
            
            if (i === this.partySelection) {
                ctx.fillStyle = '#4060a0';
                ctx.fillRect(35, y - 15, 200, 22);
                ctx.fillStyle = '#fff';
            } else {
                ctx.fillStyle = p.isFainted ? '#888' : '#000';
            }
            
            const status = p.status ? `[${p.status.toUpperCase()[0]}]` : '';
            const fainted = p.isFainted ? ' [FAINTED]' : '';
            ctx.fillText(`${p.getName()} Lv${p.level} ${status}${fainted}`, 40, y);
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BattleSystem };
}
