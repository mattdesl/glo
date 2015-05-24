var createVBO = require('./vbo')
var assign = require('object-assign')
var attribs = require('./bind-attributes')

module.exports = function createVAO (gl, attributes, elements, elementsType) {
  var ext = gl.getExtension('OES_vertex_array_object')
  if (!ext) { // emulated VAO
    return createVBO(gl, attributes, elements, elementsType)
  }

  var maxAttribs = gl.getParameter(gl.MAX_VERTEX_ATTRIBS) | 0
  var vbo = new VertexArrayObject(gl, ext, maxAttribs)
  vbo.update(attributes, elements, elementsType)
  return vbo
}

function VertexArrayObject (gl, ext, maxAttribs) {
  this.gl = gl
  this.attributes = null
  this.elements = null
  this.elementsType = gl.UNSIGNED_SHORT
  this.handle = ext.createVertexArrayOES()
  this._maxAttribs = maxAttribs
  this._dirty = false
  this._ext = ext
  this.vao = true
}

assign(VertexArrayObject.prototype, {

  dispose: function dispose () {
    this._ext.deleteVertexArrayOES(this.handle)
  },

  update: function update (attributes, elements, elementsType) {
    this.attributes = attributes
    this.elements = elements
    this.elementsType = elementsType || this.gl.UNSIGNED_SHORT
    this.invalidate()
  },

  invalidate: function () {
    this._dirty = true
  },

  bind: function bind (shader) {
    this._ext.bindVertexArrayOES(this.handle)

    // if we need to update the bindings ...
    if (this._dirty) {
      attribs.unbindAll(this.gl, this._maxAttribs)
      attribs.bind(this.gl, this.attributes, this.elements, shader.attributes)
    }
  },

  // must be the same shader that was used in bind()
  unbind: function unbind (shader) {
    this._ext.bindVertexArrayOES(null)
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
