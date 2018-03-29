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
  postFinish: ''
};

class Config {
  constructor() {
    this.load();
  }

  get(key) {
    return this._config.get(key);
  }

  set(key, value) {
    return this._config.set(key, value);
  }

  has(key) {
    return this._config.has(key);
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

  get syncAfterFinish() {
    return this.get('syncAfterFinish');
  }

  get postFinish() {
    return this.get('postFinish');
  }

  load() {

    if (this.promise) {
      return this.promise;
    }

    this._config = new Map();
    this.setConfig(DEFAULT_CONFIG);

    this.promise = this
      .readFromPkg()
      .then(() => {
        this.readConfiguration();
      });
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
      this.set('loaded', true);
    }
  }

  readFromPkg() {
    return readPkgUp()
      .then(({ pkg }) => {
        this.setConfig(_.cloneDeep(pkg.gflow || {}));
        this.set('loaded', true);
        return this.toObject();
      })
      .catch((er) => {
        return this.toObject();
      });
  }

  isLoaded() {
    return !!this.get('loaded');
  }

  /**
   *
   * @returns {boolean}
   */
  hasConfiguration() {
    return fs.existsSync(path.join(process.cwd(), CONFIG_BASENAME), 'utf8');
  }

  writeConfiguration() {
    const conf = {};

    this._config.forEach((value, key) => {
      conf[key] = value;
    });

    fs.writeFileSync(path.join(process.cwd(), CONFIG_BASENAME), JSON.stringify(conf, null, 2), { encoding: 'utf8' });
  }

  toObject() {
    return Array.from(this._config.keys).reduce((acc, key) => {
      acc[key] = this._config.get(key);
      return acc;
    }, {});
  }
}

module.exports = new Config();

