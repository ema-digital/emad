# EMAD

This is a deployment utility written in node.js that leverages rsync to deploy the files
from your local file system to a drive that is mounted with sshfs. This project exists
because it is not always possible to use deployment tools such as Capistrano in order
to deploy sites to shared or managed hosting accounts. 

The logic that the deployment script follows is to upload only new files or directories,
as well as overwrite the files on the server when the files on your computer are newer.

This is a recursive file copy from one place to another.

## Dependencies
1. Node JS
2. rsync
3. sshfs

This requires the rsyncwrapper package for Node.js, which has a dependency that
"a reasonably modern version of rsync (>=2.6.9) in your PATH."

Windows users will need to install the cwRsync package. See the
[installation section](http://www.rsync.net/resources/howto/windows_rsync.html) for more info.

This script also relies on sshfs to mount the remote server as a network drive.
* [Windows](https://code.google.com/p/win-sshfs/)
* [OSX](http://osxfuse.github.io/)
* Linux
  ```
  sudo apt-get install sshfs
  ```

## Quick Intro
1. Install the package as a global module by running `npm install -g emad` from the command line
2. Set up your config files (`emad-project.json` and `emad-local/emad-config.json`). 
3. Mount remote directory using sshfs. 
4. Deploy using `emad [options]`

## Options

### immediates
```bash
--immediates
```
Makes the sync operation non-recursive. __default: false__

### env
```bash
--env <name>
```
The target environment of the deployment. __default: staging__

### force
```bash
--force
```
Will do a fresh copy of the source into the target and ignore the last modified time.
This is not a full mirror. Files that do not exist in the source will be kept intact in
the target directory. __default: false__

### ssh
```bash
--ssh
```
Sets the ssh flag to true. If this option is used, it requires ssh key authetication. __default: false__

### dry-run
```bash
-n, --dry-run
```
Outputs a list of files to be copied without actually copying them. __default: false__

### version
```bash
-V, --version
```
Displays the version number

### help
```bash
-h, --help
```
Displays help information

## Config Files
_Don't feel like generating these by hand?_ You can use our [Yeoman](http://yeoman.io) generator to create these for you.
Check out [generator-emad](https://www.npmjs.com/package/generator-emad) for more.

### emad-local/emad-config.json
_This file is specific to your dev environment and should not be checked in to version control._
The `source` and `target` properties of the `dirs` object use NIX-style paths, regardless of
the OS of your development machine. The most basic setup is as follows:

Also, note that to copy the contents of the source directory into the target directory, the
`source` direcory should end in a trailing slash but the `target` directory should not.

Every deploy location is required to have a source, target, and env property in the config.

```
{
  "dirs": {
    "source": "/c/Users/egardner/Documents/devspace/wordpress/wp-content/themes/mower/",
    "target": "/e/sandbox.mower.com/web/content/wp-content/themes/mower",
    "env": "staging"
  }
}
```

A more complicated version would be as follows: 
```js
{
  "dirs": [
    {
      "source": "/c/Users/username/Documents/devspace/wordpress/wp-content/themes/mower/",
      "target": "/d/sandbox.mower.com/web/content/wp-content/themes/mower",
      "env": "production"
    },
    {
      "source": "/c/Users/username/Documents/devspace/wordpress/wp-content/plugins/mower-awesome/",
      "target": "/e/sandbox.mower.com/web/content/wp-content/wp-content/plugins/mower-awesome",
      "env": "staging"
    }
  ]
}
```

### emad-local/emad-deploy.log
This is a log of previous deploys. Note that it is specific to the machine that the deployment
is being triggered from and not a true log every developer's releases to a specific server.
_This file is specific to your dev environment and should not be checked in to version control._

### emad-project.json
This file contains the project-level includes and excludes. This is to avoid having items
such as config files advertently deployed to a server. These excludes can be shared with
other developers and _this file IS meant to be checked in to version control._

```js
{
  "exclude": ["*.komodoproject", "test.txt"],
  "include": ["smiley.gif"]
}
```
The files and directories are not included in the deployment:
'emad-project.json', 'emad-local/', 'node_modules/', '.sass-cache/', '*.scssc', '.DS_Store'

Additionally, the command uses rsync's --cvs-exclude flag, which will ignore common directories that
are used for source control such as `.git/` and `.svn/`.
See the [rsync manual](https://download.samba.org/pub/rsync/rsync.html) for more information.
