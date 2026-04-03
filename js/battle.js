class BattleSystem {
    constructor(game) {
        this.game = game;
        this.active = false;
        this.playerPokemon = null;
        this.enemyPokemon = null;
        this.turn = 0;
        
        this.pokemonData = {
            bulbasaur: {
                name: 'BULBASAUR',
                type: 'grass',
                level: 5,
                hp: 20,
                maxHp: 20,
                attack: 11,
                defense: 11,
                moves: ['TACKLE', 'GROWL']
            },
            charmander: {
                name: 'CHARMANDER',
                type: 'fire',
                level: 5,
                hp: 19,
                maxHp: 19,
                attack: 12,
                defense: 10,
                moves: ['SCRATCH', 'GROWL']
            },
            squirtle: {
                name: 'SQUIRTLE',
                type: 'water',
                level: 5,
                hp: 20,
                maxHp: 20,
                attack: 11,
                defense: 12,
                moves: ['TACKLE', 'TAIL WHIP']
            },
            pidgey: {
                name: 'PIDGEY',
                type: 'normal',
                level: 3,
                hp: 15,
                maxHp: 15,
                attack: 8,
                defense: 7,
                moves: ['GUST', 'SAND ATTACK']
            },
            rattata: {
                name: 'RATTATA',
                type: 'normal',
                level: 3,
                hp: 14,
                maxHp: 14,
                attack: 9,
                defense: 6,
                moves: ['TACKLE', 'TAIL WHIP']
            },
            caterpie: {
                name: 'CATERPIE',
                type: 'bug',
                level: 3,
                hp: 16,
                maxHp: 16,
                attack: 7,
                defense: 8,
                moves: ['TACKLE', 'STRING SHOT']
            }
        };
    }
    
    start() {
        this.active = true;
        
        // Give player a starter
        const starters = ['bulbasaur', 'charmander', 'squirtle'];
        const randomStarter = starters[Math.floor(Math.random() * starters.length)];
        this.playerPokemon = this.createPokemon(randomStarter);
        
        // Random wild Pokemon
        const wild = ['pidgey', 'rattata', 'caterpie'];
        const randomWild = wild[Math.floor(Math.random() * wild.length)];
        this.enemyPokemon = this.createPokemon(randomWild);
        
        this.battleState = 'intro';
        this.message = `Wild ${this.enemyPokemon.name} appeared!`;
        this.turn = 0;
        
        // Auto-end battle after intro for demo
        setTimeout(() => {
            this.end();
        }, 2000);
    }
    
    createPokemon(species) {
        return { ...this.pokemonData[species] };
    }
    
    end() {
        this.active = false;
        this.game.state = 'world';
        this.game.showDialog(`The wild ${this.enemyPokemon.name} ran away!`);
    }
    
    render(ctx) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        
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
        
        // Draw Pokemon (simplified representations)
        if (this.enemyPokemon) {
            this.drawPokemon(ctx, this.enemyPokemon, width * 0.75, height * 0.25, true);
            this.drawHPBar(ctx, this.enemyPokemon, width * 0.55, height * 0.15, 150);
        }
        
        if (this.playerPokemon) {
            this.drawPokemon(ctx, this.playerPokemon, width * 0.25, height * 0.55, false);
            this.drawHPBar(ctx, this.playerPokemon, width * 0.15, height * 0.75, 150);
        }
        
        // Message box
        ctx.fillStyle = '#fff';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.fillRect(20, height - 120, width - 40, 100);
        ctx.strokeRect(20, height - 120, width - 40, 100);
        
        // Message text
        ctx.fillStyle = '#000';
        ctx.font = '20px "Courier New", monospace';
        ctx.fillText(this.message, 40, height - 75);
    }
    
    drawPokemon(ctx, pokemon, x, y, isEnemy) {
        const size = isEnemy ? 64 : 80;
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(x, y + size/2, size/2, size/4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Body color based on type
        const typeColors = {
            grass: '#78c850',
            fire: '#f08030',
            water: '#6890f0',
            normal: '#a8a878',
            bug: '#a8b820'
        };
        
        ctx.fillStyle = typeColors[pokemon.type] || '#888';
        
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
        
        // Name
        ctx.fillStyle = '#fff';
        ctx.font = '16px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(pokemon.name, x, y - size/2 - 10);
        ctx.textAlign = 'left';
    }
    
    drawHPBar(ctx, pokemon, x, y, width) {
        const height = 12;
        
        // Background
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y, width, height);
        
        // HP bar
        const hpPercent = pokemon.hp / pokemon.maxHp;
        let hpColor = '#20c020';
        if (hpPercent < 0.5) hpColor = '#f0e020';
        if (hpPercent < 0.2) hpColor = '#f02020';
        
        ctx.fillStyle = hpColor;
        ctx.fillRect(x + 2, y + 2, (width - 4) * hpPercent, height - 4);
        
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = '12px "Courier New", monospace';
        ctx.fillText(`Lv${pokemon.level}`, x + width + 10, y + 10);
    }
}
