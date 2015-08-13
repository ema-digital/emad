#!/usr/bin/env node

var commandopts = require('./lib/command').command(process.argv),
  config = require('./lib/loadconfig'),
  fs = require('fs'),
  path = require('path'),
  configopts = config.loadConfig(path.join('emad-local', 'emad-config.json')),
  os = require('os'),
  projectSettings = config.loadConfig('emad-project.json'),
  sync = require('./lib/sync');

// prefixs the path for windows OS
// to work with the cwRsync package
var addPathPrefix = function(path) {
  if (commandopts.isWindows === true) {
    return '/cygdrive' + path;
  }
  else {
    return path;
  }
};

// The emad function glues everything together.
// It handles config loading, passes arguments around, and
// calls the sync function, provided that validation passes.
var emad = function(commandopts, configopts, projectSettings, callback) {
  var track = [];

  if (typeof configopts.configversion === 'undefined') {
    console.log('The format of the config file is incompatible with this version of emad.');
  }
  else if (parseInt(configopts.configversion, 10) === 2) {
    if (typeof configopts.env[commandopts.env] !== 'undefined') {
      configopts.env[commandopts.env]
      .map(function(element) {
        return {
          source: addPathPrefix(element.source),
          target: addPathPrefix(element.target)
        };
      })
      .forEach(function(element, index, array) {
        var source = element.source,
          target = element.target,
          rscall = sync.sync(source, target, commandopts, configopts, projectSettings);
  
        track.push(rscall);
      });
    }
    else {
      console.log('The target environment does not exist in the config file.');
    }
    
  }
  
  return track;

};

if (require.main === module) {
  console.log('emad started at: ' + new Date());
  emad(commandopts, configopts, projectSettings);
}
else {
  exports.emad = emad;
}
