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
            { x: 550, y: 320, width: 20, height: 20, type: 'goomba' }, // Goomba enemy
            { x: 700, y: 320, width: 20, height: 20, type: 'turtle' }  // Turtle enemy    
        ],
    } // END of level 1
// Additional levels can be added here
] 
/**
 * -----------------------------------------------------------
 *               ARRAY OF GAME LEVEL OBJECTS 
 *                          END   
 * -----------------------------------------------------------
 */