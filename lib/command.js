#!/usr/bin/env node
var fs = require('fs'),
  os = require('os'),
  path = require('path'),
  process = require('process'),
  program = require('commander'),
  isWindows = false;

// builds the command line options and
// returns an array that will eventually set
// the flags that are used when the rsync function
// is called
exports.command = function(argv){
  var env;

  program
    .version('0.3.0')
    .option('--immediates', 'Makes the file transfer non-recursive')
    .option('--ssh', 'sets the ssh flag')
    .option('-n, --dry-run', 'Previews files to be copied without actually syncing')
    .option('--transpose', 'Transposes the source and target directories specified in the emad-config.json file.')
    .option('--inplace', 'writes updated data to a file instead of generating a temporary file and then overwriting')
    .option('--env <name>', 'Filter out the environment', env)
    .option('--force', 'Copies the contents of the source to the target even if the target is newer. BE CAREFUL!');
  
  program.parse(process.argv);

  if (os.platform().indexOf('win') !== -1) {
    isWindows = true;
  }
  
  return {
    env: program.env || 'staging',
    force: false || !!program.force,
    immediates: false || !!program.immediates,
    isWindows: isWindows,
    inplace: false || !!program.inplace,
    dryRun: false || !!program.dryRun,
    ssh: false || !!program.ssh,
    transpose: false || !!program.transpose
  };
};
