#!/usr/bin/env node

var cli = require('./lib/commander'),
  command = cli.command(process.argv),
  config = require('./lib/loadconfig'),
  data = config.loadConfig('emad-config.json'),
  fs = require('fs'),
  os = require('os'),
  rsync = require("rsyncwrapper").rsync;

exports.sync = function(opts) {
  
  rsync({
    src: data.dirs.source,
    dest: data.dirs.target,
    recursive: true,
    exclude: [
      '.git',
      '*.komodotools',
      '.sass-cache',
      '*.scssc',
      '.svn'
    ]
  }, function (error, stdout, stderr, cmd) {
    if (error) {
      console.log(error.message);
    } else {
      console.log('emad completed successfully');
    }
  });
  
}