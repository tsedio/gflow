# GFLOW

A command line gitflow.

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
    finish      Merge the current branch on the production branch and delete it
    init        Create a new git flow project
    new         Create a new branch from the latest commit of production branch
    startfeat   Create a new feature branch from the latest commit of production branch
    startfix    Create a new fix branch from the latest commit of production branch
    push        Rebase the current branch from production and push all commit (run test before)
    publish     Alias of push command
    rebase      Rebase the current branch from production
    sync        Synchronise master branch and production
    help [cmd]  display help for [cmd]
```
