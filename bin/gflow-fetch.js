#!/usr/bin/env node
'use strict';
const { fetch, getConfiguration } = require('../src');

getConfiguration()
  .then((config) => {
    fetch();
  });

