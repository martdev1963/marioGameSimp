# Mario Game - Complete Code Documentation

This document provides comprehensive line-by-line documentation for the Mario game codebase, including all JavaScript functions, game logic, and CSS classes.

---

## Table of Contents

1. [Game Constants](#game-constants)
2. [Game State Variables](#game-state-variables)
3. [Game Objects Arrays](#game-objects-arrays)
4. [Level Definitions](#level-definitions)
5. [Function Definitions](#function-definitions)
6. [Event Listeners](#event-listeners)
7. [Game Loop](#game-loop)
8. [CSS Classes](#css-classes)

---

## Game Constants

### Lines 1-13: Game Constants

```javascript
const GRAVITY = 0.5; // Acceleration due to gravity (m/s^2)
```
- **Purpose**: Defines the downward acceleration applied to the player and falling objects each frame
- **Value**: 0.5 pixels per frame squared
- **Usage**: Applied to `player.velocityY` when the player is not grounded, creating realistic falling motion

```javascript
const JUMP_FORCE = -12; // Initial jump velocity (m/s)
```
- **Purpose**: Defines the initial upward velocity when the player jumps
- **Value**: -12 pixels per frame (negative because Y increases downward)
- **Usage**: Sets `player.velocityY` when Space key is pressed and player is grounded

```javascript
const MOVE_SPEED = 2.5; // Horizontal speed of the player (m/s)
```
- **Purpose**: Defines the horizontal movement speed of the player
- **Value**: 2.5 pixels per frame
- **Usage**: Sets `player.velocityX` when ArrowLeft/ArrowRight or A/D keys are pressed

```javascript
const ENEMY_SPEED = 1; // Speed of enemy movement (m/s)
```
- **Purpose**: Defines the horizontal movement speed of enemies
- **Value**: 1 pixel per frame
- **Usage**: Multiplied by enemy direction to calculate enemy movement each frame

---

## Game State Variables

### Lines 21-30: Game State Object

```javascript
let gameState = {
    score: 0, // Player's score
    level: 1, // Current game level
    lives: 3, // Player's remaining lives
    gameRunning: true, // Is the game currently running?
    keys: { // Object to track key presses
    }
}
```
- **Purpose**: Central object storing all game state information
- **Properties**:
  - `score`: Accumulated points from collecting coins, mushrooms, and defeating enemies
  - `level`: Current level number (1-indexed)
  - `lives`: Number of remaining lives (game over when reaches 0)
  - `gameRunning`: Boolean flag to control game loop execution
  - `keys`: Object mapping key codes to boolean pressed states (e.g., `{'ArrowLeft': true}`)

### Lines 32-46: Player Object

```javascript
let player = {
    element: document.getElementById('mario'), // Player DOM element
    x: 50, // Player's x position
    y: 340, // Player's y position
    width: 20, // Player's width
    height: 20, // Player's height
    velocityX: 0, // Player's horizontal velocity
    velocityY: 0, // Player's vertical velocity
    grounded: false, // Is the player on the ground?
    big: false, // Is the player in "big" state?
    bigTimer: 0, // Timer for "big" state duration
    invincible: false, // Is the player invincible (after taking damage)?
    invincibleTimer: 0 // Timer for invincibility duration
}
```
- **Purpose**: Stores all player-related state and properties
- **Properties**:
  - `element`: Reference to the DOM element representing Mario
  - `x`, `y`: Player's position coordinates (top-left corner)
  - `width`, `height`: Player's collision box dimensions
  - `velocityX`, `velocityY`: Current velocity in pixels per frame
  - `grounded`: Boolean indicating if player is standing on a platform
  - `big`: Boolean indicating if player is in enlarged state (from mushroom)
  - `bigTimer`: Frame counter for big state duration (600 frames = 10 seconds at 60 FPS)
  - `invincible`: Boolean indicating temporary invincibility after taking damage
  - `invincibleTimer`: Frame counter for invincibility duration (120 frames = 2 seconds)

---

## Game Objects Arrays

### Lines 54-61: Game Objects Container

```javascript
let gameObjects = {
    platforms: [], // Array to hold platform objects
    enemies: [], // Array to hold enemy objects
    coins: [], // Array to hold coin objects
    surpriseBlocks: [], // Array to hold surprise block objects
    pipes: [], // Array to hold pipe objects
    mushrooms: [] // Array to hold mushroom items spawned from blocks
}
```
- **Purpose**: Container for all dynamic game objects created during level loading
- **Structure**: Each array contains objects with properties like `element`, `x`, `y`, `width`, `height`, and type-specific properties
- **Usage**: Used for collision detection, rendering, and game logic updates

---

## Level Definitions

### Lines 71-138: Levels Array

The `levels` array contains level configuration objects. Each level defines:

#### Level Structure:
```javascript
{
    platforms: [...], // Array of platform definitions
    enemies: [...], // Array of enemy definitions
    coins: [...], // Array of coin definitions
    surpriseBlocks: [...], // Array of surprise block definitions
    pipes: [...] // Array of pipe definitions
}
```

#### Platform Definition:
```javascript
{ x: 0, y: 360, width: 400, height: 40, type: 'ground' }
```
- `x`, `y`: Position coordinates (top-left corner)
- `width`, `height`: Platform dimensions in pixels
- `type`: Platform type ('ground', 'floating', 'blue') - determines CSS class and appearance

#### Enemy Definition:
```javascript
{ x: 250, y: 314, type: 'brown' }
```
- `x`, `y`: Position coordinates (y calculated as platform.y - enemy.height to sit on platform)
- `type`: Enemy type ('brown', 'purple', 'spider') - determines CSS class and appearance

#### Coin Definition:
```javascript
{ x: 220, y: 260 }
```
- `x`, `y`: Position coordinates where coin appears

#### Surprise Block Definition:
```javascript
{ x: 320, y: 120, type: 'mushroom' }
```
- `x`, `y`: Position coordinates
- `type`: Item type ('mushroom', 'coin') - determines what spawns when hit

#### Pipe Definition:
```javascript
{ x: 750, y: 320 }
```
- `x`, `y`: Position coordinates (top-left corner of pipe)

---

## Function Definitions

### Lines 155-168: initGame()

```javascript
function initGame() {
    loadLevel(gameState.level -1); // Load the first level which is at index 0
    gameLoop();
    
    // Start background music
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.volume = 0.1; // Set volume to 10%
        backgroundMusic.play().catch(error => {
            // Handle autoplay restrictions - music will start on user interaction
            console.log('Background music will start on user interaction:', error);
        });
    }
}
```
- **Purpose**: Initializes the game on startup
- **Steps**:
  1. Loads the first level (index 0, level 1)
  2. Starts the game loop
  3. Attempts to start background music (may fail due to browser autoplay restrictions)

### Lines 192-345: loadLevel(levelIndex)

```javascript
function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {
        showGameOver(true) // Player has completed all levels    
        return // Exit if level index is out of bounds
    }    
    
    // Clear existing game objects
    clearLevel() // Implement this function to remove existing game objects from the DOM and reset arrays
    
    const level = levels[levelIndex]; // individual level object from levels array
    const gameArea = document.getElementById('game-area');  // Assuming there's a div with id 'game-area' to hold game elements
    
    // reset player object properties
    player.x = 50;
    player.y = 340;
    player.velocityX = 0;
    player.velocityY = 0;
    player.big = false;
    player.bigTimer = 0;
    player.invincible = false;
    player.invincibleTimer = 0;
    player.element.className = ''; // reset player class
    
    //function call below to update player position in DOM
    updateElementPosition(player.element, player.x, player.y) // this function updates the player's DOM element position based on player.x and player.y
```
- **Purpose**: Loads a level by creating all game objects from level data
- **Parameters**: `levelIndex` - Zero-based index of level to load
- **Process**:
  1. Checks if level exists, shows win screen if all levels completed
  2. Clears previous level objects
  3. Resets player to starting position and state
  4. Creates platforms, enemies, coins, surprise blocks, and pipes from level data

#### Platform Creation (Lines 229-246):
```javascript
level.platforms.forEach((platformData, index) => {
    const platform = myCreateElement('div', `platform ${platformData.type}`, {
        left: platformData.x + 'px',
        top: platformData.y + 'px',
        width: platformData.width + 'px',
        height: platformData.height + 'px'
    })
    gameArea.appendChild(platform);
    gameObjects.platforms.push({
        element: platform,
        x: platformData.x,
        y: platformData.y,
        width: platformData.width,
        height: platformData.height,
        type: platformData.type,
        id: 'platform-' + index
    });
});
```
- Creates a div element with classes `platform` and the platform type
- Sets position and size via inline styles
- Appends to game area and adds to `gameObjects.platforms` array

#### Enemy Creation (Lines 250-268):
```javascript
level.enemies.forEach((enemyData, index) => {
    const enemy = myCreateElement('div', `enemy ${enemyData.type}`, {
        left: enemyData.x + 'px',       
        top: enemyData.y + 'px'
    });
    enemy.textContent = '';
    gameArea.appendChild(enemy);
    gameObjects.enemies.push({
        element: enemy, 
        x: enemyData.x,
        y: enemyData.y,
        width: 50, // assuming fixed width for enemies
        height: 50, // assuming fixed height for enemies
        direction: -1, // 1 for right, -1 for left
        speed: ENEMY_SPEED,
        id: 'enemy-' + index,
        alive: true
    });
});
```
- Creates enemy div with type-specific class
- Initializes with `direction: -1` (left), `alive: true`
- Fixed dimensions: 50x50 pixels

#### Coin Creation (Lines 271-287):
```javascript
level.coins.forEach((coinData, index) => {
    const coin = myCreateElement('div', 'coin', {
        left: coinData.x + 'px',       
        top: coinData.y + 'px' 
    });
    coin.textContent = '';
    gameArea.appendChild(coin);
    gameObjects.coins.push({
        element: coin, 
        x: coinData.x,
        y: coinData.y,
        width: 20,
        height: 20,            
        collected: false,
        id: 'coin-' + index
    });
});
```
- Creates coin div with `coin` class
- Initializes with `collected: false`
- Fixed dimensions: 20x20 pixels

#### Surprise Block Creation (Lines 290-308):
```javascript
level.surpriseBlocks.forEach((blockData, index) => {
    const block = myCreateElement('div', `surprise-block ${blockData.type}`, {
        left: blockData.x + 'px',
        top: blockData.y + 'px' 
    });
    block.textContent = '';
    gameArea.appendChild(block);
    gameObjects.surpriseBlocks.push({
        element: block, 
        x: blockData.x,
        y: blockData.y,
        width: 20,
        height: 20,
        type: blockData.type,
        hit: false,
        id: 'surprise-block-' + index
    });
});
```
- Creates surprise block div with type-specific class
- Initializes with `hit: false` (not yet activated)
- Fixed dimensions: 20x20 pixels

#### Pipe Creation (Lines 311-342):
```javascript
level.pipes.forEach((pipeData, index) => {
    const pipe = myCreateElement('div', 'pipe', {
        left: pipeData.x + 'px',    
        top: pipeData.y + 'px' 
    });
    
    // pipe parts (associated object versions of the respective html elements)   
    const pipeTopLeft = myCreateElement('div', 'pipe-top');
    const pipeTopRight = myCreateElement('div', 'pipe-top-right');
    const pipeBottomLeft = myCreateElement('div', 'pipe-bottom');
    const pipeBottomRight = myCreateElement('div', 'pipe-bottom-right');
    
    // Append pipe parts to pipe element
    pipe.appendChild(pipeTopLeft);
    pipe.appendChild(pipeTopRight);
    pipe.appendChild(pipeBottomLeft);
    pipe.appendChild(pipeBottomRight);  
    
    gameArea.appendChild(pipe); 
    gameObjects.pipes.push({
        element: pipe, 
        x: pipeData.x,
        y: pipeData.y,  
        width: 40,
        height: 40,
        id: 'pipe-' + index
    });
});
```
- Creates pipe container with four child divs for visual parts
- Fixed dimensions: 40x40 pixels
- Pipe parts positioned via CSS classes

### Lines 353-359: updateElementPosition(element, x, y)

```javascript
function updateElementPosition(element, x, y) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
}
```
- **Purpose**: Generic function to update any element's position in the DOM
- **Parameters**:
  - `element`: DOM element to position
  - `x`, `y`: New position coordinates
- **Usage**: Called every frame for player and enemies to sync game state with visual representation

### Lines 361-368: updateScoreDisplay()

```javascript
function updateScoreDisplay() {
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = gameState.score; // Update the displayed score to match gameState.score
    }
}
```
- **Purpose**: Updates the score display in the UI
- **Process**: Finds score element and sets its text content to current score

### Lines 371-377: myCreateElement(type, className, styles)

```javascript
function myCreateElement(type, className, styles = {}) {
    const element = document.createElement(type);
    element.className = className;  
    Object.assign(element.style, styles);
    return element;
}
```
- **Purpose**: Helper function to create DOM elements with class and inline styles
- **Parameters**:
  - `type`: HTML element type (e.g., 'div')
  - `className`: Space-separated CSS classes
  - `styles`: Object of CSS properties to apply inline
- **Returns**: Created DOM element

### Lines 379-389: playCollectionSound()

```javascript
function playCollectionSound() {
    const collectionSound = document.getElementById('collection-sound');
    if (collectionSound) {
        collectionSound.volume = 0.1; // Set volume to 10%
        collectionSound.currentTime = 0; // Reset to start of sound
        collectionSound.play().catch(error => {
            console.log('Could not play collection sound:', error);
        });
    }
}
```
- **Purpose**: Plays the collection sound effect for coins and mushrooms
- **Process**:
  1. Gets audio element
  2. Sets volume to 10%
  3. Resets playback to start
  4. Plays sound, catching autoplay errors

### Lines 392-414: pauseAllSounds()

```javascript
function pauseAllSounds() {
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
    const nextLevelSound = document.getElementById('next-level-sound');
    if (nextLevelSound) {
        nextLevelSound.pause();
    }
    const bounceSound = document.getElementById('bounce-sound');
    if (bounceSound) {
        bounceSound.pause();
    }
    const collectionSound = document.getElementById('collection-sound');
    if (collectionSound) {
        collectionSound.pause();
    }
    const enemyFartSound = document.getElementById('enemy-fart-sound');
    if (enemyFartSound) {
        enemyFartSound.pause();
    }
}
```
- **Purpose**: Pauses all game sounds (called when game ends)
- **Process**: Iterates through all audio elements and pauses them

### Lines 416-446: showGameOver(won)

```javascript
function showGameOver(won) {
    gameState.gameRunning = false; // Stop the game loop
    document.getElementById('game-over-title').textContent = won ? 'You Win!' : 'Game Over';
    document.getElementById('final-score').textContent = `Final Score: ${gameState.score}`;
    document.getElementById('game-over').style.display = 'block';
    
    // Pause all other sounds
    pauseAllSounds();
    
    if (won) {
        // Play win sound
        const winSound = document.getElementById('win-sound');
        if (winSound) {
            winSound.volume = 0.3; // Set volume to 30%
            winSound.currentTime = 0; // Reset to start of sound
            winSound.play().catch(error => {
                console.log('Could not play win sound:', error);
            });
        }
    } else {
        // Play lose sound
        const loseSound = document.getElementById('lose-sound');
        if (loseSound) {
            loseSound.volume = 0.3; // Set volume to 30%
            loseSound.currentTime = 0; // Reset to start of sound
            loseSound.play().catch(error => {
                console.log('Could not play lose sound:', error);
            });
        }
    }
}
```
- **Purpose**: Displays game over screen and handles win/lose states
- **Parameters**: `won` - Boolean indicating if player won
- **Process**:
  1. Stops game loop
  2. Updates UI with win/lose message and final score
  3. Shows game over overlay
  4. Pauses all sounds
  5. Plays appropriate win or lose sound

### Lines 448-465: clearLevel()

```javascript
function clearLevel() {
    Object.values(gameObjects).flat().forEach(obj => {
       if (obj.element && obj.element.parentNode) {
            obj.element.remove(); // Remove element from DOM 
       }    
    })
    
    // Reset gameObjects arrays
    gameObjects = {
        platforms: [], 
        enemies: [],    
        coins: [],    
        surpriseBlocks: [],    
        pipes: [],
        mushrooms: []
    }   
}
```
- **Purpose**: Removes all game objects from DOM and resets arrays
- **Process**:
  1. Iterates through all game object arrays
  2. Removes each element from DOM if it exists
  3. Resets all arrays to empty

---

## Event Listeners

### Lines 476-510: Keydown Event Listener

```javascript
document.addEventListener('keydown', (e) => {
    // Start background music on first user interaction (handles autoplay restrictions)
    const backgroundMusic = document.getElementById('background-music');
    if (backgroundMusic && backgroundMusic.paused) {
        backgroundMusic.volume = 0.1; // Set volume to 10%
        backgroundMusic.play().catch(error => {
            console.log('Could not start background music:', error);
        });
    }
    
    gameState.keys[e.code] = true; // Set the key as pressed
    
    if (e.code === 'Space') {
        e.preventDefault(); // Prevent default space key behavior (page scrolling)
        if (player.grounded) {
            player.velocityY = JUMP_FORCE; // Apply jump force
            player.grounded = false; // Player is now in the air
            
            // Play bounce sound effect
            const bounceSound = document.getElementById('bounce-sound');
            if (bounceSound) {
                bounceSound.volume = 0.1; // Set volume to 10%
                bounceSound.currentTime = 0; // Reset to start of sound
                bounceSound.play().catch(error => {
                    console.log('Could not play bounce sound:', error);
                });
            }
        }
    }
    
    if (e.code === 'ArrowDown') {
        e.preventDefault(); // Prevent default arrow down key behavior (page scrolling)
    }
});
```
- **Purpose**: Handles keyboard input for player movement and actions
- **Key Behaviors**:
  - **Any key**: Attempts to start background music (handles autoplay restrictions)
  - **All keys**: Records key press in `gameState.keys`
  - **Space**: Jumps if grounded, plays bounce sound
  - **ArrowDown**: Prevents page scrolling

### Lines 512-514: Keyup Event Listener

```javascript
document.addEventListener('keyup', (e) => {       
    gameState.keys[e.code] = false; // Set the key as released
});
```
- **Purpose**: Records when keys are released
- **Process**: Sets key state to false in `gameState.keys` object

---

## Game Loop

### Lines 525-531: gameLoop()

```javascript
function gameLoop() {
    if (!gameState.gameRunning) return; // Exit if the game is not running  
    
    update(); // Update game state
    requestAnimationFrame(gameLoop); // Request the next frame
}
```
- **Purpose**: Main game loop that runs continuously
- **Process**:
  1. Checks if game is running, exits if not
  2. Calls `update()` to process game logic
  3. Schedules next frame using `requestAnimationFrame` (typically 60 FPS)

### Lines 533-787: update()

The `update()` function is the core game logic, called every frame. It handles:

#### Big Timer (Lines 540-551):
```javascript
if (player.bigTimer > 0) {
    player.bigTimer--; // Decrement timer by 1 each frame
    if (player.bigTimer <= 0) {
        // Timer expired - return player to normal size
        player.big = false;
        player.bigTimer = 0;
        player.element.classList.remove('big');
        player.width = 20;
        player.height = 20;
    }
}
```
- Decrements big timer each frame
- Returns player to normal size when timer expires

#### Invincibility Timer (Lines 553-563):
```javascript
if (player.invincibleTimer > 0) {
    player.invincibleTimer--;
    if (player.invincibleTimer <= 0) {
        player.invincible = false;
        player.invincibleTimer = 0;
    } else {
        player.invincible = true;
    }
}
```
- Decrements invincibility timer
- Maintains invincible state while timer is active

#### Movement Handling (Lines 564-571):
```javascript
if (gameState.keys['ArrowLeft'] || gameState.keys['KeyA']) {
    player.velocityX = -MOVE_SPEED; // Move left
} else if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']) {    
    player.velocityX = MOVE_SPEED; // Move right
} else {
    player.velocityX *= 0.8; // No horizontal movement...apply friction
}
```
- Sets horizontal velocity based on input
- Applies friction (multiplies by 0.8) when no input, creating smooth deceleration

#### Gravity and Position Update (Lines 579-586):
```javascript
if (!player.grounded) {
    player.velocityY += GRAVITY; // Apply gravity
}

// Update player position based on velocity
player.x += player.velocityX;
player.y += player.velocityY;
```
- Applies gravity when not grounded
- Updates position by adding velocity each frame

#### Boundary Checking (Lines 588-604):
```javascript
const GAME_AREA_WIDTH = 800;
const GAME_AREA_HEIGHT = 400;

if (player.x < 0) {
    player.x = 0;
} else if (player.x + player.width > GAME_AREA_WIDTH) {
    player.x = GAME_AREA_WIDTH - player.width;
}

if (player.y < 0) {
    player.y = 0;
} else if (player.y + player.height > GAME_AREA_HEIGHT) {
    player.y = GAME_AREA_HEIGHT - player.height;
}
```
- Constrains player within game area boundaries
- Prevents player from going off-screen

#### Platform Collision (Lines 606-617):
```javascript
player.grounded = false; // Assume player is in the air
for (let platform of gameObjects.platforms) {
    if (checkCollision(player, platform)) {
        if (player.velocityY > 0) { // Falling down
            player.y = platform.y - player.height; // Align player on top of platform
            player.velocityY = 0;
            player.grounded = true;
        }    
    }
}
```
- Checks collision with all platforms
- If falling onto platform, aligns player on top and sets grounded

#### Pipe Collision (Lines 619-629):
```javascript
for (let pipe of gameObjects.pipes) {
    if (checkCollision(player, pipe)) { 
        if (player.velocityY > 0) { // Falling down
            player.y = pipe.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
        }
    }
}
```
- Similar to platform collision, handles pipe collision

#### Enemy Movement and Collision (Lines 632-687):
```javascript
for (let enemy of gameObjects.enemies) {
    if (!enemy.alive) continue; // Skip dead enemies
    
    enemy.x += enemy.speed * enemy.direction; // Move enemy
    
    // Reverse direction if at screen boundaries
    if (enemy.x <= 0 || enemy.x + enemy.width >= 800) {
        enemy.direction *= -1; // Reverse direction
    }
    
    updateElementPosition(enemy.element, enemy.x, enemy.y);
    
    // Check player-enemy collision
    if (checkCollision(player, enemy)) {
        if (player.velocityY > 0 && player.y < enemy.y) {
            // Player jumping on enemy
            enemy.alive = false;
            enemy.element.remove();
            player.velocityY = JUMP_FORCE * 0.7; // Bounce up
            gameState.score += 100;
            updateScoreDisplay();
        } else {
            // Player hit by enemy
            if (!player.invincible) {
                // Play enemy fart sound
                const enemyFartSound = document.getElementById('enemy-fart-sound');
                if (enemyFartSound) {
                    enemyFartSound.volume = 0.2;
                    enemyFartSound.currentTime = 0;
                    enemyFartSound.play().catch(error => {
                        console.log('Could not play enemy fart sound:', error);
                    });
                }
                
                if (player.big) {
                    // Shrink player
                    player.big = false;
                    player.bigTimer = 0;
                    player.element.classList.remove('big');
                    player.width = 20;
                    player.height = 20;
                    player.invincible = true;
                    player.invincibleTimer = 120;
                    continue;
                } else {
                    loseLife();
                    break;
                }
            }
        }
    }
}
```
- Moves enemies horizontally, reversing at boundaries
- Handles two collision types:
  - **Player jumping on enemy**: Defeats enemy, bounces player, adds score
  - **Player hit horizontally**: Shrinks if big, loses life if small (unless invincible)

#### Coin Collection (Lines 689-698):
```javascript
for (let coin of gameObjects.coins) {
    if (!coin.collected && checkCollision(player, coin)) {
        coin.collected = true;
        coin.element.remove();
        gameState.score += 50;
        updateScoreDisplay();
        playCollectionSound();
    }
}
```
- Checks collision with coins
- Removes coin, adds 50 points, plays sound

#### Mushroom Collection (Lines 700-716):
```javascript
for (let mushroom of gameObjects.mushrooms) {
    if (!mushroom.collected && checkCollision(player, mushroom)) {
        mushroom.collected = true;
        mushroom.element.remove();
        gameState.lives++;
        gameState.score += 150;
        updateScoreDisplay();
        playCollectionSound();
        const index = gameObjects.mushrooms.indexOf(mushroom);
        if (index > -1) {
            gameObjects.mushrooms.splice(index, 1);
        }
        break;
    }
}
```
- Checks collision with mushrooms
- Removes mushroom, adds life, adds 150 points, plays sound

#### Surprise Block Interaction (Lines 718-746):
```javascript
for (let block of gameObjects.surpriseBlocks) {
    if (!block.hit && player.velocityY < 0 && player.y + player.height > block.y + block.height && checkCollision(player, block)) {
        block.hit = true;
        block.element.classList.add('hit');
        spawnItemOnBox(block, block.type);
        
        if (block.type === 'mushroom') {
            if (!player.big) {
                player.big = true;
                player.bigTimer = 600;
                player.element.classList.add('big');
                player.width = 35;
                player.height = 35;
            }
            gameState.score += 150;
            updateScoreDisplay();
        } else if (block.type === 'coin') {
            gameState.score += 50;
            updateScoreDisplay();
        }
    }
}
```
- Triggers when player hits block from below while moving up
- Marks block as hit, changes appearance, spawns item
- If mushroom type, makes player big (if not already)

#### Pipe Interaction (Lines 748-766):
```javascript
for (let pipe of gameObjects.pipes) {
    if (player.grounded && 
        player.x + player.width > pipe.x 
        && player.x < pipe.x + pipe.width &&
        Math.abs((player.y + player.height) - pipe.y) < 5 && gameState.keys['ArrowDown']) {
        nextLevel();
    }
    
    if (checkCollision(player, pipe)) {
        if (player.velocityY > 0) {
            player.y = pipe.y - player.height;
            player.velocityY = 0;
            player.grounded = true;
        }
    }
}
```
- Checks if player is on pipe and pressing down
- Advances to next level if conditions met
- Also handles collision for standing on pipe

#### Fall Death (Lines 769-773):
```javascript
if (player.y > GAME_AREA_HEIGHT) {
    loseLife();
}
```
- Checks if player fell below game area
- Calls `loseLife()` if true

#### DOM Update (Lines 775-785):
```javascript
updateElementPosition(player.element, player.x, player.y);

document.getElementById('score').textContent = gameState.score;
document.getElementById('level').textContent = gameState.level;
document.getElementById('lives').textContent = gameState.lives;
```
- Updates player position in DOM
- Updates UI displays for score, level, and lives

### Lines 790-797: checkCollision(rect1, rect2)

```javascript
function checkCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&  
        rect1.x + rect1.width > rect2.x &&  
        rect1.y < rect2.y + rect2.height &&  
        rect1.y + rect1.height > rect2.y    
    );
}
```
- **Purpose**: Axis-Aligned Bounding Box (AABB) collision detection
- **Parameters**: Two rectangle objects with `x`, `y`, `width`, `height`
- **Returns**: Boolean indicating if rectangles overlap
- **Logic**: Checks if rectangles overlap on both X and Y axes

### Lines 800-933: spawnItemOnBox(block, type)

```javascript
function spawnItemOnBox(block, type) {
    const item = document.createElement('div');
    item.classList.add(type);
    item.style.position = 'absolute';
    item.style.left = block.x + 'px';
    item.style.top = (block.y - 20) + 'px';
    document.getElementById('game-area').appendChild(item);
    
    const itemObject = {
        element: item,
        x: block.x,
        y: block.y - 20,
        width: 20,
        height: 20,
        type: type,
        velocityY: 0,
        collected: false
    };
    
    if (type === 'mushroom') {
        // Mushroom physics and collision logic
        gameObjects.mushrooms.push(itemObject);
        const mushroomInterval = setInterval(() => {
            itemObject.velocityY += GRAVITY;
            itemObject.y += itemObject.velocityY;
            
            let grounded = false;
            
            // Check platform collision
            for (let platform of gameObjects.platforms) {
                if (checkCollision(itemObject, platform)) {
                    if (itemObject.velocityY > 0) {
                        itemObject.y = platform.y - itemObject.height;
                        itemObject.velocityY = 0;
                        grounded = true;
                        break;
                    }
                }
            }
            
            // Check pipe collision
            if (!grounded) {
                for (let pipe of gameObjects.pipes) {
                    if (checkCollision(itemObject, pipe)) {
                        if (itemObject.velocityY > 0) {
                            itemObject.y = pipe.y - itemObject.height;
                            itemObject.velocityY = 0;
                            grounded = true;
                            break;
                        }
                    }
                }
            }
            
            updateElementPosition(itemObject.element, itemObject.x, itemObject.y);
            
            // Fade out after landing
            if (grounded) {
                clearInterval(mushroomInterval);
                setTimeout(() => {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.remove();
                        const index = gameObjects.mushrooms.indexOf(itemObject);
                        if (index > -1) {
                            gameObjects.mushrooms.splice(index, 1);
                        }
                    }, 500);
                }, 300);
            }
        }, 16);
    } else if (type === 'coin') {
        // Coin animation logic
        gameObjects.coins.push(itemObject);
        let frames = 0;
        const coinInterval = setInterval(() => {
            // Check collection
            if (!itemObject.collected && checkCollision(player, itemObject)) {
                itemObject.collected = true;
                itemObject.element.remove();
                gameState.score += 50;
                updateScoreDisplay();
                playCollectionSound();
                const index = gameObjects.coins.indexOf(itemObject);
                if (index > -1) {
                    gameObjects.coins.splice(index, 1);
                }
                clearInterval(coinInterval);
                return;
            }
            
            // Animation phases
            if (frames < 30) {
                itemObject.y -= 1; // Move up
                item.style.top = itemObject.y + 'px';
                frames++;
            } else if (frames >= 30 && frames < 180) {
                item.style.visibility = (frames % 10 < 5) ? 'visible' : 'hidden';
                frames++;
            } else if (frames >= 180) {
                clearInterval(coinInterval);
                if (!itemObject.collected) {
                    const index = gameObjects.coins.indexOf(itemObject);
                    if (index > -1) {
                        gameObjects.coins.splice(index, 1);
                    }
                }
                item.remove();
            }
            updateElementPosition(itemObject.element, itemObject.x, itemObject.y);
        }, 60);
    }
}
```
- **Purpose**: Spawns and animates items from surprise blocks
- **Parameters**:
  - `block`: Surprise block object
  - `type`: Item type ('mushroom' or 'coin')
- **Mushroom Behavior**:
  - Falls with gravity
  - Collides with platforms/pipes
  - Fades out after landing
- **Coin Behavior**:
  - Moves up for 30 frames
  - Spins (visibility toggle) for 150 frames
  - Disappears after animation
  - Can be collected during animation

### Lines 942-963: loseLife()

```javascript
function loseLife() {
    gameState.lives--;  
    if (gameState.lives <= 0) {
        showGameOver(false);
    } else {
        // Reset player position and state
        player.x = 50;
        player.y = 340;
        player.velocityX = 0;
        player.velocityY = 0;
        player.big = false;
        player.bigTimer = 0;
        player.element.classList.remove('big');
        player.width = 20;
        player.height = 20;
        player.invincible = true;
        player.invincibleTimer = 120;
        updateElementPosition(player.element, player.x, player.y);
    }
}
```
- **Purpose**: Handles life loss
- **Process**:
  1. Decrements lives
  2. Shows game over if lives reach 0
  3. Otherwise resets player to start position with invincibility

### Lines 965-982: nextLevel()

```javascript
function nextLevel() {
    // Play next level sound effect
    const nextLevelSound = document.getElementById('next-level-sound');
    if (nextLevelSound) {
        nextLevelSound.volume = 0.2;
        nextLevelSound.currentTime = 0;
        nextLevelSound.play().catch(error => {
            console.log('Could not play next level sound:', error);
        });
    }
    
    gameState.level++;
    if (gameState.level > levels.length) {
        showGameOver(true);
    } else {
        loadLevel(gameState.level - 1);
    }
}
```
- **Purpose**: Advances to next level
- **Process**:
  1. Plays next level sound
  2. Increments level
  3. Shows win screen if all levels completed
  4. Otherwise loads next level

### Lines 985-1004: restartGame()

```javascript
function restartGame() {
    // Reset game state
    gameState.score = 0;
    gameState.level = 1;
    gameState.lives = 3;
    gameState.gameRunning = true;   
    gameState.keys = {};
    player.big = false;
    player.bigTimer = 0;
    player.invincible = false;
    player.invincibleTimer = 0;
    player.element.classList.remove('big');
    player.width = 20;
    player.height = 20;
    document.getElementById('game-over').style.display = 'none';
    
    initGame();
}
```
- **Purpose**: Resets game to initial state
- **Process**: Resets all game state and player properties, hides game over screen, reinitializes game

### Lines 1007-1011: Event Listeners and Initialization

```javascript
const restartButton = document.getElementById('restart-button')
restartButton.addEventListener('click', restartGame);

initGame();
```
- Sets up restart button click handler
- Starts the game

---

## CSS Classes

### Body Styles (Lines 1-10)

```css
body {
    font-family: 'Courier New', monospace;
    background: linear-gradient(to bottom, #5C94FC, #87CEEB);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
}
```
- **Purpose**: Base page styling
- **Properties**:
  - `font-family`: Monospace font for retro feel
  - `background`: Sky blue gradient
  - `display: flex`: Centers content vertically and horizontally
  - `height: 100vh`: Full viewport height

### H4 Styles (Lines 13-19)

```css
h4 {
    margin-top: -20px;
    margin-bottom: 2px;
    font-size: 16px;
    font-weight: bold;
}
```
- **Purpose**: Styles the "MAB Media" heading
- **Properties**: Negative top margin to position above game container

### Game Container (Lines 22-27)

```css
.game-container {
    background: #fff;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px #000;
}
```
- **Purpose**: Container for game area and UI
- **Properties**: White background, rounded corners, shadow for depth

### UI Styles (Lines 29-36)

```css
.ui {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    min-width: 800px;
}
```
- **Purpose**: Styles the score/level/lives display
- **Properties**: Flexbox layout, bold text, matches game area width

### Game Area (Lines 38-46)

```css
#game-area {
    position: relative;
    width: 800px;
    height: 400px;
    background: linear-gradient(to bottom, #000, #5C94FC 80%, #228B22 80%, #228B22 100%);
    border: 2px solid #333;
    overflow: hidden;
}
```
- **Purpose**: Main game canvas
- **Properties**:
  - `position: relative`: Parent for absolutely positioned game objects
  - `background`: Gradient from black (top) to blue (sky) to green (ground)
  - `overflow: hidden`: Clips objects outside bounds

### Mario Base Styles (Lines 49-58)

```css
#mario {
    position: absolute;
    width: 20px;
    height: 20px;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('https://i.imgur.com/Wb1qfhK.png');
    z-index: 100;
}
```
- **Purpose**: Base player styling
- **Properties**:
  - `position: absolute`: Positioned relative to game area
  - `z-index: 100`: Renders above most objects
  - `background-image`: Mario sprite image

### Mario Big State (Lines 61-66)

```css
#mario.big {
    width: 35px;
    height: 35px;
    background-image: url('https://i.imgur.com/Wb1qfhK.png');
}
```
- **Purpose**: Enlarged player state
- **Properties**: Larger dimensions when `big` class is applied

### Platform Base (Lines 69-74)

```css
.platform {
    background-image: url('https://i.imgur.com/M6rwarW.png');
    position: absolute;
    background-size: 20px 20px;
    background-repeat: repeat;
}
```
- **Purpose**: Base platform styling
- **Properties**: Tiled background image for platforms

### Platform Ground (Lines 77-82)

```css
.platform.ground {
    background-image: url('https://i.imgur.com/pogC9x5.png');
    position: absolute;
    background-size: 20px 20px;
    background-repeat: repeat;
}
```
- **Purpose**: Ground platform variant
- **Properties**: Different sprite for ground platforms

### Platform Floating (Lines 84-89)

```css
.platform.floating {
    background-image: url('https://i.imgur.com/pogC9x5.png');
    position: absolute;
    background-size: 20px 20px;
    background-repeat: repeat;
}
```
- **Purpose**: Floating platform variant
- **Properties**: Same sprite as ground (can be customized)

### Platform Blue (Lines 91-96)

```css
.platform.blue {
    background-image: url('https://i.imgur.com/fVscIbn.png');
    position: absolute;
    background-size: 20px 20px;
    background-repeat: repeat;
}
```
- **Purpose**: Blue platform variant (Level 2)
- **Properties**: Blue platform sprite

### Enemy Brown (Lines 98-112)

```css
.enemy.brown {
    background-image: url('img/pics/Spider_1.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 70px;
    height: 70px;
    display: block;
    z-index: 50;
    text-indent: -9999px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
}
```
- **Purpose**: Brown enemy (spider) styling
- **Properties**:
  - `z-index: 50`: Below player but above platforms
  - `text-indent: -9999px`: Hides any text content
  - Large dimensions for spider sprite

### Enemy Purple (Lines 114-126)

```css
.enemy.purple {
    background-image: url('https://i.imgur.com/SvV4ueD.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 20px;
    height: 20px;
    text-indent: -9999px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
}
```
- **Purpose**: Purple enemy styling
- **Properties**: Smaller dimensions, different sprite

### Mushroom (Lines 128-136)

```css
.mushroom {
    position: absolute;
    background-image: url('https://i.imgur.com/0wMd92p.png');
    width: 20px;
    height: 20px;
    opacity: 1;
    transition: opacity 0.5s ease-out;
}
```
- **Purpose**: Mushroom item styling
- **Properties**:
  - `transition: opacity 0.5s ease-out`: Smooth fade-out animation

### Coin (Lines 138-151)

```css
.coin {
    background-image: url('https://i.imgur.com/wbKxhcd.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 20px;
    height: 20px;
    animation: coinSpin 1s infinite linear;
    text-indent: -9999px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
}
```
- **Purpose**: Coin item styling
- **Properties**:
  - `animation: coinSpin 1s infinite linear`: Continuous spinning animation

### Coin Spin Animation (Lines 246-254)

```css
@keyframes coinSpin {
    0% {
        transform: rotateY(0deg);
    }
    100% {
        transform: rotateY(360deg);
    }
}
```
- **Purpose**: Defines coin rotation animation
- **Properties**: Rotates 360 degrees on Y-axis continuously

### Surprise Block (Lines 153-165)

```css
.surprise-block {
    background-image: url('https://i.imgur.com/gesQ1KP.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 20px;
    height: 20px;
    text-indent: -9999px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
}
```
- **Purpose**: Unhit surprise block styling
- **Properties**: Question mark block sprite

### Surprise Block Hit (Lines 168-180)

```css
.surprise-block.hit {
    background-image: url('https://i.imgur.com/bdrLpi6.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    width: 20px;
    height: 20px;
    text-indent: -9999px;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
}
```
- **Purpose**: Hit surprise block styling
- **Properties**: Empty block sprite after being hit

### Pipe Container (Lines 183-188)

```css
.pipe {
    position: absolute;
    width: 40px;
    height: 40px;
}
```
- **Purpose**: Pipe container element
- **Properties**: Fixed dimensions, contains pipe parts

### Pipe Top Left (Lines 197-206)

```css
.pipe-top {
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-image: url('https://i.imgur.com/ReTPiWY.png');
}
```
- **Purpose**: Top-left pipe corner
- **Properties**: Positioned at top-left of pipe container

### Pipe Top Right (Lines 208-217)

```css
.pipe-top-right {
    position: absolute;
    top: 320;
    right: 0;
    background-size: cover;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-image: url('https://i.imgur.com/hj2GK4n.png');
}
```
- **Purpose**: Top-right pipe corner
- **Properties**: Positioned at top-right (note: `top: 320` appears to be a positioning value)

### Pipe Bottom Left (Lines 220-229)

```css
.pipe-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    background-size: cover;
    background-repeat: no-repeat;
    width: 20px;
    height: 20px;
    background-image: url('https://i.imgur.com/c1cYSbt.png');
}
```
- **Purpose**: Bottom-left pipe corner
- **Properties**: Positioned at bottom-left

### Pipe Bottom Right (Lines 232-239)

```css
.pipe-bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    background-image: url('https://i.imgur.com/nqQ79eI.png');
}
```
- **Purpose**: Bottom-right pipe corner
- **Properties**: Positioned at bottom-right

### Controls (Lines 257-262)

```css
.controls {
    margin-top: 15px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
}
```
- **Purpose**: Control instructions styling
- **Properties**: Centered text below game

### Game Over Overlay (Lines 264-276)

```css
#game-over {
    position: absolute;
    top: 50%;
    background: rgba(0, 0, 0, 0.5);
    border: 3px solid #FFF;
    color: #fff;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
    z-index: 1000;
    display: none;
}
```
- **Purpose**: Game over screen overlay
- **Properties**:
  - `position: absolute`: Overlays game area
  - `z-index: 1000`: Above all game elements
  - `display: none`: Hidden by default, shown when game ends
  - Semi-transparent black background

### Restart Button (Lines 278-287)

```css
#restart-button {
    margin: 10px;
    font-size: 16px;
    font-weight: bold;
    background-color: #FF6B6B;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
```
- **Purpose**: Restart button styling
- **Properties**: Red button with white text, rounded corners

### Restart Button Hover (Lines 289-291)

```css
#restart-button:hover {
    background-color: #FF3B3B;
}
```
- **Purpose**: Hover state for restart button
- **Properties**: Darker red on hover

---

## Summary

This documentation covers all aspects of the Mario game codebase:

- **Game Constants**: Physics values (gravity, jump force, speeds)
- **Game State**: Player state, game state, and object arrays
- **Level System**: Level definition structure and loading
- **Game Loop**: Frame-by-frame update logic
- **Collision Detection**: AABB collision system
- **Sound System**: Audio playback for various game events
- **CSS Styling**: All visual classes and animations

The game uses a simple but effective architecture:
- **State-based**: Game state stored in objects
- **Frame-based**: Updates every frame via `requestAnimationFrame`
- **DOM-based**: Game objects are DOM elements positioned absolutely
- **Event-driven**: Keyboard input drives player actions

This documentation should serve as a complete reference for understanding, maintaining, or extending the game.

