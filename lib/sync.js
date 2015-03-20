#!/usr/bin/env node

var fs = require('fs'),
  rsync = require("rsyncwrapper").rsync;

exports.sync = function(source, target, commandopts, configopts) {
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
  
  var buildExcludes = function() {
    return excludes;
  };
  
  rsync({
    args: buildArgs(commandopts),
    src: source,
    dest: target,
    ssh: commandopts.ssh,
    exclude: [
      '.git',
      'node_modules',
      '.sass-cache',
      '*.scssc',
      '.svn'
    ]
  }, function (error, stdout, stderr, cmd) {
    if (error) {
      console.log(error.message);
    }
    else {
      console.log('\n=============================');
      console.log('RUNNING:::');
      console.log('=============================');
      console.log(cmd);
      
      console.log('\n=============================');
      console.log('Command Output');
      console.log('=============================');
      console.log(stdout);
      console.log('\n=============================');
      console.log('emad completed successfully');
      console.log('=============================');
    }
  });
  
}