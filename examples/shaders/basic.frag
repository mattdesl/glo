#ifdef GL_ES
precision mediump float;
#endif

uniform vec4 tint;

void main() {
   gl_FragColor = vec4(1.0) * tint;
}