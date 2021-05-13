const exec = require("../../exec");
const hasYarn = require("has-yarn");

module.exports = options => ({
  title: "Test",
  skip: () => !options.test,
  task: () =>
    exec(hasYarn ? "yarn" : "npm", ["test"], {
      env: {
        CI: "GFLOW"
      }
    })
});
