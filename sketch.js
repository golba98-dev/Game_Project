/*
    Project: Side Scrolling Game
    Author: Intern Dev
    Date: Dec 2025
    
    Description: 
    - Bigfoot character with full animations 
    - Procedural tree generation 
    - Camera scrolling
    - Spaced out for maximum readability
*/


// ===========================
// GLOBAL VARIABLES
// ===========================

var gameChar_x;

var gameChar_y;

var floorPos_y;


// World objects

var trees = [];

var collectable;

var canyon;


// Game state booleans

var isLeft = false;

var isRight = false;

var isFalling = false;

var isPlummeting = false; 


// Visual constants

let coinAngle = 0;

const ORIGINAL_WIDTH = 1000;

const ORIGINAL_HEIGHT = 600;


// Character colors

var furColor;

var skinColor;



// ===========================
// SETUP FUNCTION
// ===========================

function setup() {

    console.log("Initializing Game...");
    
    createCanvas(windowWidth, windowHeight);
    
    // CSS styling to remove scrollbars
    document.body.style.overflow = "hidden"; 
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    
    // Set colors
    furColor = color(70, 45, 20);      // Dark Brown
    
    skinColor = color(180, 140, 110);  // Face Color


    // Level settings
    
    floorPos_y = 450; // Keep ground low for more sky
    
    gameChar_x = 100;
    
    gameChar_y = floorPos_y;


    // Initialize Objects

    collectable = {
        x_pos: ORIGINAL_WIDTH / 2,
        y_pos: floorPos_y - 20,
        size: 50,
        isFound: false
    };


    canyon = {
        x_pos: 700,
        width: 100
    };


    // Initialize Trees
    generateTrees();
    
    console.log("Setup Complete.");
}


function windowResized() {
    
    resizeCanvas(windowWidth, windowHeight);

}



// ===========================
// MAIN DRAW LOOP
// ===========================

function draw() {

    // 1. Calculate Scale and Camera
    
    let scaleX = width / ORIGINAL_WIDTH;
    
    let scaleY = height / ORIGINAL_HEIGHT;


    background(135, 206, 250); // Sky Blue


    push();
    
    scale(scaleX, scaleY);


    // Camera Logic: Move the world relative to character
    
    var cameraPosX = gameChar_x - ORIGINAL_WIDTH / 2;
    
    translate(-cameraPosX, 0);
    
    noStroke();
    
    
    // 2. Draw Scenery (Order matters: Back to Front)
    
    drawGround();
    
    drawClouds();
    
    drawMountains();
    
    drawTrees();
    
    drawCanyon(canyon.x_pos, floorPos_y, canyon.width, ORIGINAL_HEIGHT - floorPos_y);


    // 3. Game Logic checks
    
    checkCanyon();
    
    checkCollectable();
    
    handleMovement();
    
    
    // 4. Draw the Character (Bigfoot)
    
    renderGameChar();


    // 5. Physics Update
    
    updatePhysics();
    
    
    pop(); 
    
    
    // Animation tick
    
    coinAngle += 0.05;
}



// ===========================
// LOGIC FUNCTIONS
// ===========================

function generateTrees() {
    
    console.log("Generating Trees...");
    
    trees = [];
    
    // Try to spawn 15 trees
    for (var i = 0; i < 15; i++) {
        
        var validPosition = false;
        
        var maxAttempts = 100; // Prevent infinite loop crashing browser
        
        var attempts = 0;
        
        var tx = 0;


        while (!validPosition && attempts < maxAttempts) {
            
            tx = random(-1500, 2500);
            
            validPosition = true;

            // RULE 1: Don't spawn on the canyon hole (plus buffer)
            
            if (tx > canyon.x_pos - 80 && tx < canyon.x_pos + canyon.width + 80) {
                validPosition = false;
            }


            // RULE 2: Don't spawn too close to other trees
            
            if (validPosition) {
                
                for (var j = 0; j < trees.length; j++) {
                    
                    var d = abs(trees[j].x - tx);
                    
                    if (d < 120) { 
                        validPosition = false;
                        break;
                    }
                }
            }
            
            attempts++;
        }


        // Only push if we found a good spot
        
        if (validPosition) {
            
            trees.push({
                x: tx,
                y: floorPos_y,
                trunkW: random(30, 50),
                trunkH: random(90, 160),
                canopySize: random(110, 160),
                leafColor: color(random(20, 60), random(100, 180), random(20, 60))
            });
        }
    }
}


