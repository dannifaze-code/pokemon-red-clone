// ============================================
// INVENTORY SYSTEM - Pockets, PC Storage, Items
// ============================================

const ITEM_CATEGORIES = {
    MEDICINE: 'medicine',
    POKEBALL: 'pokeball',
    BATTLE_ITEM: 'battle_item',
    KEY_ITEM: 'key_item',
    TM_HM: 'tm_hm',
    EVOLUTION_STONE: 'evolution_stone',
    CRAFTING: 'crafting'
};

// Item database
const ITEM_DATABASE = {
    // Potions
    POTION: {
        id: 'POTION',
        name: 'Potion',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 300,
        effect: { type: 'heal', amount: 20 },
        description: 'Restores 20 HP to a Pokemon.'
    },
    SUPER_POTION: {
        id: 'SUPER_POTION',
        name: 'Super Potion',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 700,
        effect: { type: 'heal', amount: 50 },
        description: 'Restores 50 HP to a Pokemon.'
    },
    HYPER_POTION: {
        id: 'HYPER_POTION',
        name: 'Hyper Potion',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 1200,
        effect: { type: 'heal', amount: 200 },
        description: 'Restores 200 HP to a Pokemon.'
    },
    MAX_POTION: {
        id: 'MAX_POTION',
        name: 'Max Potion',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 2500,
        effect: { type: 'heal', amount: 'full' },
        description: 'Fully restores HP to a Pokemon.'
    },
    
    // Status healers
    ANTIDOTE: {
        id: 'ANTIDOTE',
        name: 'Antidote',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 100,
        effect: { type: 'cure', status: 'poison' },
        description: 'Cures a poisoned Pokemon.'
    },
    PARALYZ_HEAL: {
        id: 'PARALYZ_HEAL',
        name: 'Paralyze Heal',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 200,
        effect: { type: 'cure', status: 'paralyze' },
        description: 'Cures a paralyzed Pokemon.'
    },
    AWAKENING: {
        id: 'AWAKENING',
        name: 'Awakening',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 250,
        effect: { type: 'cure', status: 'sleep' },
        description: 'Wakes up a sleeping Pokemon.'
    },
    BURN_HEAL: {
        id: 'BURN_HEAL',
        name: 'Burn Heal',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 250,
        effect: { type: 'cure', status: 'burn' },
        description: 'Heals a burned Pokemon.'
    },
    ICE_HEAL: {
        id: 'ICE_HEAL',
        name: 'Ice Heal',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 250,
        effect: { type: 'cure', status: 'freeze' },
        description: 'Defrosts a frozen Pokemon.'
    },
    FULL_HEAL: {
        id: 'FULL_HEAL',
        name: 'Full Heal',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 600,
        effect: { type: 'cure', status: 'all' },
        description: 'Heals all status conditions.'
    },
    
    // Revives
    REVIVE: {
        id: 'REVIVE',
        name: 'Revive',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 1500,
        effect: { type: 'revive', hpPercent: 50 },
        description: 'Revives a fainted Pokemon with half HP.'
    },
    MAX_REVIVE: {
        id: 'MAX_REVIVE',
        name: 'Max Revive',
        category: ITEM_CATEGORIES.MEDICINE,
        price: 4000,
        effect: { type: 'revive', hpPercent: 100 },
        description: 'Revives a fainted Pokemon with full HP.'
    },
    
    // Pokeballs
    POKE_BALL: {
        id: 'POKE_BALL',
        name: 'Poke Ball',
        category: ITEM_CATEGORIES.POKEBALL,
        price: 200,
        catchRate: 1.0,
        description: 'A device for catching wild Pokemon.'
    },
    GREAT_BALL: {
        id: 'GREAT_BALL',
        name: 'Great Ball',
        category: ITEM_CATEGORIES.POKEBALL,
        price: 600,
        catchRate: 1.5,
        description: 'A better ball with higher catch rate.'
    },
    ULTRA_BALL: {
        id: 'ULTRA_BALL',
        name: 'Ultra Ball',
        category: ITEM_CATEGORIES.POKEBALL,
        price: 1200,
        catchRate: 2.0,
        description: 'An ultra-performance ball.'
    },
    MASTER_BALL: {
        id: 'MASTER_BALL',
        name: 'Master Ball',
        category: ITEM_CATEGORIES.POKEBALL,
        price: 0,
        catchRate: 255, // Guaranteed catch
        description: 'The best ball. It never misses.'
    },
    
    // Evolution stones
    FIRE_STONE: {
        id: 'FIRE_STONE',
        name: 'Fire Stone',
        category: ITEM_CATEGORIES.EVOLUTION_STONE,
        price: 2100,
        description: 'Evolves certain Fire-type Pokemon.'
    },
    WATER_STONE: {
        id: 'WATER_STONE',
        name: 'Water Stone',
        category: ITEM_CATEGORIES.EVOLUTION_STONE,
        price: 2100,
        description: 'Evolves certain Water-type Pokemon.'
    },
    THUNDER_STONE: {
        id: 'THUNDER_STONE',
        name: 'Thunder Stone',
        category: ITEM_CATEGORIES.EVOLUTION_STONE,
        price: 2100,
        description: 'Evolves certain Electric-type Pokemon.'
    },
    LEAF_STONE: {
        id: 'LEAF_STONE',
        name: 'Leaf Stone',
        category: ITEM_CATEGORIES.EVOLUTION_STONE,
        price: 2100,
        description: 'Evolves certain Grass-type Pokemon.'
    },
    MOON_STONE: {
        id: 'MOON_STONE',
        name: 'Moon Stone',
        category: ITEM_CATEGORIES.EVOLUTION_STONE,
        price: 2100,
        description: 'Evolves certain Pokemon.'
    },
    
    // Crafting materials (creative feature)
    APRICORN_RED: {
        id: 'APRICORN_RED',
        name: 'Red Apricorn',
        category: ITEM_CATEGORIES.CRAFTING,
        price: 50,
        description: 'A red apricorn. Used to craft Poke Balls.'
    },
    APRICORN_BLU: {
        id: 'APRICORN_BLU',
        name: 'Blue Apricorn',
        category: ITEM_CATEGORIES.CRAFTING,
        price: 50,
        description: 'A blue apricorn. Used to craft Great Balls.'
    },
    APRICORN_BLK: {
        id: 'APRICORN_BLK',
        name: 'Black Apricorn',
        category: ITEM_CATEGORIES.CRAFTING,
        price: 100,
        description: 'A black apricorn. Used to craft Ultra Balls.'
    },
    HERB_MEDICINAL: {
        id: 'HERB_MEDICINAL',
        name: 'Medicinal Herb',
        category: ITEM_CATEGORIES.CRAFTING,
        price: 30,
        description: 'An herb with healing properties.'
    },
    
    // Key items
    POTION_RECIPE: {
        id: 'POTION_RECIPE',
        name: 'Potion Recipe',
        category: ITEM_CATEGORIES.KEY_ITEM,
        price: 0,
        description: 'A recipe for crafting Potions.'
    },
    OLD_ROD: {
        id: 'OLD_ROD',
        name: 'Old Rod',
        category: ITEM_CATEGORIES.KEY_ITEM,
        price: 0,
        description: 'Use it by water to fish for Pokemon.'
    },
    GOOD_ROD: {
        id: 'GOOD_ROD',
        name: 'Good Rod',
        category: ITEM_CATEGORIES.KEY_ITEM,
        price: 0,
        description: 'A better rod for catching Pokemon.'
    },
    SUPER_ROD: {
        id: 'SUPER_ROD',
        name: 'Super Rod',
        category: ITEM_CATEGORIES.KEY_ITEM,
        price: 0,
        description: 'The best rod for fishing.'
    },
    
    // Held items
    LEFTOVERS: {
        id: 'LEFTOVERS',
        name: 'Leftovers',
        category: ITEM_CATEGORIES.BATTLE_ITEM,
        price: 200,
        effect: { type: 'passive_heal', amount: '1/16' },
        description: 'Restores a little HP each turn.'
    },
    ORAN_BERRY: {
        id: 'ORAN_BERRY',
        name: 'Oran Berry',
        category: ITEM_CATEGORIES.BATTLE_ITEM,
        price: 10,
        effect: { type: 'heal_on_low_hp', amount: 10, threshold: 50 },
        description: 'Restores 10 HP when HP drops below 50%.'
    },
    SITRUS_BERRY: {
        id: 'SITRUS_BERRY',
        name: 'Sitrus Berry',
        category: ITEM_CATEGORIES.BATTLE_ITEM,
        price: 50,
        effect: { type: 'heal_on_low_hp', amount: '1/4', threshold: 50 },
        description: 'Restores 25% HP when HP drops below 50%.'
    }
};

