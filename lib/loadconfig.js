#!/usr/bin/env node

var fs = require('fs'),
  path = require('path');

exports.loadConfig = function(filename) {
  var config = path.join(process.cwd(), filename),
    data;

  try {
    data = JSON.parse(fs.readFileSync(config, "utf8"));
  } catch(e) {
    console.log("Error reading file " + config);
  }

  return data;
};
