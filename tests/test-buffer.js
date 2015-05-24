var test = require('tape')

var createBuffer = require('../src/mesh/buffer')
var createContext = require('webgl-context')

test('should create array buffer', function (t) {
  var gl = createContext()
  require('gl-buffer-snoop')(gl)

  var data = new Float32Array([ 1, 1, 0 ])
  var buffer = createBuffer(gl, data)
  t.equal(buffer.usage, gl.STATIC_DRAW, 'default static')
  t.equal(buffer.type, gl.ARRAY_BUFFER, 'default array')
  t.equal(buffer.byteLength, 12, 'correct byte length')
  t.equal(buffer.length, 3, 'correct length')

  buffer.bind()
  var usage = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_USAGE)
  t.equal(usage, gl.STATIC_DRAW, 'GPU usage storage')
  var length = gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE)
  t.equal(length, buffer.byteLength, 'GPU length storage')

  var gpuData = gl.getBufferData(buffer.handle)
  t.deepEqual(new Float32Array(gpuData.buffer), data, 'stored float32 array data')

  var elements = createBuffer(gl, data, gl.ELEMENT_ARRAY_BUFFER, gl.DYNAMIC_DRAW)

  elements.bind()
  usage = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_USAGE)
  t.equal(usage, elements.usage, 'GPU usage storage')
  t.equal(usage, gl.DYNAMIC_DRAW, 'GPU usage storage')
  length = gl.getBufferParameter(gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE)
  t.equal(length, elements.byteLength, 'GPU length storage')
  t.end()
})
