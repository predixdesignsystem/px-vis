module.exports = {
  verbose: true,
  plugins: {
    local: {
      browsers: ['chrome', 'firefox']
    },
    sauce: {
      disabled: true
    }
  },
  suites: [
    'test/px-vis-svg-fixture.html',
    'test/px-vis-scale-fixture.html',
    'test/px-vis-register-fixture.html'
  ]
};
