var createCamera = require('perspective-camera')
var createApp = require('canvas-loop')
var createShader = require('../src/shader')
var createContext = require('webgl-context')
var basic = require('../src/shaders/basic')

var gl = createContext()
createExtensions(gl)

var canvas = document.body.appendChild(gl.canvas)

var shader = createShader(gl, basic)

createApp(canvas)
  .on('tick', render)
  .start()

function render (dt) {
  gl.clearColor(0, 0, 0, 1)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  shader.bind()

}

function createExtensions (gl) {
  var drawBuffers = gl.getExtension('WEBGL_draw_buffers')
  var fragDepth = gl.getExtension('EXT_frag_depth')
  var shaderLOD = gl.getExtension('EXT_shader_texture_lod') // no FF
  var stdDerivs = gl.getExtension('OES_standard_derivatives')
  var depthTex = gl.getExtension('WEBGL_depth_texture')
  console.log(drawBuffers)
  console.log(fragDepth)
  console.log(shaderLOD)
  console.log(stdDerivs)
  console.log(depthTex)
}