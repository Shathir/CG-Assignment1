var arr_circle = []

function drawcircle(gl,program,x,y,icolor)
{
    
    var positionAttributeLocation = gl.getAttribLocation(program, "vect_position");

    var color_location = gl.getUniformLocation(program, "icolor")

    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let x1 = (x-400)/400
    let y1 = (y-300)/300

    
    for(var i=0;i<20;i++)
    {
       
        arr_circle.push( x1,y1,x1+0.1*Math.cos(i*Math.PI/10),y1+0.1*Math.sin(i*Math.PI/10),
                            x1+0.1*Math.cos((i+1)*Math.PI/10),y1+0.1*Math.sin((i+1)*Math.PI/10),)
    }
    
    resizeCanvasToDisplaySize(gl.canvas);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr_circle), gl.STATIC_DRAW);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.useProgram(program);

    gl.uniform4f(color_location, ...icolor)

    gl.enableVertexAttribArray(positionAttributeLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);
    
    gl.drawArrays(gl.TRIANGLES, 0, arr_circle.length/2);
}