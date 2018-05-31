const path = require('path');
const fs = require('fs');
const readPkgUp = require('read-pkg-up');
const { getBranchName } = require('./utils/get-branche-name');
const { DEFAULT_CONFIG, CONFIG_BASENAME } = require('./base-config');

class Config extends Map {
  constructor() {
    super();
    this.load();
  }

  /**
   *
   * @returns {*}
   */
  get remote() {
    return this.get('remote');
  }

  /**
   *
   * @returns {*}
   */
  get production() {
    return this.get('production');
  }

  /**
   *
   * @returns {string}
   */
  get remoteProduction() {
    return this.get('remote') + '/' + this.get('production');
  }

  /**
   *
   * @returns {*|string}
   */
  get develop() {
    return this.get('develop');
  }

  /**
   *
   * @returns {string}
   */
  get remoteDevelop() {
    return this.get('remote') + '/' + this.get('develop');
  }

  /**
   *
   * @returns {*}
   */
  get charBranchNameSeparator() {
    return this.get('charBranchNameSeparator');
  }

  /**
   *
   * @returns {*}
   */
  get syncAfterFinish() {
    return this.get('syncAfterFinish');
  }

  /**
   *
   * @returns {*}
   */
  get postFinish() {
    return this.get('postFinish');
  }

  get skipTest() {
    return this.get('skipTest');
  }

  get branchTypes() {
    return this.get('branchTypes') || {};
  }

  /**
   *
   * @returns {V | undefined}
   */
  get refs() {
    return this.get('refs') || {};
  }

  /**
   *
   * @returns {{label: *, value: string}[]}
   */
  getBranchTypes() {
    return Object.keys(this.branchTypes).map((key) => {
      return {
        label: this.branchTypes[key],
        value: key
      };
    });
  }

  /**
   *
   * @param refBranch
   * @returns {Array}
   */
  getRelatedBranches(refBranch) {
    const refs = this.get('refs');
    refBranch = getBranchName(refBranch);

    return Object.keys(refs).reduce((acc, branchName) => {
      if (refs[branchName] === refBranch) {
        acc.push(branchName);
      }
      return acc;
    }, []);
  }

  setBranchRef(branch, refBranch) {
    this.refs[getBranchName(branch)] = getBranchName(refBranch);
    this.writeConfiguration();
  }

  /**
   *
   * @param branch
   * @returns {*}
   */
  hasBranchRef(branch) {
    return this.refs[getBranchName(branch)];
  }

  /**
   *
   * @param branch
   * @returns {*}
   */
  getBranchRef(branch) {
    return this.refs[getBranchName(branch)];
  }

  /**
   *
   * @param branch
   * @returns {string}
   */
  getRemoteBranchRef(branch) {
    if (this.hasBranchRef(branch)) {
      return `${this.remote}/${this.getBranchRef(branch)}`;
    }
  }

  /**
   *
   * @returns {string[]}
   */
  getRefBranches() {
    return Object.values(this.refs).map(o => `${this.remote}/${o}`);
  }

  load() {
    if (this.promise) {
      return this.promise;
    }

    this.clear();
    this.setConfig(DEFAULT_CONFIG);
    this.readFromPkg();
    this.readConfiguration();
  }

  /**
   *
   * @param config
   */
  setConfig(config) {
    Object.keys(config).forEach((key) => {
      const value = config[key];

      if (key === 'master') {
        key = 'develop';
      }

      this.set(key, value);
    });
  }

  /**
   * @deprecated
   * @returns {*}
   */
  readFromPkg() {
    try {
      const { pkg } = readPkgUp.sync();
      this.setConfig(_.cloneDeep(pkg.gflow || {}));
    } catch (er) {
    }

    return this.toObject();
  }

  /**
   *
   */
  readConfiguration() {
    if (this.hasConfiguration()) {
      const conf = JSON.parse(fs.readFileSync(path.join(process.cwd(), CONFIG_BASENAME), 'utf8'));
      this.setConfig(conf);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  hasConfiguration() {
    return fs.existsSync(path.join(process.cwd(), CONFIG_BASENAME), 'utf8');
  }

  /**
   *
   */
  writeConfiguration() {
    const conf = this.toObject();

    fs.writeFileSync(path.join(process.cwd(), CONFIG_BASENAME), JSON.stringify(conf, null, 2), { encoding: 'utf8' });
  }

  toObject() {
    return Array.from(this.keys()).reduce((acc, key) => {
      acc[key] = this.get(key);
      return acc;
    }, {});
  }
}

module.exports = new Config();

