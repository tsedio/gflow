const { getBranchName } = require('./utils/get-branche-name');
const { branchExists } = require('./git');

class Refs extends Map {
  constructor(hooks) {
    super();
    this.hooks = hooks;
  }

  /**
   *
   * @param key
   * @param value
   * @returns {Map}
   */
  set(key, value) {
    if (!this.callHook('onSet', value)) {
      return super.set(getBranchName(key), value);
    }

    return undefined;
  }

  /**
   *
   * @param key
   * @returns {V | undefined}
   */
  get(key) {
    return super.get(getBranchName(key));
  }

  /**
   *
   * @param key
   * @returns {V | undefined}
   */
  has(key) {
    return super.get(getBranchName(key));
  }

  /**
   *
   * @param refBranch
   * @returns {Array}
   */
  relatedBranchesOf(refBranch) {
    refBranch = getBranchName(refBranch);

    return Array.from(this.keys()).reduce((acc, branchName) => {
      if (this.get(branchName) === refBranch) {
        acc.push(branchName);
      }
      return acc;
    }, []);
  }

  /**
   *
   * @param branch
   * @returns {string}
   */
  referenceRemoteOf(branch) {
    if (this.has(branch)) {
      return `${this.remote}/${this.get(branch)}`;
    }
    return undefined;
  }

  /**
   *
   * @param branch
   * @returns {string}
   */
  referenceOf(branch) {
    return this.has(branch) ? `${this.callHook('onRemote')}/${this.get(branch)}` : this.callHook('onReferenceOf');
  }

  /**
   *
   * @returns {string[]}
   */
  remoteBranches() {
    return this.branches.map(o => `${this.callHook('onRemote')}/${o}`);
  }

  /**
   *
   * @returns {string[]}
   */
  branches() {
    return Array.from(this.keys()).map(o => `${this.callHook('onRemote')}/${o}`);
  }

  /**
   *
   * @returns {string[]}
   */
  remoteReferences() {
    return this.references.map(o => `${this.callHook('onRemote')}/${o}`);
  }

  /**
   *
   * @returns {string[]}
   */
  references() {
    return Array.from(this.values()).map(o => `${this.callHook('onRemote')}/${o}`);
  }

  /**
   *
   * @returns {Array}
   */
  cleanReferences() {
    const list = [];
    this.forEach((ref, branch) => {
      if (!branchExists(ref, this.callHook('onRemote'))) {
        this.delete(branch);
        list.push({ branch, ref });
      }
    });

    return list;
  }

  /**
   *
   * @param hook
   * @param args
   * @returns {*}
   */
  callHook(hook, ...args) {
    return this.hooks && this.hooks[hook] && this.hooks[hook](...args);
  }
}

module.exports = {
  Refs
};
