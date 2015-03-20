#!/usr/bin/env node

var command = require('./lib/command').command(process.argv),
  config = require('./lib/loadconfig'),
  fs = require('fs'),
  path = require('path'),
  data = config.loadConfig(path.join('emad-local', 'emad-config.json')),
  os = require('os'),
  sync = require('./lib/sync');

var emad = function(command, callback) {
  
  var addPathPrefix = function(path) {
    if (command.isWindows === true) {
      return '/cygdrive' + path;
    }
    else {
      return path;
    }
  };
  
  var writeLog = function(opts){
    
  };
  
  // Single deployment location
  if (data.dirs.constructor === {}.constructor) {
    if (data.dirs.source && data.dirs.target) {
      var source = addPathPrefix(data.dirs.source),
        target = addPathPrefix(data.dirs.target);
      
      sync.sync(source, target, command, data);
    }
    else {
      console.log("The dirs object is missing either a source or target location. Nothing will be deployed");
      process.exit(1);
    }
    
  }
  
  // Multiple deployment locations
  else if(data.dirs instanceof Array) {
    data.dirs
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
          
        sync.sync(source, target, command, data);
        
      });
    
  }
  // Final check for a misconfigured object
  else {
    console.log("The dirs property is missing from your config file or it is an invalid type");
    process.exit(1);
  }
};

if (!module.parents) {
  emad(command);
}
