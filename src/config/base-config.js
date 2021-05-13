const CONFIG_BASENAME = ".gflowrc";

const ConfigSchema = [
  /**
   * Value: gitflow or gflow
   */
  {
    default: "gflow",
    type: "list",
    name: "flow",
    message: "What flow do you want to use?",
    choices: [
      {
        label:
          "GFlow - Use rebase command when pushing/finishing branch on remote",
        value: "gflow"
      },
      {
        label:
          "GFlow - Use rebase command when pushing/finishing branch on remote",
        value: "gitflow"
      }
    ]
  },
  /**
   *
   */
  {
    default: "origin",
    type: "input",
    name: "remote",
    message: "What is your remote alias name?"
  },
  /**
   *
   */
  {
    default: "master",
    type: "input",
    name: "develop",
    message: "What is your development branch name?"
  },
  /**
   *
   */
  {
    default: "production",
    type: "input",
    name: "production",
    message: "What is your production branch name?"
  },
  /**
   *
   */
  {
    default: [],
    name: "ignores"
  },
  /**
   *
   */
  {
    default: false,
    type: "confirm",
    name: "syncAfterFinish",
    enable: ctx => ctx.production !== ctx.develop,
    message: "Reset development branch over production after gflow finish?"
  },
  /**
   *
   */
  {
    default: "",
    name: "postFinish"
  },
  /**
   *
   */
  {
    default: false,
    type: "confirm",
    name: "skipTest",
    message: "Skip unit test when pushing/finishing branch?"
  },
  /**
   *
   */
  {
    default: "-",
    name: "charReplacement"
  },
  /**
   *
   */
  {
    default: {
      feat: "feat",
      fix: "fix",
      chore: "chore",
      docs: "docs",
      release: "release"
    },
    name: "branchTypes"
  }
];

module.exports = {
  ConfigSchema,
  CONFIG_BASENAME,
  DEFAULT_CONFIG: ConfigSchema.reduce(
    (acc, { name, default: defaultValue }) => {
      acc[name] = defaultValue;

      return acc;
    },
    {}
  )
};
