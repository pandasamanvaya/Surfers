
const zNear = 0.1;
const zFar = 200.0;

var coinRotation = 0.0;
var eye = vec3.create();
var up = vec3.create();
var center = vec3.create();
var lookMatrix = mat4.create();

var projectionMatrix = mat4.create();
var speed = 0.4;

const r = 0.4, shift = 0.4;
const l = 0.8, b = 0.8, h = 0.4;
player = Player(r, l, b, h);
police = Player(r, l, b, h);

var jump = false, bigjump = false, jet = false, grayWorld = false;
var jet_time = 0.0, jump_time = 0.0, police_time = 1.0;
const incr = 0.1;
var now, x_1, x_2, x_3, x_4;

var score = 0.0, coin_cnt = 0;
var coinT1, coinT2, coinT3, coinT4, train = [];
barrier1 = largeBarrier();
barrier2 = smallBarrier();

main();

function glInit(){
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);  
  
  return gl;
}

function keyDownHandler(event){
  if(event.keyCode == 39){
    console.log('right');
    if(player.pos[0] < 4.0){
      player.pos[0] += 4.0; 
      police.pos[0] += 4.0; 
    }
  }

  else if(event.keyCode == 37){
    console.log('left');
    if(player.pos[0] >= -3.9){
      player.pos[0] -= 4.0; 
      police.pos[0] -= 4.0; 
    }
  }
  else if(event.keyCode == 32){
    console.log('Space');
    jump = true;
  }
    
}

var fall = false;
function player_jump(height){

  if(player.pos[1] < height && !fall)
    player.pos[1] += incr;
  else if(!jet){
    fall = true;
    player.pos[1] -= incr/2;
    if(player.pos[1] <= -0.2){
      jump = false;
      player.pos[1] = -0.2;
      fall = false;
    }
  }
}

