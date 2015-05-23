var test = require('tape')

var extracted = require('./fixtures/complex-structs.json')
// var asJson = require('../src/glo-shader/reflect')
var asJson = require('../src/glo-shader/reflect')

test('should extract json from uniforms / attributes', function (t) {
  var r = asJson(extracted.uniforms)
  console.log(JSON.stringify(r, null, 2))
  t.end()
})