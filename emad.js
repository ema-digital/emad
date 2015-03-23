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


var emad = function(commandopts, callback) {
  
  // Single deployment location
  if (configopts.dirs.constructor === {}.constructor) {
    if (configopts.dirs.source && configopts.dirs.target) {
      var source = addPathPrefix(configopts.dirs.source),
        target = addPathPrefix(configopts.dirs.target);
      
      sync.sync(source, target, commandopts, configopts, projectSettings);
    }
    else {
      console.log("The dirs object is missing either a source or target location. Nothing will be deployed");
      process.exit(1);
    }
    
  }
  
  // Multiple deployment locations
  else if(configopts.dirs instanceof Array) {
    configopts.dirs
      .filter(function(element) {
        return element.source && element.target;
      })
      .map(function(element, index, array) {
        return {
          source: addPathPrefix(element.source),
          target: addPathPrefix(element.target)
        }
      })
      .forEach(function(element, index, array) {
        var source = element.source,
          target = element.target;
          
        sync.sync(source, target, commandopts, configopts, projectSettings);
        
      });
    
  }
  // Final check for a misconfigured object
  else {
    console.log("The dirs property is missing from your config file or it is an invalid type");
    process.exit(1);
  }
};

if (!module.parents) {
  emad(commandopts);
  console.log('emad completed at: ' + new Date());
}
else {
  exports.emad = emad;
}
