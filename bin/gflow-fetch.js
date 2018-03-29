#!/usr/bin/env node
'use strict';
const { fetch, config } = require('../src');

config
  .then((config) => {
    fetch();
  });

