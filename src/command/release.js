const fs = require("fs");
const chalk = require("chalk");
const logger = require("fancy-log");
const figures = require("figures");
const git = require("../git/index");
const CI = require("../config/ci");
const config = require("../config");
/**
 *
 * @returns {any}
 */
const readPackage = () =>
  writePackage(
    JSON.parse(fs.readFileSync("./package.json", { encoding: "utf8" }))
  );
/**
 *
 * @param pkg
 */
const writePackage = pkg => {
  fs.writeFileSync("./package.json", JSON.stringify(pkg, null, 2), {
    encoding: "utf8"
  });
  return pkg;
};

module.exports = {
  /**
   *
   * @returns {Promise<void>}
   */
  pre() {
    const { EMAIL, USER } = CI;

    if (CI) {
      if (EMAIL && USER) {
        git.config("--global", "user.email", EMAIL);
        git.config("--global", "user.name", USER);
      }

      git.checkoutSync(config.production);
      git.branchSync(
        `--set-upstream-to=${config.remoteProduction}`,
        config.production
      );

      logger(
        "[Gflow release]",
        chalk.green(figures.tick),
        `${CI.NAME} CI Installed`
      );
    } else {
      logger(
        "[Gflow release]",
        chalk.yellow(figures.cross),
        "Not in CI environment"
      );
    }

    return Promise.resolve();
  },
  /**
   *
   * @param context
   */
  updateVersion(context) {
    if (context) {
      const {
        nextRelease: { version }
      } = context;

      logger("[Gflow release] Write package.json");

      const pkg = readPackage();
      pkg.version = version;
      writePackage(pkg);
    }
  },
  /**
   *
   * @returns {Promise<void>}
   */
  commitChanges() {
    const { GH_TOKEN } = process.env;
    const pkg = readPackage();
    const {
      version,
      repository: { url }
    } = pkg;
    const repository = url.replace("https://", "");

    if (!CI) {
      logger(
        "[Gflow release]",
        chalk.yellow(figures.cross),
        "Not in CI environment"
      );
      return Promise.resolve();
    }

    logger("[Gflow release]", `Generate release tag for v${version}`);
    logger("[Gflow release]", `REPOSITORY:      ${repository}`);
    logger("[Gflow release]", `RELEASE_BRANCH:  ${config.production}`);
    logger("[Gflow release]", `DEVELOP_BRANCH:   ${config.develop}`);
    logger("[Gflow release]", `BUILD:           ${CI.BUILD_NUMBER}`);

    if (GH_TOKEN) {
      logger("[Gflow release]", `Configure remote repository ${repository}`);
      git.remoteSync("add", CI.ORIGIN, `https://${GH_TOKEN}@${repository}`);
    }

    logger("[Gflow release]", "Adding files to commit");
    git.addSync("-A");

    logger("[Gflow release]", "Reset .npmrc");
    git.resetSync("--", ".npmrc");

    logger("[Gflow release]", "Commit files");
    git.commitSync(
      "-m",
      `${CI.NAME} build: ${CI.BUILD_NUMBER} v${version} [ci skip]`
    );

    return undefined;
  },

  prepare(pluginConfig, context) {
    module.exports.pre();
    module.exports.updateVersion(context);
    module.exports.commitChanges();

    return Promise.resolve();
  },

  success() {
    try {
      logger("[Gflow release]", `Push to ${config.production}`);
      git.pushSync("--quiet", "--set-upstream", CI.ORIGIN, config.production);

      logger(
        "[Gflow release]",
        `Sync ${config.develop} with ${config.production}`
      );
      git.pushSync(
        "-f",
        CI.ORIGIN,
        `${config.production}:refs/heads/${config.develop}`
      );

      logger(chalk.green(figures.tick), "Release tag are applied on git");
    } catch (er) {
      logger(chalk.red(figures.cross), String(er), er.stack);
    }

    return Promise.resolve();
  },
  /**
   *
   * @returns {*}
   */
  post() {
    return module.exports.prepare().then(() => module.exports.success());
  }
};
