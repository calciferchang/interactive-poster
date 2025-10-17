const APEX = {}
const ANGLES = [-25, -23, -20, -16, -13, -11, -6.5, 0, 5.25, 10, 13, 18, 22, 24, 25.5]
function setup() {
  createCanvas(400, 400);
  APEX.x = width / 2
  APEX.y = height / 3

  for (let i = 0; i < ANGLES.length; i++) {
    drawLineFromAngle(ANGLES[i])
  }
}

function draw() {
}

function keyPressed() {
  stroke(255)
  let randomAngle = floor(constrain(randomGaussian(8, 4), 0, 16))
  print(randomAngle)
  drawLineFromAngle(ANGLES[randomAngle])
}
function drawLineFromAngle(angleDegrees) {
  const angle = radians(angleDegrees + 90); // to make angles read from relationship to center line
  const y1 = height + 100;
  const dy = y1 - APEX.y;  // vertical distance to travel
  const distance = dy / sin(angle);  // total distance along the line
  const x1 = APEX.x + distance * cos(angle);

  line(APEX.x, APEX.y, x1, y1);
}