function handleMovement() {
    
    isLeft = false;
    
    isRight = false;


    if (isPlummeting == false) {
        
        if (keyIsDown(37) || keyIsDown(65)) { // Left Arrow or A
            gameChar_x -= 5;
            isLeft = true;
        }
        
        if (keyIsDown(39) || keyIsDown(68)) { // Right Arrow or D
            gameChar_x += 5;
            isRight = true;
        }
    }
}


function updatePhysics() {
    
    // Simple gravity
    
    if (gameChar_y < floorPos_y) {
        
        gameChar_y += 2; 
        
        isFalling = true; 
        
    } else {
        
        isFalling = false; 
    }
    
    
    // Plummeting logic (falling into hole)
    
    if(isPlummeting == true) {
        
        gameChar_y += 5;
    }
}


function checkCanyon() {
    
    if(gameChar_x > canyon.x_pos && gameChar_x < canyon.x_pos + canyon.width && gameChar_y >= floorPos_y) {
        
        isPlummeting = true;
    }
}


function checkCollectable() {
    
    if(collectable.isFound == false) {
        
        drawCoin(collectable.x_pos, collectable.y_pos);
        
        if(dist(gameChar_x, gameChar_y, collectable.x_pos, collectable.y_pos) < 50) {
            
            collectable.isFound = true;
            
            console.log("Coin Collected!");
        }
    }
}


function keyPressed() {
    
    if (isPlummeting) { return; }
    
    
    // Jump on Space (32) or W (87)
    
    if (keyCode == 32 || keyCode == 87) { 
        
        if (!isFalling && !isPlummeting) { 
            
            gameChar_y -= 100; 
        }
    }
}



// ===========================
// DRAWING FUNCTIONS
// ===========================

