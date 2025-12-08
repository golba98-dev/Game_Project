var gameChar_x;
var gameChar_y;
var floorPos_y;

var trees = [];
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
    
    // Lowered the floor to give more sky space
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

    // --- TREE GENERATION WITH SPACING LOGIC ---
    trees = [];
    
    // Try to place 15 trees
    for (var i = 0; i < 15; i++) {
        
        var validPosition = false;
        var maxAttempts = 100; // Prevent infinite loops
        var attempts = 0;
        var tx = 0;

        while (!validPosition && attempts < maxAttempts) {
            // Pick a random spot in a wide world (-1500 to 2500)
            tx = random(-1500, 2500);
            validPosition = true;

            // CHECK 1: Is it in the Canyon?
            // (checking with an 80px buffer so it doesn't hang off the edge)
            if (tx > canyon.x_pos - 80 && tx < canyon.x_pos + canyon.width + 80) {
                validPosition = false;
            }

            // CHECK 2: Is it too close to an existing tree?
            // Loop through all trees we have already made
            if (validPosition) {
                for (var j = 0; j < trees.length; j++) {
                    var distance = abs(trees[j].x - tx);
                    // If distance is less than 150px, it's too close
                    if (distance < 150) {
                        validPosition = false;
                        break;
                    }
                }
            }

            attempts++;
        }

        // Only add the tree if we found a valid spot
        if (validPosition) {
            trees.push({
                x: tx,
                y: floorPos_y,
                trunkW: random(25, 45),
                trunkH: random(80, 160),
                canopySize: random(100, 150),
                leafColor: color(random(20, 60), random(100, 180), random(20, 60))
            });
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    let scaleX = width / ORIGINAL_WIDTH;
    let scaleY = height / ORIGINAL_HEIGHT;

    background(135, 206, 250);

    push();
    scale(scaleX, scaleY);

    var cameraPosX = gameChar_x - ORIGINAL_WIDTH / 2;
    translate(-cameraPosX, 0);

    noStroke();
    
    // Draw Ground
    fill(34, 139, 34);
    rect(-2000, floorPos_y, ORIGINAL_WIDTH + 4000, ORIGINAL_HEIGHT / 2);

    // Draw Background Objects
    drawCloud(150, 100);
    drawCloud(300, 150);
    drawCloud(600, 120);
    drawCloud(800, 80);

    drawMountain(200, floorPos_y, 300, 250);
    drawMountain(400, floorPos_y, 250, 200);
    drawMountain(650, floorPos_y, 350, 280);

    // Draw Trees
    for (var i = 0; i < trees.length; i++) {
        drawTree(trees[i]);
    }

    drawCanyon(canyon.x_pos, floorPos_y, canyon.width, ORIGINAL_HEIGHT - floorPos_y);

    // Logic: Falling into Canyon
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
    
    // --- DRAWING THE CHARACTER (Expanded Format) ---
    
    if (isLeft && isFalling) {
        // Jumping Left
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
        // Jumping Right
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
        // Walking Left
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
        // Walking Right
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
        // Falling Forward
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
        // Standing Front
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

    // Physics
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
    if (isPlummeting) { return; }
    
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

function drawTree(t) {
    noStroke();
    
    // Draw Shadow
    fill(0, 50); 
    ellipse(t.x + t.trunkW/2, t.y, t.trunkW * 1.5, 10);
    
    // Draw Trunk
    fill(100, 50, 10); 
    rect(t.x, t.y - t.trunkH, t.trunkW, t.trunkH);
    
    // Draw Foliage (3 Layers for detail)
    fill(t.leafColor);
    ellipse(t.x + t.trunkW/2, t.y - t.trunkH * 0.8, t.canopySize, t.canopySize * 0.8);
    
    // Middle Layer (Lighter)
    fill(red(t.leafColor) + 20, green(t.leafColor) + 20, blue(t.leafColor) + 20);
    ellipse(t.x + t.trunkW/2 - 20, t.y - t.trunkH, t.canopySize * 0.7, t.canopySize * 0.7);
    ellipse(t.x + t.trunkW/2 + 20, t.y - t.trunkH, t.canopySize * 0.7, t.canopySize * 0.7);
    
    // Top Layer
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