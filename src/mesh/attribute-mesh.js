var assign = require('object-assign')
var pack = require('array-pack-2d')
var dtype = require('dtype')
var fromGLType = require('./gl-to-dtype')
var createBuffer = require('./buffer')
var createVBO = require('./vbo')
var createVAO = require('./vao')

var indexOfName = require('indexof-property')('name')
var anArray = require('an-array')
var defined = require('defined')

module.exports = function createMesh (gl, opt) {
  return new AttributeMesh(gl, opt)
}

function AttributeMesh (gl, opt) {
  this.gl = gl
  this.attributes = []
  this._elements = null
  this._elementsSize = null
  this._elementsType = null
  this.bindings = opt.vao ? createVAO(gl) : createVBO(gl)
}

Object.defineProperty(AttributeMesh.prototype, 'count', {
  configurable: true, enumerable: true,
  get: function () {
    if (this._elements) {
      return this._elements.length
    } else {
      if (this.attributes.length === 0) return 0
      return this.attributes[0].buffer.length / this.attributes[0].size
    }
  }
})

assign(AttributeMesh.prototype, {

  bind: function bind (shader) {
    if (this._dirty) {
      this.bindings.update(this.attributes, this._elements, this._elementsType)
      this._dirty = false
    }

    this.bindings.bind(shader)
    return this
  },

  unbind: function unbind (shader) {
    this.bindings.unbind(shader)
    return this
  },

  draw: function draw (mode, count, offset) {
    count = defined(count, this.count)
    this.bindings.draw(mode, count, offset)
    return this
  },

  // replaces attribute
  attribute: function attribute (name, opt) {
    var attribIdx = indexOfName(this.attributes, name)
    var attrib = attribIdx === -1 ? null : this.attributes[attribIdx]
    if (!opt) { // getter
      return attrib
    }

    var gl = this.gl
    if (anArray(opt)) { // allow just array param
      opt = { data: opt }
    }

    var array = unroll(opt.data, fromGLType(opt.type) || 'float32')
    var size = opt.size || guessSize(opt.data, 3)
    var buffer
    if (!attrib) { // create new attribute
      buffer = createBuffer(gl, array, gl.ARRAY_BUFFER, opt.usage)
      attrib = assign({
        name: name,
        buffer: buffer,
        size: size
      }, opt)
      this.attributes.push(attrib)
    } else { // update existing
      // mutate existing attribute info like stride/etc
      assign(attrib, opt)
      buffer.usage = defined(opt.usage, buffer.usage)
      buffer.update(array)
    }

    this._dirty = true
    return this
  },

  elements: function elements (opt) {
    if (!opt) { // getter
      return this._elements
    }

    var gl = this.gl
    if (anArray(opt)) { // allow just array param
      opt = { data: opt }
    }

    var size = opt.size || guessSize(opt.data, 3)
    var array = unroll(opt.data, fromGLType(opt.type) || 'uint16')

    if (this._elements) { // update existing
      this._elementsType = opt.type
      this._elements.usage = defined(opt.usage, this._elements.usage)
      this._elementsSize = size
      this._elements.update()
    } else { // create new element buffer
      this._elementsSize = defined(opt.size, this._elementsSize)
      this._elements = createBuffer(gl, array, gl.ELEMENT_ARRAY_BUFFER, opt.usage)
    }

    this._dirty = true
    return this
  }
})

function guessSize (data, defaultSize) {
  if (data.length && data[0].length) {
    return data[0].length
  }
  return defaultSize
}

function unroll (data, type) {
  if (Array.isArray(data)) { // plain array
    if (Array.isArray(data[0])) { // nested array
      return pack(data, type)
    } else { // flat array
      return new (dtype(type))(data)
    }
  } else { // assume typed array already
    return data
  }
}
