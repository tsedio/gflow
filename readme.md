# GFLOW

A command line inspired from the Git Flow process and adapted to use rebase command exlusively.
It always keep your branches up to date.

![example](example.gif)

## Feature

- Define a production and development branches,
- See all branches status,
- Rebase and run tasks (Install and test) before pushing a branch,
- Always create a branch from production,


## Install

```bash
npm install -g gflow
```

## Usage 

```bash
  Usage: gflow [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    branches    List all branches status
    finish      Merge the current branch on the referenced branch (production or ancestor) and delete it
    merge       Merge the current branch on the referenced branch (production or ancestor) without deleting branch
    release     Create the release tag on the production branch. Synchronize the dev branch and production branch (for CI like travis)
    init        Create a new git flow project
    new         Create a new branch from the latest commit of production branch
    push        Rebase the current branch from production and push all commit (run test before)
    publish     Alias of push command
    rebase      Rebase the current branch from production
    fetch       Download objects and refs from another repository (--all and --prune)
    sync        Synchronize dev branch and production
    config      Configuration
    help [cmd]  display help for [cmd]
```

### Getting started

You can initialize a new GFlow project with this command:

```bash
gflow init
```

This command will configure the production and development branches.


### Configuration options

Gflow init command generate a `.glfowrc` config file with some options look like:

```json
{
  "production": "production",
  "develop": "master",
  "charBranchNameSeparator": "_",
  "remote": "origin",
  "ignores": [],
  "syncAfterFinish": true,
  "postFinish": "",
  "skipTest": true,
  "branchTypes": {
    "feat": "feat",
    "fix": "fix",
    "chore": "chore",
    "docs": "docs"
  }
}
```

Key | Description
---|---
`production` | Name of the production branch or the branch use as reference to rebase a feature branch.
`develop` | Name of the development branch (or the release candidate branch).
`charBranchNameSeparator` | Char separator of the a branch between branchName and task type (feat, fix, chore, etc...). Example: if char = "/" `feat/branch_name`.
`remote` | Alias name of the remote repository (origin).
`ignores` | Disable rebasing for the given branch list when the `rebase-all` command is used.
`syncAfterFinish` | Perform synchronization between `production` and `develop` branches.
`postFinish` | Run command after the `finish` command.
`skipTest` | Disable unit test step.
`branchTypes` | Configure the branch types for the command `gflow new`.


## Use travis and semantic release

Gflow is compliante with [semantic-release](https://github.com/semantic-release/semantic-release) and provide
plugin for this.


To begin generate your semantic-release configuration with [semantic-release-cli](https://www.npmjs.com/package/semantic-release-cli)
then create `release.config.js` and add these lines:

```json
module.exports = {
  branch: 'production',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    '@gflow/src/command/release'
  ]
};
```

