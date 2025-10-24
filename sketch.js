/// <reference types="p5" />

const APEX = {};
const SETUP = {
	angles: [-25, -23, -20, -16, -13, -11, -6.5, 0, 5.25, 10, 13, 18, 22, 24, 25.5],
};
let shapes = [];

function setup() {
	let container = select('#sketch-container');
	let w = container.width;
	let h = container.height;
	createCanvas(w, h);
	select('canvas').parent('sketch-container');

	APEX.x = floor(width / 2);
	APEX.y = floor(height / 5);
	SETUP.startY = height + 1

	colorMode(HSB) // HSB makes it easier to generate a desirable palette
	newShape() // Create a single shape so that the server does not crash on reload.
}

function draw() {
	background(255);
	if (frameCount % 8 === 0) {  // Generate shapes every 60 frames 
		newShape()
	}
	for (let shape of shapes) {
		shape.render()
	}
	shapes = shapes.filter(shape => !shape.isDead)
}

class Shape {
	constructor(lanes, y, config) {
		this.lanes = lanes
		this.y = y
		this.segmentHeight = config.segmentHeight
		this.topOffset = config.topOffset
		this.bottomOffsetDeviation = config.bottomOffsetDeviation
		this.color = config.color
		this.isDead = false
	}

	render() {
		noStroke()	
		fill(...this.color)
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

	let angleIndex = floor(random(0, NUM_ANGLES - 1)) 
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
	let shapeHeight = floor(random(height / 20, height / 8))
	let deviation = shapeHeight / 10
	return {
		segmentHeight: shapeHeight,
		topOffset: random(height / 100, height / 33),
		bottomOffsetDeviation: random(-deviation, deviation),
		color: generateColor()
	};
}

function newShape() {
	const newShape = new Shape(
		selectBoundaryAngles(),
		SETUP.startY,
		generateShapeConfig()
	)
	shapes.push(newShape);
}

function generateColor() {
	let i = random(0, COLORS.length - 1)	
	return [
		// Generate HSB values from predetermined ranges
		random(COLORS[i].h[0], COLORS[i].h[1]),
		random(COLORS[i].s[0], COLORS[i].s[1]),
		random(COLORS[i].b[0], COLORS[i].b[1]),
		COLORS[i].a
	]
}

const COLORS = [
	{ // Blue
		h: [190, 230],
		s: [30, 85],
		b: [30, 80],
		a: 80
	}
]
	
