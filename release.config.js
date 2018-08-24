module.exports = {
  branch: 'production',
  prepare: ['@semantic-release/npm', './src/command/release.js'],
  success: ['@semantic-release/github', './src/command/release.js'], // ,
  fail: ['@semantic-release/github'],
};
