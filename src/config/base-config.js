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
  charReplacement: '-',
  /**
   *
   */
  branchTypes: {
    feat: 'feat',
    fix: 'fix',
    chore: 'chore',
    docs: 'docs',
    release: 'release'
  }
};

module.exports = {
  CONFIG_BASENAME,
  DEFAULT_CONFIG
};
