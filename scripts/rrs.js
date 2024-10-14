const { execSync } = require("child_process");
const rrs = require("react-router-serve");

execSync("react-router-serve ./build/server/index.js");
