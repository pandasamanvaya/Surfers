
var cubeRotation = 0.0;

main();

//
// Start here
//
function main() {
  // const canvas = document.querySelector('#glcanvas');
  // const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  gl = glInit();
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uProjectionMatrix;
    uniform mat4 uModelViewMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  // const positionBuffer1 = gl.createBuffer();
  // const indexBuffer1 = gl.createBuffer();
  // const colorBuffer1 = gl.createBuffer();

  // const positionBuffer2 = gl.createBuffer();
  // const indexBuffer2 = gl.createBuffer();
  // const colorBuffer2 = gl.createBuffer();

  // const buffers1 = initBuffers(gl, positionBuffer1, colorBuffer1, indexBuffer1);
  // const buffers2 = initBuffers(gl, positionBuffer2, colorBuffer2, indexBuffer2);

  var wall = Wall();
  create_wall(wall);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  console.log(color.blue)
  var then = 0;
  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(programInfo.program);
    requestAnimationFrame(render);

   // drawScene(gl, programInfo, buffers1, deltaTime, [-0.0, -3.0, -10.0], projectionMatrix);
//    drawScene(gl, programInfo, buffers, deltaTime);

    drawScene(gl, programInfo, wall, deltaTime, [0.0, 0.0, -5.0], projectionMatrix);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//

function Wall(){
//function initBuffers(gl, positionBuffer, colorBuffer, indexBuffer) {

  // Create a buffer for the cube's vertex positions.


  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.


  // Now create an array of positions for the cube.

  const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    -1.0, -1.0,  -1.0,
     1.0, -1.0,  -1.0,
     1.0,  1.0,  -1.0,
    -1.0,  1.0,  -1.0,

  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  // Now set up the colors for the faces. We'll use solid colors
  // for each face.

  const faceColors = [
    color.blue,
    color.blue,
  ];

  // Convert the array of colors into a table for all the vertices.

  var colors = [];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }


  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.


  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,  
  ];

  // Now send the element array to GL


  return {
    position: positions,
    color: colors,
    indices: indices,
  };
}

function create_wall(wall){
  wall.positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, wall.positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wall.position), gl.STATIC_DRAW);

  wall.colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, wall.colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wall.color), gl.STATIC_DRAW);

  wall.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wall.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
  new Uint16Array(wall.indices), gl.STATIC_DRAW);
}
//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, deltaTime, pos, projectionMatrix) {

  // Clear the canvas before we start drawing on it.


  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  
  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 pos);  // amount to translate

  //Write your code to Rotate the cube here//
  mat4.rotate(modelViewMatrix,
              modelViewMatrix,
              1.57,
              [0.0, 1.0, 0.0]);



  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.positionBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(0);
  }

  // Tell WebGL how to pull out the colors from the color buffer
  // into the vertexColor attribute.
  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colorBuffer);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(1);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indexBuffer);

  // Tell WebGL to use our program when drawing


  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const vertexCount = 12;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }


  // Update the rotation for the next draw

  //cubeRotation += deltaTime;

  gl.disableVertexAttribArray(0)
  gl.disableVertexAttribArray(1)
}



