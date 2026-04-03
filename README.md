# Pokémon Red Clone

[![Play on GitHub Pages](https://img.shields.io/badge/Play%20Now-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://dannifaze-code.github.io/pokemon-red-clone/)

A browser-based clone of the classic Pokémon Red game, built with vanilla JavaScript and HTML5 Canvas. No downloads required - play directly in your browser!

![Game Preview](assets/preview.png)

## Features

- **Explore** a Pallet Town-inspired overworld
- **Battle System** with wild Pokémon encounters in tall grass
- **Animated Sprites** with retro Game Boy-style graphics
- **Classic UI** with dialog boxes and menus
- **Keyboard Controls** - Arrow keys to move, Z to interact, X for menu

## Play Now

### Option 1: Play on GitHub Pages (Recommended)
Click the **"Play Now"** button above or visit: **https://dannifaze-code.github.io/pokemon-red-clone/**

### Option 2: Play Locally in Windsurf
1. Open this project in Windsurf
2. Start a local server:
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   # or
   php -S localhost:8080
   ```
3. Open `http://localhost:8080` in your browser

### Option 3: Open Directly
Simply open `index.html` in your web browser (some features may be limited due to browser security restrictions).

## Controls

| Key | Action |
|-----|--------|
| ↑ ↓ ← → | Move character |
| Z / Space | Interact / Confirm |
| X | Open/Close Menu / Cancel |

## Technical Details

- **No frameworks** - Pure vanilla JavaScript
- **HTML5 Canvas** for rendering
- **Modular architecture** with separate classes for:
  - `Game` - Main game loop and state management
  - `Player` - Character movement and rendering
  - `GameMap` - World generation and tile rendering
  - `BattleSystem` - Turn-based battle mechanics

## Project Structure

```
pokemon-red-clone/
├── index.html          # Main entry point
├── styles.css          # Styling and CRT effects
├── js/
│   ├── game.js         # Core game engine
│   ├── player.js       # Player character logic
│   ├── map.js          # Map generation and rendering
│   ├── battle.js       # Battle system
│   └── main.js         # Entry point
└── .github/workflows/
    └── deploy.yml      # GitHub Pages auto-deployment
```

## Future Plans

- [ ] Inventory/Bag system
- [ ] Pokémon party management
- [ ] Save/Load functionality using localStorage
- [ ] More maps (Viridian City, Routes, Gyms)
- [ ] Trainer battles
- [ ] More Pokémon species
- [ ] Sound effects and music
- [ ] Mobile touch controls

## Contributing

Feel free to fork this project and submit pull requests. This is a learning project and contributions are welcome!

## License

This is a fan project for educational purposes. Pokémon and all related properties are trademarks of Nintendo, Game Freak, and The Pokémon Company.

---

**Built with ❤️ by dannifaze**
