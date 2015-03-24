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
    
    sync = {
      sync: sinon.spy()
    };

  });
  
  afterEach(function() {
    sync.sync.reset();
  })
  
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
    
    //emad.emad(commandopts);
    //expect(sync.sync).callCount(1);
  });
  
  it('should require that each item in the dirs object has both a source property and a target property if an array is given', function() {
  
  });
  
  it('should provide some level of validation for the config file containing local and remote paths', function() {
  
  });
  
});