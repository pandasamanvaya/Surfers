
function color_shape(buffer, off, len, color){

	for(var i = off; i < len; i+=3){
		buffer[i] = color[0];
		buffer[i+1] = color[1];
		buffer[i+2] = color[2];
	}
}

function triangle(buffer, off, x, y, z){

	for(var i = 0; i < 3; i++){
		buffer[off+i] = x[i];
		buffer[off+i+3] = y[i];
		buffer[off+i+6] = z[i];
	}

}

function rectangle(buffer, off, len, width){

	const p1 = [0, width, 0];
	const p2 = [0, 0, 0];
	const p3 = [len, width, 0];
	const p4 = [len, 0, 0];

	triangle(buffer, off, p1, p2, p3);
	triangle(buffer, off+9, p2, p3, p4);

	return 18;
}

function regular_polygon(buffer, off, n, r){

	var theta = 360.0/n, x = 0.0, y = r;

	for(var i = off; i < 9*n + off; i += 9){
		var up_x = x * Math.cos((Math.PI/180) * theta) - y * Math.sin((Math.PI/180) * theta);
		var up_y = x * Math.sin((Math.PI/180) * theta) + y * Math.cos((Math.PI/180) * theta);

		var p1 = [x, y, 0.0];
		var p2 = [up_x, up_y, 0.0];
		var p3 = [0.0, 0.0, 0.0];
		triangle(buffer, i, p1, p2, p3);
		x = up_x; y = up_y;

	}
	return i;
}

function semicircle(buffer, Len, r, k){

	const size = 0.1;
	var off = 0;
	var len = Len;
	for(var theta = -60; theta <= 60.0; theta+=0.2){
		var x = theta/9;
		var y = -0.05*(x+20)*(x-20);
		off = len;
		len += rectangle(buffer, off, size, size);
		shift_shape(buffer, off, len, x, y-17, -5.0);
	}

}

function cuboid(buffer, off, l, b, h){

	const cuboid = [
		//Front
		0, b, 0,
		0, 0, 0,
		l, 0, 0,
		0, b, 0,
		l, b, 0,
		l, 0, 0,

		//Back
		0, b, h,
		0, 0, h,
		l, 0, h,
		0, b, h,
		l, b, h,
		l, 0, h,

		//Top
		0, b, 0,
		l, b, 0,
		l, b, h,
		l, b, h,
		0, b, 0,
		0, b, h,

		//Down
		0, 0, 0,
		l, 0, 0,
		l, 0, h,
		l, 0, h,
		0, 0, 0,
		0, 0, h,

		//Left
		0, 0, 0,
		0, 0, h,
		0, b, h,
		0, 0, 0,
		0, b, 0,
		0, b, h,

		//Right
		0, 0, 0,
		0, 0, h,
		0, b, h,
		0, 0, 0,
		0, b, 0,
		0, b, h,
	];

	for(var i = 0; i < 36*3; i+=3){
		buffer[off+i] = cuboid[i];
		buffer[off+i+1] = cuboid[i+1];
		buffer[off+i+2] = cuboid[i+2];
	}
	return 36*3;
}

function cylinder(buffer, len, h, r){
	var off = 0;
	for(var i = 0; i < h; i+=0.001){
		len = regular_polygon(buffer, off, 20, r);
		shift_shape(buffer, off, len, 0,0, i);
		off = len;
	}
	return len;
}

function shift_shape(buffer, off, len, x, y, z){
	for(var i = off, j = off+1, k = off+2; i < len && j < len && k < len; i+=3, j+=3, k+=3){
		buffer[i] += x;
		buffer[j] += y;
		buffer[k] += z;
	}
}