const {refreshRepository, rebase} = require("../git/index");

const DEFAULT_OPTIONS = {
  from: "origin/production"
};

module.exports = (options = DEFAULT_OPTIONS) => {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  refreshRepository();
  rebase(options.from);
  return options;
};

