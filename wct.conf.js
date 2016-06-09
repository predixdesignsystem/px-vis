module.exports = {
  verbose: false,
  plugins: {
    local: {
        browsers: ['chrome', 'firefox']
    },
    sauce: {
      disabled: true,
      "browsers": [{
          "browserName": "microsoftedge",
          "platform": "Windows 10",
          "version": ""
        }, {
          "browserName": "internet explorer",
          "platform": "Windows 8.1",
          "version": "11"
        },
        {
          "browserName": "safari",
          "platform": "OS X 10.11",
          "version": "9"
        }, {
          "browserName": "safari",
          "platform": "OS X 10.10",
          "version": "8"
        }
      ]
    }
  },
  suites: [
    'test/px-vis-svg-fixture.html',
    'test/px-vis-scale-fixture.html',
    'test/px-vis-register-fixture.html',
    'test/px-vis-line-fixture.html',
    'test/px-vis-scatter-fixture.html',
    'test/px-vis-event-fixture.html',
    'test/px-vis-threshold-fixture.html'
  ]
};
