// WebGL2 textures:
//   2d, 3d, 2d-array, cube

// option A
// different classes for Texture2D, TextureCube, etc
var createTextureCube = require('glo-texture/cube')
var texCube = createTextureCube(gl, images, { 
  format: gl.RGB 
})

// option B
// same Texture class, handles different upload() behaviour
var createTexture = require('glo-texture')
var texCube = createTexture(gl, images, {
  target: gl.TEXTURE_CUBE_MAP,
  format: gl.RGB
})
