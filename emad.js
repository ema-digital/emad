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

// The emad function glues everything tothether.
// It handles config loading, passes arguments around, and
// calls the sync function, provided that validation passes.
var emad = function(commandopts, configopts, projectSettings, callback) {
  var track = [];

  // Single deployment location
  if (configopts.dirs.constructor === {}.constructor) {
    if (configopts.dirs.source && configopts.dirs.target && configopts.dirs.env) {
      var source = addPathPrefix(configopts.dirs.source),
        target = addPathPrefix(configopts.dirs.target);

      if (configopts.dirs.env === commandopts.env) {
        var rscall = sync.sync(source, target, commandopts, configopts, projectSettings);
        track.push(rscall);
      }

      else {
        console.log('The dirs object does not have this environment configured. Nothing will be deployed');
      }

    }
    else {
      console.log('The dirs object is missing a source, target, and/or env property. Nothing will be deployed');
    }

  }
  // Multiple deployment locations
  else if(configopts.dirs instanceof Array) {
    configopts.dirs
      .filter(function(element) {
        return element.source && element.target;
      })
      .filter(function(element) {
        return element.env === commandopts.env;
      })
      .map(function(element, index, array) {
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
  // Final check for a misconfigured object
  else {
    console.log('The dirs property is missing from your config file or it is an invalid type');
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
