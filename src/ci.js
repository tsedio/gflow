module.exports = (() => {
  const { env } = process;
  const { GIT_USER_NAME, GIT_USER_EMAIL } = env;
  if (env.CI) {
    if (env.TRAVIS) {
      const { TRAVIS_BUILD_NUMBER } = env;

      return {
        NAME: 'Travis CI',
        USER: GIT_USER_NAME || 'Travis CI',
        EMAIL: GIT_USER_EMAIL || 'travis@travis-ci.org',
        BUILD_NUMBER: TRAVIS_BUILD_NUMBER,
        ORIGIN: 'origin-git'
      };
    }

    if (env.GITLAB_CI) {
      const { CI_BUILD_ID, CI_JOB_ID } = env;

      return {
        NAME: 'GitLab CI',
        USER: GIT_USER_NAME || 'GitLab CI',
        email: GIT_USER_EMAIL || 'gitlab@gitlab.com',
        BUILD_NUMBER: CI_BUILD_ID || CI_JOB_ID,
        ORIGIN: 'origin-git'
      };
    }

    if (env.CIRCLECI) {
      const { CIRCLE_BUILD_NUM } = env;
      return {
        NAME: 'Circle CI',
        USER: GIT_USER_NAME || 'Circle CI',
        EMAIL: GIT_USER_EMAIL || 'circle@circleci.com',
        BUILD_NUMBER: CIRCLE_BUILD_NUM,
        ORIGIN: 'origin-git'
      };
    }
    return {
      NAME: 'Unsupported CI',
      BUILD_NUMBER: '',
      ORIGIN: 'origin-git'
    };
  }
  /// local
  return {
    NAME: 'LOCAL',
    BUILD_NUMBER: '',
    ORIGIN: 'origin'
  };

})();

