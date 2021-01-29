function drawcircle(gl, program, x, y, icolor, scale, rotate = {x:400, y:400, t:0}) {
  var positionAttributeLocation = gl.getAttribLocation(
    program,
    "vect_position"
  );

  var color_location = gl.getUniformLocation(program, "icolor");

  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  rotate.x = rotate.x - 400/400;
  rotate.y = rotate.y -400/400;

  let x1 = (x - 400) / 400;
  let y1 = (y - 400) / 400;
  var positions = []
  for (var i = 0; i < 20; i++) {
    positions.push(
      rotatex(x1,y1,rotate),
      rotatey(x1,y1,rotate),
      rotatex(x1 + 0.1*scale * Math.cos((i * Math.PI) / 10), y1 + 0.1*scale * Math.sin((i * Math.PI) / 10), rotate), 
      rotatey(x1 + 0.1*scale * Math.cos((i * Math.PI) / 10), y1 + 0.1*scale * Math.sin((i * Math.PI) / 10), rotate),
      rotatex(x1 + 0.1*scale * Math.cos(((i+1) * Math.PI) / 10), y1 + 0.1*scale * Math.sin(((i+1) * Math.PI) / 10), rotate), 
      rotatey(x1 + 0.1*scale * Math.cos(((i+1) * Math.PI) / 10), y1 + 0.1*scale * Math.sin(((i+1) * Math.PI) / 10), rotate),
      
    );
  }

  resizeCanvasToDisplaySize(gl.canvas);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.useProgram(program);

  gl.uniform4f(color_location, ...icolor);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var size = 2; // 2 components per iteration
  var type = gl.FLOAT; // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0; // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.drawArrays(gl.TRIANGLES, 0, 60);
}


function c_distance(x,y,cx,cy,scale){

  d1 = Math.sqrt(((Math.abs(x-cx))/400)**2 + ((Math.abs(y-cy))/400)**2)

  if(d1 < 0.1*scale)
  {
    return -Infinity
  }
  else
  {
    return (d1 - 0.1*scale);
  }
}

function rotatex(x,y,rotate){
  return  rotate.x + (x - rotate.x)*Math.cos(Math.PI*rotate.t/180) - (y - rotate.y)*Math.sin(Math.PI*rotate.t/180);
}

function rotatey(x,y,rotate){
  return   rotate.y + (x - rotate.x)*Math.sin(Math.PI*rotate.t/180) + (y - rotate.y)*Math.cos(Math.PI*rotate.t/180);
}