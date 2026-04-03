// ============================================
// SAVE SYSTEM - Auto-save, manual save, load
// ============================================

const SAVE_VERSION = '1.0';
const SAVE_KEY = 'pokemonRedClone_save';
const SETTINGS_KEY = 'pokemonRedClone_settings';

class SaveSystem {
    constructor(game) {
        this.game = game;
        this.autoSaveEnabled = true;
        this.autoSaveInterval = 30000; // 30 seconds
        this.lastSaveTime = 0;
        this.saveCount = 0;
        
        // Load settings
        this.loadSettings();
    }
    
    // Generate save data
    generateSaveData() {
        return {
            version: SAVE_VERSION,
            timestamp: Date.now(),
            playTime: this.game.playTime || 0,
            
            // Player data
            player: {
                x: this.game.player.x,
                y: this.game.player.y,
                direction: this.game.player.direction,
                badges: this.game.player.badges || [],
                name: this.game.player.name || 'RED'
            },
            
            // Party Pokemon
            party: this.game.party?.map(p => p.serialize()) || [],
            
            // Inventory
            inventory: this.game.inventory?.serialize() || null,
            
            // PC Storage
            pcStorage: this.game.pcStorage?.serialize() || null,
            
            // Progress tracking
            pokedex: this.game.pokedex || { seen: [], caught: [] },
            defeatedTrainers: this.game.defeatedTrainers || [],
            storyProgress: this.game.storyProgress || 0,
            
            // Game settings
            settings: {
                textSpeed: this.game.settings?.textSpeed || 'medium',
                battleAnimations: this.game.settings?.battleAnimations !== false,
                soundEnabled: this.game.settings?.soundEnabled !== false,
                xpShare: this.game.settings?.xpShare || false,
                fastForward: this.game.settings?.fastForward || false,
                nuzlockeMode: this.game.settings?.nuzlockeMode || false
            },
            
            // Map state
            currentMap: this.game.currentMap || 'pallet_town',
            mapStates: this.game.mapStates || {}
        };
    }
    
