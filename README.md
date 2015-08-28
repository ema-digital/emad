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

This script also relies on sshfs to mount the remote server as a network drive. Some options for mounting a remote server as a network drive include:
* [ExpanDrive](http://expandrive.com/) - Mac or Windows
* [Fuse](http://osxfuse.github.io/) - Mac
* [win-sshfs](https://code.google.com/p/win-sshfs/) - Windows
* `sudo apt-get install sshfs` - Linux

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

### only
```bash
--only <index>
```
The deploys only the index specified in the target environment. The index is zero-based.
A value of false will deploy all locations in the environment. __default: false__

### force
```bash
--force
```
Will do a fresh copy of the source into the target and ignore the last modified time.
This is not a full mirror. Files that do not exist in the source will be kept intact in
the target directory. __default: false__

### dry-run
```bash
-n, --dry-run
```
Outputs a list of files to be copied without actually copying them. __default: false__

### inplace
```bash
--inplace
```
Writes data to the destination file directly instead of using a temporary file. __default: false__

### transpose
```bash
--transpose
```
Attempts to swap the source and destination directories provided in the config file. __default: false__

### version
```bash
-V, --version
```
Displays the version number.

### help
```bash
-h, --help
```
Displays help information.

## Config Files
_Don't feel like generating these by hand?_ You can use our [Yeoman](http://yeoman.io) generator to create these for you.
Check out [generator-emad](https://www.npmjs.com/package/generator-emad) for more.

### emad-project.json
This file contains the project-level includes and excludes, environment definitions, and
deployment locations for each. This is to avoid having items
such as config files advertently deployed to a server. These excludes can be shared with
other developers and _this file IS meant to be checked in to version control._

Every object in the deployment environment is required to have a `source` and `target` property.
The `source` and `target` property values must always use POSIX style paths, regardless of
the OS of your development machine. 

Also, note that to copy the contents of the source directory into the target directory, the
`source` directory should end in a trailing slash but the `target` directory should not.

```js
{
  "exclude": ["*.komodoproject", "test.txt"],
  "include": ["smiley.gif"],
  "configversion": 3,
  "env": {
     "production": [
        {
          "source": "./path-1/",
          "target": "/public_html/path-1"
        },
        {
          "source": "./path-2/",
          "target": "/public_html/path-2"
        }
     ],
     "staging": [
        {
          "source": "./path-1/",
          "target": "/public_html/path-1"
        },
        {
          "source": "./path-2/",
          "target": "/public_html/path-2"
        }
     ]
  }
}
```

### emad-local/emad-config.json
It's likely that each developer that works on the project will have drives mapped differently.
The emad-config.json file adds prefixes to each path that are specific to each development machine.
_This file is specific to your dev environment and should not be checked in to version control._

```js
{
  "env": {
    "production": {
      "source": {
        "prefix": ""
      },
      "target": {
        "prefix": "/cygdrive/p/"
      }
    },
    "staging": {
      "source": {
        "prefix": ""
      },
      "target": {
        "prefix": "/cygdrive/s/"
      }
    }
  }
}
```
In the example above, the `/cygdrive` prefix is needed because the development machine is Windows,
and cwRsync which is used on Windows requires the `/cygdrive` prefix in order for absolute paths
to be used. The `/s` in the staging environment's target prefix value means that the developer
has the target destination of the deployment mapped to his or her "s" drive. 

### emad-local/emad-deploy.log
This is a log of previous deploys. Note that it is specific to the machine that the deployment
is being triggered from and not a true log every developer's releases to a specific server.
_This file is specific to your dev environment and should not be checked in to version control._

## Additional Notes
The following files and directories are not included in the deployment:
'emad-project.json', 'emad-local/', 'node_modules/', '.sass-cache/', '*.scssc', '.DS_Store'

Additionally, the command uses rsync's --cvs-exclude flag, which will ignore common directories that
are used for source control such as `.git/` and `.svn/`.
See the [rsync manual](https://download.samba.org/pub/rsync/rsync.html) for more information.
