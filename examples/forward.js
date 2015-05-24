var createCamera = require('perspective-camera')
var createApp = require('canvas-loop')
var createShader = require('../src/shader')
var createContext = require('webgl-context')
var basic = require('../src/shaders/basic')

var gl = createContext()
var canvas = document.body.appendChild(gl.canvas)
var shader = createShader(gl, basic)

//just for prototyping..
var geom = require('icosphere')(1)
var mesh = require('gl-geometry')(gl).attr('position', geom)

var model = require('gl-mat4/identity')([])

var camera = createCamera()

createApp(canvas)
  .on('tick', render)
  .start()

function render (dt) {
  var width = gl.drawingBufferWidth
  var height = gl.drawingBufferHeight
  gl.viewport(0, 0, width, height)
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.disable(gl.DEPTH_TEST)
  gl.disable(gl.CULL_FACE)

  camera.viewport = [0, 0, width, height]
  camera.identity()
  camera.translate([ 0, 0, 4 ])
  camera.lookAt([ 0, 0, 0 ])
  camera.update()

  shader.bind()
  shader.uniforms.model(model)
  shader.uniforms.projection(camera.projection)
  shader.uniforms.view(camera.view)
  shader.uniforms.tint([1, 1, 1, 1])

  
}

// function createExtensions (gl) {
//   var drawBuffers = gl.getExtension('WEBGL_draw_buffers')
//   var fragDepth = gl.getExtension('EXT_frag_depth')
//   var shaderLOD = gl.getExtension('EXT_shader_texture_lod') // no FF
//   var stdDerivs = gl.getExtension('OES_standard_derivatives')
//   var depthTex = gl.getExtension('WEBGL_depth_texture')
//   console.log(drawBuffers)
//   console.log(fragDepth)
//   console.log(shaderLOD)
//   console.log(stdDerivs)
//   console.log(depthTex)
// }