class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        this.TILE_SIZE = 32;
        this.VIEW_WIDTH = 20;
        this.VIEW_HEIGHT = 18;
        
        this.state = 'world'; // world, battle, dialog, menu
        this.paused = false;
        
        this.colors = {
            grass: '#4a8c4a',
            water: '#4a7aa8',
            path: '#8c7a6b',
            tree: '#2d5a2d',
            building: '#8c6b4a'
        };
        
        this.lastTime = 0;
        this.deltaTime = 0;
    }
    
    init() {
        this.player = new Player(10, 8);
        this.map = new GameMap();
        this.battle = new BattleSystem(this);
        this.saveSystem = new SaveSystem(this);
        
        this.party = [];
        this.inventory = new Inventory();
        this.pcStorage = new PCStorage();
        
        this.playTime = 0;
        this.pokedex = { seen: [], caught: [] };
        this.badges = [];
        this.settings = {
            textSpeed: 'medium',
            battleAnimations: true,
            soundEnabled: true,
            xpShare: false,
            fastForward: false,
            nuzlockeMode: false,
            runningShoes: true
        };
        this.lastHealX = 10;
        this.lastHealY = 8;
        
        this.startNewGame();
        this.setupEventListeners();
        this.gameLoop(0);
    }
    
    startNewGame() {
        const starters = ['BULBASAUR', 'CHARMANDER', 'SQUIRTLE'];
        const choice = Math.floor(Math.random() * 3);
        const starter = new Pokemon(starters[choice], 5);
        this.party.push(starter);
        
        this.inventory.addItem('POTION', 5);
        this.inventory.addItem('POKE_BALL', 5);
        
        this.showDialog(`You received a ${starter.getName()}!`);
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleInput(e));
    }
    
    handleInput(e) {
        if (this.state === 'dialog') {
            if (e.key === 'z' || e.key === ' ' || e.key === 'Enter') {
                this.closeDialog();
            }
            return;
        }
        
        if (this.state === 'menu') {
            this.handleMenuInput(e);
            return;
        }
        
        if (this.state === 'battle') {
            this.battle.handleInput(e.key);
            return;
        }
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                this.player.move(0, -1, this.map);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.player.move(0, 1, this.map);
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.player.move(-1, 0, this.map);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.player.move(1, 0, this.map);
                break;
            case 'z':
            case ' ':
                this.handleInteract();
                break;
            case 'x':
                this.openMenu();
                break;
        }
    }
    
    handleMenuInput(e) {
        const menu = document.getElementById('menu');
        const items = menu.querySelectorAll('li');
        let selected = menu.querySelector('.selected');
        let index = selected ? Array.from(items).indexOf(selected) : -1;
        
        switch(e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (selected) selected.classList.remove('selected');
                index = index > 0 ? index - 1 : items.length - 1;
                items[index].classList.add('selected');
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (selected) selected.classList.remove('selected');
                index = index < items.length - 1 ? index + 1 : 0;
                items[index].classList.add('selected');
                break;
            case 'z':
            case ' ':
            case 'Enter':
                if (selected) {
                    this.executeMenuAction(selected.dataset.action);
                }
                break;
            case 'x':
                this.closeMenu();
                break;
        }
    }
    
    openMenu() {
        this.state = 'menu';
        const menu = document.getElementById('menu');
        menu.classList.remove('hidden');
        const items = menu.querySelectorAll('li');
        items.forEach(item => item.classList.remove('selected'));
        items[0].classList.add('selected');
    }
    
    closeMenu() {
        this.state = 'world';
        document.getElementById('menu').classList.add('hidden');
    }
    
    executeMenuAction(action) {
        switch(action) {
            case 'pokemon':
                this.showPokemonMenu();
                break;
            case 'bag':
                this.showBagMenu();
                break;
            case 'save':
                this.saveGame();
                this.closeMenu();
                break;
            case 'exit':
                this.closeMenu();
                break;
            default:
                this.showDialog(`${action.toUpperCase()} is not implemented yet!`);
                this.closeMenu();
                break;
        }
    }
    
    showPokemonMenu() {
        let text = 'Your Pokemon:\n';
        for (let i = 0; i < this.party.length; i++) {
            const p = this.party[i];
            text += `${i + 1}. ${p.getName()} Lv${p.level} (${p.currentHp}/${p.maxHp} HP)`;
            if (p.status) text += ` [${p.status.toUpperCase()}]`;
            if (p.isFainted) text += ' [FAINTED]';
            text += '\n';
        }
        this.showDialog(text);
        this.closeMenu();
    }
    
    showBagMenu() {
        let text = 'Your Bag:\n';
        text += `Money: $${this.inventory.money}\n\n`;
        
        const pockets = this.inventory.pockets;
        for (const [cat, items] of Object.entries(pockets)) {
            const entries = Object.entries(items);
            if (entries.length > 0) {
                text += cat.toUpperCase() + ':\n';
                for (const [id, count] of entries) {
                    const item = ITEM_DATABASE[id];
                    text += `  ${item?.name || id} x${count}\n`;
                }
                text += '\n';
            }
        }
        
        this.showDialog(text || 'Bag is empty.');
        this.closeMenu();
    }
    
    saveGame() {
        const result = this.saveSystem.save(true);
        this.showDialog(result.success ? 'Game saved!' : 'Failed to save.');
    }
    
    handleInteract() {
        const facingX = this.player.x + this.player.direction.x;
        const facingY = this.player.y + this.player.direction.y;
        
        const tile = this.map.getTile(facingX, facingY);
        if (tile === 'npc') {
            this.showDialog('Trainer: Hello! This is a work in progress!');
        } else if (tile === 'sign') {
            this.showDialog('Welcome to Pallet Town!\nThe journey begins here.');
        } else if (tile === 'grass') {
            if (Math.random() < 0.3) {
                this.startBattle();
            }
        }
    }
    
    showDialog(text) {
        this.state = 'dialog';
        const dialogBox = document.getElementById('dialog-box');
        const dialogText = document.getElementById('dialog-text');
        dialogText.textContent = text;
        dialogBox.classList.remove('hidden');
    }
    
    closeDialog() {
        this.state = 'world';
        document.getElementById('dialog-box').classList.add('hidden');
    }
    
    startBattle() {
        const encounters = ['PIDGEY', 'RATTATA', 'CATERPIE'];
        const species = encounters[Math.floor(Math.random() * encounters.length)];
        this.state = 'battle';
        this.battle.startWildBattle(species);
    }
    
    gameLoop(timestamp) {
        this.deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.update();
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }
    
    update() {
        if (this.state === 'world' && !this.paused) {
            this.map.update();
            this.player.update(this.deltaTime);
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Calculate camera offset
        const cameraX = Math.max(0, Math.min(
            this.map.width * this.TILE_SIZE - this.canvas.width,
            this.player.x * this.TILE_SIZE - this.canvas.width / 2 + this.TILE_SIZE / 2
        ));
        const cameraY = Math.max(0, Math.min(
            this.map.height * this.TILE_SIZE - this.canvas.height,
            this.player.y * this.TILE_SIZE - this.canvas.height / 2 + this.TILE_SIZE / 2
        ));
        
        this.ctx.save();
        this.ctx.translate(-cameraX, -cameraY);
        
        // Render map
        this.map.render(this.ctx, cameraX, cameraY, this.canvas.width, this.canvas.height);
        
        // Render player
        this.player.render(this.ctx);
        
        this.ctx.restore();
        
        // Render battle if active
        if (this.state === 'battle') {
            this.battle.render(this.ctx);
        }
    }
}
