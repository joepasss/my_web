#!/bin/bash

export NODE_OPTIONS="--import ./register-hooks.js"
npx webpack serve --config ./webpack/webpack.dev.config.ts
