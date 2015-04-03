var chai = require('chai'),
  expect = chai.expect,
  command = require('./../lib/command'),
  program = require('commander');
  
  program.option('-u'); // adds the -u flag that is added by mocha

describe('command', function() {
  
  it('should export a command module', function(){
    expect(typeof command.command).to.equal('function');
  });
  
  it('should return an object with the properties defined by default', function(){
    var cli = command.command([]);
    
    expect(cli.env).to.equal('staging');
    expect(cli.force).not.to.be.ok;
    expect(cli.immediates).not.to.be.ok;
    expect(typeof cli.isWindows).to.equal('boolean');
    expect(cli.dryRun).not.to.be.ok;
    expect(cli.ssh).not.to.be.ok;
    expect(cli.transpose).not.to.be.ok;
  });
  
  it('should allow its default properties to be overridden with cli arguments', function(){
    program.env = 'prod';
    program.force = true;
    program.immediates = true;
    program.dryRun = true;
    program.ssh = true;
    program.transpose = true;
    var cli = command.command([]);
    
    expect(cli.env).to.equal('prod');
    expect(cli.force).to.be.ok;
    expect(cli.immediates).to.be.ok;
    expect(cli.dryRun).to.be.ok;
    expect(cli.ssh).to.be.ok;
    expect(cli.transpose).to.be.ok;
    
  });
  
});
