#!/bin/sh

# Update dependencies
/usr/local/bin/yarn

# Build
echo "Build via webpack..."
yarn run build

# Clean-up
rm -rf node_modules/

