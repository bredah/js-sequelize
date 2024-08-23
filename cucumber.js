module.exports = {
  default: {
    paths: ["test/bdd/*.feature"],
    require: ["test/bdd/steps/*.js"],
    requireModule: ["@babel/register"],
    dryRun: false,
    format: ["progress-bar", ["html", "cucumber-report.html"]],
    language: "pt",
    // tags: "database",
  },
};
