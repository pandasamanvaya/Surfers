function Wall(){

  const len = 200;
  var buf_data = [];
  var color_data = [];
  rectangle(buf_data, 0, len, len);
  color_shape(color_data, 0, buf_data.length, color.red);

  var vertex_buf;
  var color_buf;

  return{
    buf_data : buf_data,
    vertex_buf : vertex_buf,
    color_data : color_data,
    color_buf : color_buf,
  };

}

function create_wall(gl, wall){
  wall.vertex_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, wall.vertex_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wall.buf_data), gl.STATIC_DRAW);

  wall.color_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, wall.color_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(wall.color_data), gl.STATIC_DRAW);

}

function render_wall(gl, wall, Shader, no, pos, projectionMatrix){

  const modelViewMatrix = mat4.create();
  const fogColor = color.grey;
  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 pos);  // amount to translate

  //Write your code to Rotate the cube here//
  mat4.rotate(modelViewMatrix,
    modelViewMatrix,
    90 * Math.PI / 180,
    [0.0, 1.0, 0.0]); 
  gl.bindBuffer(gl.ARRAY_BUFFER, wall.vertex_buf);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
  gl.enableVertexAttribArray(Shader.attribLocations.vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, wall.color_buf);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);   
  gl.enableVertexAttribArray(Shader.attribLocations.vertexColor);

  if(no == 0){
    gl.uniformMatrix4fv(
      Shader.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
    gl.uniformMatrix4fv(
      Shader.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

    gl.uniform4fv(Shader.uniformLocations.fogColor, fogColor);
  }
  else{
      gl.uniformMatrix4fv(
      Shader.uniformLocations.projectionMat,
      false,
      projectionMatrix);
    gl.uniformMatrix4fv(
      Shader.uniformLocations.modelViewMat,
      false,
      modelViewMatrix);

  }
  gl.drawArrays(gl.TRIANGLES, 0, wall.buf_data.length/3);

}
