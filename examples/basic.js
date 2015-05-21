const gl = require('webgl-context')()
const canvas = gl.canvas

const app = require('canvas-loop')(canvas, {
  scale: window.devicePixelRatio
})

app.on('tick', render).start()

function render(dt) {
  
}