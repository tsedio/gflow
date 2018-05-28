const path = require('path');
const fs = require('fs');
const readPkgUp = require('read-pkg-up');

const CONFIG_BASENAME = '.gflowrc';
const DEFAULT_CONFIG = {
  production: 'production',
  develop: 'master',
  charBranchNameSeparator: '_',
  remote: 'origin',
  ignores: [],
  syncAfterFinish: false,
  postFinish: '',
  skipTest: false,
  branchTypes: {
    feat: 'feat',
    fix: 'feat',
    chore: 'chore',
    docs: 'docs'
  }
};

class Config extends Map {
  constructor() {
    super();
    this.load();
  }

  then(...args) {
    return this.promise.then(...args);
  }

  catch(...args) {
    return this.promise.catch(...args);
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
    return this.get('branchTypes');
  }

  load() {

    if (this.promise) {
      return this.promise;
    }

    this.clear();
    this.setConfig(DEFAULT_CONFIG);
    this.readFromPkg();
    this.readConfiguration();

    this.promise = Promise.resolve(this.toObject());
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
   *
   */
  readConfiguration() {
    if (this.hasConfiguration()) {
      const conf = JSON.parse(fs.readFileSync(path.join(process.cwd(), CONFIG_BASENAME), 'utf8'));
      this.setConfig(conf);
    }
  }

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

