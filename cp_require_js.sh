#!/bin/bash

if [ -z "$1" ]; then
	echo "Usage: cp_require_js.sh <path_to_require.js>"
	exit
fi

if [ ! -f "$1" ]; then
	echo "$1: not a file"
	exit
fi

cp $1 examples/module-discovery/public/scripts/lib/require.js
cp $1 examples/module-discovery-bundle-bug/public/scripts/lib/require.js
cp $1 examples/module-discovery-grunt/public/scripts/lib/require.js
cp $1 examples/shim/WebContent/scripts/lib/require.js
cp $1 examples/simple/public/scripts/lib/require.js
cp $1 tests/issue004/public/scripts/lib/require.js