// Crafting recipes
const CRAFTING_RECIPES = {
    POTION: {
        result: 'POTION',
        ingredients: { HERB_MEDICINAL: 2 },
        requiresRecipe: true
    },
    SUPER_POTION: {
        result: 'SUPER_POTION',
        ingredients: { HERB_MEDICINAL: 5 },
        requiresRecipe: true
    },
    POKE_BALL: {
        result: 'POKE_BALL',
        ingredients: { APRICORN_RED: 1 },
        requiresRecipe: false
    },
    GREAT_BALL: {
        result: 'GREAT_BALL',
        ingredients: { APRICORN_BLU: 1, APRICORN_RED: 1 },
        requiresRecipe: true
    },
    ULTRA_BALL: {
        result: 'ULTRA_BALL',
        ingredients: { APRICORN_BLK: 2, APRICORN_BLU: 1 },
        requiresRecipe: true
    }
};

class Inventory {
    constructor(savedData = null) {
        // Pockets for organizing items
        this.pockets = {
            [ITEM_CATEGORIES.MEDICINE]: {},
            [ITEM_CATEGORIES.POKEBALL]: {},
            [ITEM_CATEGORIES.BATTLE_ITEM]: {},
            [ITEM_CATEGORIES.KEY_ITEM]: {},
            [ITEM_CATEGORIES.TM_HM]: {},
            [ITEM_CATEGORIES.CRAFTING]: {}
        };
        
        // Money
        this.money = savedData?.money || 3000; // Starting money
        
        // PC Storage - unlimited space
        this.pcStorage = savedData?.pcStorage || {};
        
        // Known recipes
        this.knownRecipes = savedData?.knownRecipes || ['POKE_BALL'];
        
        // Load saved data
        if (savedData?.pockets) {
            this.pockets = savedData.pockets;
        }
    }
    
