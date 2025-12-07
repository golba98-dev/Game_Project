// ===========================
// Game Variables
// ===========================
var gameChar_x;
var gameChar_y;
var floorPos_y;

var isLeft = false;
var isRight = false;
var isFalling = false;
var isPlummeting = false; 

// Landscape Settings
let coinAngle = 0;
const ORIGINAL_WIDTH = 1000;
const ORIGINAL_HEIGHT = 600;

// Game Objects
var collectable;
var canyon;

// ===========================
// Setup
// ===========================
function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // --- FIX FOR SCROLLBARS ---
    document.body.style.overflow = "hidden"; 
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    // --------------------------
    
    floorPos_y = 300; 
    
    gameChar_x = 100;
    gameChar_y = floorPos_y;

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
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// ===========================
// Main Draw Loop
// ===========================
function draw() {
    let scaleX = width / ORIGINAL_WIDTH;
    let scaleY = height / ORIGINAL_HEIGHT;

    background(135, 206, 250); // Sky Blue

    push();
    scale(scaleX, scaleY);

    // --- Ground ---
    noStroke();
    fill(34, 139, 34);
    rect(0, floorPos_y, ORIGINAL_WIDTH, ORIGINAL_HEIGHT / 2);

    // --- Scenery ---
    drawCloud(150, 100);
    drawCloud(300, 150);
    drawCloud(600, 120);
    drawCloud(800, 80);

    drawMountain(200, floorPos_y, 300, 250);
    drawMountain(400, floorPos_y, 250, 200);
    drawMountain(650, floorPos_y, 350, 280);

    drawCanyon(canyon.x_pos, floorPos_y, canyon.width, ORIGINAL_HEIGHT - floorPos_y);

    // --- Canyon Physics ---
    if(gameChar_x > canyon.x_pos && gameChar_x < canyon.x_pos + canyon.width && gameChar_y >= floorPos_y) {
        isPlummeting = true;
    }

    if(isPlummeting == true) {
        gameChar_y += 5;
    }
    
    // --- Collectable Logic ---
    if(collectable.isFound == false) {
        drawCoin(collectable.x_pos, collectable.y_pos);
    }

    if(collectable.isFound == false) {
        if(dist(gameChar_x, gameChar_y, collectable.x_pos, collectable.y_pos) < 50) {
            collectable.isFound = true;
        }
    }

    // --- NEW MOVEMENT LOGIC (Fixes Sticky Keys) ---
    isLeft = false;
    isRight = false;

    if (isPlummeting == false) {
        // Check if Left Arrow (37) or A (65) is held down
        if (keyIsDown(37) || keyIsDown(65)) {
            gameChar_x -= 5;
            isLeft = true;
        }

        // Check if Right Arrow (39) or D (68) is held down
        if (keyIsDown(39) || keyIsDown(68)) {
            gameChar_x += 5;
            isRight = true;
        }
    }
	
    
    if (isLeft && isFalling) {
        // --- Jumping Left ---
        //Tread
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 30, 20, 10, 5);
        //Body
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 55, 16, 25, 5);
        //Arm
        fill(130);
        push();
        translate(gameChar_x, gameChar_y -45);
        rotate(0.5);
        rect(-8, 0, 8, 15, 3);
        pop();
        //Head
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 85, 20, 30, 8);
        //Eye
        fill(0, 255, 255);
        ellipse(gameChar_x - 8, gameChar_y - 70, 6, 8);
        //Antenna
        stroke(100);
        line(gameChar_x, gameChar_y - 85, gameChar_x - 4, gameChar_y - 95);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x - 4, gameChar_y - 95, 6, 6);
        //Thruster
        fill(255, 200, 0, 150);
        ellipse(gameChar_x, gameChar_y - 15, 15, 10);

    } else if (isRight && isFalling) {
        // --- Jumping Right ---
        //Tread
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 30, 20, 10, 5);
        //Body
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 55, 16, 25, 5);
        //Arm (Angled up slightly for jump)
        fill(130);
        push();
        translate(gameChar_x, gameChar_y -45);
        rotate(-0.5);
        rect(0, 0, 8, 15, 3);
        pop();
        //Head
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 85, 20, 30, 8);
        //Eye
        fill(0, 255, 255);
        ellipse(gameChar_x + 8, gameChar_y - 70, 6, 8);
        //Antenna
        stroke(100);
        line(gameChar_x, gameChar_y - 85, gameChar_x + 4, gameChar_y - 95);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x + 4, gameChar_y - 95, 6, 6);
        //Thruster
        fill(255, 200, 0, 150);
        ellipse(gameChar_x, gameChar_y - 15, 15, 10);

    } else if (isLeft) {
        // --- Walking Left ---
        //Tread (Side view)
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 10, 20, 10, 5);
        //Body (Side view)
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 35, 16, 25, 5);
        //Arm (swinging back slightly)
        fill(130);
        rect(gameChar_x, gameChar_y - 30, 8, 15, 3);
        //Head (Side view)
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 65, 20, 30, 8);
        //Eye (Only one visible on left side)
        fill(0, 255, 255);
        ellipse(gameChar_x - 8, gameChar_y - 50, 6, 8);
        //Antenna
        stroke(100);
        line(gameChar_x, gameChar_y - 65, gameChar_x - 2, gameChar_y - 75);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x - 2, gameChar_y - 75, 6, 6);

    } else if (isRight) {
       
        //Tread
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 10, 20, 10, 5);
        //Body
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 35, 16, 25, 5);
        //Arm (swinging back slightly)
        fill(130);
        rect(gameChar_x - 8, gameChar_y - 30, 8, 15, 3);
        //Head
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 65, 20, 30, 8);
        //Eye (Visible on right side)
        fill(0, 255, 255);
        ellipse(gameChar_x + 8, gameChar_y - 50, 6, 8);
        //Antenna
        stroke(100);
        line(gameChar_x, gameChar_y - 65, gameChar_x + 2, gameChar_y - 75);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x + 2, gameChar_y - 75, 6, 6);

    } else if (isFalling || isPlummeting) {
       
        //Treads
        fill(100);
        rect(gameChar_x - 15, gameChar_y - 30, 10, 10, 3); // Left tread
        rect(gameChar_x + 5, gameChar_y - 30, 10, 10, 3);  // Right tread
        //Body
        fill(150);
        rect(gameChar_x - 12, gameChar_y - 55, 24, 25, 5); // Main body
        //Head
        fill(180);
        rect(gameChar_x - 15, gameChar_y - 85, 30, 30, 8); // Head base
        //Eyes (Glowing)
        fill(0, 255, 255);
        ellipse(gameChar_x - 7, gameChar_y - 70, 8, 8);
        ellipse(gameChar_x + 7, gameChar_y - 70, 8, 8);
        //Antenna
        stroke(100);
        line(gameChar_x, gameChar_y - 85, gameChar_x, gameChar_y - 95);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x, gameChar_y - 95, 6, 6);
        //Simple "thruster" effect
        fill(255, 200, 0, 150);
        ellipse(gameChar_x - 10, gameChar_y - 15, 8, 15);
        ellipse(gameChar_x + 10, gameChar_y - 15, 8, 15);

    } else {
       
        //Treads
        fill(100);
        rect(gameChar_x - 15, gameChar_y - 10, 10, 10, 3); // Left tread
        rect(gameChar_x + 5, gameChar_y - 10, 10, 10, 3);  // Right tread
        //Body
        fill(150);
        rect(gameChar_x - 12, gameChar_y - 35, 24, 25, 5); // Main body
        //Head
        fill(180);
        rect(gameChar_x - 15, gameChar_y - 65, 30, 30, 8); // Head base
        //Eyes (Glowing)
        fill(0, 255, 255); // Cyan glow
        ellipse(gameChar_x - 7, gameChar_y - 50, 8, 8);
        ellipse(gameChar_x + 7, gameChar_y - 50, 8, 8);
        //Antenna
        stroke(100);
        line(gameChar_x, gameChar_y - 65, gameChar_x, gameChar_y - 75);
        noStroke();
        fill(255, 50, 50); // Red light
        ellipse(gameChar_x, gameChar_y - 75, 6, 6);
    }
    
    // --- Foreground ---
    drawTree(120, floorPos_y - 50);

    // --- Gravity Logic ---
    if (gameChar_y < floorPos_y) {
        gameChar_y += 2; 
        isFalling = true; 
    } else {
        isFalling = false; 
    }
    
    pop(); 

    coinAngle += 0.05;
}

function keyPressed() {
    
    //Freeze movement during plummet
    if (isPlummeting) {
        return;
    }

    // Only handle Jumping (Space or W)
    if (keyCode == 32 || keyCode == 87) { 
        if (!isFalling && !isPlummeting) { 
            gameChar_y -= 100; 
        }
    }
}

function drawCloud(x, y) {
    fill(255);
    noStroke();
    ellipse(x, y, 80, 60);
    ellipse(x + 40, y, 100, 70);
    ellipse(x + 80, y, 80, 60);
}

function drawMountain(baseX, baseY, w, h) {
    fill(120);
    noStroke();
    triangle(baseX, baseY, baseX + w / 2, baseY - h, baseX + w, baseY);
    fill(255);
    triangle(baseX + w / 2, baseY - h, baseX + w / 2 - 30, baseY - h + 50, baseX + w / 2 + 30, baseY - h + 50);
}

function drawTree(x, y) {
    fill(139, 69, 19);
    noStroke();
    rect(x, y, 40, 120);
    fill(34, 139, 34);
    ellipse(x + 20, y - 40, 140, 140);
    ellipse(x - 30, y, 100, 100);
    ellipse(x + 70, y, 100, 100);
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