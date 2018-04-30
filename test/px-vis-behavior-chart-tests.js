/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-behavior-chart does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
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
