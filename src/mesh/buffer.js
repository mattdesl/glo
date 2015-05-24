var assign = require('object-assign')

module.exports = function createBuffer (gl, data, type, usage) {
  type = type || gl.ARRAY_BUFFER
  usage = usage || gl.STATIC_DRAW

  if (type !== gl.ARRAY_BUFFER && type !== gl.ELEMENT_ARRAY_BUFFER) {
    throw new TypeError('gl-buffer: Invalid type for webgl buffer, must be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER')
  }
  if (usage !== gl.DYNAMIC_DRAW && usage !== gl.STATIC_DRAW && usage !== gl.STREAM_DRAW) {
    throw new TypeError('gl-buffer: Invalid usage for buffer, must be either gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW')
  }

  var buffer = new Buffer(gl, type, usage)
  buffer.update(data)
  return buffer
}

function Buffer (gl, type, usage) {
  this.gl = gl
  this.type = type
  this.usage = usage
  this.length = 0
  this.byteLength = 0
  this.handle = gl.createBuffer()
}

assign(Buffer.prototype, {

  bind: function bind () {
    this.gl.bindBuffer(this.type, this.handle)
  },

  dispose: function dispose () {
    this.gl.deleteBuffer(this.handle)
  },

  // since this is mostly internal, we will KISS and
  // just stick to typed arrays

  update: function update (data) {
    this.bind()
    this.length = data.length
    this.byteLength = this.length * data.BYTES_PER_ELEMENT
    this.gl.bufferData(this.type, data, this.usage)
  },

  updateSubData: function updateSubData (data, offset) {
    this.bind()
    this.gl.bufferSubData(this.type, offset, data)
  }
})
