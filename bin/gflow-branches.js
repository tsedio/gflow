#!/usr/bin/env node
"use strict";
const {branches, getConfiguration} = require("../src");

getConfiguration()
  .then((config) =>
    branches(config)
  );
