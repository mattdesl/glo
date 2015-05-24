attribute vec4 position;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;

varying vec3 vNormal;

void main() {
  vNormal = normalize(position.xyz); //need to mult by norm mtx...
  gl_Position = projection * view * model * position;
  gl_PointSize = 1.0;
}
