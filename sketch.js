var gameChar_x;
var gameChar_y;
var floorPos_y;

// We use this array to store tree objects (with random properties)
var trees = [];
var trees_x = [120, 400, 700, 1000, 1400];

var isLeft = false;
var isRight = false;
var isFalling = false;
var isPlummeting = false; 

let coinAngle = 0;
const ORIGINAL_WIDTH = 1000;
const ORIGINAL_HEIGHT = 600;

var collectable;
var canyon;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    document.body.style.overflow = "hidden"; 
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    
    // --- MODIFICATION: Lowered the floor ---
    // Changed from 300 to 450. 
    // This moves the ground down, giving you more sky and less "grass wall".
    floorPos_y = 450; 
    
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

    // --- MODIFICATION: Generate Random Trees ---
    // We populate the 'trees' array with objects containing random sizes and colors
    trees = [];
    for (var i = 0; i < trees_x.length; i++) {
        trees.push({
            x: trees_x[i],
            y: floorPos_y,
            // Randomize trunk width and height
            trunkW: random(25, 45),
            trunkH: random(80, 160),
            // Randomize canopy (leaf) size
            canopySize: random(100, 150),
            // Randomize leaf color (various shades of green)
            leafColor: color(random(20, 60), random(100, 180), random(20, 60))
        });
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    let scaleX = width / ORIGINAL_WIDTH;
    let scaleY = height / ORIGINAL_HEIGHT;

    background(135, 206, 250); // Sky Blue

    push();
    scale(scaleX, scaleY);

    // Camera: keep the character roughly centered by translating the world
    var cameraPosX = gameChar_x - ORIGINAL_WIDTH / 2;
    translate(-cameraPosX, 0);

    noStroke();
    
    // Draw the ground (extended for scrolling)
    fill(34, 139, 34);
    rect(-2000, floorPos_y, ORIGINAL_WIDTH + 4000, ORIGINAL_HEIGHT / 2);

    // Background objects
    drawCloud(150, 100);
    drawCloud(300, 150);
    drawCloud(600, 120);
    drawCloud(800, 80);

    drawMountain(200, floorPos_y, 300, 250);
    drawMountain(400, floorPos_y, 250, 200);
    drawMountain(650, floorPos_y, 350, 280);

    // --- MODIFICATION: Draw the detailed trees ---
    for (var i = 0; i < trees.length; i++) {
        drawTree(trees[i]);
    }

    drawCanyon(canyon.x_pos, floorPos_y, canyon.width, ORIGINAL_HEIGHT - floorPos_y);

    // Logic: Falling into canyon
    if(gameChar_x > canyon.x_pos && gameChar_x < canyon.x_pos + canyon.width && gameChar_y >= floorPos_y) {
        isPlummeting = true;
    }

    if(isPlummeting == true) {
        gameChar_y += 5;
    }
    
    // Logic: Collectable
    if(collectable.isFound == false) {
        drawCoin(collectable.x_pos, collectable.y_pos);
    }

    if(collectable.isFound == false) {
        if(dist(gameChar_x, gameChar_y, collectable.x_pos, collectable.y_pos) < 50) {
            collectable.isFound = true;
        }
    }

    // Logic: Movement
    isLeft = false;
    isRight = false;

    if (isPlummeting == false) {
        if (keyIsDown(37) || keyIsDown(65)) {
            gameChar_x -= 5;
            isLeft = true;
        }

        if (keyIsDown(39) || keyIsDown(68)) {
            gameChar_x += 5;
            isRight = true;
        }
    }
    
    // --- Character Drawing Logic ---
    if (isLeft && isFalling) {
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 30, 20, 10, 5);
        
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 55, 16, 25, 5);
       
        fill(130);
        push();
        translate(gameChar_x, gameChar_y -45);
        rotate(0.5);
        rect(-8, 0, 8, 15, 3);
        pop();
  
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 85, 20, 30, 8);
        
        fill(0, 255, 255);
        ellipse(gameChar_x - 8, gameChar_y - 70, 6, 8);
    
        stroke(100);
        line(gameChar_x, gameChar_y - 85, gameChar_x - 4, gameChar_y - 95);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x - 4, gameChar_y - 95, 6, 6);
        
        fill(255, 200, 0, 150);
        ellipse(gameChar_x, gameChar_y - 15, 15, 10);

    } else if (isRight && isFalling) {
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 30, 20, 10, 5);
      
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 55, 16, 25, 5);
      
        fill(130);
        push();
        translate(gameChar_x, gameChar_y -45);
        rotate(-0.5);
        rect(0, 0, 8, 15, 3);
        pop();
      
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 85, 20, 30, 8);
       
        fill(0, 255, 255);
        ellipse(gameChar_x + 8, gameChar_y - 70, 6, 8);
        
        stroke(100);
        line(gameChar_x, gameChar_y - 85, gameChar_x + 4, gameChar_y - 95);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x + 4, gameChar_y - 95, 6, 6);
       
        fill(255, 200, 0, 150);
        ellipse(gameChar_x, gameChar_y - 15, 15, 10);

    } else if (isLeft) {
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 10, 20, 10, 5);
      
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 35, 16, 25, 5);
        
        fill(130);
        rect(gameChar_x, gameChar_y - 30, 8, 15, 3);
      
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 65, 20, 30, 8);
     
        fill(0, 255, 255);
        ellipse(gameChar_x - 8, gameChar_y - 50, 6, 8);
       
        stroke(100);
        line(gameChar_x, gameChar_y - 65, gameChar_x - 2, gameChar_y - 75);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x - 2, gameChar_y - 75, 6, 6);

    } else if (isRight) {
        fill(100);
        rect(gameChar_x - 10, gameChar_y - 10, 20, 10, 5);
        
        fill(150);
        rect(gameChar_x - 8, gameChar_y - 35, 16, 25, 5);
      
        fill(130);
        rect(gameChar_x - 8, gameChar_y - 30, 8, 15, 3);
       
        fill(180);
        rect(gameChar_x - 10, gameChar_y - 65, 20, 30, 8);
        
        fill(0, 255, 255);
        ellipse(gameChar_x + 8, gameChar_y - 50, 6, 8);
      
        stroke(100);
        line(gameChar_x, gameChar_y - 65, gameChar_x + 2, gameChar_y - 75);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x + 2, gameChar_y - 75, 6, 6);

    } else if (isFalling || isPlummeting) {
        fill(100);
        rect(gameChar_x - 15, gameChar_y - 30, 10, 10, 3); 
        rect(gameChar_x + 5, gameChar_y - 30, 10, 10, 3);  
        
        fill(150);
        rect(gameChar_x - 12, gameChar_y - 55, 24, 25, 5);
        
        fill(180);
        rect(gameChar_x - 15, gameChar_y - 85, 30, 30, 8);
       
        fill(0, 255, 255);
        ellipse(gameChar_x - 7, gameChar_y - 70, 8, 8);
        ellipse(gameChar_x + 7, gameChar_y - 70, 8, 8);
       
        stroke(100);
        line(gameChar_x, gameChar_y - 85, gameChar_x, gameChar_y - 95);
        noStroke();
        fill(255, 50, 50);
        ellipse(gameChar_x, gameChar_y - 95, 6, 6);
      
        fill(255, 200, 0, 150);
        ellipse(gameChar_x - 10, gameChar_y - 15, 8, 15);
        ellipse(gameChar_x + 10, gameChar_y - 15, 8, 15);

    } else {
        fill(100);
        rect(gameChar_x - 15, gameChar_y - 10, 10, 10, 3); 
        rect(gameChar_x + 5, gameChar_y - 10, 10, 10, 3);  
        
        fill(150);
        rect(gameChar_x - 12, gameChar_y - 35, 24, 25, 5); 
      
        fill(180);
        rect(gameChar_x - 15, gameChar_y - 65, 30, 30, 8); 
      
        fill(0, 255, 255); 
        ellipse(gameChar_x - 7, gameChar_y - 50, 8, 8);
        ellipse(gameChar_x + 7, gameChar_y - 50, 8, 8);
       
        stroke(100);
        line(gameChar_x, gameChar_y - 65, gameChar_x, gameChar_y - 75);
        noStroke();
        fill(255, 50, 50); 
        ellipse(gameChar_x, gameChar_y - 75, 6, 6);
    }

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
    if (isPlummeting) {
        return;
    }

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

