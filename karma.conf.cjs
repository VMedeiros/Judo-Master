/**
 * Karma: unit tests with Jasmine in Chrome. `npm test` watches; `npm run
 * test:ci` runs once in headless Chrome and enforces the coverage floor.
 */
module.exports = function karmaConfig(config) {
  config.set({
    basePath: '',
    // Override when another local process already holds Karma's default port.
    port: Number(process.env.KARMA_PORT) || 9876,
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
    ],
    client: {
      jasmine: { random: true },
      clearContext: false,
    },
    jasmineHtmlReporter: {
      suppressAll: true,
    },
    coverageReporter: {
      dir: require('node:path').join(__dirname, './coverage/judo-master'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'lcov' }],
      check: {
        global: {
          statements: 95,
          branches: 85,
          functions: 95,
          lines: 95,
        },
      },
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeHeadlessCI: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },
    restartOnFileChange: true,
    singleRun: false,
    autoWatch: true,
  });
};
