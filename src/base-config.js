const CONFIG_BASENAME = '.gflowrc';
const DEFAULT_CONFIG = {
  production: 'production',
  /**
   *
   */
  develop: 'master',
  /**
   *
   */
  charBranchNameSeparator: '_',
  /**
   *
   */
  remote: 'origin',
  /**
   *
   */
  ignores: [],
  /**
   *
   */
  syncAfterFinish: false,
  /**
   *
   */
  postFinish: '',
  /**
   *
   */
  skipTest: false,
  /**
   *
   */
  branchTypes: {
    feat: 'feat',
    fix: 'fix',
    chore: 'chore',
    docs: 'docs'
  },
  /**
   * List of branches that not follow the default develop/production branches.
   */
  refs: {}
};

module.exports = {
  CONFIG_BASENAME,
  DEFAULT_CONFIG
};