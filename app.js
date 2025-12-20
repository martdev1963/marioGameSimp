//  Data structures and constants for the game
/**
 * -----------------------------------------------------------
 *                    GAME CONSTANTS
 * -----------------------------------------------------------
 */
const GRAVITY = 0.5; // Acceleration due to gravity (m/s^2)
const JUMP_FORCE = -12; // Initial jump velocity (m/s)
const MOVE_SPEED = 2.5; // Horizontal speed of the player (m/s)
const ENEMY_SPEED = 1; // Speed of enemy movement (m/s)

/**
 * -----------------------------------------------------------
 *                    GAME STATE VARIABLES
 * -----------------------------------------------------------
 */

// Game State object to track the current state of the game
let gameState = {
    score: 0, // Player's score
    level: 1, // Current game level
    lives: 3, // Player's remaining lives
    gameRunning: true, // Is the game currently running?
    keys: { // Object to track key presses

    }
}

// player object to track player properties
let player = {
    element: document.getElementById('mario'), // Player DOM element
    x: 50, // Player's x position
    y: 300, // Player's y position
    width: 20, // Player's width
    height: 20, // Player's height
    velocityX: 0, // Player's horizontal velocity
    velocityY: 0, // Player's vertical velocity
    grounded: false, // Is the player on the ground?
    big: false, // Is the player in "big" state?
    bigTimer: 0 // Timer for "big" state duration   
}

/**
 * -----------------------------------------------------------
 *                    GAME OBJECTS ARRAYS
 * -----------------------------------------------------------
 */

let gameObjects = {
    platforms: [], // Array to hold platform objects
    enemies: [], // Array to hold enemy objects
    coins: [], // Array to hold coin objects
    surpriseBlocks: [], // Array to hold surprise block objects
    pipes: [] // Array to hold pipe objects
}


/**
 * -----------------------------------------------------------
 *               ARRAY OF GAME LEVEL OBJECTS 
 *                         START 
 *                vid_time: 36:05 / 2:12:04  
 * -----------------------------------------------------------
 */
const levels = [
    // level 1 
    {
        platforms: [  // type can be 'ground' or 'floating' representing different platform types (via their class names)
            { x: 0, y: 360, width: 400, height: 40, type: 'ground' }, // Ground platform
            { x: 500, y: 360, width: 300, height: 40, type: 'ground' }, // Ground platform
            { x: 200, y: 280, width: 60, height: 20, type: 'floating' }, // floating platform
            { x: 300, y: 240, width: 60, height: 20, type: 'floating' }, // Ground platform
            { x: 600, y: 280, width: 80, height: 20, type: 'floating' }, // Ground platform
        ],
        enemies: [  // type can be 'goomba' or 'turtle' representing different enemy types (via their class names)
            { x: 250, y: 344, type: 'brown' }, // brown enemy
            { x: 550, y: 344, type: 'brown' }, // brown enemy    
        ],

        coins: [  // type can be 'gold' or 'silver' representing different coin types (via their class names)
            { x: 220, y: 260}, // coin
            { x: 320, y: 220}, // coin
            { x: 620, y: 260}, // coin
        ],

        surpriseBlocks: [  // type can be 'coin' or 'mushroom' representing different surprise block types (via their class names)
            { x: 350, y: 220, type: 'mushroom' }, // mushroom surprise block
        ],

        pipes: [  // type can be 'small' or 'large' representing different pipe types (via their class names)
            { x: 750, y: 300} // pipe
        ]

    }, // END of level 1
    // --------------------------------------------------------------------------------------------------------------------------
    // Level 2     [vid_Time: 39:50 / 2:12:04 ]
    {
        platforms: [ // 8 blue platforms

            { x: 0, y: 360, width: 200, height: 40, type: 'blue' }, // Ground platform
             { x: 300, y: 360, width: 200, height: 40, type: 'blue' }, // Ground platform
              { x: 600, y: 360, width: 200, height: 40, type: 'blue' }, // Ground platform
               { x: 150, y: 300, width: 200, height: 40, type: 'blue' }, // Ground platform
                { x: 250, y: 280, width: 200, height: 40, type: 'blue' }, // Ground platform
                 { x: 350, y: 260, width: 200, height: 40, type: 'blue' }, // Ground platform
                  { x: 450, y: 240, width: 200, height: 40, type: 'blue' }, // Ground platform
                   { x: 550, y: 280, width: 200, height: 40, type: 'blue' } // Ground platform
        ],
        enemies: [
            { x: 350, y: 344, type: 'purple' }, // green enemy
            { x: 650, y: 344, type: 'purple' },  // green enemy
            { x: 570, y: 264, type: 'purple' }  // green enemy 
        ], // Array to hold enemy objects
        coins: [
            { x: 160, y: 260}, // coin
            { x: 160, y: 260}, // coin
            { x: 160, y: 260}, // coin
            { x: 160, y: 260}, // coin
            { x: 160, y: 260}, // coin
        ], // Array to hold coin objects
        surpriseBlocks: [
            { x: 200, y: 260, type: 'mushroom' }, // mushroom surprise block
            { x: 500, y: 220, type: 'coin' } // coin surprise block
        ], // Array to hold surprise block objects
        pipes: [
            { x: 750, y: 300} // pipe
        ] // Array to hold pipe objects

    } // END of level 2        
    // --------------------------------------------------------------------------------------------------------------------------
    // Additional levels can be added here
] // END of levels array

