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

  //console.log(x,y)

  rasteriseshapes(x, y);
}

var minind = null



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
      //console.log(objects[i].x)
      objects[i].render()
    }
  }

  else if(mode === 1)
  {
    if(minind !== null){
        console.log("hello")
        objects[minind].setcolor()
    }
      var dist = [];
      var minint = Infinity
      
    for(var i= objects.length - 1;i>=0;i--)
    {
        let d = objects[i].near(x,y)
        dist.push(d)
        if(d < minint)
        {
            minint = d;
            minind = i;
        } 
    }

    console.log(dist)
    console.log(minind)
    objects[minind].setcolor([0,0,0,1])
    
    for (var i = 0; i < objects.length; i++) {
        //console.log(objects[i].x)
        objects[i].render()
      }

    if(key === "arrowup"){

    }
  }
  
}

class Shape {
  constructor(type, x, y,color = null) {
    this.type = type
    if (type === "s") {
      this.draw = drawsquare;
      this.color = color ? color : [1, 0, 1, 1];
      this.distance = s_distance;
    } else if (type === "r") {
      this.draw = drawrectangle;
      this.color = color ? color : [1, 0, 0, 1];
      this.distance = r_distance
    } else if (type === "c") {
      this.draw = drawcircle;
      this.color = color ? color : [0, 0, 1, 1];
      this.distance = c_distance;
    }
    this.x = x;
    this.y = y;
  }

  setcolor(color = null){
      if(this.type === "s") this.color = color ? color : [1,0,1,1]
      else if(this.type === "r") this.color = color ? color : [1,0,0,1]
      else if(this.type === "c") this.color = color ? color : [0,0,1,1]
      
  }

  render() {
    this.draw(gl, program, this.x, this.y, this.color);
  }

    
  near(mx,my){
      //console.log(mx,my)
      return this.distance(mx,my,this.x,this.y)
      
  }
}
