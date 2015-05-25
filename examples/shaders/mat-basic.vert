attribute vec2 uv;
attribute vec3 normal;
attribute vec4 position;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vUv = uv;
  vNormal = normal;
  gl_Position = projection * view * model * position;
  gl_PointSize = 1.0;
}
