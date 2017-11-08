const {refreshRepository, checkout} = require("../git/index");

const DEFAULT_OPTIONS = {
  branchName: "branch_name",
  type: "feat",
  from: "origin/production"
};

module.exports = (options = DEFAULT_OPTIONS) => {
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const branch = `${options.type}_${options.branchName}`;
  refreshRepository();
  checkout("--no-track", "-b", branch, options.from);
  console.log("New feature", branch, "CREATION DONE from MASTER HEAD");
};
