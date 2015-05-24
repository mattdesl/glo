glo development tool:

  - optional, high-level
  - lives in a separate module
  - brings together:
    - budo
    - garnish
    - errorify
    - babelify??
  - main focus is glslify hot-reloading
  - on bundle update() event, check deps
    if they were all .glsl / .frag / .vert files,
    don't reload browser (assume hot-reload will work)

basically allowing faster development without breaking
current LiveReload integrations