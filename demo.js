var gl = require('webgl-context')()
var createGeom = require('gl-geometry')
var wire = require('gl-wireframe')
var mat4 = require('gl-mat4')

//resize canvas w/ device scaling
var fit = require('canvas-fit')(gl.canvas, window, window.devicePixelRatio)

//our mesh
var icosphere = require('icosphere')(1)
//rejig cells so they render with gl.LINES correctly
icosphere.cells = wire(icosphere.cells)

//build buffers + attributes
var geom = createGeom(gl)
      .attr('positions', icosphere.positions)
      .faces(icosphere.cells)

var shader = require('gl-basic-shader')(gl)

var createCamera = require('./camera/perspective')
var model = mat4.identity([])
var camera = createCamera({
  fov: Math.PI/4,
  near: 0,
  far: 100,
  position: [0, 0, 5]
})

//resize to screen & render
document.body.appendChild(gl.canvas)
window.addEventListener('resize', fit)

var time = 0
require('raf-loop')(render).start()

function render(dt) {
  time += dt/1000

  var width = gl.drawingBufferWidth 
  var height = gl.drawingBufferHeight
  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 1)

  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.disable(gl.DEPTH_TEST)

  var aspect = width / height
  
  //rotate model matrix around Y axis
  // mat4.rotateY(rotation, rotation, 0.005)
  camera.aspect = aspect

  var orbit = 2.5
  var x = Math.cos(time/4) * orbit
  var z = Math.sin(time/4) * orbit
  camera.identity()
  // camera.translate([orbit, 0, orbit])
  // camera.rotateAround([0, 0, 0], [0, 1, 0], time)
  camera.position[0] = x
  camera.position[2] = z
  camera.lookAt([0, 0, 0])
  camera.update()


  shader.bind()
  shader.uniforms.projection = camera.projection
  shader.uniforms.view = camera.view
  shader.uniforms.model = model
  shader.uniforms.tint = [1,1,1,1] // RGBA white

  geom.bind(shader)
  geom.draw(gl.LINES)
  geom.unbind()
}