/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');

var app = new EmberApp({
  name: require('./package.json').name,
  minifyCSS: {
    enabled: true,
    options: {}
  },

  getEnvJSON: require('./config/environment')
});

//JSHint tests are current QUnit and fail to run
app.hinting = false;

// Use this to add additional libraries to the generated output files.
app.import('vendor/ember-data/ember-data.js');

// If the library that you are including contains AMD or ES6 modules that
// you would like to import into your application please specify an
// object with the list of modules as keys along with the exports of each
// module as its value.
app.import('vendor/ic-ajax/dist/named-amd/main.js', {
  'ic-ajax': [
    'default',
    'defineFixture',
    'lookupFixture',
    'raw',
    'request',
  ]
});

var mochaFiles = pickFiles('vendor', {
    srcDir: '/mocha',
    files: [
      'mocha.css', 'mocha.js'
    ],
    destDir: '/assets/'
  });

var shouldFiles = pickFiles('vendor', {
    srcDir: '/should',
    files: [
      'should.js'
    ],
    destDir: '/assets/'
  });

var sinonFiles = pickFiles('vendor', {
    srcDir: '/sinonjs-built/pkg',
    files: [
      'sinon.js'
    ],
    destDir: '/assets/'
  });

var mochaAdapter = pickFiles('vendor', {
    srcDir: '/ember-mocha-adapter',
    files: [
      'adapter-qunit.js'
    ],
    destDir: '/assets/'
  });

var testTrees = mergeTrees([mochaFiles, mochaAdapter, shouldFiles, sinonFiles], {
     overwrite: true
});

var fullTree = mergeTrees([app.toTree(), testTrees]);

module.exports = fullTree;
