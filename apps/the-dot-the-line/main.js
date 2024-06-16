/* eslint-disable no-undef */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

class Dot {
  constructor() {
    this.reset();
  }
  move() {
    this.x += Math.cos(this.directionAngle) * 0.5;
    this.y += Math.sin(this.directionAngle) * 0.5;
  }
  reset() {
    this.x = Math.floor(Math.random() * canvasWidth);
    this.y = Math.floor(Math.random() * canvasHeight);
    this.directionAngle = Math.random() * 2 * Math.PI;
  }
  isOutOfScreen() {
    return (
      this.x > canvasWidth || this.x < 0 || this.y > canvasHeight || this.y < 0
    );
  }
}

const drawCircle = (point, radius) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
};

const drawLine = (point1, point2) => {
  // Start a new Path
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);

  // Draw the Path
  ctx.stroke();
};

// const mouse = { x: 0, y: 0 };

const getDistance = (point1, point2) => {
  return Math.sqrt(
    Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
  );
};

// const getRandomPoint = () => {
//   return {
//     x: Math.floor(Math.random() * canvasWidth),
//     y: Math.floor(Math.random() * canvasHeight),
//   };
// };

const getPointArray = (size) => {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(new Dot());
  }
  return arr;
};

const pointArray = getPointArray(50);

const animate = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  pointArray.forEach((currentPoint) => {
    drawCircle(currentPoint, 5);
    currentPoint.move();
    if (currentPoint.isOutOfScreen()) {
      currentPoint.reset();
    }
    pointArray.forEach((otherPoint) => {
      if (getDistance(currentPoint, otherPoint) <= 200) {
        drawLine(currentPoint, otherPoint);
      }
    });
  });
  // drawCircle(mouse.x, mouse.y, 0);

  requestAnimationFrame(animate);
};

animate();

// canvas.onmousemove = function (event) {
//   mouse.x = event.clientX - ctx.canvas.offsetLeft;
//   mouse.y = event.clientY - ctx.canvas.offsetTop;
// };
