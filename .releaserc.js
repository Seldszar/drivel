const { name } = require("./package.json");

module.exports = {
  verifyConditions: ["@semantic-release/github"],
  prepare: [
    {
      path: "@semantic-release/exec",
      cmd: "node ./scripts/archive.js ${nextRelease.version}",
    },
  ],
  publish: [
    {
      path: "@semantic-release/github",
      assets: `dist/${name}-*.zip`,
    },
  ],
};
