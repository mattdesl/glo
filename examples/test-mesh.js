// testing low level GL utils

var createCamera = require('perspective-camera')
var createApp = require('canvas-loop')
var createShader = require('../src/shader')
var createContext = require('webgl-context')
var material = require('./shaders/mat-basic')

var gl = createContext()
var canvas = document.body.appendChild(gl.canvas)
var shader = createShader(gl, material)

var icosphere = require('icosphere')(3)
var torus = require('torus-mesh')()

var model = require('gl-mat4/identity')([])

var camera = createCamera()

var createTexture = require('../src/texture/2d')
var createMesh = require('../src/mesh')
var mesh = createMesh(gl, { vao: true })
  .attribute('position', torus.positions)
  .attribute('uv', torus.uvs)
  .attribute('normal', torus.normals)
  .elements(torus.cells)

var loadImage = require('img')
var baboon = require('baboon-image-uri')
var tex

var app = createApp(canvas)
  .on('tick', render)

var parseDDS = require('parse-dds')
require('xhr')({
  responseType: 'arraybuffer',
  uri: 'assets/test-dxt1.dds'
}, function (err, resp, data) {
  if (err) throw err
  var ext = gl.getExtension('WEBGL_compressed_texture_s3tc')
  if (!ext)
    throw new Error('compressed texture not supported')

  var dds = parseDDS(data)
  tex = createTexture(gl)
  tex.compressed = true
  tex.format = getFormat(ext, dds.format)
  tex.wrap = gl.REPEAT
  tex.minFilter = gl.LINEAR_MIPMAP_LINEAR
  tex.magFilter = gl.LINEAR

  dds.images.forEach(function (image, level) {
    var array = new Uint8Array(data, image.offset, image.length)
    tex.update(array, image.shape, level)
  })

  app.start()
})

function getFormat (ext, ddsFormat) {
  switch (ddsFormat) {
    case 'dxt1':
      return ext.COMPRESSED_RGB_S3TC_DXT1_EXT
    case 'dxt3':
      return ext.COMPRESSED_RGBA_S3TC_DXT3_EXT
    case 'dxt5':
      return ext.COMPRESSED_RGBA_S3TC_DXT5_EXT
    default:
      throw new Error('unsupported format ' + ddsFormat)
  }
}


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
  camera.translate([ -3, 0, -4 ])
  camera.lookAt([ 0, 0, 0 ])
  camera.update()

  shader.bind()
  shader.uniforms.projection(camera.projection)
  shader.uniforms.view(camera.view)
  shader.uniforms.model(model)
  shader.uniforms.iChannel0(0)
  // shader.uniforms.tint([1, 1, 1, 1])

  tex.bind()
  mesh.bind(shader)
  mesh.draw(gl.TRIANGLES)
  mesh.unbind(shader)
}
