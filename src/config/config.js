const path = require("path");
const fs = require("fs");
const { DEFAULT_CONFIG, CONFIG_BASENAME } = require("./base-config");

class Config extends Map {
  constructor() {
    super();
    this.load();
  }

  get charReplacement() {
    return this.get("charReplacement");
  }

  /**
   *
   * @returns {*}
   */
  get remote() {
    return this.get("remote");
  }

  /**
   *
   * @returns {*}
   */
  get production() {
    return this.get("production");
  }

  /**
   *
   * @returns {*}
   */
  get flow() {
    return this.get("flow") || "gflow";
  }

  /**
   *
   * @returns {string}
   */
  get remoteProduction() {
    return `${this.get("remote")}/${this.get("production")}`;
  }

  /**
   *
   * @returns {*|string}
   */
  get develop() {
    return this.get("develop");
  }

  /**
   *
   * @returns {string}
   */
  get remoteDevelop() {
    return `${this.get("remote")}/${this.get("develop")}`;
  }

  /**
   *
   * @returns {*}
   */
  get syncAfterFinish() {
    return this.get("syncAfterFinish");
  }

  /**
   *
   * @returns {*}
   */
  get postFinish() {
    return this.get("postFinish");
  }

  get skipTest() {
    return this.get("skipTest");
  }

  get branchTypes() {
    return this.get("branchTypes") || {};
  }

  /**
   *
   * @returns {{label: *, value: string}[]}
   */
  getBranchTypes() {
    return Object.keys(this.branchTypes).map(key => ({
      label: this.branchTypes[key],
      value: key
    }));
  }

  load() {
    if (this.promise) {
      return this.promise;
    }

    this.clear();
    this.setConfig(DEFAULT_CONFIG);
    this.readConfiguration();

    return undefined;
  }

  /**
   *
   * @param config
   */
  setConfig(config) {
    Object.keys(config).forEach(key => {
      const value = config[key];

      if (key === "master") {
        key = "develop";
      }

      if (this[`_${key}`] instanceof Map) {
        Object.keys(value).forEach(k => {
          this[`_${key}`].set(k, value[k]);
        });
      } else {
        this.set(key, value);
      }
    });
  }

  /**
   *
   */
  readConfiguration() {
    if (this.hasConfiguration()) {
      const conf = JSON.parse(
        fs.readFileSync(path.join(process.cwd(), CONFIG_BASENAME), "utf8")
      );
      this.setConfig(conf);
    }
  }

  /**
   *
   * @returns {boolean}
   */
  hasConfiguration() {
    return fs.existsSync(path.join(process.cwd(), CONFIG_BASENAME), "utf8");
  }

  /**
   *
   */
  writeConfiguration() {
    const conf = this.toObject();

    fs.writeFileSync(
      path.join(process.cwd(), CONFIG_BASENAME),
      JSON.stringify(conf, null, 2),
      { encoding: "utf8" }
    );
  }

  /**
   *
   * @returns {K}
   */
  toObject() {
    return Array.from(this.keys()).reduce((acc, key) => {
      if (this[`_${key}`] instanceof Map) {
        acc[key] = {};

        this[`_${key}`].forEach((v, k) => {
          acc[key][k] = v;
        });
      } else {
        acc[key] = this.get(key);
      }

      return acc;
    }, {});
  }
}

module.exports = new Config();