function renderGameChar() {
    
    // This function handles all 6 animation states for Bigfoot
    
    // 1. Jumping Left
    
    if (isLeft && isFalling) {
        
        fill(furColor);
        
        rect(gameChar_x - 18, gameChar_y - 60, 36, 45, 10); // Body
        
        drawBigfootHead(gameChar_x, gameChar_y, -1);      // Head
        
        
        // Arms Up
        
        push(); 
        translate(gameChar_x - 15, gameChar_y - 50); 
        rotate(-2.5); 
        rect(0, 0, 12, 35, 6); 
        pop();
        
        push(); 
        translate(gameChar_x + 10, gameChar_y - 50); 
        rotate(0.5); 
        rect(0, 0, 12, 35, 6); 
        pop();
        
        
        // Legs Tucked
        
        rect(gameChar_x - 15, gameChar_y - 25, 14, 14, 7);
        
        rect(gameChar_x + 2, gameChar_y - 20, 14, 14, 7);


    // 2. Jumping Right
    
    } else if (isRight && isFalling) {
        
        fill(furColor);
        
        rect(gameChar_x - 18, gameChar_y - 60, 36, 45, 10);
        
        drawBigfootHead(gameChar_x, gameChar_y, 1);
        
        
        // Arms Up
        
        push(); 
        translate(gameChar_x + 15, gameChar_y - 50); 
        rotate(2.5); 
        rect(-12, 0, 12, 35, 6); 
        pop();
        
        push(); 
        translate(gameChar_x - 10, gameChar_y - 50); 
        rotate(-0.5); 
        rect(-12, 0, 12, 35, 6); 
        pop();
        
        
        rect(gameChar_x - 15, gameChar_y - 20, 14, 14, 7);
        
        rect(gameChar_x + 2, gameChar_y - 25, 14, 14, 7);


    // 3. Walking Left
    
    } else if (isLeft) {
        
        fill(furColor);
        
        push(); 
        translate(gameChar_x + 5, gameChar_y - 20); 
        rotate(0.4); 
        rect(-6, 0, 12, 25, 6); 
        pop(); // Back Leg
        
        push(); 
        translate(gameChar_x, gameChar_y); 
        rotate(-0.1); 
        rect(-18, -60, 36, 45, 10); 
        pop();      // Body
        
        drawBigfootHead(gameChar_x - 4, gameChar_y, -1);
        
        push(); 
        translate(gameChar_x - 5, gameChar_y - 20); 
        rotate(-0.4); 
        rect(-6, 0, 12, 25, 6); 
        pop(); // Front Leg
        
        push(); 
        translate(gameChar_x, gameChar_y - 50); 
        rotate(0.5); 
        rect(-6, 0, 12, 40, 6); 
        pop();      // Arm


    // 4. Walking Right
    
    } else if (isRight) {
        
        fill(furColor);
        
        push(); 
        translate(gameChar_x - 5, gameChar_y - 20); 
        rotate(-0.4); 
        rect(-6, 0, 12, 25, 6); 
        pop(); // Back Leg
        
        push(); 
        translate(gameChar_x, gameChar_y); 
        rotate(0.1); 
        rect(-18, -60, 36, 45, 10); 
        pop();       // Body
        
        drawBigfootHead(gameChar_x + 4, gameChar_y, 1);
        
        push(); 
        translate(gameChar_x + 5, gameChar_y - 20); 
        rotate(0.4); 
        rect(-6, 0, 12, 25, 6); 
        pop();  // Front Leg
        
        push(); 
        translate(gameChar_x, gameChar_y - 50); 
        rotate(-0.5); 
        rect(-6, 0, 12, 40, 6); 
        pop();     // Arm


    // 5. Falling Front (Plummeting)
    
    } else if (isFalling || isPlummeting) {
        
        fill(furColor);
        
        rect(gameChar_x - 18, gameChar_y - 60, 36, 45, 10);
        
        drawBigfootHead(gameChar_x, gameChar_y, 0);
        
        fill(0); 
        ellipse(gameChar_x, gameChar_y - 58, 8, 10); // Mouth Open scream
        
        
        // Arms Flailing
        
        rect(gameChar_x - 30, gameChar_y - 65, 12, 40, 6);
        
        rect(gameChar_x + 18, gameChar_y - 65, 12, 40, 6);
        
        rect(gameChar_x - 15, gameChar_y - 20, 12, 15, 6);
        
        rect(gameChar_x + 3, gameChar_y - 20, 12, 15, 6);


    // 6. Standing Still (Idle)
    
    } else {
        
        fill(furColor);
        
        rect(gameChar_x - 20, gameChar_y - 60, 40, 50, 12); // Body
        
        drawBigfootHead(gameChar_x, gameChar_y, 0);       // Head
        
        
        // Arms Hanging
        
        rect(gameChar_x - 32, gameChar_y - 55, 14, 45, 7);
        
        rect(gameChar_x + 18, gameChar_y - 55, 14, 45, 7);
        
        // Legs Standing
        
        rect(gameChar_x - 15, gameChar_y - 12, 14, 15, 6);
        
        rect(gameChar_x + 1, gameChar_y - 12, 14, 15, 6);
    }
}


// Helper to draw the face direction

function drawBigfootHead(x, y, dir) {
    
    fill(furColor);
    
    ellipse(x, y - 65, 40, 45); // Head Base
    
    fill(skinColor);
    
    ellipse(x + (dir * 4), y - 65, 24, 28); // Face offset
    
    fill(0);
    
    ellipse(x + (dir * 4) - 6, y - 67, 4, 4); // Eye L
    
    ellipse(x + (dir * 4) + 6, y - 67, 4, 4); // Eye R
}


