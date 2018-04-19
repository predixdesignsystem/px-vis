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
  suite('px-vis-highlight-point-canvas does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-highlight-point-canvas basic', function() {
    suite('px-vis-highlight-point-canvas setup works', function() {
      var baseScale,
          baseSVG,
          basePoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      basePoint = document.getElementById('basePoint');
        var d = [{
              "x": 1,
              "timeStamp": 1397102460000,
              "y0": 1,
              "y1": 1
            },{
              "x": 2,
              "timeStamp": 1397131620000,
              "y0": 6,
              "y1": 3
            },{
              "x": 3,
              "timeStamp": 1397160780000,
              "y0": 4,
              "y1": 8
            },{
              "x": 4,
              "timeStamp": 1397189940000,
              "y0": 8,
              "y1": 4
            },{
              "x": 5,
              "timeStamp": 1397219100000,
              "y0": 6,
              "y1": 6
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y0",
              "color": colorSet[0]
            },
            "mySeries2":{
              "type":"line",
              "name":"mySeries2",
              "x":"x",
              "y":"y1",
              "color": colorSet[1]
            },
          },
          chartExtents = {"x":[1,5],"y":[0,10]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        baseSVG.set('width',w);
        baseSVG.set('height',h);
        baseSVG.set('margin',m);

        baseScale.set('width',w);
        baseScale.set('height',h);
        baseScale.set('margin',m);
        baseScale.set('completeSeriesConfig',completeSeriesConfig);
        baseScale.set('chartExtents',chartExtents);
        baseScale.set('dataExtents',chartExtents);
        baseScale.set('chartData',d);

        basePoint.set('timeData', 'timeStamp');
        basePoint.set('completeSeriesConfig',completeSeriesConfig);

        window.setTimeout(function() { done(); }, 100);
      });

      test('basePoint fixture is created', function() {
        assert.isTrue(basePoint !== null);
      });

      test('basePoint highlightData not created', function() {
        assert.isUndefined(basePoint._highlightData);
      });

      test('basePoint base layer is not muted', function() {
        assert.isFalse(baseSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });

      test('basePoint didnt create defaultEmptyData', function() {
        assert.isNull(basePoint.defaultEmptyData);
      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var baseScale,
          baseSVG,
          basePoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      basePoint = document.getElementById('basePoint');
        var d = {
            "rawData":[{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            }],
            "timeStamps": [1397160780000]
          };

        basePoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('basePoint create highlightData', function() {
        assert.deepEqual(basePoint._highlightData, [{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            }]);
      });

      test('basePoint base layer mutes', function() {
        assert.isTrue(baseSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });

      test('basePoint didnt create defaultEmptyData', function() {
        assert.isNull(basePoint.defaultEmptyData);
      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var baseScale,
          baseSVG,
          basePoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      basePoint = document.getElementById('basePoint');
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        basePoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('basePoint highlightData removed', function() {
        assert.deepEqual(basePoint._highlightData, []);
      });

      test('basePoint base layer unmutes', function() {
        assert.isFalse(baseSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite
  }); //suite



   suite('px-vis-highlight-point-canvas different dataset', function() {
    suite('px-vis-highlight-point-canvas setup works', function() {
      var differentScale,
          differentSVG,
          differentPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      differentScale = document.getElementById('differentScale');
      differentSVG = document.getElementById('differentSVG');
      differentPoint = document.getElementById('differentPoint');
        var d = [{
              "x": 1,
              "timeStamp": 1397102460000,
              "y0": 1,
              "y1": 1
            },{
              "x": 2,
              "timeStamp": 1397131620000,
              "y0": 6,
              "y1": 3
            },{
              "x": 3,
              "timeStamp": 1397160780000,
              "y0": 4,
              "y1": 8
            },{
              "x": 4,
              "timeStamp": 1397189940000,
              "y0": 8,
              "y1": 4
            },{
              "x": 5,
              "timeStamp": 1397219100000,
              "y0": 6,
              "y1": 6
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y0",
              "color": colorSet[0]
            },
            "mySeries2":{
              "type":"line",
              "name":"mySeries2",
              "x":"x",
              "y":"y1",
              "color": colorSet[1]
            },
          },
          chartExtents = {"x":[1,5],"y":[0,10]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        differentSVG.set('width',w);
        differentSVG.set('height',h);
        differentSVG.set('margin',m);

        differentScale.set('width',w);
        differentScale.set('height',h);
        differentScale.set('margin',m);
        differentScale.set('completeSeriesConfig',completeSeriesConfig);
        differentScale.set('chartExtents',chartExtents);
        differentScale.set('dataExtents',chartExtents);
        differentScale.set('chartData',d);

        differentPoint.set('timeData', 'timeStamp');
        differentPoint.set('completeSeriesConfig',completeSeriesConfig);
        differentPoint.set('chartData',d);

        window.setTimeout(function() { done(); }, 100);

      });

      test('differentPoint fixture is created', function() {
        assert.isTrue(differentPoint !== null);
      });

      test('basePoint highlightData not created', function() {
        assert.isUndefined(differentPoint._highlightData);
      });

      test('differentPoint different layer is not muted', function() {
        assert.isFalse(differentSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var differentScale,
          differentSVG,
          differentPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      differentScale = document.getElementById('differentScale');
      differentSVG = document.getElementById('differentSVG');
      differentPoint = document.getElementById('differentPoint');
        var d = {
            "rawData":[{
              "timeStamp": 1397160780000,
              "x": 15,
              "y0": 10,
              "y1": 20
            }],
            "timeStamps": [1397160780000]
          };

        differentPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('basePoint create highlightData', function() {
        assert.deepEqual(differentPoint._highlightData, [{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            }]);
      });

      test('differentPoint different layer mutes', function() {
        assert.isTrue(differentSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var differentScale,
          differentSVG,
          differentPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      differentScale = document.getElementById('differentScale');
      differentSVG = document.getElementById('differentSVG');
      differentPoint = document.getElementById('differentPoint');
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        differentPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('differentPoint highlightData removed', function() {
        assert.deepEqual(differentPoint._highlightData, []);
      });

      test('differentPoint different layer unmutes', function() {
        assert.isFalse(differentSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite
  }); //suite



  suite('px-vis-highlight-point-canvas fuzz', function() {
    suite('px-vis-highlight-point-canvas setup works', function() {
      var fuzzScale,
          fuzzSVG,
          fuzzPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      fuzzScale = document.getElementById('fuzzScale');
      fuzzSVG = document.getElementById('fuzzSVG');
      fuzzPoint = document.getElementById('fuzzPoint');
        var d = [{
              "x": 1,
              "timeStamp": 1397102460000,
              "y0": 1,
              "y1": 1
            },{
              "x": 2,
              "timeStamp": 1397131620000,
              "y0": 6,
              "y1": 3
            },{
              "x": 3,
              "timeStamp": 1397160780000,
              "y0": 4,
              "y1": 8
            },{
              "x": 4,
              "timeStamp": 1397189940000,
              "y0": 8,
              "y1": 4
            },{
              "x": 5,
              "timeStamp": 1397219100000,
              "y0": 6,
              "y1": 6
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y0",
              "color": colorSet[0]
            },
            "mySeries2":{
              "type":"line",
              "name":"mySeries2",
              "x":"x",
              "y":"y1",
              "color": colorSet[1]
            },
          },
          chartExtents = {"x":[1,5],"y":[0,10]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        fuzzSVG.set('width',w);
        fuzzSVG.set('height',h);
        fuzzSVG.set('margin',m);

        fuzzScale.set('width',w);
        fuzzScale.set('height',h);
        fuzzScale.set('margin',m);
        fuzzScale.set('completeSeriesConfig',completeSeriesConfig);
        fuzzScale.set('chartExtents',chartExtents);
        fuzzScale.set('dataExtents',chartExtents);
        fuzzScale.set('chartData',d);

        fuzzPoint.set('timeData', 'timeStamp');
        fuzzPoint.set('completeSeriesConfig',completeSeriesConfig);
        fuzzPoint.set('chartData',d);

        window.setTimeout(function() { done(); }, 100);

      });

      test('fuzzPoint fixture is created', function() {
        assert.isTrue(fuzzPoint !== null);
      });

      test('fuzzPoint highlightData not created', function() {
        assert.isUndefined(fuzzPoint._highlightData);
      });

      test('fuzzPoint fuzz layer is not muted', function() {
        assert.isFalse(fuzzSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var fuzzScale,
          fuzzSVG,
          fuzzPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      fuzzScale = document.getElementById('fuzzScale');
      fuzzSVG = document.getElementById('fuzzSVG');
      fuzzPoint = document.getElementById('fuzzPoint');
        var d = {
            "rawData":[{
              "timeStamp": 1397160780000,
              "x": 15,
              "y0": 10,
              "y1": 20
            }],
            "timeStamps": [1397160780000]
          };

        fuzzPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('fuzzPoint highlightData removed', function() {
        assert.deepEqual(fuzzPoint._highlightData, [{
              "timeStamp": 1397131620000,
              "x": 2,
              "y0": 6,
              "y1": 3
            },{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            },{
              "timeStamp": 1397189940000,
              "x": 4,
              "y0": 8,
              "y1": 4
            }]);
      });

      test('fuzzPoint fuzz layer mutes', function() {
        assert.isTrue(fuzzSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var fuzzScale,
          fuzzSVG,
          fuzzPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      fuzzScale = document.getElementById('fuzzScale');
      fuzzSVG = document.getElementById('fuzzSVG');
      fuzzPoint = document.getElementById('fuzzPoint');
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        fuzzPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('fuzzPoint scatters removed', function() {
        assert.deepEqual(fuzzPoint._highlightData, []);
      });

      test('fuzzPoint fuzz layer unmutes', function() {
        assert.isFalse(fuzzSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite
  }); //suite


  suite('px-vis-highlight-point-canvas generating crosshair data', function() {
    suite('px-vis-highlight-point-canvas setup works', function() {
      var generatingScale,
          generatingSVG,
          generatingPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      generatingScale = document.getElementById('generatingScale');
      generatingSVG = document.getElementById('generatingSVG');
      generatingPoint = document.getElementById('generatingPoint');
        var d = [{
              "x": 1,
              "timeStamp": 1397102460000,
              "y0": 1,
              "y1": 1
            },{
              "x": 2,
              "timeStamp": 1397131620000,
              "y0": 6,
              "y1": 3
            },{
              "x": 3,
              "timeStamp": 1397160780000,
              "y0": 4,
              "y1": 8
            },{
              "x": 4,
              "timeStamp": 1397189940000,
              "y0": 8,
              "y1": 4
            },{
              "x": 5,
              "timeStamp": 1397219100000,
              "y0": 6,
              "y1": 6
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y0",
              "color": colorSet[0]
            },
            "mySeries2":{
              "type":"line",
              "name":"mySeries2",
              "x":"x",
              "y":"y1",
              "color": colorSet[1]
            },
          },
          chartExtents = {"x":[1,5],"y":[0,10]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        generatingSVG.set('width',w);
        generatingSVG.set('height',h);
        generatingSVG.set('margin',m);

        generatingScale.set('width',w);
        generatingScale.set('height',h);
        generatingScale.set('margin',m);
        generatingScale.set('completeSeriesConfig',completeSeriesConfig);
        generatingScale.set('chartExtents',chartExtents);
        generatingScale.set('dataExtents',chartExtents);
        generatingScale.set('chartData',d);

        generatingPoint.set('timeData', 'timeStamp');
        generatingPoint.set('completeSeriesConfig',completeSeriesConfig);

        window.setTimeout(function() { done(); }, 100);
      });

      test('generatingPoint fixture is created', function() {
        assert.isTrue(generatingPoint !== null);
      });

      test('generatingPoint highlightData not created', function() {
        assert.isUndefined(generatingPoint._highlightData);
      });

      test('generatingPoint generating layer is not muted', function() {
        assert.isFalse(generatingSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var generatingScale,
          generatingSVG,
          generatingPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      generatingScale = document.getElementById('generatingScale');
      generatingSVG = document.getElementById('generatingSVG');
      generatingPoint = document.getElementById('generatingPoint');
        var d = {
            "rawData":[{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            }],
            "timeStamps": [1397160780000]
          };

        generatingPoint.set('generatingCrosshairData',true);
        generatingPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('generatingPoint does not create highlightData', function() {
        assert.equal(generatingPoint._highlightData, undefined);
      });

      test('generatingPoint generating layer does not mute', function() {
        assert.isFalse(generatingSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var generatingScale,
          generatingSVG,
          generatingPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      generatingScale = document.getElementById('generatingScale');
      generatingSVG = document.getElementById('generatingSVG');
      generatingPoint = document.getElementById('generatingPoint');
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        generatingPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('generatingPoint highlightData removed', function() {
        assert.deepEqual(generatingPoint._highlightData, []);
      });

      test('generatingPoint generating layer unmutes', function() {
        assert.isFalse(generatingSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite
  }); //suite


  suite('px-vis-highlight-point-canvas drawWithLocalCrosshairData ', function() {
    suite('px-vis-highlight-point-canvas setup works', function() {
      var forceScale,
          forceSVG,
          forcePoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      forceScale = document.getElementById('forceScale');
      forceSVG = document.getElementById('forceSVG');
      forcePoint = document.getElementById('forcePoint');
        var d = [{
              "x": 1,
              "timeStamp": 1397102460000,
              "y0": 1,
              "y1": 1
            },{
              "x": 2,
              "timeStamp": 1397131620000,
              "y0": 6,
              "y1": 3
            },{
              "x": 3,
              "timeStamp": 1397160780000,
              "y0": 4,
              "y1": 8
            },{
              "x": 4,
              "timeStamp": 1397189940000,
              "y0": 8,
              "y1": 4
            },{
              "x": 5,
              "timeStamp": 1397219100000,
              "y0": 6,
              "y1": 6
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y0",
              "color": colorSet[0]
            },
            "mySeries2":{
              "type":"line",
              "name":"mySeries2",
              "x":"x",
              "y":"y1",
              "color": colorSet[1]
            },
          },
          chartExtents = {"x":[1,5],"y":[0,10]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        forceSVG.set('width',w);
        forceSVG.set('height',h);
        forceSVG.set('margin',m);

        forceScale.set('width',w);
        forceScale.set('height',h);
        forceScale.set('margin',m);
        forceScale.set('completeSeriesConfig',completeSeriesConfig);
        forceScale.set('chartExtents',chartExtents);
        forceScale.set('dataExtents',chartExtents);
        forceScale.set('chartData',d);

        forcePoint.set('timeData', 'timeStamp');
        forcePoint.set('drawWithLocalCrosshairData',true);
        forcePoint.set('completeSeriesConfig',completeSeriesConfig);

        window.setTimeout(function() { done(); }, 100);
      });

      test('forcePoint fixture is created', function() {
        assert.isTrue(forcePoint !== null);
      });

      test('forcePoint highlightData not created', function() {
        assert.isUndefined(forcePoint._highlightData);
      });

      test('forcePoint force layer is not muted', function() {
        assert.isFalse(forceSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var forceScale,
          forceSVG,
          forcePoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      forceScale = document.getElementById('forceScale');
      forceSVG = document.getElementById('forceSVG');
      forcePoint = document.getElementById('forcePoint');
        var d = {
            "rawData":[{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            }],
            "timeStamps": [1397160780000]
          };

        forcePoint.set('generatingCrosshairData',true);
        forcePoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('forcePoint create highlightData', function() {
        assert.deepEqual(forcePoint._highlightData, [{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            }]);
      });

      test('forcePoint force layer mutes', function() {
        assert.isTrue(forceSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point-canvas mutes and draws', function() {
      var forceScale,
          forceSVG,
          forcePoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      forceScale = document.getElementById('forceScale');
      forceSVG = document.getElementById('forceSVG');
      forcePoint = document.getElementById('forcePoint');
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        forcePoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('forcePoint highlightData removed', function() {
        assert.deepEqual(forcePoint._highlightData, []);
      });

      test('forcePoint force layer unmutes', function() {
        assert.isFalse(forceSVG.canvasContext.canvas.classList.contains("secondaryDataMask"));
      });
    }); //suite
  }); //suite




    suite('px-vis-highlight-point creates tooltip data', function() {
    suite('px-vis-highlight-point setup works', function() {
      var tooltipScale,
          tooltipSVG,
          tooltipPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      tooltipScale = document.getElementById('tooltipScale');
      tooltipSVG = document.getElementById('tooltipSVG');
      tooltipPoint = document.getElementById('tooltipPoint');
        var d = [{
              "x": 1,
              "timeStamp": 1397102460000,
              "y0": 1,
              "y1": 1
            },{
              "x": 2,
              "timeStamp": 1397131620000,
              "y0": 6,
              "y1": 3
            },{
              "x": 3,
              "timeStamp": 1397160780000,
              "y0": 4,
              "y1": 8
            },{
              "x": 4,
              "timeStamp": 1397189940000,
              "y0": 8,
              "y1": 4
            },{
              "x": 5,
              "timeStamp": 1397219100000,
              "y0": 6,
              "y1": 6
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y0",
              "color": colorSet[0]
            },
            "mySeries2":{
              "type":"line",
              "name":"mySeries2",
              "x":"x",
              "y":"y1",
              "color": colorSet[1]
            },
          },
          chartExtents = {"x":[1,5],"y":[0,10]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        tooltipSVG.set('width',w);
        tooltipSVG.set('height',h);
        tooltipSVG.set('margin',m);

        tooltipScale.set('width',w);
        tooltipScale.set('height',h);
        tooltipScale.set('margin',m);
        tooltipScale.set('completeSeriesConfig',completeSeriesConfig);
        tooltipScale.set('chartExtents',chartExtents);
        tooltipScale.set('dataExtents',chartExtents);
        tooltipScale.set('chartData',d);

        tooltipPoint.set('seriesKeys', Object.keys(completeSeriesConfig));
        tooltipPoint.set('timeData', 'timeStamp');
        tooltipPoint.set('completeSeriesConfig',completeSeriesConfig);
        tooltipPoint.set('showTooltipData',true);

        window.setTimeout(function() { done(); }, 100);
      });

      test('tooltipPoint didnt create defaultEmptyData', function() {
        assert.isNull(tooltipPoint.defaultEmptyData);
      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var tooltipScale,
          tooltipSVG,
          tooltipPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      tooltipScale = document.getElementById('tooltipScale');
      tooltipSVG = document.getElementById('tooltipSVG');
      tooltipPoint = document.getElementById('tooltipPoint');
        var d = {
            "rawData":[{
              "timeStamp": 1397160780000,
              "x": 3,
              "y0": 4,
              "y1": 8
            }],
            "timeStamps": [1397160780000]
          };

        tooltipPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('tooltipPoint created defaultEmptyData', function() {
        assert.deepEqual(tooltipPoint.defaultEmptyData, {"time":1397160780000,"timeSeriesKey":null,"hidden":true,"series":[{"name":"mySeries","value":{"x":3,"y0":4},"coord":[240,162]},{"name":"mySeries2","value":{"x":3,"y1":8},"coord":[240,54]}],"seriesObj":{"mySeries":{"name":"mySeries","value":{"x":3,"y0":4},"coord":[240,162]},"mySeries2":{"name":"mySeries2","value":{"x":3,"y1":8},"coord":[240,54]}},"mouse":[240,162],"xArr":[],"yArr":[],"rawData":[],"timeStamps":[],"timeStampsTracker":{},"additionalPoints":[]});
      });

      test('tooltipPoint created tooltipData', function() {
        assert.deepEqual(tooltipPoint.tooltipData, {"time":1397160780000,"timeSeriesKey":null,"hidden":true,"series":[{"name":"mySeries","value":{"x":3,"y0":4},"coord":[240,162]},{"name":"mySeries2","value":{"x":3,"y1":8},"coord":[240,54]}],"seriesObj":{"mySeries":{"name":"mySeries","value":{"x":3,"y0":4},"coord":[240,162]},"mySeries2":{"name":"mySeries2","value":{"x":3,"y1":8},"coord":[240,54]}},"mouse":[240,162],"xArr":[],"yArr":[],"rawData":[],"timeStamps":[],"timeStampsTracker":{},"additionalPoints":[]});
      });

    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var tooltipScale,
          tooltipSVG,
          tooltipPoint;


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
      tooltipScale = document.getElementById('tooltipScale');
      tooltipSVG = document.getElementById('tooltipSVG');
      tooltipPoint = document.getElementById('tooltipPoint');
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        tooltipPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('tooltipPoint emptied defaultEmptyData', function() {
        assert.isNull(tooltipPoint.defaultEmptyData);
      });

      test('tooltipPoint emptied tooltipData', function() {
        assert.deepEqual(tooltipPoint.tooltipData,{"time":null,"timeSeriesKey":null,"hidden":true,"series":[{"name":"mySeries","value":null},{"name":"mySeries2","value":null}],"seriesObj":{},"mouse":null,"xArr":null,"yArr":null});
      });

    }); //suite
  }); //suite

} //runTests
