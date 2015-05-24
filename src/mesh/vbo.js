var assign = require('object-assign')
var noop = function () {}
var attribs = require('./bind-attributes')

module.exports = function createVBO (gl, attributes, elements, elementsType) {
  var vbo = new VertexBufferObject(gl)
  vbo.update(attributes, elements, elementsType)
  return vbo
}

function VertexBufferObject (gl) {
  this.gl = gl
  this.attributes = null
  this.elements = null
  this.elementsType = gl.UNSIGNED_SHORT
}

assign(VertexBufferObject.prototype, {

  dispose: noop,
  invalidate: noop,

  update: function update (attributes, elements, elementsType) {
    this.attributes = attributes
    this.elements = elements
    this.elementsType = elementsType || this.gl.UNSIGNED_SHORT
  },

  // associate this VBO with the given shader
  bind: function bind (shader) {
    if (!shader) {
      throw new Error('must provide shader to vbo bind()')
    }

    attribs.bind(this.gl, this.attributes, this.elements, shader.attributes)
  },

  // must be the same shader that was used in bind()
  unbind: function unbind (shader) {
    if (!shader) {
      throw new Error('must provide shader to vbo unbind()')
    }

    attribs.unbind(this.gl, this.attributes, this.elements, shader.attributes)
  },

  draw: function draw (mode, count, offset) {
    offset = offset || 0
    var gl = this.gl
    if (this.elements) {
      gl.drawElements(mode, count, this.elementsType, offset)
    } else {
      gl.drawArrays(mode, offset, count)
    }
  }
})
