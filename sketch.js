const APEX = {}
const ANGLES = [-25, -23, -20, -16, -13, -11, -6.5, 0, 5.25, 10, 13, 18, 22, 24, 25.5]

function setup() {
  createCanvas(400, 400);
  APEX.x = width / 2
  APEX.y = height / 3
}

function draw() {
}

function keyPressed() {
  stroke(0)
  for (let i = 0; i < ANGLES.length; i++) {
    drawLineFromAngle(ANGLES[i])
  }

  let index = floor(constrain(randomGaussian(6.5, 4), 0, 13))
  index = 7 // TESTING
  let val1 = ANGLES[index]
  let val2 = ANGLES[index + 1]

  let closer = abs(val1) < abs(val2) ? val1 : val2
  let farther = val1 === closer ? val2 : val1
  let anglePair = [closer, farther]

  stroke(255, 204, 100)
  drawLineFromAngle(anglePair[0])
  stroke('red');
  drawLineFromAngle(anglePair[1])

  genQuad(anglePair)
}

function getX(y, angleDegrees) {
  const angle = radians(angleDegrees + 90)
  const dy = y - APEX.y
  const distance = dy / sin(angle)
  const x = APEX.x + distance * cos(angle)
  return x
}

function genQuad(anglePair) {
  let startY = height / 2
  let quadHeight = 50;
  let deviation = quadHeight / 10
  
  let y1 = startY + 1
  let x1 = getX(y1, anglePair[0])

  let y2 = y1 + random(width / 40, width / 10)
  let x2 = getX(y2, anglePair[1])

  let y3 = y2 + quadHeight
  let x3 = getX(y3, anglePair[1])

  let y4 = y1 + quadHeight + random(-deviation, deviation)
  let x4 = getX(y4, anglePair[0])

  console.log(`Point 1: (${x1}, ${y1})`)
  console.log(`Point 2: (${x2}, ${y2})`)
  console.log(`Point 3: (${x3}, ${y3})`)
  console.log(`Point 4: (${x4}, ${y4})`)
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
