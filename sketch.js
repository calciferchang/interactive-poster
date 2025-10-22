const APEX = {};
const SETUP = {
  angles: [-25, -23, -20, -16, -13, -11, -6.5, 0, 5.25, 10, 13, 18, 22, 24, 25.5],
};
let shapes = [];

function setup() {
  createCanvas(400, 400);
  APEX.x = width / 2;
  APEX.y = height / 3;
  SETUP.startY = height + 1
}

function draw() {
  background(255);

  for (let shape of shapes) {
    if (shape.y === floor(APEX.y)) {
      shape.height -= 1
    } else {
      shape.y -= 1
    }
    stroke(0);
    drawQuad(shape);
  }
}

function keyPressed() {
  const shape = new Shape(
    selectBoundaryAngles(),
    SETUP.startY,
    generateShapeConfig()
  )
  shapes.push(shape);
}

function getX(y, angleDegrees) {
  const angle = radians(angleDegrees + 90); // change orientation of provided angles to face downwards.
  const dy = y - APEX.y;
  const distance = dy / sin(angle);
  const x = APEX.x + distance * cos(angle);
  return x;
}

function drawQuad(shape) {
  let y1 = shape.y;
  let x1
  let y2
  let x2
  if (y1 === floor(APEX.y)) {
    x1 = floor(APEX.x)
  } else {
    x1 = getX(y1, shape.lanes.inner);
  }
  y2 = y1 + shape.topOffset;
  x2 = getX(y2, shape.lanes.outer);
  let y3 = y2 + shape.height;
  let x3 = getX(y3, shape.lanes.outer);
  let y4 = y1 + shape.height + shape.bottomOffsetDeviation;
  let x4 = getX(y4, shape.lanes.inner);
  quad(x1, y1, x2, y2, x3, y3, x4, y4);
}

function drawLineFromAngle(angleDegrees) {
  const angle = radians(angleDegrees + 90); // to make angles read from relationship to center line
  const y1 = height + 1;
  const dy = y1 - APEX.y; // vertical distance to travel
  const distance = dy / sin(angle); // total distance along the line
  const x1 = APEX.x + distance * cos(angle);

  line(APEX.x, APEX.y, x1, y1);
}

class Shape {
  constructor(lanes, y, config) {
    this.lanes = lanes
    this.y = y
    this.height = config.height
    this.topOffset = config.topOffset
    this.bottomOffsetDeviation = config.bottomOffsetDeviation
  }
}

// Helper functions
function selectBoundaryAngles() {
  const NUM_ANGLES = SETUP.angles.length;
  const CENTER_INDEX = NUM_ANGLES / 2;

  let angleIndex = floor(constrain(randomGaussian(CENTER_INDEX, 4), 0, NUM_ANGLES - 2));
  let leftAngle = SETUP.angles[angleIndex];
  let rightAngle = SETUP.angles[angleIndex + 1];

  // Ensure that shapes will always be angled towards the center.
  let inner = abs(leftAngle) < abs(rightAngle) ? leftAngle : rightAngle;
  let outer = leftAngle === inner ? rightAngle : leftAngle;

  return { inner, outer };
}

function generateShapeConfig() {
  let shapeHeight = 50;
  let deviation = shapeHeight / 10;

  return {
    height: shapeHeight,
    topOffset: random(height / 80, height / 20),
    bottomOffsetDeviation: random(-deviation, deviation)
  };
}
