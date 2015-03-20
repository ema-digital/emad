#!/usr/bin/env node

exports.command = function(argv){
  
  var os = require('os'),
    program = require('commander'),
    init = null,
    isWindows = false;

  program
    .version('0.1.0')
    .option('--immediates', 'Makes the file transfer non-recursive')
    .option('--init', 'Creates the emad-config.json file in the specified location.')
    .option('-v, --verbose', 'Verbose output')
    .option('--ssh', 'sets the ssh flag')
    .option('-n, --dry-run', 'Previews files to be copied without actually syncing')
    .option('-t, --transpose', 'Transposes the source and target directories specified in the emad-config.json file.')
    .parse(process.argv);
    
  if (typeof(program.init) === 'string') {
    init = program.init;
  }
  
  if (os.platform().indexOf('win') !== -1) {
    isWindows = true;
  }
    
  return {
    init: init,
    immediates: false || !!program.immediates,
    isWindows: isWindows,
    dryRun: false || !!program.dryRun,
    ssh: false || !!program.ssh,
    verbose: false || !!program.verbose,
    transpose: false || !!program.ssh,
  }

}
