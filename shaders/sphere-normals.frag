precision mediump float;

uniform vec4 tint;
varying vec3 vNormal;

void main() {
   gl_FragColor = vec4(vNormal, 1.0) * tint;
}