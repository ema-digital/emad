var chai = require('chai'),
  expect = chai.expect,
  sync = require('./../lib/sync'),
  projectSettings = {},
  configopts = {},
  commandopts = {};

describe('sync', function() {
  
  beforeEach(function(){
    commandopts = {
      immediates: false,
      isWindows: true,
      dryRun: false,
      ssh: false,
      transpose: false,
    };
    configopts = {
      'dirs': [
        {
          'source': '/c/Users/egardner/Documents/devspace/utilties/emad-py/',
          'target': '/c/Users/egardner/Documents/devspace/utilties/emad-target'
        }
      ]
    };
    projectSettings = {
      'exclude': ['*.komodoproject', 'temp.txt'],
      'include': ['smiley.gif']
    };
  });
  
  it('should export a sync module', function() {
    expect(typeof sync.sync).to.equal('function');
  });
  
  it('should call rsync with the -a flag set by default', function() {
    var results = sync.sync(configopts.dirs[0].source, configopts.dirs[0].target, commandopts, configopts, projectSettings);
    expect(results.args).to.include('-a');
  });
  
  it('should accommodate a non-recursive file transfer', function() {
    commandopts.immediates = true;
    
    var results = sync.sync(configopts.dirs[0].source, configopts.dirs[0].target, commandopts, configopts, projectSettings);
    expect(results.args).not.to.include('-a');
  });
  
  it('should merge the exclude properties in the sync directory with the project-level ones', function() {
    var results = sync.sync(configopts.dirs[0].source, configopts.dirs[0].target, commandopts, configopts, projectSettings);
    expect(results.exclude).to.include('*.komodoproject');
    expect(results.exclude).to.include('temp.txt');
  });
  
  it('should merge the include properties in the sync directory with the project-level ones', function() {
    var results = sync.sync(configopts.dirs[0].source, configopts.dirs[0].target, commandopts, configopts, projectSettings);
    expect(results.include).to.include('smiley.gif');
  });
  
  it('should reverse the direction of the sync if the transpose flag is set', function() {
    commandopts.transpose = true;
    
    var results = sync.sync(configopts.dirs[0].source, configopts.dirs[0].target, commandopts, configopts, projectSettings);
    expect(results.src).to.equal(configopts.dirs[0].target + '/');
    expect(results.dest).to.equal(configopts.dirs[0].source.slice(0, -1));
    
  });
  
});
