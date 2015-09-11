/*jshint expr: true*/
var chai = require('chai'),
  expect = chai.expect,
  emad = require('./../emad'),
  sinon = require('sinon'),
  sinonChai = require('sinon-chai'),
  projectopts = {},
  configopts = {},
  commandopts = {};

chai.use(sinonChai);

describe('emad', function(){

  beforeEach(function() {
    commandopts = {
      env: 'staging',
      immediates: false,
      isWindows: true,
      filename: false,
      dryRun: false,
      only: false,
      ssh: false,
      transpose: false,
    };
    configopts = {
      "env": {
        "production": {
          "source": {
            "prefix": ""
          },
          "target": {
            "prefix": "/p"
          }
        },
        "staging": {
          "source": {
            "prefix": ""
          },
          "target": {
            "prefix": "/cygdrive/s"
          }
        }
      }
    };
    projectopts = {
      'exclude': ['.git', '*.py'],
      'include': ['smiley.gif'],
      "configversion": 3,
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
              "source": "./path-1/",
              "target": "/public_html/path-1"
            },
            {
              "source": "/C/dev/build/path-2/",
              "target": "/s/public_html/path-2"
            }
         ]
      }
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
    var track = emad.emad(commandopts, configopts, projectopts);
    expect(track.length).to.equal(2);
  });

  it('should allow a specific index in the environment array to be synced and nothing else', function(){
    commandopts.only = 0;
    var track = emad.emad(commandopts, configopts, projectopts);
    expect(track.length).to.equal(1);
  });
  
  it('should not call sync if --files-from is used without --only', function(){
    commandopts.filename = 'textfile.txt';
    var track = emad.emad(commandopts, configopts, projectopts);
    expect(track.length).to.equal(0);
  });
  
  it('should call sync if --files-from is used with --only', function(){
    commandopts.filename = 'textfile.txt';
    commandopts.only = 0;
    var track = emad.emad(commandopts, configopts, projectopts);
    expect(track.length).to.equal(1);
  });
  
  it('should allow a the source and targets to be prefixed via config file option', function(){
    var track = emad.emad(commandopts, configopts, projectopts);
    expect(track[0].target).to.equal(configopts.env.staging.target.prefix + projectopts.env.staging[0].target);
  });

  it('should log if given an environment that does not exist', function() {
    commandopts.env = 'doesnotexist';
    var track = emad.emad(commandopts, configopts, projectopts);
    expect(console.log).to.be.called;
  });
  
});
