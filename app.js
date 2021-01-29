window.onload = main;

var mode = 0;
var key;

var canvas
var gl
var program

function main() {
  canvas = document.querySelector("#canvas-board");
  gl = canvas.getContext("webgl");

  if (!gl) {
    console.error("Webgl is not supported");
    return;
  }
  program = shaderprogram(gl);

  document.addEventListener("keydown", (event) =>
    keyBoardhandler(gl, program, event)
  );
  document.addEventListener("mousedown", (event) =>
    mousehandler(gl, program, event)
  );
}

function resizeCanvasToDisplaySize(canvas) {
  // Lookup the size the browser is displaying the canvas in CSS pixels.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  const needResize =
    canvas.width !== displayWidth || canvas.height !== displayHeight;

  if (needResize) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }

  return needResize;
}

function keyBoardhandler(gl, program, event) {
  key = event.key.toLowerCase();
  switch (key) {
    case "m":
      mode = ++mode % 3;
      break;
  }
}

var objects = [];
function mousehandler(gl, program, event) {
  const cvs = gl.canvas.getBoundingClientRect();
  let x = event.clientX - cvs.left;
  let y = cvs.bottom - event.clientY;

  rasteriseshapes(x, y);
}

function rasteriseshapes(x, y) {
  if (mode === 0) {
    switch (key) {
      case "r":
        objects.push(new Shape("r", x, y));
        break;
      case "s":
        objects.push(new Shape("s", x, y));
        break;
      case "c":
        objects.push(new Shape("c", x, y));
        break;
      default:
        break;
    }
    for (var i = 0; i < objects.length; i++) {
      console.log(objects[i].x)
      objects[i].render()
    }
  }
}

class Shape {
  constructor(type, x, y) {
    this.type = type
    if (type === "s") {
      this.draw = drawsquare;
      this.color = [1, 0, 1, 1];
    } else if (type === "r") {
      this.draw = drawrectangle;
      this.color = [1, 0, 0, 1];
    } else if (type === "c") {
      this.draw = drawcircle;
      this.color = [0, 0, 1, 1];
    }
    this.x = x;
    this.y = y;
  }

  render() {
    this.draw(gl, program, this.x, this.y, this.color);
  }
}
