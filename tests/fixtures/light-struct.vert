uniform mat4 projection, view;
uniform mat4 model;

attribute vec4 position;
attribute float someAttrib;

float notListed = 2.0;
uniform float alsoNotListed;

void main() {
   gl_Position = projection * view * model * position;
   gl_PointSize = someAttrib;
}
