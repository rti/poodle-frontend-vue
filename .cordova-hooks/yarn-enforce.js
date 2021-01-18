#!/usr/bin/env node

// https://github.com/apache/cordova-cli/issues/303#issuecomment-643812857

var exec = require('child_process').execSync;

module.exports = function(context) {
  console.log('HOOK: yarn-enforce: removing package-lock.json is present.')

  exec('rm -f package-lock.json');
  // TODO: completely clean node_modules here maybe?
  exec('yarn');
};
