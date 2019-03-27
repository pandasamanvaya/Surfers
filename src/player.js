function Player(r, l, b, h){
	const depth = 0.006;
	
	var len = 0;

	var buf_data = [];
	var color_data = [];

	len = cylinder(buf_data, len, depth, r);
	color_shape(color_data, 0, len, color.brown);
	console.log(len);
	var off = len;
	len += cuboid(buf_data, len, l, b, h);
	shift_shape(buf_data, off, len, -r, -3*r, 0);
	color_shape(color_data, off, len, color.green);
	//console.log(buf_data);
	off = len;
	len += cuboid(buf_data, len, l/10, b, h);
	shift_shape(buf_data, off, len, -r/2, -3*r-b, 0);
	color_shape(color_data, off, len, color.grey);
	
	off = len;
	len += cuboid(buf_data, len, l/10, b, h);
	shift_shape(buf_data, off, len, r/2, -3*r-b, 0);
	color_shape(color_data, off, len, color.grey);

	off = len;
	len += cuboid(buf_data, len, l/2, b/10, h);
	shift_shape(buf_data, off, len, r, -2*r, 0);
	color_shape(color_data, off, len, color.grey);

	off = len;
	len += cuboid(buf_data, len, l/2, b/10, h);
	shift_shape(buf_data, off, len, -2*r, -2*r, 0);
	color_shape(color_data, off, len, color.grey);

	var vertex_buf;
	var color_buf;
	var pos = [];

	return{
	buf_data : buf_data,
	vertex_buf : vertex_buf,
	color_data : color_data,
	color_buf : color_buf,
	pos : pos,
	};
}

function create_player(gl, player){
  player.vertex_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, player.vertex_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(player.buf_data), gl.STATIC_DRAW);

  player.color_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, player.color_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(player.color_data), gl.STATIC_DRAW);

}

function render_player(gl, player, shader, no, projectionMatrix){

	const modelViewMatrix = mat4.create();


	mat4.translate(modelViewMatrix,     // destination matrix
	             modelViewMatrix,     // matrix to translate
	             player.pos);  // amount to translate

	mat4.rotate(modelViewMatrix,
	          modelViewMatrix,
	          20*Math.PI/180,
	          [0.0, 1.0, 0.0]); 

	gl.bindBuffer(gl.ARRAY_BUFFER, player.vertex_buf);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(0);

	gl.bindBuffer(gl.ARRAY_BUFFER, player.color_buf);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(1);

	if(no == 0){
		gl.uniformMatrix4fv(
		  shader.uniformLocations.projectionMatrix,
		  false,
		  projectionMatrix);
		gl.uniformMatrix4fv(
		  shader.uniformLocations.modelViewMatrix,
		  false,
		  modelViewMatrix);
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
  gl.drawArrays(gl.TRIANGLES, 0, player.buf_data.length/3);

}