    // Add item to inventory
    addItem(itemId, quantity = 1) {
        const item = ITEM_DATABASE[itemId];
        if (!item) return false;
        
        const pocket = item.category;
        if (!this.pockets[pocket]) {
            this.pockets[pocket] = {};
        }
        
        if (!this.pockets[pocket][itemId]) {
            this.pockets[pocket][itemId] = 0;
        }
        
        this.pockets[pocket][itemId] += quantity;
        return true;
    }
    
    // Remove item from inventory
    removeItem(itemId, quantity = 1) {
        const item = ITEM_DATABASE[itemId];
        if (!item) return false;
        
        const pocket = item.category;
        if (!this.pockets[pocket]?.[itemId]) return false;
        
        if (this.pockets[pocket][itemId] < quantity) return false;
        
        this.pockets[pocket][itemId] -= quantity;
        if (this.pockets[pocket][itemId] === 0) {
            delete this.pockets[pocket][itemId];
        }
        return true;
    }
    
    // Check if has item
    hasItem(itemId, quantity = 1) {
        const item = ITEM_DATABASE[itemId];
        if (!item) return false;
        
        const pocket = item.category;
        return (this.pockets[pocket]?.[itemId] || 0) >= quantity;
    }
    
    // Get quantity of item
    getItemCount(itemId) {
        const item = ITEM_DATABASE[itemId];
        if (!item) return 0;
        
        const pocket = item.category;
        return this.pockets[pocket]?.[itemId] || 0;
    }
    
