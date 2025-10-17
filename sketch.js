const APEX = {}
const ANGLES = [-25, -23, -20, -16, -13, -11, -6.5, 0, 5.25, 10, 13, 18, 22, 24, 25.5]
let quads = []

function setup() {
  createCanvas(400, 400);
  APEX.x = width / 2
  APEX.y = height / 3

  stroke(0)
  for (let i = 0; i < ANGLES.length; i++) {
    drawLineFromAngle(ANGLES[i])
  }
}

function draw() {
  background(255)
 
  for (let q of quads) {
    q.y -= 1
    
    if (q.startY < APEX.y) {
      Object.assign(q, createQuad())
    }
   
    stroke(0)
    drawQuad(q)
  }

  for (let i = 0; i < ANGLES.length; i++) {
    drawLineFromAngle(ANGLES[i])
  }
}

function keyPressed() {
  quads.push(createQuad())
}

function getX(y, angleDegrees) {
  const angle = radians(angleDegrees + 90) // change orientation of provided angles to face downwards.
  const dy = y - APEX.y
  const distance = dy / sin(angle)
  const x = APEX.x + distance * cos(angle)
  return x
}

function createQuad() {
  // gaussian instead of random to concentrate quads toward the center
  let index = floor(constrain(randomGaussian(6.5, 4), 0, 13))
  let val1 = ANGLES[index]
  let val2 = ANGLES[index + 1]

  // ensure that the angle closest to the center will be mapped first
  let closer = abs(val1) < abs(val2) ? val1 : val2
  let farther = val1 === closer ? val2 : val1
  let angle = [closer, farther]

  stroke(255, 204, 100)
  drawLineFromAngle(angle[0])
  stroke('red');
  drawLineFromAngle(angle[1])

  let quadHeight = 50;
  let deviation = quadHeight / 10
  return {
    angle: [closer, farther],
    y: 300,
    height: quadHeight,
    slope: random(height / 80, height / 20),
    deviation: random(-deviation, deviation)
  }
}

function drawQuad(q) {
  let y1 = q.y
  let x1 = getX(y1, q.angle[0])
  let y2 = y1 + q.slope
  let x2 = getX(y2, q.angle[1])
  let y3 = y2 + q.height
  let x3 = getX(y3, q.angle[1])
  let y4 = y1 + q.height + q.deviation
  let x4 = getX(y4, q.angle[0])

  quad(x1, y1, x2, y2, x3, y3, x4, y4)
}

function drawLineFromAngle(angleDegrees) {
  const angle = radians(angleDegrees + 90); // to make angles read from relationship to center line
  const y1 = height + 1;
  const dy = y1 - APEX.y;  // vertical distance to travel
  const distance = dy / sin(angle);  // total distance along the line
  const x1 = APEX.x + distance * cos(angle);

  line(APEX.x, APEX.y, x1, y1);
}
