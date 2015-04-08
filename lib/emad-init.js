#!/usr/bin/env node

var fs = require('fs'),
  path = require('path'),
  process = require('process');

exports.emadInit = function(err, callback){
  var createLocal = function() {
    var localdir = path.join(process.cwd(), 'emad-local'),
      configfile = 'emad-config.json';
    
    fs.mkdir(localdir, function() {
      fs.readdir(localdir, function(err, files) {
        var contents = files.filter(function(element, index, array) {
          return element === configfile;
        });
        
        if (contents.length === 0) {
          var config = {
            'dirs': [
              {
                'source': localdir,
                'target': 'changeme',
                'env': 'changeme'
              }
            ]
          };
          try {
            fs.writeFile(path.join(localdir, configfile), JSON.stringify(config, null, 2), 'utf8');
          } catch(e) {
            console.log('Error writing file ' + configfile);
            process.exit();
          }
        }
      })
    });
    
  };
  
  var createProject = function() {
    var projectfile = 'emad-project.json';
    
    fs.readdir(process.cwd(), function(err, files) {
      var contents = files.filter(function(element, index, array) {
        return element === projectfile;
      });
      
      if (contents.length === 0) {
        console.log('called');

        var config = {
          'exclude': [],
          'include': []
        };
        
        try {
          fs.writeFile(projectfile, JSON.stringify(config, null, 2), 'utf8');
        } catch(e) {
          console.log('Error writing file ' + projectfile);
        }
      }
    });
  };
  
  createLocal();
  createProject();
};