// --- MODIFICATION: New Detailed Tree Function ---
// This function now takes a 'tree object' (t) instead of just x,y
function drawTree(t) {
    noStroke();
    
    // 1. Shadow at the base
    fill(0, 50); // Transparent black
    ellipse(t.x + t.trunkW/2, t.y, t.trunkW * 1.5, 10);

    // 2. Trunk
    fill(100, 50, 10); // Brown
    rect(t.x, t.y - t.trunkH, t.trunkW, t.trunkH);
    
    // 3. Foliage (Leaves) - Uses the random color specific to this tree
    fill(t.leafColor);
    
    // Draw 3 layers of leaves to make it look detailed
    // Bottom bush
    ellipse(t.x + t.trunkW/2, t.y - t.trunkH * 0.8, t.canopySize, t.canopySize * 0.8);
    
    // Middle bushes (slightly brighter for 3D effect)
    fill(red(t.leafColor) + 20, green(t.leafColor) + 20, blue(t.leafColor) + 20);
    ellipse(t.x + t.trunkW/2 - 20, t.y - t.trunkH, t.canopySize * 0.7, t.canopySize * 0.7);
    ellipse(t.x + t.trunkW/2 + 20, t.y - t.trunkH, t.canopySize * 0.7, t.canopySize * 0.7);
    
    // Top bush
    fill(t.leafColor);
    ellipse(t.x + t.trunkW/2, t.y - t.trunkH * 1.2, t.canopySize * 0.6, t.canopySize * 0.6);
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