document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {
  suite('px-vis-highlight-line renders parallel axis highlight', function() {
    var parallel = document.getElementById('parallel'),
        parallelCanvas = parallel.$.canvas,
        parallelhighlight = parallel.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;


    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y3": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y3": 14,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y3": 8,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y3": 12,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            "y3": 14,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2', 'y3'],
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

        parallel.set('width',w);
        parallel.set('height',h);
        parallel.set('margin',m);
        parallel.set('canvasLayersConfig.highlighter', {});
        parallel.set('seriesKey', 'x');
        parallel.set('catagories',categories);
        parallel.set('catagoryKey','cat');
        parallel.set('completeSeriesConfig',completeSeriesConfig);
        parallel.set('chartData',d);
        parallel.set('axes',dim);
        parallel.set('dimensions',dim);
        parallel.set('preventInitialDrawing',false);

        window.setTimeout(function() { done(); }, 100);
      });

    test('parallelhighlight fixture is created', function() {
      assert.isTrue(parallelhighlight !== null);
    });

    test('line within parallelhighlight is created', function() {
      assert.isTrue(parallelhighlight.$.myHighlighter !== null);
    });

    test('parallelhighlight highlightData not created', function() {
      assert.isUndefined(parallelhighlight._highlightData);
    });

    test('parallelhighlight base layer is not muted', function() {
      assert.isFalse(parallelCanvas.canvasContext.canvas.classList.contains("secondaryDataMask"));
    });

    test('parallelhighlight has transition', function() {
      assert.equal(parallelCanvas.canvasContext.canvas.style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('parallelhighlight didnt create defaultEmptyData', function() {
      assert.isNull(parallelhighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var parallel = document.getElementById('parallel'),
        parallelCanvas = parallel.$.canvas,
        parallelhighlight = parallel.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }],
            "timeStamps": [1397160780000]
          };

      parallel.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(parallelCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('_highlightData is created', function() {
      assert.deepEqual(parallelhighlight._highlightData, [{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }]);
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var parallel = document.getElementById('parallel'),
        parallelCanvas = parallel.$.canvas,
        parallelhighlight = parallel.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      parallelhighlight.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(parallelCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(parallelhighlight._highlightData, []);
    });
  }); //suite









  suite('px-vis-highlight-line renders radar axis highlight', function() {
    var radar = document.getElementById('radar'),
        radarCanvas = radar.$.canvas,
        radarhighlight = radar.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y3": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y3": 14,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y3": 8,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y3": 12,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            "y3": 14,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2', 'y3'],
        chartExtents = { "x": ['y','y2','y3'], "y": [0,27] },
        categories = ['a','b'],
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      radar.set('width',w);
      radar.set('height',h);
      radar.set('margin',m);
      radar.set('offset',offset);
      radar.set('_radius',min);
      radar.set('centerOffset',50);
      radar.set('canvasLayersConfig.highlighter', {});
      radar.set('catagories',categories);
      radar.set('catagoryKey','cat');
      radar.set('seriesKey', 'x');
      radar.set('completeSeriesConfig',completeSeriesConfig);
      radar.set('chartData',d);
      radar.set('axes',dim);
      radar.set('dimensions',dim);
      radar.set('preventInitialDrawing',false);

      window.setTimeout(function() { done(); }, 100);

    });

    test('radarhighlight fixture is created', function() {
      assert.isTrue(radarhighlight !== null);
    });

    test('line within radarhighlight is created', function() {
      assert.isTrue(radarhighlight.$.myHighlighter !== null);
    });

    test('radarhighlight highlightData not created', function() {
      assert.isUndefined(radarhighlight._highlightData);
    });

    test('radarhighlight base layer is not muted', function() {
      assert.isFalse(radarCanvas.canvasContext.canvas.classList.contains("secondaryDataMask"));
    });

    test('radarhighlight didnt create defaultEmptyData', function() {
      assert.isNull(radarhighlight.defaultEmptyData);
    });

  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var radar = document.getElementById('radar'),
        radarCanvas = radar.$.canvas,
        radarhighlight = radar.$.highlighter;

    suiteSetup(function(done){
      var d = {
        "rawData":[{
          "x": 1397160780000,
          "y": 10,
          "y2": 3,
          "y3": 8,
          'cat': 'b'
        }],
        "timeStamps": [1397160780000]
      };

      radar.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(radarCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('_highlightData is created', function() {
      assert.deepEqual(radarhighlight._highlightData, [{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }]);
      });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var radar = document.getElementById('radar'),
        radarCanvas = radar.$.canvas,
        radarhighlight = radar.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      radar.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(radarCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(radarhighlight._highlightData, []);
    });
  }); //suite









  suite('px-vis-highlight-line renders different dataset highlight', function() {
    var different = document.getElementById('different'),
        differentCanvas = different.$.canvas,
        differenthighlight = different.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;


    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y3": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y3": 14,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y3": 8,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y3": 12,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            "y3": 14,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2', 'y3'],
        chartExtents = {"x": ['y','y2','y3'], "y": {'y': [0,10], 'y2':[0,27], 'y3':[0,14] }},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      different.set('differentDataset',true);
      different.set('width',w);
      different.set('height',h);
      different.set('margin',m);
      different.set('canvasLayersConfig.highlighter', {});
      different.set('seriesKey', 'x');
      different.set('catagories',categories);
      different.set('catagoryKey','cat');
      different.set('completeSeriesConfig',completeSeriesConfig);
      different.set('chartData',d);
      different.set('axes',dim);
      different.set('dimensions',dim);
      different.set('preventInitialDrawing',false);

      window.setTimeout(function() { done(); }, 100);
    });

    test('differenthighlight fixture is created', function() {
      assert.isTrue(differenthighlight !== null);
    });

    test('line within differenthighlight is created', function() {
      assert.isTrue(differenthighlight.$.myHighlighter !== null);
    });

    test('differenthighlight highlightData not created', function() {
      assert.isUndefined(differenthighlight._highlightData);
    });

    test('differenthighlight base layer is not muted', function() {
      assert.isFalse(differentCanvas.canvasContext.canvas.classList.contains("secondaryDataMask"));
    });

    test('differenthighlight has transition', function() {
      assert.equal(differentCanvas.canvasContext.canvas.style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('differenthighlight didnt create defaultEmptyData', function() {
      assert.isNull(differenthighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var different = document.getElementById('different'),
        differentCanvas = different.$.canvas,
        differenthighlight = different.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[{
              "x": 1397160780000,
              "y": 100,
              "y2": 100,
              "y3": 100,
              'cat': 'b'
            }],
            "timeStamps": [1397160780000]
          };

      different.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(differentCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

     test('_highlightData is created', function() {
      assert.deepEqual(differenthighlight._highlightData, [{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }]);
      });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var different = document.getElementById('different'),
        differentCanvas = different.$.canvas,
        differenthighlight = different.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      different.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(differentCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(differenthighlight._highlightData, []);
    });
  }); //suite







  suite('px-vis-highlight-line renders fuzz dataset highlight', function() {
    var fuzz = document.getElementById('fuzz'),
        fuzzCanvas = fuzz.$.canvas,
        fuzzhighlight = fuzz.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;


    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y3": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y3": 14,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y3": 8,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y3": 12,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            "y3": 14,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2', 'y3'],
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      fuzz.set('differentDataset',true);
      fuzz.set('fuzz',30000000);
      fuzz.set('width',w);
      fuzz.set('height',h);
      fuzz.set('margin',m);
      fuzz.set('canvasLayersConfig.highlighter', {});
      fuzz.set('seriesKey', 'x');
      fuzz.set('catagories',categories);
      fuzz.set('catagoryKey','cat');
      fuzz.set('completeSeriesConfig',completeSeriesConfig);
      fuzz.set('chartData',d);
      fuzz.set('axes',dim);
      fuzz.set('dimensions',dim);
      fuzz.set('preventInitialDrawing',false);

      window.setTimeout(function() { done(); }, 100);
    });

    test('fuzzhighlight fixture is created', function() {
      assert.isTrue(fuzzhighlight !== null);
    });

    test('line within fuzzhighlight is created', function() {
      assert.isTrue(fuzzhighlight.$.myHighlighter !== null);
    });

    test('fuzzhighlight highlightData not created', function() {
      assert.isUndefined(fuzzhighlight._highlightData);
    });

    test('fuzzhighlight base layer is not muted', function() {
      assert.isFalse(fuzzCanvas.canvasContext.canvas.classList.contains("secondaryDataMask"));
    });

    test('fuzzhighlight has transition', function() {
      assert.equal(fuzzCanvas.canvasContext.canvas.style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('fuzzhighlight didnt create defaultEmptyData', function() {
      assert.isNull(fuzzhighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var fuzz = document.getElementById('fuzz'),
        fuzzCanvas = fuzz.$.canvas,
        fuzzhighlight = fuzz.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[{
              "x": 1397160800000,
              "y": 100,
              "y2": 100,
              "y3": 100,
              'cat': 'b'
            }],
            "timeStamps": [1397160800000]
          };

      fuzz.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(fuzzCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

     test('_highlightData is created', function() {
      assert.deepEqual(fuzzhighlight._highlightData, [{
          "x": 1397131620000,
          "y": 6,
          "y2": 21,
          "y3": 14,
          'cat': 'a'
        },{
          "x": 1397160780000,
          "y": 10,
          "y2": 3,
          "y3": 8,
          'cat': 'b'
        },{
          "x": 1397189940000,
          "y": 4,
          "y2": 10,
          "y3": 12,
          'cat': 'a'
        }]);
      });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var fuzz = document.getElementById('fuzz'),
        fuzzCanvas = fuzz.$.canvas,
        fuzzhighlight = fuzz.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      fuzz.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(fuzzCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(fuzzhighlight._highlightData, []);
    });
  }); //suite









  suite('px-vis-highlight-line renders generating crosshair data axis highlight', function() {
    var generating = document.getElementById('generating'),
        generatingCanvas = generating.$.canvas,
        generatinghighlight = generating.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;


    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y3": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y3": 14,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y3": 8,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y3": 12,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            "y3": 14,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2', 'y3'],
        chartExtents = {"x": ['y','y2','y3'], "y": {'y': [0,10], 'y2':[0,27], 'y3':[0,14] }},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      generating.set('width',w);
      generating.set('height',h);
      generating.set('margin',m);
      generating.set('canvasLayersConfig.highlighter', {});
      generating.set('seriesKey', 'x');
      generating.set('catagories',categories);
      generating.set('catagoryKey','cat');
      generating.set('completeSeriesConfig',completeSeriesConfig);
      generating.set('chartData',d);
      generating.set('axes',dim);
      generating.set('dimensions',dim);
      generating.set('preventInitialDrawing',false);

      window.setTimeout(function() { done(); }, 100);
    });

    test('generatinghighlight fixture is created', function() {
      assert.isTrue(generatinghighlight !== null);
    });

    test('line within generatinghighlight is created', function() {
      assert.isTrue(generatinghighlight.$.myHighlighter !== null);
    });

    test('generatinghighlight highlightData not created', function() {
      assert.isUndefined(generatinghighlight._highlightData);
    });

    test('generatinghighlight base layer is not muted', function() {
      assert.isFalse(generatingCanvas.canvasContext.canvas.classList.contains("secondaryDataMask"));
    });

    test('generatinghighlight has transition', function() {
      assert.equal(generatingCanvas.canvasContext.canvas.style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('generatinghighlight didnt create defaultEmptyData', function() {
      assert.isNull(generatinghighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var generating = document.getElementById('generating'),
        generatingCanvas = generating.$.canvas,
        generatinghighlight = generating.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }],
            "timeStamps": [1397160780000]
          };

      generating.set('generatingCrosshairData',true);
      generating.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer gets masked', function() {
      assert.isFalse(generatingCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('generatinghighlight highlightData not created', function() {
      assert.equal(generatinghighlight._highlightData, undefined);
    });

  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var generating = document.getElementById('generating'),
        generatingCanvas = generating.$.canvas,
        generatinghighlight = generating.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      generating.set("generatingCrosshairData", false);
      generating.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(generatingCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(generatinghighlight._highlightData, []);
    });
  }); //suite












  suite('px-vis-highlight-line forces display when generatingCrosshairData', function() {
    var force = document.getElementById('force'),
        forceCanvas = force.$.canvas,
        forcehighlight = force.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;


    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y3": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y3": 14,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y3": 8,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y3": 12,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            "y3": 14,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2', 'y3'],
        chartExtents = {"x": ['y','y2','y3'], "y": {'y': [0,10], 'y2':[0,27], 'y3':[0,14] }},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      force.set('drawWithLocalCrosshairData',true);
      force.set('width',w);
      force.set('height',h);
      force.set('margin',m);
      force.set('canvasLayersConfig.highlighter', {});
      force.set('seriesKey', 'x');
      force.set('catagories',categories);
      force.set('catagoryKey','cat');
      force.set('completeSeriesConfig',completeSeriesConfig);
      force.set('chartData',d);
      force.set('axes',dim);
      force.set('dimensions',dim);
      force.set('preventInitialDrawing',false);

      window.setTimeout(function() { done(); }, 100);

    });

    test('forcehighlight fixture is created', function() {
      assert.isTrue(forcehighlight !== null);
    });

    test('line within forcehighlight is created', function() {
      assert.isTrue(forcehighlight.$.myHighlighter !== null);
    });

    test('forcehighlight highlightData not created', function() {
      assert.isUndefined(forcehighlight._highlightData);
    });

    test('forcehighlight base layer is not muted', function() {
      assert.isFalse(forceCanvas.canvasContext.canvas.classList.contains("secondaryDataMask"));
    });

    test('forcehighlight has transition', function() {
      assert.equal(forceCanvas.canvasContext.canvas.style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('forcehighlight didnt create defaultEmptyData', function() {
      assert.isNull(forcehighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var force = document.getElementById('force'),
        forceCanvas = force.$.canvas,
        forcehighlight = force.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }],
            "timeStamps": [1397160780000]
          };

      force.setAttribute("generatingCrosshairData", true);
      force.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(forceCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('_highlightData is created', function() {
      assert.deepEqual(forcehighlight._highlightData, [{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }]);
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var force = document.getElementById('force'),
        forceCanvas = force.$.canvas,
        forcehighlight = force.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      force.setAttribute("generatingCrosshairData", false);
      force.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(forceCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(forcehighlight._highlightData, []);
    });
  }); //suite












  suite('px-vis-highlight-line creates tooltipData', function() {
    var tooltip = document.getElementById('tooltip'),
        tooltipCanvas = tooltip.$.canvas,
        tooltiphighlight = tooltip.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;


    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y3": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y3": 14,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y3": 8,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y3": 12,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            "y3": 14,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2', 'y3'],
            "y":['y','y2', 'y3'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2', 'y3'],
        chartExtents = {"x": ['y','y2','y3'], "y": {'y': [0,10], 'y2':[0,27], 'y3':[0,14] }},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      tooltip.set('showTooltipData',true);
      tooltip.set('width',w);
      tooltip.set('height',h);
      tooltip.set('margin',m);
      tooltip.set('canvasLayersConfig.highlighter', {});
      tooltip.set('seriesKey', 'x');
      tooltip.set('catagories',categories);
      tooltip.set('catagoryKey','cat');
      tooltip.set('completeSeriesConfig',completeSeriesConfig);
      tooltip.set('chartData',d);
      tooltip.set('axes',dim);
      tooltip.set('dimensions',dim);
      tooltip.set('preventInitialDrawing',false);

      window.setTimeout(function() {
        tooltiphighlight.set('canvasContext', tooltipCanvas.canvasLayers.highlighter);
        done();
      }, 100);

    });

    test('tooltiphighlight fixture is created', function() {
      assert.isTrue(tooltiphighlight !== null);
    });

    test('tooltiphighlight highlightData not created', function() {
      assert.isUndefined(tooltiphighlight._highlightData);
    });

    test('tooltiphighlight didnt create defaultEmptyData', function() {
        assert.isNull(tooltiphighlight.defaultEmptyData);
      });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var tooltip = document.getElementById('tooltip'),
        tooltipCanvas = tooltip.$.canvas,
        tooltiphighlight = tooltip.$.highlighter;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;


    suiteSetup(function(done){
      var d = {
            "rawData":[{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }],
            "timeStamps": [1397160780000]
          };

      tooltip.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('_highlightData is created', function() {
      assert.deepEqual(tooltiphighlight._highlightData, [{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 8,
              'cat': 'b'
            }]);
    });

    test('tooltiphighlight created defaultEmptyData', function() {

      assert.equal(tooltiphighlight.defaultEmptyData.mouse, null);
      assert.equal(tooltiphighlight.defaultEmptyData.dataPos[0], 423);
      assert.closeTo(tooltiphighlight.defaultEmptyData.dataPos[1], 2190, 4);
      assert.equal(tooltiphighlight.defaultEmptyData.time, 1397160780000);
      assert.deepEqual(tooltiphighlight.defaultEmptyData.dataset, {"x":1397160780000,"y":10,"y2":3,"y3":8,"cat":"b"});
      assert.deepEqual(tooltiphighlight.defaultEmptyData.series, [{"name":"y","value":{"y":10,"y2":3,"y3":8}},{"name":"y2","value":{"y":10,"y2":3,"y3":8}},{"name":"y3","value":{"y":10,"y2":3,"y3":8}}]);
      assert.equal(tooltiphighlight.defaultEmptyData.color.split(" ").join(""), colorSet[0].split(" ").join(""));
      assert.deepEqual(tooltiphighlight.defaultEmptyData.tooltipConfig, {"y":{"color":colorSet[0].split(" ").join(""),"name":"y","yAxisUnit":"","y":"y"},"y2":{"color":colorSet[0].split(" ").join(""),"name":"y2","yAxisUnit":"","y":"y2"},"y3":{"color":colorSet[0].split(" ").join(""),"name":"y3","yAxisUnit":"","y":"y3"}});
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var tooltip = document.getElementById('tooltip'),
        tooltipCanvas = tooltip.$.canvas,
        tooltiphighlight = tooltip.$.highlighter;

    suiteSetup(function(done){
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      tooltip.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(tooltipCanvas.canvasContext.canvas.classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(tooltiphighlight._highlightData, []);
    });
  }); //suite

}
