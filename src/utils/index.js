const normalize = require('./normalize-branch');
const toRemote = require('./to-remote');
const getBrancheName = require('./get-branche-name');

module.exports = {
  ...normalize,
  ...toRemote,
  ...getBrancheName
};
