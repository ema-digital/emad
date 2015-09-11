#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  rsync = require("rsyncwrapper").rsync,
  defaultIncludes = [],
  defaultExcludes = [
    '.DS_Store',
    'emad-project.json',
    'emad-local/',
    'emad-local/*',
    'node_modules/',
    'node_modules/*',
    '.sass-cache/',
    '.sass-cache/*',
    '*.scssc'
  ];
  
// build the rsync options based on the options specified
// -a is the equivalent of -rlptgoD
// see http://linux.die.net/man/1/rsync for more info
var buildArgs = function(commandopts) {
  var args = ['-v', '-z', '-i', '--progress', '--cvs-exclude'];
  
  if (commandopts.immediates) {
    args.push('-d', '-l', '-p', '-t', '-g', '-o', '-D', '-v', '-z');
    defaultExcludes.push('*/');
  }
  else {
    args.push('-a');
  }
  
  if (commandopts.force !== true) {
    args.push('--update');
  }
  else {
    args.push('--ignore-times');
  }
  
  if (commandopts.inplace) {
    args.push('--inplace');
  }
  
  if (commandopts.dryRun) {
    args.push('-n');
  }
  
  if (commandopts.isWindows) {
    args.push('--modify-window=1');
  }
  
  if (commandopts.filename) {
    args.push('--files-from=' + commandopts.filename);
  }
  
  return args;

};

// merges the global includes/excludes contained in this
// file with the project-level include/excludes from the
// emad-project.json file
var mergeDeployConfig = function(prop, mergeWith, commandopts) {
  
  if (commandopts.filename) {
    defaultExcludes.push(commandopts.filename);
  }
  
  if (typeof(prop) === "string") {
    mergeWith.push(prop);
  }
  else if(prop instanceof Array) {
    prop.forEach(function(element) {
      mergeWith.push(element);
    });
  }
  else {
    return mergeWith;
  }
  
  var unique = mergeWith.filter(function(element, index, array) {
    return array.indexOf(element) === index;
  });
  
  return unique;
  
};

// calls rsync based on the options defined.
// this is the glue that makes the program run and deploy the
// way it should
exports.sync = function(source, target, commandopts, configopts, projectopts, callback) {
  // private function to make the transpose option work so a sync can go
  // in the reverse direction
  var setPaths = function(source, target) {
    if (!commandopts.transpose) {
      return {
        source: source,
        target: target
      };
    }
    else {
      var sourcePath = source,
        targetPath = target;
      
      if (source.lastIndexOf('/') === source.length - 1) {
        sourcePath = source.slice(0, -1);
        if (target.lastIndexOf('/') !== target.length - 1) {
          targetPath = target + '/';
        }
      }
      
      return {
        source: targetPath, // yes, this is really how it should be. We are doing a reverse sync
        target: sourcePath
      };
      
    }
    
  };
  
  var paths = setPaths(source, target),
    opts = {
      args: buildArgs(commandopts),
      src: paths.source,
      dest: paths.target,
      ssh: commandopts.ssh,
      exclude: mergeDeployConfig(projectopts.exclude, defaultExcludes, commandopts),
      include: mergeDeployConfig(projectopts.include, defaultIncludes, commandopts)
    };
  
  rsync(opts, function (error, stdout, stderr, cmd) {
      var logtext = '\n=============================\n' +
      new Date() + '\n' +
      'RUNNING:::\n' +
      '=============================\n' +
      cmd + '\n' +
      '=============================\n' +
      'Command Output\n' + 
      '=============================\n' +
      stdout + '\n' +
      '=============================\n' +
      stderr + '\n' +
      '=============================\n' +
      'emad completed at ' + new Date() + '\n' +
      '=============================\n\n';
    
      fs.appendFile(path.join('emad-local', 'emad-deploy.log'), logtext, function(err) {
        if (err) {
          throw err;
        }
      });
    
  });
  
  return opts;
  
};
