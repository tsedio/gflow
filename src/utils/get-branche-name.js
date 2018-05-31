module.exports = {
  getBranchName(branch) {
    const info = branch.split('/');
    return info[1] || info[0];
  }
};