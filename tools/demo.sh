# Quick script to run a JS file, e.g.
#   tools/run examples/basic.js
echo "Running: $1"
budo $1:bundle.js --dir examples --live -v -- -t babelify -t glslify -p errorify -t [ installify --save-dev ] | garnish