// testing low level GL utils

var createCamera = require('perspective-camera')
var createApp = require('canvas-loop')
var createShader = require('../src/shader')
var createContext = require('webgl-context')
// var basic = require('../shaders/basic')
var testNormals = require('../shaders/sphere-normals')

var gl = createContext()
var canvas = document.body.appendChild(gl.canvas)
var shader = createShader(gl, testNormals)
var pack = require('array-pack-2d')

var icosphere = require('icosphere')(3)

var model = require('gl-mat4/identity')([])

var camera = createCamera()

var createBuffer = require('../src/mesh/buffer')
var createVBO = require('../src/mesh/vbo')

var positions = createBuffer(gl, pack(icosphere.positions))
var elements = createBuffer(gl, pack(icosphere.cells, 'uint16'), gl.ELEMENT_ARRAY_BUFFER)
var vbo = createVBO(gl, [
  {
    name: 'position',
    buffer: positions,
    size: 3
  }
], elements)

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

  vbo.bind(shader)
  vbo.draw(gl.TRIANGLES, geom.cells.length * 3)
  vbo.unbind(shader)
}
