#!/usr/bin/env node
var fs = require('fs'),
  os = require('os'),
  path = require('path'),
  program = require('commander'),
  isWindows = false;

// builds the command line options and
// returns an array that will eventually set
// the flags that are used when the rsync function
// is called
exports.command = function(argv){
  var env;

  program
    .version('0.4.0')
    .option('--immediates', 'Makes the file transfer non-recursive')
    .option('--ssh', 'sets the ssh flag')
    .option('-n, --dry-run', 'Previews files to be copied without actually syncing')
    .option('--transpose', 'Transposes the source and target directories specified in the emad-config.json file.')
    .option('--inplace', 'Writes data to the destination file directly instead of using a temporary file.')
    .option('--env <name>', 'Filter out the environment', env)
    .option('--force', 'Copies the contents of the source to the target even if the target is newer. BE CAREFUL!');
  
  program.parse(process.argv);

  if (os.platform() === 'win32' || os.platform() === 'win64' ) {
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
