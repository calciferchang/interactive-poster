/// <reference types="p5" />

const APEX = {};
const SETUP = {
	angles: [-25, -23, -20, -16, -13, -11, -6.5, 0, 5.25, 10, 13, 18, 22, 24, 25.5],
};
let shapes = [];

function setup() {
  createCanvas(400, 400);
  APEX.x = floor(width / 2);
  APEX.y = floor(height / 3);
  SETUP.startY = height + 1
}

function draw() {
}

function keyPressed() {
	if (key === "s") {
		noLoop()
	}
	if (key === "d") {
		loop()
	}
	if (key === "f") {
		redraw()
	}
}

function drawLineFromAngle(angleDegrees) {
	const angle = radians(angleDegrees + 90); // to make angles read from relationship to center line
	const y1 = height + 1;

	line(APEX.x, APEX.y, x1, y1);
}

class Shape {
	constructor(lanes, y, config) {
		this.lanes = lanes
		this.y = y
		this.segmentHeight = config.segmentHeight
		this.topOffset = config.topOffset
		this.bottomOffsetDeviation = config.bottomOffsetDeviation
		this.isDead = false
	}

	render() {
		if (this.y === APEX.y) {
			this.shrink()
		} else {
			this.rise()
		}
		if (this.segmentHeight === 1) {
			this.isDead = true;
		}
	}

	shrink() {
		// Drawing a triangle instead of a quad when @ APEX
		let x1 = APEX.x;
		let y1 = APEX.y;
		let y2 = y1 + this.segmentHeight + this.topOffset
		let x2 = getX(y2, this.lanes.outer);
		let y3 = y1 + this.segmentHeight + this.bottomOffsetDeviation;
		let x3 = getX(y3, this.lanes.inner);
		triangle(x1, y1, x2, y2, x3, y3)
		this.segmentHeight -= 1
	}

	rise() {
		let y1 = this.y;
		let x1 = getX(y1, this.lanes.inner);
		let y2 = y1 + this.topOffset;
		let x2 = getX(y2, this.lanes.outer);
		let y3 = y2 + this.segmentHeight;
		let x3 = getX(y3, this.lanes.outer);
		let y4 = y1 + this.segmentHeight + this.bottomOffsetDeviation;
		let x4 = getX(y4, this.lanes.inner);
		quad(x1, y1, x2, y2, x3, y3, x4, y4);
		this.y -= 1
	}
}

// Helper functions
function selectBoundaryAngles() {
  const NUM_ANGLES = SETUP.angles.length;
  const CENTER_INDEX = NUM_ANGLES / 2;

  let angleIndex = floor(constrain(randomGaussian(CENTER_INDEX, 4), 0, NUM_ANGLES - 2))
  let leftAngle = SETUP.angles[angleIndex];
  let rightAngle = SETUP.angles[angleIndex + 1];

  // Ensure that shapes will always be angled towards the center.
  let inner = abs(leftAngle) < abs(rightAngle) ? leftAngle : rightAngle;
  let outer = leftAngle === inner ? rightAngle : leftAngle;

  return { inner, outer };
}

function getX(y, angleDegrees) {
  const angle = radians(angleDegrees + 90); // change orientation of provided angles to face downwards.
  const dy = y - APEX.y;
  const distance = dy / sin(angle);
  const x = APEX.x + distance * cos(angle);
  return x;
}

function generateShapeConfig() {
	let shapeHeight = 50;
	let deviation = shapeHeight / 10;
	return {
		segmentHeight: shapeHeight,
		topOffset: random(4, 12),
		bottomOffsetDeviation: random(-deviation, deviation)
	};
}

}
