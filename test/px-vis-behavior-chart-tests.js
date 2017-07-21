document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-behavior-chart does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-behavior-chart completeSeriesconfig test', function() {
    var testComponent = document.querySelector('test-component'),
      seriesConfig = {},
      chartData = [{x: 'time', y: 'myTest'}];

    suiteSetup(function(done) {
      seriesConfig = {
        'My Series': {
          'name': 'My Series',  //human readable name
          'x': 'x',
          'y': 'y',
          'interpolationFunction': function() {},
          'axis': {
            'id': 'AXIS_ID',
            'side': 'left',
            'number': 1
          }
        }
      };

      testComponent.set('chartData', chartData)
      testComponent.set('seriesConfig', seriesConfig);

      window.setTimeout(function() {
        done();
      }, 300);
    });

    test('CompleteSeriesConfig is created', function() {
      assert.isDefined(testComponent.completeSeriesConfig);
    });

    test('CompleteSeriesConfig is new object', function() {
      assert.notStrictEqual(testComponent.completeSeriesConfig, seriesConfig);
    });

    test('CompleteSeriesConfig contains seriesConfig members', function() {
      assert.strictEqual(testComponent.completeSeriesConfig['My Series']['name'], seriesConfig['My Series']['name']);
      assert.strictEqual(testComponent.completeSeriesConfig['My Series']['x'], seriesConfig['My Series']['x']);
      assert.strictEqual(testComponent.completeSeriesConfig['My Series']['y'], seriesConfig['My Series']['y']);
      assert.strictEqual(testComponent.completeSeriesConfig['My Series']['interpolationFunction'], seriesConfig['My Series']['interpolationFunction']);
      assert.deepEqual(testComponent.completeSeriesConfig['My Series']['axis'], seriesConfig['My Series']['axis']);
    });
  });
}
