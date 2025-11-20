const { buildAnalyzer, runDepTree } = require("./analyzer/index");

exports.checkOwner = require("./owner/checkOwner");
exports.fixOwner = require("./owner/fixOwner");
exports.checkEslint = require("./eslint/index");
exports.checkTest = require("./test/index");
exports.checkCommitlint = require("./commitlint/index");
exports.checkSize = require("./size/index");
exports.checkKuxOld = require("./kuxold/index");
exports.checkTs = require("./typescript/index");
exports.buildAnalyzer = buildAnalyzer;
exports.runDepTree = runDepTree;
