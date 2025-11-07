let cells = [];
let glowPositions = [];
let breatheOffset = 0;

function setup() {
  createCanvas(800, 600);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Create organic cell-like structures mimicking the fluid art
  for (let i = 0; i < 120; i++) {
    cells.push({
      x: random(width),
      y: random(height),
      size: random(20, 180),
      hue: random(180, 280), // Blues to purples
      sat: random(40, 90),
      bright: random(60, 90),
      alpha: random(30, 80),
      offsetX: random(-30, 30),
      offsetY: random(-30, 30)
    });
  }
  
  // Add warm accent cells like in the original
  for (let i = 0; i < 40; i++) {
    cells.push({
      x: random(width * 0.3, width * 0.7),
      y: random(height * 0.4, height * 0.8),
      size: random(15, 100),
      hue: random(20, 60), // Oranges to yellows
      sat: random(70, 95),
      bright: random(80, 95),
      alpha: random(50, 85),
      offsetX: random(-20, 20),
      offsetY: random(-20, 20)
    });
  }
  
  // Add some pink/magenta accents
  for (let i = 0; i < 25; i++) {
    cells.push({
      x: random(width * 0.2, width * 0.8),
      y: random(height * 0.3, height * 0.9),
      size: random(10, 60),
      hue: random(300, 340),
      sat: random(60, 85),
      bright: random(70, 90),
      alpha: random(40, 75),
      offsetX: random(-15, 15),
      offsetY: random(-15, 15)
    });
  }
}

function draw() {
  background(220, 15, 85); // Soft gray-blue background
  
  breatheOffset += 0.02;
  
  // Draw cellular structure with organic blending
  for (let cell of cells) {
    let distToMouse = dist(mouseX, mouseY, cell.x + cell.offsetX, cell.y + cell.offsetY);
    let hoverEffect = map(constrain(distToMouse, 0, 150), 0, 150, 1.5, 1.0);
    let glowIntensity = map(constrain(distToMouse, 0, 100), 0, 100, 25, 0);
    
    // Breathing effect
    let breathe = sin(breatheOffset + cell.x * 0.01 + cell.y * 0.01) * 0.1 + 1;
    
    // Main cell body
    fill(cell.hue, cell.sat, cell.bright * breathe * hoverEffect, cell.alpha);
    noStroke();
    
    // Create organic, irregular shapes instead of perfect circles
    let points = 8;
    let angleStep = TWO_PI / points;
    
    beginShape();
    for (let i = 0; i < points; i++) {
      let angle = angleStep * i;
      let radius = cell.size * (0.7 + 0.3 * noise(cell.x * 0.01 + cos(angle), cell.y * 0.01 + sin(angle), frameCount * 0.005));
      let x = cell.x + cell.offsetX + cos(angle) * radius * hoverEffect;
      let y = cell.y + cell.offsetY + sin(angle) * radius * hoverEffect;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Add subtle glow on hover
    if (glowIntensity > 0) {
      fill(cell.hue, cell.sat * 0.6, min(100, cell.bright * 1.3), glowIntensity);
      let glowSize = cell.size * hoverEffect * 1.4;
      ellipse(cell.x + cell.offsetX, cell.y + cell.offsetY, glowSize, glowSize);
    }
  }
  
  // Add some connecting membrane-like structures
  stroke(200, 20, 90, 15);
  strokeWeight(1);
  for (let i = 0; i < cells.length - 1; i += 3) {
    let cell1 = cells[i];
    let cell2 = cells[i + 1];
    let distance = dist(cell1.x, cell1.y, cell2.x, cell2.y);
    
    if (distance < 120) {
      line(cell1.x + cell1.offsetX, cell1.y + cell1.offsetY, 
           cell2.x + cell2.offsetX, cell2.y + cell2.offsetY);
    }
  }
  
  noStroke();
}

function mouseMoved() {
  // Create gentle ripple effect
  glowPositions.push({
    x: mouseX,
    y: mouseY,
    life: 20,
    maxLife: 20
  });
  
  // Limit array size
  if (glowPositions.length > 5) {
    glowPositions.shift();
  }
}