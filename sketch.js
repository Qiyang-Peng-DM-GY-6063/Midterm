let mySize;

// a shader variable
let theShader;

function preload() {
  // theShader = new p5.Shader(this.renderer,shader.vert,shader.frag);
  theShader = loadShader('shader.vert','shader.frag');
}

function setup() {
  mySize = min(windowWidth, windowHeight) * 1.0;

  // shaders require WEBGL mode to work
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  // city generator
}

function draw() {
  // Only use the shader if it's loaded
  if (theShader) {
    // shader() sets the active shader with our shader
    shader(theShader);

    // Set shader uniforms
    theShader.setUniform("u_resolution", [width, height]);
    theShader.setUniform("u_time", millis() / 1000.0);
    theShader.setUniform("u_frame", frameCount / 1.0);
    theShader.setUniform("u_mouse", [mouseX / 100.0, map(mouseY, 0, height, height, 0) / 100.0]);

    // rect gives us some geometry on the screen
    rect(-width / 2, -height / 2, width, height);
  }
}

// function city generator() - create random rect - city in the background

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
