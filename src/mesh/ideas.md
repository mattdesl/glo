

var mesh = createMesh()
  .attribute('position', floats, {
    normalize: true,
    stride: 
  })
  .elements(elements)




allow VAO and VBO independently for control
VBO by default 
  - simple case, most widespread support
  - in most cases bindings are not a bottleneck
  - can swap shaders easily

VAO for advanced optimizations
  - assumes all shaders have a matching layout
  - VAO will be set to the first shader on bind()
    until you call invalidate()
  - works well when you have to draw a mesh many
    times using the same shader
    or when you have bound attrib locations throughout