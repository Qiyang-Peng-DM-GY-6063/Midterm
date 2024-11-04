// Shader Credit to: Richard Bourne & VKS
// https://openprocessing.org/sketch/994875
// https://openprocessing.org/sketch/2399104

let buildings = [];
let numBuildings = 2400;

let containerCenterX, containerCenterY;
let containerSpeedX, containerSpeedY;
let containerWidth, containerHeight;
let minX, maxX, minY, maxY;

function setup() {
  // Generate buildings
  let mainCanvas = createCanvas(windowWidth, windowHeight);
  mainCanvas.position(0, 0);
  mainCanvas.style("z-index", "1");
  generateBuildings();

  containerWidth = windowWidth / 1.5;
  containerHeight = windowHeight / 1.5;

  // Boundaries
  minX = 0;
  maxX = width;
  minY = 0;
  maxY = height;

  containerCenterX = random(minX, maxX);
  containerCenterY = random(minY, maxY);

  // Speed
  containerSpeedX = random(0.3, 0.7);
  containerSpeedY = random(0.3, 0.7);

  // Z-index
  let container = select("#shader-container");
  container.size(containerWidth, containerHeight);
  container.style("z-index", "2");

  createShaderWindow();
}

function draw() {
  background(35);

  // Draw buildings
  for (let b of buildings) {
    let opacity = map(sin(b.opacityPhase), -1, 1, 10, 225);
    stroke(180, opacity);
    b.opacityPhase += b.fadeSpeed;
    drawBuilding(b.x, b.y, b.w, b.d, b.h);
  }

  // Bounce off 
  if (containerCenterX <= minX || containerCenterX >= maxX) {
    containerSpeedX *= -1;
  }
  if (containerCenterY <= minY || containerCenterY >= maxY) {
    containerSpeedY *= -1;
  }

  // Update container center position
  containerCenterX += containerSpeedX;
  containerCenterY += containerSpeedY;

  let containerX = containerCenterX - containerWidth / 2;
  let containerY = containerCenterY - containerHeight / 2;

  let container = select("#shader-container");
  container.position(containerX, containerY);
}

function generateBuildings() {
  buildings = [];
  let rows = Math.sqrt(numBuildings);
  let cols = rows;

  for (let i = 0; i < numBuildings; i++) {
    let x = (i % cols) * (width / cols) + random(-5, 5);
    let y = Math.floor(i / cols) * (height / rows) + random(-5, 5);
    let w = random(5, 15);
    let d = random(3, 10);
    let h = random(10, 40);
    let opacityPhase = random(TWO_PI);
    let fadeSpeed = random(0.005, 0.03);
    buildings.push({ x, y, w, d, h, opacityPhase, fadeSpeed });
  }
}

function drawBuilding(x, y, w, d, h) {
  let frontBottomLeft = createVector(x, y);
  let frontBottomRight = createVector(x + w, y);
  let frontTopLeft = createVector(x, y - h);
  let frontTopRight = createVector(x + w, y - h);

  let backBottomRight = createVector(x + w + d, y - d * 0.5);
  let backTopLeft = createVector(x + d, y - h - d * 0.5);
  let backTopRight = createVector(x + w + d, y - h - d * 0.5);

  // Front
  line(
    frontBottomLeft.x,
    frontBottomLeft.y,
    frontBottomRight.x,
    frontBottomRight.y
  );
  line(
    frontBottomRight.x,frontBottomRight.y,frontTopRight.x,frontTopRight.y
  );
  line(frontTopRight.x, frontTopRight.y, frontTopLeft.x, frontTopLeft.y);
  line(frontTopLeft.x, frontTopLeft.y, frontBottomLeft.x, frontBottomLeft.y);

  // Side
  line(
    frontBottomRight.x,frontBottomRight.y,backBottomRight.x,backBottomRight.y
  );
  line(backBottomRight.x, backBottomRight.y, backTopRight.x, backTopRight.y);
  line(backTopRight.x, backTopRight.y, frontTopRight.x, frontTopRight.y);

  // Top
  line(frontTopLeft.x, frontTopLeft.y, backTopLeft.x, backTopLeft.y);
  line(frontTopRight.x, frontTopRight.y, backTopRight.x, backTopRight.y);
  line(backTopLeft.x, backTopLeft.y, backTopRight.x, backTopRight.y);
}

// Shader overlay window - arrow function 
function createShaderWindow() {
  return new p5((sketch) => {
    let theShader;
    let metaballs = [];

    sketch.preload = () => {
      // Load shader files
      theShader = sketch.loadShader("shader.vert", "shader.frag");
    };

    sketch.setup = () => {
      // Get the size of the shader container
      let container = sketch.select("#shader-container");
      //elt - html element - getBoundingClientRect() - get the viewport data
      let rect = container.elt.getBoundingClientRect();
      let w = rect.width;
      let h = rect.height;

      sketch.createCanvas(w, h, sketch.WEBGL);
      sketch.noStroke();

      //Credit to: Richard Bourne
      // Initialize metaballs
      for (let i = 0; i < 12; i++) {
        metaballs.push({
          x: Math.random(),
          y: Math.random(),
          radius: 0.05 + Math.random() * 0.1,
          speedX: -0.0005 + Math.random() * 0.001,
          speedY: -0.0005 + Math.random() * 0.001,
        });
      }
    };

    sketch.draw = () => {

      sketch.shader(theShader);

      theShader.setUniform("u_resolution", [sketch.width, sketch.height]);
      theShader.setUniform("u_time", sketch.millis() / 1000.0);

      // Update metaballs positions
      for (let i = 0; i < metaballs.length; i++) {
        let m = metaballs[i];
        m.x += m.speedX;
        m.y += m.speedY;
        if (m.x < 0 || m.x > 1) m.speedX *= -1;
        if (m.y < 0 || m.y > 1) m.speedY *= -1;
      }

      // Prepare array to send to shader
      let metaballsData = [];
      for (let i = 0; i < metaballs.length; i++) {
        let m = metaballs[i];
        metaballsData.push(m.x, m.y, m.radius);
      }

      // Set uniform
      theShader.setUniform("u_metaballs", metaballsData);
      sketch.rect( - sketch.width / 2, - sketch.height / 2, sketch.width, sketch.height);
    };
  }, "shader-container");
}