    // Get all items in a pocket
    getPocketContents(category) {
        return this.pockets[category] || {};
    }
    
    // Use item on Pokemon
    useItem(itemId, targetPokemon) {
        const item = ITEM_DATABASE[itemId];
        if (!item || !this.hasItem(itemId)) return { success: false, message: 'No item' };
        if (!item.effect) return { success: false, message: 'No effect' };
        
        let result = { success: false, message: '' };
        
        switch (item.effect.type) {
            case 'heal':
                if (targetPokemon.isFainted) {
                    result = { success: false, message: `${targetPokemon.getName()} is fainted!` };
                } else if (targetPokemon.currentHp >= targetPokemon.maxHp) {
                    result = { success: false, message: `${targetPokemon.getName()} is already at full HP!` };
                } else {
                    const healAmount = item.effect.amount === 'full' ? targetPokemon.maxHp : item.effect.amount;
                    const oldHp = targetPokemon.currentHp;
                    targetPokemon.heal(healAmount);
                    this.removeItem(itemId, 1);
                    result = { 
                        success: true, 
                        message: `${targetPokemon.getName()} recovered ${targetPokemon.currentHp - oldHp} HP!`,
                        healed: targetPokemon.currentHp - oldHp
                    };
                }
                break;
                
            case 'cure':
                if (targetPokemon.isFainted) {
                    result = { success: false, message: `${targetPokemon.getName()} is fainted!` };
                } else if (!targetPokemon.status) {
                    result = { success: false, message: `${targetPokemon.getName()} has no status condition!` };
                } else if (item.effect.status === 'all' || targetPokemon.status === item.effect.status) {
                    const oldStatus = targetPokemon.status;
                    targetPokemon.status = null;
                    this.removeItem(itemId, 1);
                    result = { 
                        success: true, 
                        message: `${targetPokemon.getName()} was cured of ${oldStatus}!`
                    };
                } else {
                    result = { success: false, message: `It had no effect...` };
                }
                break;
                
            case 'revive':
                if (!targetPokemon.isFainted) {
                    result = { success: false, message: `${targetPokemon.getName()} isn't fainted!` };
                } else {
                    targetPokemon.isFainted = false;
                    const healAmount = item.effect.hpPercent === 100 ? targetPokemon.maxHp : Math.floor(targetPokemon.maxHp * (item.effect.hpPercent / 100));
                    targetPokemon.currentHp = healAmount;
                    this.removeItem(itemId, 1);
                    result = { 
                        success: true, 
                        message: `${targetPokemon.getName()} was revived with ${healAmount} HP!`
                    };
                }
                break;
        }
        
        return result;
    }
    
