function Train(){

	const len = 3.0;
	var buf_data = [];
	var color_data = [];
	cuboid(buf_data, 0, len, len, 20);
	//regular_polygon(buf_data, 0, 20, r);
	color_shape(color_data, 0, buf_data.length, color.blue);

	var vertex_buf;
	var color_buf;
	var pos = [];

	//console.log(buf_data);
	return{
		buf_data : buf_data,
		vertex_buf : vertex_buf,
		color_data : color_data,
		color_buf : color_buf,
		pos : pos,
	};
}

function create_train(gl, train){
	train.vertex_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, train.vertex_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(train.buf_data), gl.STATIC_DRAW);

	train.color_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, train.color_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(train.color_data), gl.STATIC_DRAW);

}

function render_train(gl, train, Shader, no, projectionMatrix){
	const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

	mat4.translate(modelViewMatrix,     // destination matrix
	             modelViewMatrix,     // matrix to translate
	             train.pos);  // amount to translate

	//Write your code to Rotate the cube here//
	// mat4.rotate(modelViewMatrix,
	// 	modelViewMatrix,
	// 	90 * Math.PI / 180,
	// 	[0.0, 1.0, 0.0]); 
	gl.bindBuffer(gl.ARRAY_BUFFER, train.vertex_buf);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(0);

	gl.bindBuffer(gl.ARRAY_BUFFER, train.color_buf);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(1);

	if(no == 0){
		gl.uniformMatrix4fv(
			Shader.uniformLocations.projectionMatrix,
			false,
			projectionMatrix);
		gl.uniformMatrix4fv(
			Shader.uniformLocations.modelViewMatrix,
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
	gl.drawArrays(gl.TRIANGLES, 0, train.buf_data.length/3);
	train.pos[2] += 3*speed;
}

function largeBarrier(){
	const l = 1.2;

	var buf_data = [];
	var color_data = [];
	var off = 0, len = 0;

	len += rectangle(buf_data, 0, 2*l, 1.5*l);
	off = len;
	len += rectangle(buf_data, off, l/5, 0.8*l);
	shift_shape(buf_data, off, len, 1.8*l, -0.8*l, 0);
	off = len;
	len += rectangle(buf_data, off, l/5, 0.8*l);
	shift_shape(buf_data, off, len, 0, -0.8*l, 0);
	color_shape(color_data, 0, buf_data.length, color.brown);

	var vertex_buf;
	var color_buf;
	var pos = [0 ,0, 0];

	//console.log(buf_data);
	return{
		buf_data : buf_data,
		vertex_buf : vertex_buf,
		color_data : color_data,
		color_buf : color_buf,
		pos : pos,
	};
}

function smallBarrier(){
	
	const l = 1.2;

	var buf_data = [];
	var color_data = [];
	var off = 0, len = 0;

	len += rectangle(buf_data, 0, 2*l, l/5);
	off = len;
	len += rectangle(buf_data, off, l/5, 0.5*l);
	shift_shape(buf_data, off, len, 1.8*l, -0.5*l, 0);
	off = len;
	len += rectangle(buf_data, off, l/5, 0.5*l);
	shift_shape(buf_data, off, len, 0, -0.5*l, 0);
	color_shape(color_data, 0, buf_data.length, color.brown);

	var vertex_buf;
	var color_buf;
	var pos = [0 ,0, 0];

	//console.log(buf_data);
	return{
		buf_data : buf_data,
		vertex_buf : vertex_buf,
		color_data : color_data,
		color_buf : color_buf,
		pos : pos,
	};
}

function create_barrier(gl, barrier){
	barrier.vertex_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, barrier.vertex_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barrier.buf_data), gl.STATIC_DRAW);

	barrier.color_buf = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, barrier.color_buf);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(barrier.color_data), gl.STATIC_DRAW);

}

function render_barrier(gl, barrier, Shader, no, projectionMatrix){
	const modelViewMatrix = mat4.create();
	const fogColor = color.grey;

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

	mat4.translate(modelViewMatrix,     // destination matrix
	             modelViewMatrix,     // matrix to translate
	             barrier.pos);  // amount to translate

	//Write your code to Rotate the cube here//
	// mat4.rotate(modelViewMatrix,
	// 	modelViewMatrix,
	// 	90 * Math.PI / 180,
	// 	[0.0, 1.0, 0.0]); 
	gl.bindBuffer(gl.ARRAY_BUFFER, barrier.vertex_buf);
	gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(0);

	gl.bindBuffer(gl.ARRAY_BUFFER, barrier.color_buf);
	gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);   
	gl.enableVertexAttribArray(1);

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
	gl.drawArrays(gl.TRIANGLES, 0, barrier.buf_data.length/3);

	barrier.pos[2] += speed;
}

function update_barrier(barrier){
  const z = Math.floor(Math.random()*10) + 20;
  const x = get_x();

  barrier.pos[2] = -z-200;
  barrier.pos[0] = x;
}

function update_train(train){
  const z = Math.floor(Math.random()*10) + 40;
  train.pos[2] = -z-230;
  train.pos[0] = get_x();
}