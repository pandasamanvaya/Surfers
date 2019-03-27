function Rail(){

	const texture = LoadImg(gl, "../lib/railtrack.png");
	var frame = [];
	const len = 200.0;
	rectangle(frame, 0, len, 15);
	//console.log(len);

	const tex_cord = [
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0,
  ];

  var frame_buf;
  var tex_buf;
  var pos = [];
  return{
  	frame : frame,
  	tex_cord : tex_cord,
  	frame_buf : frame_buf,
  	tex_buf : tex_buf,
  	texture : texture,
  	pos : pos,
  }
}

function create_rail(gl, rail){

	rail.frame_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,rail.frame_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rail.frame), gl.STATIC_DRAW);

	rail.tex_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, rail.tex_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rail.tex_cord), gl.STATIC_DRAW);

}

function render_rail(gl, rail, ImgShader, projectionMatrix, pos){

	const modelViewMatrix = mat4.create();
  const fogColor = color.grey;

  mat4.translate(modelViewMatrix, modelViewMatrix, pos);
  mat4.rotate(modelViewMatrix, modelViewMatrix, 90*Math.PI/180, [1.0, 0.0, 0.0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, 90*Math.PI/180, [0.0, 0.0, 1.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, rail.frame_buf);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
  gl.enableVertexAttribArray(0);
  gl.uniformMatrix4fv(ImgShader.uniformLocations.matrixLocation,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(ImgShader.uniformLocations.modelViewMatrix,
      false, modelViewMatrix);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, rail.texture);
  gl.bindBuffer(gl.ARRAY_BUFFER, rail.tex_buf);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);   
  gl.enableVertexAttribArray(1);
  //console.log('color bound');
  gl.uniform1i(ImgShader.uniformLocations.textureLocation, 0);    
  gl.uniform4fv(ImgShader.uniformLocations.fogColor, fogColor);

  gl.drawArrays(gl.TRIANGLES, 0, 6);

}

function updateTracks(rail_right, rail_mid, rail_left){
  rail_right.pos[2] -= 400;
  rail_left.pos[2] -= 400;
  rail_mid.pos[2] -= 400;
}
