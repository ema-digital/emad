#!/usr/bin/env node

var config = require('./lib/loadconfig'),
  data = config.loadConfig('emad-config.json'),
  fs = require('fs'),
  program = require('commander'),
  os = require('os'),
  rsync = require('./lib/sync');

program
  .version('0.1.0')
  .option('-p, --dry-run', 'Previews files to be copied without actually syncing')
  .parse(process.argv);
  
  if (program.dryRun) {
    console.log('Previewing');  
  }
  
  
//fs.exists(data.dirs.source, function (exists) {
//  console.log(exists ? "it's there" : "no exists");
//});

// http://blog.commandlinekungfu.com/2009/04/episode-24-copying-and-synchronizing.html
// http://www.electrictoolbox.com/rsync-ignore-existing-update-newer/
console.log(os.platform());




