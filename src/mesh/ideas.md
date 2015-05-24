

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
  - user must decide attrib locations for app
  - add a pipeline pre-process step that
    reloads all shaders to use the same attrib layout
    (user could also just create all shaders w/ locations)


