window.onload = main;

var mode = 0;
var key;

var canvas;
var gl;
var program;

function main() {
  canvas = document.querySelector("#canvas-board");
  gl = canvas.getContext("webgl");

  if (!gl) {
    console.error("Webgl is not supported");
    return;
  }
  program = shaderprogram(gl);

  document.addEventListener("keydown", (event) => keyBoardhandler(event));
  document.addEventListener("mousedown", (event) => mousehandler(gl, event));
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

var minind = null;
var translations = {};
var rotations = {};
var centroid = { x: 0, y: 0 };

function bound_centroid() {
  minX = Infinity;
  maxX = -Infinity;
  minY = Infinity;
  maxY = -Infinity;
  for (var i in objects) {
    if (objects[i].type === "s") {
      x1 = (objects[i].x - 400) / 400 + 0.05 * objects[i].s;
      x2 = (objects[i].x - 400) / 400 - 0.05 * objects[i].s;
      y1 = (objects[i].y - 400) / 400 + 0.05 * objects[i].s;
      y2 = (objects[i].y - 400) / 400 - 0.05 * objects[i].s;
      if (maxX < x1) maxX = x1;
      if (minX > x2) minX = x2;
      if (maxY < y1) maxY = y1;
      if (minY > y2) minY = y2;
    } else if (objects[i].type === "r") {
      x1 = (objects[i].x - 400) / 400 + 0.05 * objects[i].s;
      x2 = (objects[i].x - 400) / 400 - 0.05 * objects[i].s;
      y1 = (objects[i].y - 400) / 400 + 0.1 * objects[i].s;
      y2 = (objects[i].y - 400) / 400 - 0.1 * objects[i].s;

      if (maxX < x1) maxX = x1;
      if (minX > x2) minX = x2;
      if (maxY < y1) maxY = y1;
      if (minY > y2) minY = y2;
    } else if (objects[i].type === "c") {
      x1 = (objects[i].x - 400) / 400 + 0.1 * objects[i].s;
      x2 = (objects[i].x - 400) / 400 - 0.1 * objects[i].s;
      y1 = (objects[i].y - 400) / 400 + 0.1 * objects[i].s;
      y2 = (objects[i].y - 400) / 400 - 0.1 * objects[i].s;
      if (maxX < x1) maxX = x1;
      if (minX > x2) minX = x2;
      if (maxY < y1) maxY = y1;
      if (minY > y2) minY = y2;
    }
  }

  centroid = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

function keyBoardhandler(event) {
  key = event.key.toLowerCase();
  switch (key) {
    case "m":
      mode++;
      mode = mode % 3;
      if (mode === 0) rotations = {};
      else if (mode === 1) key = null;
      else if (mode === 2) {
        if (minind !== null) {
          objects[minind].setcolor();
          minind = null;
        }
        bound_centroid();
      }
      renderobjects();
      break;
    case "arrowup":
      if (mode === 1) {
        if (!(minind in translations))
          translations[minind] = { x: 0, y: 10, s: 1 };
        else translations[minind].y += 10;
      }
      renderobjects();
      break;
    case "arrowdown":
      if (mode === 1) {
        if (!(minind in translations))
          translations[minind] = { x: 0, y: -10, s: 1 };
        else translations[minind].y -= 10;
      }
      renderobjects();
      break;
    case "arrowleft":
      if (mode === 1) {
        if (!(minind in translations))
          translations[minind] = { x: -10, y: 0, s: 1 };
        else translations[minind].x -= 10;
      } else if (mode === 2) {
        for (var i in objects) {
          if (i in rotations) {
            rotations[i].t += 10;
          } else {
            rotations[i] = { x: centroid.x, y: centroid.y, t: 10 };
          }
        }
      }
      renderobjects();
      break;
    case "arrowright":
      if (mode === 1) {
        if (!(minind in translations))
          translations[minind] = { x: 10, y: 0, s: 1 };
        else translations[minind].x += 10;
      } else if (mode === 2) {
        for (var i in objects) {
          if (i in rotations) {
            rotations[i].t -= 10;
          } else {
            rotations[i] = { x: centroid.x, y: centroid.y, t: -10 };
          }
        }
      }
      renderobjects();
      break;
    case "+":
      if (mode === 1) {
        if (!(minind in translations))
          translations[minind] = { x: 0, y: 0, s: 1.05 };
        else translations[minind].s += 0.05;
      }
      renderobjects();
      break;
    case "-":
      if (mode === 1) {
        if (!(minind in translations))
          translations[minind] = { x: 0, y: 0, s: 0.95 };
        else
          translations[minind].s = Math.max(translations[minind].s - 0.05, 0.5);
      }
      renderobjects();
      break;
    case "x":
      if (minind !== null) {
        delete objects[minind];
        delete translations[minind];
        minind = null;
      }
      renderobjects();
      break;
  }

  var details = document.getElementById("details");
  details.innerHTML = `
    <p>Current Mode Value: ${mode}</p>
    <p>Keyboard Input Value: ${key}</p>
  `;
}

var object_count = 0;
var objects = {};

function mousehandler(gl, event) {
  const cvs = gl.canvas.getBoundingClientRect();
  let x = event.clientX - cvs.left;
  let y = cvs.bottom - event.clientY;

  rasteriseshapes(x, y);
}

var minind = null;

function rasteriseshapes(x, y) {
  if (mode === 0) {
    switch (key) {
      case "r":
        objects[object_count] = new Shape("r", x, y);
        object_count++;
        break;
      case "s":
        objects[object_count] = new Shape("s", x, y);
        object_count++;
        break;
      case "c":
        objects[object_count] = new Shape("c", x, y);
        object_count++;
        break;
      default:
        break;
    }
    renderobjects();
  } else if (mode === 1) {
    if (minind !== null) {
      objects[minind].setcolor();
    }

    let minint = Infinity;
    for (var i in objects) {
      let d = objects[i].near(x, y);
      minint = Math.min(minint, d);
      if (minint === d) minind = i;
    }

    if (minind !== null) {
      objects[minind].setcolor([0, 0, 0, 1]);
    }
    renderobjects();
  } else if (mode === 1) {
    if (minind !== null) {
      objects[minind].setcolor();
    }
    var dist = [];
    var minint = Infinity;

    for (var i = objects.length - 1; i >= 0; i--) {
      let d = objects[i].near(x, y);
      dist.push(d);
      if (d < minint) {
        minint = d;
        minind = i;
      }
    }

    objects[minind].setcolor([0, 0, 0, 1]);

    for (var i = 0; i < objects.length; i++) {
      objects[i].render();
    }
  }
}

class Shape {
  constructor(type, x, y, color = null) {
    this.type = type;

    if (type === "s") {
      this.draw = drawsquare;
      this.color = color ? color : [1, 0, 1, 1];
      this.distance = s_distance;
    } else if (type === "r") {
      this.draw = drawrectangle;
      this.color = color ? color : [1, 0, 0, 1];
      this.distance = r_distance;
    } else if (type === "c") {
      this.draw = drawcircle;
      this.color = color ? color : [0, 0, 1, 1];
      this.distance = c_distance;
    }
    this.x = x;
    this.y = y;
    this.tx = 0;
    this.ty = 0;
    this.s = 1;
  }

  setcolor(color = null) {
    if (this.type === "s") this.color = color ? color : [1, 0, 1, 1];
    else if (this.type === "r") this.color = color ? color : [1, 0, 0, 1];
    else if (this.type === "c") this.color = color ? color : [0, 0, 1, 1];
  }

  setcolor(color = null) {
    if (this.type === "s") this.color = color ? color : [1, 0, 1, 1];
    else if (this.type === "r") this.color = color ? color : [1, 0, 0, 1];
    else if (this.type === "c") this.color = color ? color : [0, 0, 1, 1];
  }

  render(rotate = null) {
    if (rotate) {
      this.draw(
        gl,
        program,
        this.x + this.tx,
        this.y + this.ty,
        this.color,
        this.s,
        rotate
      );
      return;
    }
    this.draw(
      gl,
      program,
      this.x + this.tx,
      this.y + this.ty,
      this.color,
      this.s
    );
  }

  near(mx, my) {
    return this.distance(mx, my, this.x + this.tx, this.y + this.ty, this.s);
  }

  translate(x, y, s) {
    this.tx = x;
    this.ty = y;
    this.s = s;
  }
}

function renderobjects() {
  var length = Object.keys(objects).length;
  if (length > 0) {
    for (var i in objects) {
      if (i in translations) {
        objects[i].translate(
          translations[i].x,
          translations[i].y,
          translations[i].s
        );
      }
      if (i in rotations) {
        objects[i].render(Object.assign({}, rotations[i]));
      } else {
        objects[i].render();
      }
    }
  } else {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
