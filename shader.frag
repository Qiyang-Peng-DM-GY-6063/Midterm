// shader.frag

// Shader Credit to: Richard Bourne & VKS
// https://openprocessing.org/sketch/994875
// https://openprocessing.org/sketch/2399104

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_metaballs[12]; // 12 balls with x, y, radius
varying vec2 vTexCoord;

float metaball(vec2 p, vec2 center, float radius) {
  return radius / length(p - center);
}

void main() {
  vec2 uv = vTexCoord;
  float intensity = 0.0;

  // Calculate influence of each metaball
  for (int i = 0; i < 12; i++) {
    vec2 center = u_metaballs[i].xy;
    float radius = u_metaballs[i].z;
    intensity += metaball(uv, center, radius);
  }

  // Map intensity to Morandi color scheme
  float t = clamp(intensity * 0.8, 0.0, 1.0);

  vec3 baseColor = vec3(0.6, 0.55, 0.5); // Deeper muted color
  vec3 variation = vec3(
    0.15 * sin(u_time + intensity * 5.0),
    0.15 * cos(u_time + intensity * 4.0),
    0.15 * sin(u_time + intensity * 3.0)
  );

  vec3 color = baseColor + variation;

  float alpha = smoothstep(0.4, 1.0, intensity);
  gl_FragColor = vec4(color, alpha);
}
