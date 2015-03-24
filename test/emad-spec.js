var chai = require('chai'),
  expect = chai.expect,
  emad = require('./../emad'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  projectSettings = {},
  configopts = {},
  commandopts = {};
  
chai.use(sinonChai);
  
describe('emad', function(){
  
  beforeEach(function() {
    commandopts = {
      immediates: false,
      isWindows: true,
      dryRun: false,
      ssh: false,
      transpose: false,
    };
    
    projectSettings = {
      'exclude': ['.git', '*.py'],
      'include': ['smiley.gif']
    };

  });
  
  it('should export an emad module', function() {
    expect(typeof emad.emad).to.equal('function');
  });
  
  it('should be able to call the sync function if an object is given in the config file with a source and target', function() {
    configopts = {
      'dirs': {
        'source': '/c/Users/egardner/Documents/devspace/utilties/emad-py/',
        'target': '/c/Users/egardner/Documents/devspace/utilties/emad-target'
      }
    };
    
    var track = emad.emad(commandopts, configopts, projectSettings);
    expect(track.length).to.equal(1);
  });
  
  it('should be able to call the sync more than once if given an array of directories', function() {
    configopts = {
      'dirs': [
        {
          'source': '/c/Users/egardner/Documents/devspace/utilties/emad-py/',
          'target': '/c/Users/egardner/Documents/devspace/utilties/emad-target'
        },
        {
          'source': '/c/Users/egardner/Documents/devspace/utilties/emad-target/',
          'target': '/c/Users/egardner/Documents/devspace/utilties/emad-py'
        }
      ]
    };
    
    var track = emad.emad(commandopts, configopts, projectSettings);
    expect(track.length).to.equal(2);
  });
  
});