function drawGround() {
    
    fill(34, 139, 34);
    
    rect(-2000, floorPos_y, ORIGINAL_WIDTH + 4000, ORIGINAL_HEIGHT / 2);
}


function drawClouds() {
    
    // Manually drawing clouds for background
    
    drawCloud(150, 100);
    
    drawCloud(300, 150);
    
    drawCloud(600, 120);
    
    drawCloud(800, 80);
}


function drawCloud(x, y) {
    
    fill(255); 
    
    noStroke();
    
    ellipse(x, y, 80, 60); 
    
    ellipse(x + 40, y, 100, 70); 
    
    ellipse(x + 80, y, 80, 60);
}


function drawMountains() {
    
    // Drawing BIG mountains
    
    drawMountain(100, floorPos_y, 500, 400);
    
    drawMountain(350, floorPos_y, 450, 350);
    
    drawMountain(600, floorPos_y, 600, 500);
}


function drawMountain(baseX, baseY, w, h) {
    
    fill(120); 
    
    noStroke();
    
    triangle(baseX, baseY, baseX + w / 2, baseY - h, baseX + w, baseY); // Main mtn
    
    fill(255);
    
    // Snow cap
    triangle(baseX + w / 2, baseY - h, baseX + w / 2 - 30, baseY - h + 50, baseX + w / 2 + 30, baseY - h + 50);
}


function drawTrees() {
    
    for (var i = 0; i < trees.length; i++) {
        
        var t = trees[i];
        
        
        // Shadow
        
        fill(0, 50); 
        
        ellipse(t.x + t.trunkW/2, t.y, t.trunkW * 1.5, 10); 
        
        
        // Trunk
        
        fill(100, 50, 10); 
        
        rect(t.x, t.y - t.trunkH, t.trunkW, t.trunkH); 
        
        
        // Leaves (3 layers for depth)
        
        fill(t.leafColor);
        
        ellipse(t.x + t.trunkW/2, t.y - t.trunkH * 0.8, t.canopySize, t.canopySize * 0.8);
        
        fill(red(t.leafColor) + 20, green(t.leafColor) + 20, blue(t.leafColor) + 20);
        
        ellipse(t.x + t.trunkW/2 - 20, t.y - t.trunkH, t.canopySize * 0.7, t.canopySize * 0.7);
        
        ellipse(t.x + t.trunkW/2 + 20, t.y - t.trunkH, t.canopySize * 0.7, t.canopySize * 0.7);
        
        fill(t.leafColor);
        
        ellipse(t.x + t.trunkW/2, t.y - t.trunkH * 1.2, t.canopySize * 0.6, t.canopySize * 0.6);
    }
}


function drawCoin(x, y) {
    
    push(); 
    
    translate(x, y); 
    
    rotate(coinAngle); 
    
    stroke(0); 
    
    strokeWeight(1);
    
    fill(255, 223, 0); 
    
    ellipse(0, 0, 40, 40);
    
    fill(200, 160, 0); 
    
    ellipse(0, 0, 30, 30);
    
    fill(0); 
    
    noStroke(); 
    
    textSize(20); 
    
    textAlign(CENTER, CENTER); 
    
    text("$", 0, 0); 
    
    pop();
}


function drawCanyon(x, y, w, h) {
    
    noStroke();
    
    fill(40, 20, 10); 
    
    rect(x, y, w, h);
    
    fill(80, 45, 20); 
    
    beginShape(); 
    
    vertex(x, y); 
    
    vertex(x + 20, y + h); 
    
    vertex(x, y + h); 
    
    endShape(CLOSE);
    
    fill(60, 30, 10); 
    
    beginShape(); 
    
    vertex(x + w, y); 
    
    vertex(x + w - 20, y + h); 
    
    vertex(x + w, y + h); 
    
    endShape(CLOSE);
    
    fill(30, 10, 5); 
    
    triangle(x + w/2 - 10, y + h, x + w/2 + 10, y + h, x + w/2, y + h - 30);
}