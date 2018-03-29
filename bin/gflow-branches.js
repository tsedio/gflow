#!/usr/bin/env node
'use strict';
const { branches, config } = require('../src');

config
  .then((config) =>
    branches(config)
  )
  .catch(er => {
    console.error(er);
  });
