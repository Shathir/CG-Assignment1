function drawrectangle(gl, program, x, y, icolor, scale) {
  var positionAttributeLocation = gl.getAttribLocation(
    program,
    "vect_position"
  );

  var color_location = gl.getUniformLocation(program, "icolor");

  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let x1 = (x - 400) / 400;
  let y1 = (y - 400) / 400;

  var positions = [
    x1,
    y1,
    x1 + 0.05*scale,
    y1 + 0.1*scale,
    x1 + 0.05*scale,
    y1 - 0.1*scale,
    x1,
    y1,
    x1 + 0.05*scale,
    y1 + 0.1*scale,
    x1 - 0.05*scale,
    y1 + 0.1*scale,
    x1,
    y1,
    x1 - 0.05*scale,
    y1 + 0.1*scale,
    x1 - 0.05*scale,
    y1 - 0.1*scale,
    x1,
    y1,
    x1 - 0.05*scale,
    y1 - 0.1*scale,
    x1 + 0.05*scale,
    y1 - 0.1*scale,
  ];

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

  gl.drawArrays(gl.TRIANGLES, 0, 12);
}


/*function r_distance(x,y,cx,cy){

    //console.log(x,y,cx,cy)

    d0x = Math.abs(x-cx)/400
    d0y = Math.abs(y-cy)/400 

    //console.log(d0x)
    //console.log(d0y)

    if(d0x <= 0.05 && d0y <= 0.1)
    {
        //console.log("Hello world")
        return -Infinity;
    }

    else 
    {
    d1 = Math.sqrt((x-(cx-0.05))**2+(y-(cy+0.1))**2)/400
    d2 = Math.sqrt((x-(cx-0.05))**2+(y-(cy-0.1))**2)/400
    d3 = Math.sqrt((x-(cx+0.05))**2+(y-(cy-0.1))**2)/400
    d4 = Math.sqrt((x-(cx+0.05))**2+(y-(cy+0.1))**2)/400
    d7 = Math.sqrt((x-(cx+0.05))**2+(y)**2)/400
    d5 = Math.sqrt((x-(cx-0.05))**2+(y)**2)/400
    d8 = Math.sqrt((x)**2+(y-(cy+0.1))**2)/400
    d6 = Math.sqrt((x)**2+(y-(cy-0.1))**2)/400
    dist =Math.min(d1,d2,d3,d4)


    console.log(d1,d2,d3,d4,d5,d6,d7,d8)

    if(dist === d1){
        dist1 = Math.min(d5,d8);
        if(dist1 === d5)
        {
            dist5 = Math.min(d1,d5)
            if(dist5 === d5) return (Math.abs(x-cx) - 0.05)/400; 
            else return d1
        }
        else{
            dist6 = Math.min(d1,d8)
            if(dist6 === d8) return (Math.abs(y-cy) - 0.1)/400; 
            else return d1
        }
    }
    else if(dist === d2){
        dist2 = Math.min(d6,d5);
        if(dist2 === d5)
        {
            dist7 = Math.min(d2,d5)
            if(dist7 === d5) return (Math.abs(x-cx) - 0.05)/400; 
            else return d2
        }
        else{
            dist5 = Math.min(d2,d6)
            if(dist5 === d6) return (Math.abs(y-cy) - 0.1)/400; 
            else return d2
        }
    }
    else if(dist === d3){
        dist3 = Math.min(d6,d7)
        if(dist3 === d7)
        {
            dist5 = Math.min(d3,d7)
            if(dist5 === d7) return (Math.abs(x-cx) - 0.05)/400; 
            else return d3
        }
        else{
            dist6 = Math.min(d3,d6)
            if(dist6 === d6) return (Math.abs(y-cy) - 0.1)/400; 
            else return d3
        }
    }
    else{
        dist4 = Math.min(d7,d8)
        if(dist4 === d7)
        {
            dist5 = Math.min(d4,d7)
            if(dist5 === d7) return (Math.abs(x-cx) - 0.05)/400; 
            else return d4
        }
        else{
            dist6 = Math.min(d4,d8)
            if(dist6 === d8) return (Math.abs(y-cy) - 0.1)/400; 
            else return d4
        }
    }
}
} */

function r_distance(x,y,cx,cy,scale)
{
    d0x = Math.abs(x-cx)/400
    d0y = Math.abs(y-cy)/400 
    if(d0x <= 0.05*scale && d0y <= 0.1*scale)
    {
        return -Infinity;
    }

    d = Math.sqrt((x-cx)**2 + (y-cy)**2)/400

    return d;
}