#!/usr/bin/env node

const { branches, config } = require('../src');

branches(config.toObject());
