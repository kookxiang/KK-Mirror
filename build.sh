#!/bin/sh

# Update dependencies
/usr/local/bin/yarn

# Build
echo "Build via webpack..."
webpack
