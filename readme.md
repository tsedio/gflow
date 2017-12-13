# GFLOW

A command line gitflow. Always keep your branches up to date.

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
    finish      Merge the current branch on the production branch and delete it
    init        Create a new git flow project
    new         Create a new branch from the latest commit of production branch
    startfeat   Create a new feature branch from the latest commit of production branch
    startfix    Create a new fix branch from the latest commit of production branch
    push        Rebase the current branch from production and push all commit (run test before)
    publish     Alias of push command
    rebase      Rebase the current branch from production
    fetch       Download objects and refs from another repository (--all and --prune)
    sync        Synchronise master branch and production
    help [cmd]  display help for [cmd]
```

### Init project

You can initialize a new GFlow project with this command:

```bash
gflow init
```

This command will configure the production and development branches.


### Rebase all

Rebase-all command, rebase all branches from the branch reference.
You can add rules to ignore some branches when you run the `gflow rebase-all` command.

Edit your `package.json` and add this configuration:

```json
{
  "gflow": {
    "ignores": [
      "ignored-branch"
    ]
  }
}
```
