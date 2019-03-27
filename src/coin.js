function Coin(){

  const len = 0.3;
  var buf_data = [];
  var color_data = [];
  
  regular_polygon(buf_data, 0, 30, len);
  color_shape(color_data, 0, buf_data.length, color.gold);

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

function create_coin(gl, coin){
  coin.vertex_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coin.vertex_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coin.buf_data), gl.STATIC_DRAW);

  coin.color_buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, coin.color_buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coin.color_data), gl.STATIC_DRAW);

}

function render_coin(gl, coin, Shader, no, projectionMatrix){

  const modelViewMatrix = mat4.create();
  const fogColor = color.grey;

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 coin.pos);  // amount to translate

  //Write your code to Rotate the cube here//
  mat4.rotate(modelViewMatrix,
              modelViewMatrix,
              coinRotation,
              [0.0, 1.0, 0.0]); 
  gl.bindBuffer(gl.ARRAY_BUFFER, coin.vertex_buf);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);   
  gl.enableVertexAttribArray(0);

  gl.bindBuffer(gl.ARRAY_BUFFER, coin.color_buf);
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
  gl.drawArrays(gl.TRIANGLES, 0, coin.buf_data.length/3);

}

function coinType1(gl){

  var coin = [];
  var x = Math.floor(Math.random()*3);
  if(x == 1)
    x = -4.0;
  else if(x == 2)
    x = 4.0;
  for(var i = 0; i < 7; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x, -0.6, -2*i];
  }
  return coin;
}


function coinType2(gl){

  var coin = [];
  var x = Math.floor(Math.random()*3);
  if(x == 1)
    x = -4.0;
  else if(x == 2)
    x = 4.0;
  
  for(var i = 0; i < 5; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x, -0.6+0.6*i*(4-i), -i];
  }  

  return coin;
}

function coinType3(gl){

  var coin = [];
  var x = Math.floor(Math.random()*3);
  if(x == 1)
    x = -4.0;
  else if(x == 2)
    x = 4.0;
  console.log(x);
  for(var i = 0; i < 7; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x, -0.6, -2*i];
  }

/*  for(var i = 0; i < 7; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x-0.2*i*(6-i), -1, -i];
  }  
*/
  for(var i = 7; i < 14; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x, -0.6+0.3*(i-6)*(13-i), -i-9];
  }  

  for(var i = 14; i < 21; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x, -0.6, -2*i];
  }

  return coin;
}

function coinType4(gl){

  var coin = [];
  var x = Math.floor(Math.random()*2) * 4.0;

  for(var i = 0; i < 7; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x, -0.6, -i];
  }
  for(var i = 7; i < 14; i++){
    coin[i] = Coin();
    create_coin(gl, coin[i]);
    coin[i].pos = [x-4.0, -0.6, -i-3.0];
  }
  return coin;
}

function renderBlock(gl, coin, Shader, no, projectionMatrix, speed){

  for(var i = 0; i < coin.length; i++){
    render_coin(gl, coin[i], Shader, no, projectionMatrix);
    coin[i].pos[2] += speed;
  }
}

function random_coins(coinT1, coinT2, coinT3, coinT4){

  const z = Math.floor(Math.random()*10) + 30;
  const diff = Math.floor(Math.random()*10) + 40;
  position_coin(coinT1, -z, x_1);
  position_coin(coinT2, -z-diff, x_2);
  position_coin(coinT3, -z-2*diff, x_3);
  position_coin(coinT4, -z-4*diff, x_4);
}

function position_coin(coinT, pos, x){

  for(var i = 0; i < coinT.length; i++){
    coinT[i].pos[2] += pos;
    if(coinT[i].pos[0] == 30)
      coinT[i].pos[0] = x
  }
}

function update_coins(coinT, x){
  const z = Math.floor(Math.random()*10) + 40;
  position_coin(coinT, -z-210, x);
}
