var assign = require('object-assign')
function noop () {}

function VertexBufferObject (gl) {
  this.gl = gl
  this.attributes = null
  this.elements = null
  this.elementsType = gl.UNSIGNED_SHORT
}

assign(VertexBufferObject.prototype, {

  dispose: noop,
  unbind: noop,

  update: function (attributes, elements, elementsType) {
    this.attributes = attributes
    this.elements = elements
    this.elementsType = elementsType || this.gl.UNSIGNED_SHORT
  },

  // associate this VBO with the given shader
  bind: function (shader) {
    
  },

  draw: function (mode, count, offset) {

  }
})


// VBO.prototype.update = function (attributes, elements, elementsType) {
//   this._elements = elements
//   this._attributes = attributes
//   this._elementsType = elementsType || this.gl.UNSIGNED_SHORT
// }

// VBO.prototype.dispose = function () {}
// VBO.prototype.unbind = function () {}

// VBO.prototype.draw = function (mode, count, offset) {
//   offset = offset || 0
//   var gl = this.gl
//   if(this._elements) {
//     gl.drawElements(mode, count, this._elementsType, offset)
//   } else {
//     gl.drawArrays(mode, offset, count)
//   }
// }
