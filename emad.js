#!/usr/bin/env node

var commandopts = require('./lib/command').command(process.argv),
  config = require('./lib/loadconfig'),
  fs = require('fs'),
  path = require('path'),
  configopts = config.loadConfig(path.join('emad-local', 'emad-config.json')),
  os = require('os'),
  projectopts = config.loadConfig('emad-project.json'),
  sync = require('./lib/sync');

// The emad function glues everything together.
// It handles config loading, passes arguments around, and
// calls the sync function, provided that validation passes.
var emad = function(commandopts, configopts, projectopts) {
  var track = [];
  
  var objectifyPaths = function(element) {
    if (element.source === '.') {
      element.source = './';
    }
    return {
      source: path.posix.normalize(configopts.env[commandopts.env].source.prefix + element.source),
      target: path.posix.normalize(configopts.env[commandopts.env].target.prefix + element.target)
    };
  };
    
  var runSync = function(element, index, array) {
    var source = element.source,
      target = element.target,
      rscall = sync.sync(source, target, commandopts, configopts, projectopts);
  
    track.push({
      source: source,
      target: target,
      commandopts: commandopts,
      configopts: configopts,
      projectopts: projectopts
    });
  };

  if (typeof projectopts.configversion === 'undefined') {
    console.log('The format of the config file is incompatible with this version of emad.');
  }
  else if (parseInt(projectopts.configversion, 10) === 3) {
    if (typeof projectopts.env[commandopts.env] !== 'undefined') {
        if (commandopts.only === false) {
          projectopts.env[commandopts.env]
            .map(objectifyPaths)
            .forEach(runSync);
        }
        else {
          [projectopts.env[commandopts.env][commandopts.only]]
            .map(objectifyPaths)
            .forEach(runSync);
        }
        
    }
    else {
      console.log('The target environment does not exist in the config file.');
    }
    
  }
  
  return track;

};

if (require.main === module) {
  console.log('emad started at: ' + new Date());
  emad(commandopts, configopts, projectopts);
}
else {
  exports.emad = emad;
}
