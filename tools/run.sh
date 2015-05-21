# Quick script to run a JS file, e.g.
#   tools/run examples/basic.js
echo "Running: $1"
budo $1:bundle.js --live --verbose -- -t babelify -t glslify -t [ installify --save-dev ] -p errorify | garnish