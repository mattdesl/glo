var assign = require('object-assign')
var noop = function () {}

module.exports = VertexObject
function VertexObject (gl) {
  this.gl = gl
  this.attributes = null
  this.elements = null
  this.elementsType = gl.UNSIGNED_SHORT
}

assign(VertexObject.prototype, {

  dispose: noop,
  invalidate: noop,

  update: function update (attributes, elements, elementsType) {
    this.attributes = attributes
    this.elements = elements
    this.elementsType = elementsType || this.gl.UNSIGNED_SHORT
    this.invalidate()
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
