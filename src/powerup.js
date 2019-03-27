function JumpBoots()
{
	const texture = LoadImg(gl, "../lib/boot.png");
	var frame = [];
	const len = 1.2;
	rectangle(frame, 0, len, len);
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
  var pos = [0.0, 0.0, 0.0];
  return{
  	frame : frame,
  	tex_cord : tex_cord,
  	frame_buf : frame_buf,
  	tex_buf : tex_buf,
  	texture : texture,
  	pos : pos,
  }
}

function create_boot(gl, boot){

	boot.frame_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,boot.frame_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boot.frame), gl.STATIC_DRAW);

	boot.tex_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boot.tex_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boot.tex_cord), gl.STATIC_DRAW);

}

function render_boot(gl, boot, ImgShader, projectionMatrix){

	const modelViewMatrix = mat4.create();
	const fogColor = color.grey;

	//mat4.rotate(modelViewMatrix, modelViewMatrix, coinRotation, [0.0, 1.0, 0.0]);
	mat4.translate(modelViewMatrix, modelViewMatrix, boot.pos);
	//mat4.rotate(modelViewMatrix, modelViewMatrix, 90*Math.PI/180, [0.0, 0.0, 1.0]);

	gl.bindBuffer(gl.ARRAY_BUFFER, boot.frame_buf);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(0);
	gl.uniformMatrix4fv(ImgShader.uniformLocations.matrixLocation,
	  false,
	  projectionMatrix);
	gl.uniformMatrix4fv(ImgShader.uniformLocations.modelViewMatrix,
	  false, modelViewMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, boot.texture);
	gl.bindBuffer(gl.ARRAY_BUFFER, boot.tex_buf);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(1);
	//console.log('color bound');
	gl.uniform1i(ImgShader.uniformLocations.textureLocation, 0);    
	gl.uniform4fv(ImgShader.uniformLocations.fogColor, fogColor);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
	boot.pos[2] += speed;
}


function JetPack(){
	const texture = LoadImg(gl, "../lib/jetpack.png");
	var frame = [];
	const len = 1.2;
	rectangle(frame, 0, len, len);
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
  var pos = [0.0, 1.0, 0.0];
  return{
  	frame : frame,
  	tex_cord : tex_cord,
  	frame_buf : frame_buf,
  	tex_buf : tex_buf,
  	texture : texture,
  	pos : pos,
  }
}

function create_jetPack(gl, jetPack){

	jetPack.frame_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,jetPack.frame_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jetPack.frame), gl.STATIC_DRAW);

	jetPack.tex_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, jetPack.tex_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jetPack.tex_cord), gl.STATIC_DRAW);

}

function render_jetPack(gl, jetPack, ImgShader, projectionMatrix){

	const modelViewMatrix = mat4.create();
	const fogColor = color.grey;

	//mat4.rotate(modelViewMatrix, modelViewMatrix, coinRotation, [0.0, 1.0, 0.0]);
	mat4.translate(modelViewMatrix, modelViewMatrix, jetPack.pos);

	gl.bindBuffer(gl.ARRAY_BUFFER, jetPack.frame_buf);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(0);
	gl.uniformMatrix4fv(ImgShader.uniformLocations.matrixLocation,
	  false,
	  projectionMatrix);
	gl.uniformMatrix4fv(ImgShader.uniformLocations.modelViewMatrix,
	  false, modelViewMatrix);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, jetPack.texture);
	gl.bindBuffer(gl.ARRAY_BUFFER, jetPack.tex_buf);
	gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(1);
	//console.log('color bound');
	gl.uniform1i(ImgShader.uniformLocations.textureLocation, 0);    
	gl.uniform4fv(ImgShader.uniformLocations.fogColor, fogColor);

	gl.drawArrays(gl.TRIANGLES, 0, 6);
	jetPack.pos[2] += speed;
}