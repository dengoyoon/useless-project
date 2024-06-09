/* eslint-disable no-undef */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.setAttribute("width", window.innerWidth);
canvas.setAttribute("height", window.innerHeight);

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const pi = Math.PI;

const drawCircle = (point, radius) => {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, 2 * pi);
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

const getRandomPoint = () => {
  return {
    x: Math.floor(Math.random() * canvasWidth),
    y: Math.floor(Math.random() * canvasHeight),
  };
};

const getPointArray = (size) => {
  const arr = [];
  for (let i = 0; i < size; i++) {
    arr.push(getRandomPoint());
  }
  return arr;
};

const pointArray = getPointArray(50);

const animate = () => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  pointArray.forEach((currentPoint) => {
    drawCircle(currentPoint, 5);
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
