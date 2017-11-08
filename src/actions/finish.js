const {refreshRepository, currentBranchName, branch, checkout, merge, push, rebase} = require("../git/index");

const DEFAULT_OPTIONS = {
  master: "master",
  production: "production"
};


function doFetch(options) {
  rebase(`origin/${options.production}`);

  console.log("Try to delete production");
  try {
    branch("-D", options.production);
  } catch (er) {
    console.log("Local production not found");
  }

  console.log("Checkout production");
  checkout("-b", options.production, `origin/${options.production}`);
}

module.exports = (options = DEFAULT_OPTIONS) => {

  options = Object.assign({}, DEFAULT_OPTIONS, options);

  const featureBranch = currentBranchName();
  refreshRepository();

  if (options.master !== featureBranch) {
    console.log("Start publishing branch feature");

    doFetch(options);

    merge("--no-ff", "-m", `"${featureBranch}"`, featureBranch);

    push("origin", options.production);
    push("origin", `:${featureBranch}`);
    branch("-d", featureBranch);

    console.log(`${featureBranch} FINISH DONE`);
    return;
  }

  console.log(`Start publishing ${options.master} branch (group features)`);
  doFetch(options);

  merge("--no-ff", "-m", `"${featureBranch}"`, options.master);
  push("origin", options.master);
  push("origin", options.production);

  console.log(`${options.master} FINISH DONE`);
};

