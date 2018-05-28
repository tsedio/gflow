#!/usr/bin/env node
'use strict';
const { branches, config } = require('../src');


branches(config.toObject());
