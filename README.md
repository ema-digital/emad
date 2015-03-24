The logic that the deployment script follows is to upload only new files or directories,
as well as overwrite the files on the server when the files on your computer are newer.

This is a recursive file copy from one place to another.

# Dependencies
1. Node JS
2. rsync
3. sshfs

This requires the rsyncwrapper package for Node.js, which has a dependency that
"a reasonably modern version of rsync (>=2.6.9) in your PATH."

Windows users will need to install the cwRsync package. See the
(installation section)[http://www.rsync.net/resources/howto/windows_rsync.html] for more info.

This script also relies on sshfs to mount the remote server as a network drive.
* [Windows](https://code.google.com/p/win-sshfs/)
* [OSX](http://osxfuse.github.io/)
* Linux
  ```
  sudo apt-get install sshfs
  ```

# Quick Intro
1. Install all dependencies and `npm link` the emad package so it is globally accessible
2. Mount remote directory using sshfs. 
3. Set up your config file
4. Deploy!

# Options

### immediates
```
--immediates
```
Makes the sync operation non-recursive. __default: false__

### ssh
```
--ssh
```
Sets the ssh flag to true. If this option is used, it requires ssh key authetication. __default: false__

### dry-run
```
-n, --dry-run
```
Outputs a list of files to be copied without actually copying them. __default: false__

### version
```
-V, --version
```
Displays the version number

### help
```
-h, --help
```
Displays help information

# emad-local/emad-config.json
_This file is specific to your dev environment and should not be checked in to version control._
The `source` and `target` properties of the `dirs` object use NIX-style paths, regardless of
the OS of your development machine. The most basic setup is as follows:

Also, note that to copy the contents of the source directory into the target directory, the
`source` direcory should end in a trailing slash but the `target` directory should not.

```
{
  "dirs": {
    "source": "/c/Users/egardner/Documents/devspace/wordpress/wp-content/themes/mower/",
    "target": "/e/sandbox.mower.com/web/content/wp-content/themes/mower",
  }
}
```

A more complicated version would be as follows: 
```
{
  "dirs": [
    {
      "source": "/c/Users/egardner/Documents/devspace/wordpress/wp-content/themes/mower/",
      "target": "/e/sandbox.mower.com/web/content/wp-content/themes/mower",
    },
    {
      "source": "/c/Users/egardner/Documents/devspace/wordpress/wp-content/plugins/mower-awesome/",
      "target": "/e/sandbox.mower.com/web/content/wp-content/wp-content/mower-awesome",
    }
  ]
}
```

# emad-local/emad-deploy.log
This is a log of previous deploys. Note that it is specific to the machine that the deployment
is being triggered from and not a true log every developer's releases to a specific server.
_This file is specific to your dev environment and should not be checked in to version control._

# emad-project.json
This file contains the project-level includes and excludes. This is to avoid having items
such as config files advertently deployed to a server. These excludes can be shared with
other developers and are meant to be checked in to version control.

```
{
  "exclude": [".git", "*.py"],
  "include": ["smiley.gif"]
}
```