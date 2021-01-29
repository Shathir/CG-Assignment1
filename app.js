window.onload = main;

var mode = 0;
var key;

function main()
{
    console.log("Hello!");
    var canvas = document.querySelector("#canvas-board");
    var gl = canvas.getContext("webgl");

    console.log(gl);

    if(!gl)
    {
        console.error("Webgl is not supported")
        return;
    }
    var program = shaderprogram(gl);

    document.addEventListener('keydown',(event)=>keyBoardhandler(gl,program,event))
    document.addEventListener('mousedown',(event)=>mousehandler(gl,program,event))

}

function resizeCanvasToDisplaySize(canvas) {
    // Lookup the size the browser is displaying the canvas in CSS pixels.
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
   
    // Check if the canvas is not the same size.
    const needResize = canvas.width  !== displayWidth ||
                       canvas.height !== displayHeight;
   
    if (needResize) {
      // Make the canvas the same size
      canvas.width  = displayWidth;
      canvas.height = displayHeight;
    }
   
    return needResize;
  }

  function keyBoardhandler(gl,program,event)
  {
      key = event.key.toLowerCase();
      console.log(key);

      switch(key)
      {
          case 'm':
              mode = ++mode%3
      }
      console.log(mode)

  }

  var objects = {r:[],s:[],c:[]}
  function mousehandler(gl,program,event)
  {
    const cvs = gl.canvas.getBoundingClientRect()
    let x = event.clientX - cvs.left
    let y = cvs.bottom - event.clientY


    
    rasteriseshapes(gl,program,x,y,event);
  }
  
  function rasteriseshapes(gl,program,x,y,event)
  {
        if(mode === 0)
        {

            switch(key)
            {
                case 'r':
                    objects.r.push([x,y])
                    //drawrectangle(gl,program,x,y)
                    break
                
                case 's':
                    objects.s.push([x,y])
                    //drawsquare(gl,program,x,y)
                    break
                case 'c':
                    objects.c.push([x,y])
                    // drawcircle(gl,program,x,y)
                    break

                default:
                    break
            }
            for(var i=0;i<objects.r.length;i++)
            {
                drawrectangle(gl,program,objects.r[i][0],objects.r[i][1],[1,0,0,1])
            }
            for(var i=0;i<objects.c.length;i++)
            {
                drawcircle(gl,program,objects.c[i][0],objects.c[i][1],[0,0,1,1])
            }
            for(var i=0;i<objects.s.length;i++)
            {
                drawsquare(gl,program,objects.s[i][0],objects.s[i][1],[1,0,1,1])
            }
        }


  }