/**
 * -----------------------------------------------------------
 *               ARRAY OF GAME LEVEL OBJECTS 
 *                          END   
 * -----------------------------------------------------------
 */


/**
 * -----------------------------------------------------------
 *                  INITIALIZE THE GAME         
 * -----------------------------------------------------------
 */

function initGame() {
    loadLevel(gameState.level -1); // Load the first level which is at index 0
    //gameLoop();

    // Additional initialization code can go here
}


/**
 * ---------------------------------------------------------------------------------------------------------------------------
 *                                                  FUNCTION DEFINITIONS
 *                                                         START         
 * ---------------------------------------------------------------------------------------------------------------------------
 */

function loadLevel(levelIndex) {
    if (levelIndex >= levels.length) {

        showGameOver(true) // Player has completed all levels    
        return // Exit if level index is out of bounds
    }    

    // Clear existing game objects
    clearLevel() // Implement this function to remove existing game objects from the DOM and reset arrays (this is a function called before loading a new level)


    const level = levels[levelIndex]; // individual level object from levels array
    const gameArea = document.getElementById('game-area');  // Assuming there's a div with id 'game-area' to hold game elements

    // reset player object properties
    player.x = 50;
    player.y = 300;
    player.velocityX = 0;
    player.velocityY = 0;
    player.big = false;
    player.bigTimer = 0;
    player.element.className = ''; // reset player class

    //function call below to update player position in DOM
    updateElementPosition(player.element, player.x, player.y) // this function updates the player's DOM element position based on player.x and player.y

    // create platforms
    level.platforms.forEach((platformData, index) => {
        const platform = myCreateElement('div', `platform ${platformData.type}`, {  // platformData.type ie; 'ground' or 'floating'...
            left: platformData.x + 'px',
            top: platformData.y + 'px',
            width: platformData.width + 'px',
            height: platformData.height + 'px' // vid_time: 51:23 / 2:12:04
    })
        gameArea.appendChild(platform);
        gameObjects.platforms.push({ // add platform object to gameObjects.platforms array
            element: platform,
            x: platformData.x,
            y: platformData.y,
            width: platformData.width,
            height: platformData.height,
            type: platformData.type,
            id: 'platform-' + index
        });
    }); // END of forEach platform loop


} // END of loadLevel function


// Function to update the position of a DOM element based on x and y coordinates
function updateElementPosition(element, x, y) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
}


// Function to create a DOM element with specified tag, class, and styles
function myCreateElement(type, className, styles = {}) {
    const element = document.createElement('div');
    element.className = className;  
    Object.assign(element.style, styles);
    return element;
}


function showGameOver(won) {
    gameState.gameRunning = false; // Stop the game loop
    document.getElementById('game-over-title').textContent = won ? 'You Win!' : 'Game Over';
    document.getElementById('final-score').textContent = `Final Score: ${gameState.score}`;
    document.getElementById('game-over').style.display = 'block';
}

function clearLevel() {
    //const gameArea = document.getElementById('game-area');
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
        pipes: []    
    }   
} // END of clearLevel function


// Input Handling - vid_time: 59:02 / 2:12:04



// Start Game
initGame();




// vid_time: 48:19 / 2:12:04







/**
 * ---------------------------------------------------------------------------------------------------------------------------
 *                                                  FUNCTION DEFINITIONS
 *                                                         END         
 * ---------------------------------------------------------------------------------------------------------------------------
 */
