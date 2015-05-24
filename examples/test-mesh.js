// testing low level GL utils

var createCamera = require('perspective-camera')
var createApp = require('canvas-loop')
var createShader = require('../src/shader')
var createContext = require('webgl-context')
var testNormals = require('../shaders/sphere-normals')

var gl = createContext()
var canvas = document.body.appendChild(gl.canvas)
var shader = createShader(gl, testNormals)

var geom = require('icosphere')(3)

var model = require('gl-mat4/identity')([])

var camera = createCamera()

var createMesh = require('../src/mesh')
var mesh = createMesh(gl, { vao: true })
  .attribute('position', geom.positions)
  // .elements(geom.cells)

createApp(canvas)
  .on('tick', render)
  .start()

function render (dt) {
  var width = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight
  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)

  camera.viewport = [0, 0, width, height]
  camera.identity()
  camera.translate([ 0, 0, -4 ])
  camera.lookAt([ 0, 0, 0 ])
  camera.update()

  shader.bind()
  shader.uniforms.projection(camera.projection)
  shader.uniforms.view(camera.view)
  shader.uniforms.model(model)
  shader.uniforms.tint([1, 1, 1, 1])

  mesh.bind(shader)
  mesh.draw(gl.TRIANGLES)
  mesh.unbind(shader)
}
