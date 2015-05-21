precision mediump float;

struct Light {
  vec3 position;
  vec3 color;
  vec3 ambient;
  float falloff;
  float radius;
};
uniform bvec2 bools;
uniform Light light;
uniform Light lights[4];
uniform vec4 tint;
uniform vec3 tint3;
uniform sampler2D tex;
uniform samplerCube texCube;

uniform struct xxx {
  int y;
  bool foo;
  float b;
} b;

void main() {
  vec4 t = texture2D(tex, vec2(0.0));
  vec4 t2 = textureCube(texCube, vec3(0.0));
  gl_FragColor = vec4(1.0) * b.b * tint3.x + t.x + t2.y;
  float a = tint.x;
  if (bools.x) {
    a *= 2.0;
  }
  
  gl_FragColor += vec4(1.0) * a * lights[0].radius * light.position.x;
}
