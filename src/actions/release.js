'use strict';
const Listr = require('listr');
const chalk = require('chalk');
const figures = require('figures');
const { git, add, commit, reset, push } = require('./git/index');
const CI = require('./ci');
const fs = require('fs');

const DEFAULT_OPTIONS = {
  master: 'master',
  production: 'production'
};
/**
 *
 * @returns {any}
 */
const readPackage = () => {
  return writePackage(JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf8' })));
};
/**
 *
 * @param pkg
 */
const writePackage = (pkg) => {
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2), { encoding: 'utf8' });
  return pkg;
};

module.exports = {
  /**
   *
   * @param options
   */
  pre(options = {}) {
    options = Object.assign({}, DEFAULT_OPTIONS, options);

    const { EMAIL, USER } = CI;

    if (CI) {

      if (EMAIL && USER) {
        git('config', '--global', 'user.email', EMAIL);
        git('config', '--global', 'user.name', USER);
      }

      git('checkout', options.production);
      git('branch', '--set-upstream-to=origin/' + options.production, options.production);
    }

  },
  /**
   *
   * @param options
   * @returns {*}
   */
  post(options = {}) {
    options = Object.assign({}, DEFAULT_OPTIONS, options);

    const { GH_TOKEN } = process.env;
    const pkg = readPackage();
    const {
      version,
      repository: { url }
    } = pkg;
    const repository = url.replace('https://', '');

    if (!CI) {
      return Promise.resolve();
    }

    console.log(`Generate release tag for v${version}`);
    console.log(`REPOSITORY:      ${repository}`);
    console.log(`RELEASE_BRANCH:  ${options.production}`);
    console.log(`MASTER_BRANCH:   ${options.master}`);
    console.log(`BUILD:           ${CI.BUILD_NUMBER}`);

    if (GH_TOKEN) {
      git('remote', 'add', CI.ORIGIN, `https://${GH_TOKEN}@${repository}`);
    }

    const tasks = new Listr([
      {
        title: `Adding files to commit`,
        task: () => add('-A')
      },
      {
        title: `Reset .npmrc`,
        task: () => reset('--', '.npmrc')
      },
      {
        title: `Commit files`,
        task: () => commit('-m', `${CI.NAME} build: ${CI.BUILD_NUMBER} v${version} [ci skip]`)
      },
      {
        title: `Push to ${options.production}`,
        task: () => push('--quiet', '--set-upstream', CI.ORIGIN, options.production)
      },
      {
        title: `Sync ${options.master} with ${options.production}`,
        task: () => push('-f', CI.ORIGIN, `${options.production}:refs/heads/${options.master}`)
      }
    ], { concurrency: false });

    return tasks
      .run()
      .then(() => {
        console.log(chalk.green(figures.tick), 'Release tag are applied on git');
      })
      .catch(err => {
        console.error(String(err));
        return Promise.resolve();
      });
  }
};

