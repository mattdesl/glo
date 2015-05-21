precision mediump float;
varying float foo;

void main() {
  gl_FragColor = vec4(vec3(foo), 1.0);
}