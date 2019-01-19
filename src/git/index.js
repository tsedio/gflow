/* eslint-disable prefer-arrow-callback */
const { spawnSync, execSync } = require('child_process');
const exec = require('../exec');

function gitSync(cmd, ...args) {
  const response = spawnSync('git', [cmd].concat(args));
  if (response.error) {
    throw response.error;
  }
  return response.output.filter(o => !!o).map(o => o.toString());
}

function gitAsync(cmd, ...args) {
  return exec('git', [cmd].concat(args.filter(o => !!o)));
}

module.exports = {
  /**
   * @deprecated
   */
  git: gitSync,
  /**
   * @deprecated
   */
  egit: gitAsync,
  /**
   *
   */
  sync: gitSync,
  /**
   *
   */
  async: gitAsync,
  /**
   *
   * @param args
   * @returns {*}
   */
  config(...args) {
    return gitSync('config', ...args).join('').trim();
  },

  /**
   *
   * @param args
   */
  checkout(...args) {
    return gitAsync('checkout', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  checkoutSync(...args) {
    return gitSync('checkout', ...args);
  },
  /**
   *
   * @param args
   */
  branch(...args) {
    return gitAsync('branch', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  branchSync(...args) {
    return gitSync('branch', ...args);
  },
  /**
   *
   * @param args
   */
  merge(...args) {
    return gitAsync('merge', ...args);
  },
  /**
   *
   * @param args
   */
  mergeSync(...args) {
    return gitSync('merge', ...args);
  },
  /**
   *
   * @param args
   */
  remote(...args) {
    return gitAsync('remote', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  remoteSync(...args) {
    return gitSync('remote', ...args);
  },
  /**
   *
   * @param args
   */
  fetch(...args) {
    return gitAsync('fetch', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  fetchSync(...args) {
    return gitSync('fetch', ...args);
  },
  /**
   *
   * @returns {*}
   */
  refreshRepository() {
    return gitAsync('fetch', '--all', '--prune', '--tags');
  },
  /**
   *
   * @returns {*}
   */
  refreshRepositorySync() {
    return gitSync('fetch', '--all', '--prune', '--tags');
  },
  /**
   *
   * @param args
   */
  push(...args) {
    return gitAsync('push', ...args);
  },
  /**
   *
   * @param args
   */
  pushSync(...args) {
    return gitSync('push', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  add(...args) {
    return gitAsync('add', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  addSync(...args) {
    return gitSync('add', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  reset(...args) {
    return gitAsync('reset', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  resetSync(...args) {
    return gitSync('reset', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  commit(...args) {
    return gitAsync('commit', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  commitSync(...args) {
    return gitSync('commit', ...args);
  },
  /**
   *
   * @param args
   * @returns {*}
   */
  removeSync(...args) {
    return gitSync('remote', ...args);
  },

  /**
   *
   * @returns {string}
   */
  currentBranchName() {
    return gitSync('rev-parse', '--abbrev-ref', 'HEAD')[0].trim();
  },
  /**
   *
   * @param branch
   * @returns {boolean}
   */
  branchExists(branch, remote = 'origin') {
    return (
      gitSync('branch', '-a')
        .join('\n')
        .trim()
        .indexOf(`remotes/${remote}/${branch}`) > -1
    );
  },
  /**
   *
   * @param branch
   */
  checkBranchRemoteStatus(branch) {
    return gitAsync('cherry', branch, `origin/${branch}`).join('').trim();
  },
  /**
   *
   * @param branch
   * @returns {*}
   */
  checkBranchRemoteStatusSync(branch) {
    return gitSync('cherry', branch, `origin/${branch}`);
  },
  /**
   *
   * @param args
   */
  rebase(...args) {
    return gitAsync('rebase', ...args);
  },

  /**
   *
   * @param args
   */
  rebaseAsync(...args) {
    return gitSync('rebase', ...args);
  },
  /**
   *
   * @returns {Array}
   */
  branches(...args) {
    const branches = gitSync('branch', ...args)[0].split('\n');

    return branches
      .map(branch => branch.replace('* ', ''))
      .filter(branch => String(branch).indexOf('HEAD') === -1)
      .filter(branch => !!branch)
      .map(o => o.trim());
  },
  /**
   *
   * @param branch
   */
  show(branch) {
    const response = execSync(`git show --format="%ci|%cr|%an" ${branch} --`);
    return response
      .toString()
      .split('\n')[0]
      .trim();
  },
  /**
   *
   * @returns {Array}
   */
  branchesInfos(...args) {
    return module.exports
      .branches(...args)
      .map(branch => {
        try {
          const [date, creation, author] = module.exports.show(branch).split('|');
          return {
            branch,
            date,
            creation,
            author
          };
        } catch (er) {
          return undefined;
        }
      })
      .filter((b) => !!b)
      .sort((info1, info2) => info1.date < info2.date);
  },

  hasStagedChanges(cb) {
    const list = gitSync('status', '-s').filter(o => !!o).map(o => o.trim());

    if (list.length > 0) {
      if (cb) {
        return list.find(cb);
      }
      return true;
    }

    return false;
  }
};
