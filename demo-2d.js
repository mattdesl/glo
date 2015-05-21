var createContext = require('2d-context')
var createLoop = require('canvas-fit-loop')
var mat4 = require('gl-mat4')

// get a WebGL context
var ctx = createContext()
var canvas = ctx.canvas
document.body.appendChild(canvas)

// setup a retina-scaled canvas
var app = createLoop(canvas)
var unproject = require('./camera/vec3-projection').unproject
var project = require('camera-project')
var combined = mat4.identity([])
var invProjView = mat4.identity([])
var drawTriangles = require('draw-triangles-2d')

var camera = require('./camera/perspective')({
  fov: Math.PI/4,
  near: 0,
  far: 100,
  position: [0, 0, 5]
})

var icosphere = require('icosphere')(1)
var time = 0

// start rendering
app.start()

var hues = []
for (var i=0; i<100; i++)
  hues.push(Math.random()*40 + 30)

// on requestAnimationFrame
app.on('tick', function(dt) {
  time += dt / 1000
  ctx.clearRect(0, 0, app.shape[0], app.shape[1])
  ctx.fillRect(0, 0, 25, 25)

  var viewport = [0, 0, 256, 228]
  var aspect = viewport[2] / viewport[3]
  camera.aspect = aspect

  var orbit = 2.5
  var x = Math.cos(time/4) * orbit
  var z = Math.sin(time/4) * orbit
  camera.identity()
  camera.position[0] = x
  camera.position[2] = z
  camera.lookAt([0, 0, 0])
  camera.update()

  //projection * view
  mat4.multiply(combined, camera.projection, camera.view)
  //invert the projection * view matrix
  mat4.invert(invProjView, combined)

  var pos2d = icosphere.positions.map(function(p) {
    var out = project([], p, viewport, combined)
    return out.slice(0, 3)
  })

  var cells = icosphere.cells.slice().sort(function(a, b) {
    var a0 = a[0], a1 = a[1], a2 = a[2]
    var b0 = b[0], b1 = b[1], b2 = b[2]

    var pa0 = pos2d[a0], pa1 = pos2d[a1], pa2 = pos2d[a2]
    var pb0 = pos2d[b0], pb1 = pos2d[b1], pb2 = pos2d[b2]

    var avgZa = (pa0[2] + pa1[2] + pa2[2]) / 3
    var avgZb = (pb0[2] + pb1[2] + pb2[2]) / 3
    return avgZa - avgZb
  })

  cells.forEach(function(cell, i) {
    ctx.beginPath()
    var h = hues[i%hues.length]
    ctx.fillStyle = 'hsl('+h+', 50%, 50%)'
    drawTriangles(ctx, pos2d, cells, i, i+1)
    ctx.fill()
  })

})
