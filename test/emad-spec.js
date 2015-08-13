/*jshint expr: true*/
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
      env: 'staging',
      immediates: false,
      isWindows: true,
      dryRun: false,
      ssh: false,
      transpose: false,
    };
    configopts = {
      "configversion": 2,
      "env": {
         "production": [
            {
              "source": "/C/dev/build/path-1/",
              "target": "/p/public_html/path-1"
            },
            {
              "source": "/C/dev/build/path-2/",
              "target": "/p/public_html/path-2"
            }
         ],
         "staging": [
            {
              "source": "/C/Users/ethangardner/Documents/resume/",
              "target": "/C/Users/ethangardner/Documents/resume2"
            },
            {
              "source": "/C/dev/build/path-2/",
              "target": "/s/public_html/path-2"
            }
         ]
      }
    };
    projectSettings = {
      'exclude': ['.git', '*.py'],
      'include': ['smiley.gif']
    };
    sinon.stub(console, 'log', function(){});
  });
  
  afterEach(function(){
    console.log.restore();
  });

  it('should export an emad module', function() {
    expect(typeof emad.emad).to.equal('function');
  });

  it('should be able to call the sync more than once if given an array of directories', function() {
    var track = emad.emad(commandopts, configopts, projectSettings);
    expect(track.length).to.equal(2);
  });

  it('should exit if given an environment that does not exist', function() {
    commandopts.env = 'doesnotexist';
    
    var track = emad.emad(commandopts, configopts, projectSettings);
    //expect(track.length).to.equal(0);
    expect(console.log).to.be.called;
  });
  
  it('should allow a specific index in the environment array to be synced and nothing else', function(){
    
  });

});