function main() {
  // const canvas = document.querySelector('#glcanvas');
  // const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  gl = glInit();
  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  document.addEventListener('keydown', keyDownHandler, false);
  //Vertex Shader for shapes 
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    const float density = 0.017;
    const float gradient = 10.7;

    varying lowp vec4 vColor;
    varying float visibility;
    
    void main(void) {
      vec4 position = uModelViewMatrix * aVertexPosition;
      gl_Position = uProjectionMatrix * position ;
      vColor = aVertexColor;
      float distance = length(position.xyz);
      visibility = exp(-pow((distance*density), gradient));
      visibility = clamp(visibility, 0.0, 1.0);
    }
  `;

  // Fragment shader for shapes

  const fsSource = `
    precision mediump float;
    varying lowp vec4 vColor;
    varying float visibility;

    uniform vec4 fogColor;

    void main(void) {
      gl_FragColor = mix(fogColor, vColor, visibility);
    }
  `;

  //Grayscaling shader for shapes

  const grayVert = `
    attribute vec4 VertexPosition;
    attribute vec4 VertexColor;

    uniform mat4 ModelViewMatrix;
    uniform mat4 ProjectionMatrix;

    varying lowp vec4 vColor;
    varying float visibility;
    
    void main(void) {
      vec4 position = ModelViewMatrix * VertexPosition;
      gl_Position = ProjectionMatrix * position ;
      vColor = VertexColor;
    }
  `;

  const grayFrag = `
    precision mediump float;
    varying lowp vec4 vColor;

    void main(void) {
      vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
      gl_FragColor = mix(color, vColor, 0.2);
    }
  `;

  //Vertex Shader for images

  const texVert = `

    attribute vec4 a_position;
    attribute vec2 a_texcoord;
     
    uniform mat4 u_matrix;
    uniform mat4 m_matrix;
    const float density = 0.007;
    const float gradient = 10.7;

    varying vec2 v_texcoord;
    varying float visibility;
     
    void main() {
      vec4 position = m_matrix * a_position;
      // Multiply the position by the matrix.
      gl_Position = u_matrix * position;
     
      // Pass the texcoord to the fragment shader.
      v_texcoord = a_texcoord;
      float distance = length(position.xyz);
      visibility = exp(-pow((distance*density), gradient));
      visibility = clamp(visibility, 0.0, 1.0);
    }
  `;

  //Fragment shader for images
  const texFrag = `
    precision mediump float;

    // Passed in from the vertex shader.
    varying vec2 v_texcoord;
    varying float visibility;
     
    // The texture.
    uniform sampler2D u_texture;

    uniform vec4 fogColor;

    void main() {
      vec4 Color = texture2D(u_texture, v_texcoord);
      gl_FragColor = mix(Color, fogColor, 1.0 - visibility);
      if(gl_FragColor.a < 0.5)
        discard;
    }
  `;

  //Grayscaling fragment shader
  
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const TextureProgram = initShaderProgram(gl, texVert, texFrag);
  const GrayProgram = initShaderProgram(gl, grayVert, grayFrag);
  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
  const WallShader = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      fogColor: gl.getUniformLocation(shaderProgram, 'fogColor'),
    },
  };
  
  const ImgShader = {
    program : TextureProgram,
    attribLocations: {
      positionLocation : gl.getAttribLocation(TextureProgram, "a_position"),
      texcoordLocation : gl.getAttribLocation(TextureProgram, "a_texcoords"),
    },
    uniformLocations: {
      matrixLocation : gl.getUniformLocation(TextureProgram, "u_matrix"),
      modelViewMatrix: gl.getUniformLocation(TextureProgram, "m_matrix"),
      textureLocation : gl.getUniformLocation(TextureProgram, "u_texture"),
      fogColor: gl.getUniformLocation(TextureProgram, "fogColor"),
    },

  }
  
  const GrayShader = {
    program: GrayProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(GrayProgram, 'VertexPosition'),
      vertexColor: gl.getAttribLocation(GrayProgram, 'VertexColor'),
    },
    uniformLocations: {
      projectionMat: gl.getUniformLocation(GrayProgram, 'ProjectionMatrix'),
      modelViewMat: gl.getUniformLocation(GrayProgram, 'ModelViewMatrix'),
    },
  };
  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  
  mat4.perspective(projectionMatrix,
                 fieldOfView,
                 aspect,
                 zNear,
                 zFar);

  eye = vec3.fromValues(0, 2.0, 10.0);
  center = vec3.fromValues(0, 0.0, 0);
  up = vec3.fromValues(0, 1.0, 0);

  mat4.lookAt(lookMatrix, eye, center, up);

  mat4.multiply(projectionMatrix, projectionMatrix, lookMatrix);

  wall_right = Wall();
  create_wall(gl, wall_right);
  wall_left = Wall();
  create_wall(gl, wall_left);

  coinT1 = coinType1(gl);
  coinT2 = coinType2(gl);
  coinT3 = coinType3(gl);
  coinT4 = coinType4(gl);
  
  x_1 = coinT1[0].pos[0];
  x_2 = coinT2[0].pos[0];
  x_3 = coinT3[0].pos[0];
  x_41 = coinT4[0].pos[0];
  x_42 = coinT4[7].pos[0];
  var rail_left = [];
  var rail_right = [];
  var rail_mid = [];
  for(var i = 0; i < 2; i++){
    train[i] = Train();
    create_train(gl, train[i]);
    train[i].pos = [get_x(), -2.0, -150.0-100*i];
  }
  
  create_player(gl, player);
  player.pos = [0.003, -0.2, 2.0];

  create_player(gl, police);
  police.pos = [0.003, -0.2, 8.0];

 
  create_barrier(gl, barrier1);
  barrier1.pos = [get_x(), -1.0, -90];
  create_barrier(gl, barrier2);
  barrier2.pos = [get_x(), -1.0, -40];

  for(var i = 0; i < 2; i++){
    rail_left[i] = Rail();
    create_rail(gl, rail_left[i]);
    rail_left[i].pos = [-5,-10,-200-i*200];
  }
  
  for(var i = 0; i < 2; i++){
    rail_right[i] = Rail();
    create_rail(gl, rail_right[i]);
    rail_right[i].pos = [20.5,-10,-200-i*200];
  }
  for(var i = 0; i < 2; i++){
    rail_mid[i] = Rail();
    create_rail(gl, rail_mid[i]);
    rail_mid[i].pos = [8,-10,-200-i*200];
  }
  
  boot = JumpBoots();
  create_boot(gl, boot);
  boot.pos = [get_x()+0.5, -1.0, -300];
  jetPack = JetPack();
  create_jetPack(gl, jetPack);
  jetPack.pos = [get_x()+0.5, -1.0, -600];

  var then = 0, inc = 1;
  var Shader = choose_shader(WallShader, GrayShader);
  random_coins(coinT1, coinT2, coinT3, coinT4);
  var time = 0;

  function render(now) {
  //console.log(coinT1[0].pos);
    
    if(jump){
      if(bigjump)
        player_jump(3);
      else
        player_jump(1.5);
    }

    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.78, 0.78, 0.78, 1.0);

    requestAnimationFrame(render);
    if((now - time) > 5){
      Shader = choose_shader(WallShader, GrayShader);
      time = now;
      console.log(now-time);
    }
    gl.useProgram(Shader.shader.program);
    //console.log(modelViewMatrix);
    render_wall(gl, wall_right, Shader.shader, Shader.l, [20.0, -10.0, 0.0],projectionMatrix);
    render_wall(gl, wall_left, Shader.shader, Shader.l, [-20.0, -10.0, 0.0],projectionMatrix);
    render_player(gl, player, Shader.shader, Shader.l, projectionMatrix);
    render_player(gl, police, Shader.shader, Shader.l, projectionMatrix);
    render_barrier(gl, barrier1, Shader.shader, Shader.l, projectionMatrix);
    render_barrier(gl, barrier2, Shader.shader, Shader.l, projectionMatrix);
    renderBlock(gl, coinT1, Shader.shader, Shader.l, projectionMatrix, speed);
    renderBlock(gl, coinT2, Shader.shader, Shader.l, projectionMatrix, speed);
    renderBlock(gl, coinT3, Shader.shader, Shader.l, projectionMatrix, speed);
    renderBlock(gl, coinT4, Shader.shader, Shader.l, projectionMatrix, speed);
    render_train(gl, train[0], Shader.shader, Shader.l, projectionMatrix);
    render_train(gl, train[1], Shader.shader, Shader.l, projectionMatrix);
    coinRotation += deltaTime;

   // gl.useProgram(0);

    gl.useProgram(ImgShader.program);
    
    for(var i = 0; i < 2; i++){
      render_rail(gl, rail_left[i], ImgShader, projectionMatrix, rail_left[i].pos);
      render_rail(gl, rail_mid[i], ImgShader, projectionMatrix, rail_mid[i].pos);
      render_rail(gl, rail_right[i], ImgShader, projectionMatrix, rail_right[i].pos);

      rail_mid[i].pos[2] += speed;
      rail_left[i].pos[2] += speed;
      rail_right[i].pos[2] += speed;
    }
    render_boot(gl, boot, ImgShader, projectionMatrix);
    render_jetPack(gl, jetPack, ImgShader, projectionMatrix);

    if(train[0].pos[2] >= 30)
      update_train(train[0]);
    if(train[1].pos[2] >= 30)
      update_train(train[1]);

    if(rail_mid[0].pos[2] >= 0){
      updateTracks(rail_right[0], rail_mid[0], rail_left[0]);
    /*  first = false;
      second = true;*/
    }
    if(rail_mid[1].pos[2] >= 0){
      updateTracks(rail_right[1], rail_mid[1], rail_left[1]);
     /* first = true;
      second = false;*/
      
    }
    if(coinT1[coinT1.length-1].pos[2] >= 10)
      update_coins(coinT1, x_1);
    if(coinT2[coinT2.length-1].pos[2] >= 10)
      update_coins(coinT2, x_2);
    if(coinT3[coinT3.length-1].pos[2] >= 10)
      update_coins(coinT3, x_3);
    if(coinT4[coinT4.length-1].pos[2] >= 10){
      update_coins(coinT4.slice(0,7), x_41);
      update_coins(coinT4.slice(7,14), x_42);
    }

    if(barrier1.pos[2] >= 10)
      update_barrier(barrier1);
    if(barrier2.pos[2] >= 10)
      update_barrier(barrier2);

    check_collision(now);
    if(jet){
      if(now - jet_time > 20.0){
        player.pos[1] = -0.2;
        jet = false;
      }
    }
    if(bigjump){
      if(now - jump_time > 20.0){
        bigjump = false;
      }
    }

    if(police_time != 0){
      if(now - police_time > 10.0){
        police.pos[2] += speed
        if(police.pos[2] >= 8.0)
          police_time = 0;
      }
    }
    if(score > 2000*inc){
      speed += 0.03;
      inc += 1;
    }
    if(coin_cnt == 500){
      alert("  You Won!!!\n" + "Total Score : " + score + "\nCoins : " + coin_cnt);
      document.location.reload();
    }
  }
  requestAnimationFrame(render);
}

function choose_shader(WallShader, GrayShader){
  var shaders = [WallShader, GrayShader];
  const l = Math.floor(Math.random()*2);
  Shader = shaders[l];

  return{
    shader : Shader,
    l : l,
  };
}

function get_x(){
  var x = Math.floor(Math.random()*3)
  if(x == 1)
    x = -5.0;
  else if(x == 2)
    x = 3.0;
  else
    x = -1.0;

  console.log('x = ', x);
  return x;
}

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ff1';
  ctx.font = '20px serif';
  ctx.fillText("Score : " + score, 10, 20);
  ctx.fillText("Coin : " + coin_cnt, 10, 40);
}