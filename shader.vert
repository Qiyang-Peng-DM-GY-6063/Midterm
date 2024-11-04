// shader.vert

// Shader Credit to ：Richard Bourne & VKS
// https://openprocessing.org/sketch/994875
// https://openprocessing.org/sketch/2399104

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = vec4(aPosition, 1.0);
}