    // Craft item
    canCraft(recipeId) {
        const recipe = CRAFTING_RECIPES[recipeId];
        if (!recipe) return false;
        
        if (recipe.requiresRecipe && !this.knownRecipes.includes(recipeId)) {
            return false;
        }
        
        for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
            if (!this.hasItem(ingredient, amount)) {
                return false;
            }
        }
        return true;
    }
    
    craft(recipeId) {
        if (!this.canCraft(recipeId)) {
            return { success: false, message: 'Cannot craft' };
        }
        
        const recipe = CRAFTING_RECIPES[recipeId];
        
        // Consume ingredients
        for (const [ingredient, amount] of Object.entries(recipe.ingredients)) {
            this.removeItem(ingredient, amount);
        }
        
        // Add result
        this.addItem(recipe.result, 1);
        
        return { 
            success: true, 
            message: `Crafted ${ITEM_DATABASE[recipe.result].name}!`,
            item: recipe.result
        };
    }
    
    // Learn recipe
    learnRecipe(recipeId) {
        if (!this.knownRecipes.includes(recipeId)) {
            this.knownRecipes.push(recipeId);
        }
    }
    
    // Get available crafting recipes
    getAvailableRecipes() {
        return Object.keys(CRAFTING_RECIPES).filter(id => this.canCraft(id));
    }
    
    // Add money
    addMoney(amount) {
        this.money += amount;
    }
    
    // Spend money
    spendMoney(amount) {
        if (this.money < amount) return false;
        this.money -= amount;
        return true;
    }
    
    // Serialize for saving
    serialize() {
        return {
            pockets: this.pockets,
            money: this.money,
            pcStorage: this.pcStorage,
            knownRecipes: this.knownRecipes
        };
    }
}

// PC Storage System for Pokemon
class PCStorage {
    constructor(savedData = null) {
        this.boxes = savedData?.boxes || this.createDefaultBoxes();
        this.currentBox = savedData?.currentBox || 0;
    }
    
    createDefaultBoxes() {
        const boxes = [];
        for (let i = 0; i < 12; i++) {
            boxes.push({
                name: `BOX ${i + 1}`,
                pokemon: [],
                capacity: 20
            });
        }
        return boxes;
    }
    
    // Deposit Pokemon
    deposit(pokemon, boxIndex = null) {
        const targetBox = boxIndex !== null ? boxIndex : this.currentBox;
        const box = this.boxes[targetBox];
        
        if (box.pokemon.length >= box.capacity) {
            return { success: false, message: 'Box is full!' };
        }
        
        box.pokemon.push(pokemon);
        return { success: true, message: `Deposited ${pokemon.getName()} in ${box.name}` };
    }
    
    // Withdraw Pokemon
    withdraw(index, boxIndex = null) {
        const targetBox = boxIndex !== null ? boxIndex : this.currentBox;
        const box = this.boxes[targetBox];
        
        if (index < 0 || index >= box.pokemon.length) {
            return { success: false, message: 'Invalid index' };
        }
        
        const pokemon = box.pokemon.splice(index, 1)[0];
        return { success: true, pokemon, message: `Withdrew ${pokemon.getName()}` };
    }
    
    // Get all Pokemon in a box
    getBoxContents(boxIndex = null) {
        const targetBox = boxIndex !== null ? boxIndex : this.currentBox;
        return this.boxes[targetBox]?.pokemon || [];
    }
    
    // Get count of all stored Pokemon
    getTotalStored() {
        return this.boxes.reduce((total, box) => total + box.pokemon.length, 0);
    }
    
    // Change current box
    switchBox(newBoxIndex) {
        if (newBoxIndex >= 0 && newBoxIndex < this.boxes.length) {
            this.currentBox = newBoxIndex;
            return { success: true, message: `Switched to ${this.boxes[newBoxIndex].name}` };
        }
        return { success: false, message: 'Invalid box' };
    }
    
    // Serialize
    serialize() {
        return {
            boxes: this.boxes.map(box => ({
                name: box.name,
                pokemon: box.pokemon.map(p => p.serialize()),
                capacity: box.capacity
            })),
            currentBox: this.currentBox
        };
    }
    
    // Deserialize
    static deserialize(data) {
        const storage = new PCStorage();
        storage.currentBox = data.currentBox;
        storage.boxes = data.boxes.map(box => ({
            name: box.name,
            pokemon: box.pokemon.map(p => Pokemon.deserialize(p)),
            capacity: box.capacity
        }));
        return storage;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Inventory, PCStorage, ITEM_DATABASE, ITEM_CATEGORIES, CRAFTING_RECIPES };
}
