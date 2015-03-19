#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  process = require('process');

exports.loadConfig = function(filename) {
  var config = path.join(process.cwd(), filename),
    data;

  try {
    data = JSON.parse(fs.readFileSync(config, "utf8"));
  } catch(e) {
    throw new Error("Error reading file " + config);
    process.exit();
  }

  return data;
};