    // Save to localStorage
    save(manual = false) {
        try {
            const saveData = this.generateSaveData();
            const saveString = JSON.stringify(saveData);
            
            // Compress (basic approach - in production use proper compression)
            localStorage.setItem(SAVE_KEY, saveString);
            
            this.lastSaveTime = Date.now();
            this.saveCount++;
            
            console.log(`Game ${manual ? 'manually' : 'auto'} saved! (#${this.saveCount})`);
            return { success: true, timestamp: this.lastSaveTime };
        } catch (error) {
            console.error('Save failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Load from localStorage
    load() {
        try {
            const saveString = localStorage.getItem(SAVE_KEY);
            if (!saveString) {
                return { success: false, error: 'No save data found' };
            }
            
            const saveData = JSON.parse(saveString);
            
            // Version check
            if (saveData.version !== SAVE_VERSION) {
                console.warn(`Save version mismatch: ${saveData.version} vs ${SAVE_VERSION}`);
                // Attempt migration or reject
                if (!this.migrateSave(saveData)) {
                    return { success: false, error: 'Save version incompatible' };
                }
            }
            
            return { success: true, data: saveData };
        } catch (error) {
            console.error('Load failed:', error);
            return { success: false, error: error.message };
        }
    }
    
    // Apply loaded data to game
    applySaveData(saveData) {
        if (!saveData) return false;
        
        // Player position
        if (saveData.player && this.game.player) {
            this.game.player.x = saveData.player.x;
            this.game.player.y = saveData.player.y;
            this.game.player.direction = saveData.player.direction;
            this.game.player.badges = saveData.player.badges || [];
            this.game.player.name = saveData.player.name;
        }
        
        // Party
        if (saveData.party) {
            this.game.party = saveData.party.map(p => Pokemon.deserialize(p));
        }
        
        // Inventory
        if (saveData.inventory) {
            this.game.inventory = new Inventory(saveData.inventory);
        }
        
        // PC Storage
        if (saveData.pcStorage) {
            this.game.pcStorage = PCStorage.deserialize(saveData.pcStorage);
        }
        
        // Progress
        this.game.pokedex = saveData.pokedex || { seen: [], caught: [] };
        this.game.defeatedTrainers = saveData.defeatedTrainers || [];
        this.game.storyProgress = saveData.storyProgress || 0;
        this.game.playTime = saveData.playTime || 0;
        this.game.currentMap = saveData.currentMap || 'pallet_town';
        this.game.mapStates = saveData.mapStates || {};
        
        // Settings
        if (saveData.settings) {
            this.game.settings = { ...this.game.settings, ...saveData.settings };
        }
        
        return true;
    }
    
    // Check if save exists
    hasSave() {
        return localStorage.getItem(SAVE_KEY) !== null;
    }
    
    // Delete save
    deleteSave() {
        localStorage.removeItem(SAVE_KEY);
        return { success: true };
    }
    
    // Auto-save check
    checkAutoSave() {
        if (!this.autoSaveEnabled) return;
        
        const now = Date.now();
        if (now - this.lastSaveTime >= this.autoSaveInterval) {
            this.save(false);
        }
    }
    
    // Enable/disable auto-save
    setAutoSave(enabled) {
        this.autoSaveEnabled = enabled;
        this.saveSettings();
    }
    
    // Save settings separately
    saveSettings() {
        const settings = {
            autoSaveEnabled: this.autoSaveEnabled,
            autoSaveInterval: this.autoSaveInterval,
            lastSaveTime: this.lastSaveTime
        };
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
    
    // Load settings
    loadSettings() {
        try {
            const settingsString = localStorage.getItem(SETTINGS_KEY);
            if (settingsString) {
                const settings = JSON.parse(settingsString);
                this.autoSaveEnabled = settings.autoSaveEnabled ?? true;
                this.autoSaveInterval = settings.autoSaveInterval || 30000;
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }
    
    // Get save info for display
    getSaveInfo() {
        const saveString = localStorage.getItem(SAVE_KEY);
        if (!saveString) return null;
        
        try {
            const saveData = JSON.parse(saveString);
            return {
                exists: true,
                timestamp: saveData.timestamp,
                playTime: saveData.playTime,
                playerName: saveData.player?.name,
                partySize: saveData.party?.length || 0,
                badges: saveData.player?.badges?.length || 0,
                pokedexCount: saveData.pokedex?.caught?.length || 0,
                version: saveData.version
            };
        } catch {
            return null;
        }
    }
    
    // Export save to file (for backup/sharing)
    exportSave() {
        const saveData = localStorage.getItem(SAVE_KEY);
        if (!saveData) return { success: false, error: 'No save to export' };
        
        const blob = new Blob([saveData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pokemon-red-clone-save-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        return { success: true };
    }
    
    // Import save from file
    async importSave(file) {
        try {
            const text = await file.text();
            const saveData = JSON.parse(text);
            
            if (saveData.version !== SAVE_VERSION) {
                return { success: false, error: 'Incompatible save version' };
            }
            
            localStorage.setItem(SAVE_KEY, text);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Migration for older saves
    migrateSave(oldSave) {
        // Implement version migrations here
        // For now, just reject old saves
        return false;
    }
    
    // Quick save slot (for save states)
    quickSave(slot = 0) {
        const saveData = this.generateSaveData();
        localStorage.setItem(`${SAVE_KEY}_quick_${slot}`, JSON.stringify(saveData));
        return { success: true };
    }
    
    // Quick load
    quickLoad(slot = 0) {
        const saveString = localStorage.getItem(`${SAVE_KEY}_quick_${slot}`);
        if (!saveString) return { success: false, error: 'No quick save' };
        
        try {
            const saveData = JSON.parse(saveString);
            this.applySaveData(saveData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SaveSystem, SAVE_VERSION };
}
