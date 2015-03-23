#!/usr/bin/env node

var config = require('./loadconfig'),
  fs = require('fs'),
  path = require('path'),
  rsync = require("rsyncwrapper").rsync;

exports.sync = function(source, target, commandopts, configopts, projectSettings, callback) {
  // build the rsync options based on the options specified
  // -a is the equivalent of -rlptgoD
  // see http://linux.die.net/man/1/rsync for more info
  var buildArgs = function(commandopts) {
    var args = ['-v', '-z', '-i', '--progress'];
    
    if (commandopts.immediates) {
      args.push('-l', '-p', '-t', '-g', '-o', '-D', '-v', '-z');
    }
    else {
      args.push('-a');
    }
    
    if (commandopts.dryRun) {
      args.push('-n');
    }
    
    return args;
  
  };
  
  var buildExclude = function(projectSettings) {
    var exclude = [
      'emad-local',
      '.git',
      'node_modules',
      '.sass-cache',
      '*.scssc',
      '.svn'
    ];
    
    if (typeof(projectSettings.exclude) === "string") {
      exclude.push(projectSettings.exclude);
    }
    else if(projectSettings.exclude instanceof Array) {
      projectSettings.exclude.forEach(function(element) {
        exclude.push(element);
      });
    }
    
    var unique = exclude.filter(function(element, index, array) {
      return array.indexOf(element) === index;
    });
    
    return unique;
  };
  
  var opts = {
    args: buildArgs(commandopts),
    src: source,
    dest: target,
    ssh: commandopts.ssh,
    exclude: []//buildExclude(projectSettings)
  };
  
  rsync({
    args: buildArgs(commandopts),
    src: source,
    dest: target,
    ssh: commandopts.ssh,
    exclude: []//buildExclude(projectSettings)
  }, function (error, stdout, stderr, cmd) {
    if (error) {
      console.log(error.message);
    }
    else {
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
      'emad completed successfully at ' + new Date() + '\n' +
      '=============================';
    
      fs.appendFile(path.join('emad-local', 'emad-deploy.log'), logtext, function(err) {
        if (err) {
          throw err;
        }
      });
    }
    
  });
  
  return opts;
  
}