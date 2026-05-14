#!/bin/bash

export NODE_OPTIONS="--import ./register-hooks.js"
npx webpack --config ./webpack/webpack.prod.config.ts
