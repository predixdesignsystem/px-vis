document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-worker-scale exist?', function() {
    test('worker exists', function() {
      assert.deepEqual(extentCalc._defaultScaleValue, {
          "x": [Infinity, -Infinity],
          "y": [0, -Infinity]
        });
    });
  });

  suite('determineExtents', function() {
    var sandbox, checkForExtents, calcMultiAxisExtents, findMinMax,
        data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }];

    suiteSetup(function(){
      sandbox = sinon.sandbox.create();

      var checkForExtentsFn = function(ord, chartExtents, dataExtents, axis) {
        if(ord && axis === 'x') {
          return ['a','b','c'];
        }

        if(ord && axis === 'y') {
          return ['d','e','f'];
        }

        if(chartExtents && chartExtents.x && chartExtents.y) {
          return chartExtents[axis];
        }

        if(!ord) {
          return [Infinity, -Infinity];
        }

        return "error"
      };

      var findMinMaxFn = function(data, doX, doY, xOrd, yOrd, xTime, extents, keys) {
        if(xTime) {
          extents.x = [1234567890, 1234567892];
        }
      };


      checkForExtents = sandbox.stub(extentCalc, '_checkForExtents', checkForExtentsFn);
      calcMultiAxisExtents = sandbox.stub(extentCalc, '_calcMultiAxisExtents');
      findMinMax = sandbox.stub(extentCalc, '_findMinMax', findMinMaxFn);

      calcMultiAxisExtents.returns({ a1: [ -10, 10], a2: [0, 100] })

      extentCalc.completeSeriesConfig = {
        y0: { x: 'timeStamp', y: 'y0' },
        y1: { x: 'timeStamp', y: 'y1' },
        y2: { x: 'timeStamp', y: 'y2' }
      };

      extentCalc.chartExtents = [];
      extentCalc.dataExtents = [];
    });

    suiteTeardown(function() {
      sandbox.restore();
    })

    test('ordinal x and y', function() {
      sandbox.reset();
      extentCalc.xAxisType = 'ordinal';
      extentCalc.yAxisType = 'ordinal';
      extentCalc.axes = [];

      var exts = extentCalc.determineExtents(data);

      assert.isTrue(checkForExtents.called);
      assert.isFalse(calcMultiAxisExtents.called);
      assert.isFalse(findMinMax.called);

      assert.deepEqual(exts, {
        x: ['a','b','c'],
        y: ['d','e','f']
      });
    });

    test('scaleBand x and y', function() {
      sandbox.reset();
      extentCalc.xAxisType = 'scaleBand';
      extentCalc.yAxisType = 'scaleBand';
      extentCalc.axes = [];

      var exts = extentCalc.determineExtents(data);

      assert.isTrue(checkForExtents.called);
      assert.isFalse(calcMultiAxisExtents.called);
      assert.isFalse(findMinMax.called);

      assert.deepEqual(exts, {
        x: ['a','b','c'],
        y: ['d','e','f']
      });
    });

    test('ordinal x and linear y', function() {
      sandbox.reset();
      extentCalc.xAxisType = 'ordinal';
      extentCalc.yAxisType = 'linear';
      extentCalc.axes = [];

      var exts = extentCalc.determineExtents(data);

      assert.isTrue(checkForExtents.called);
      assert.isFalse(calcMultiAxisExtents.called);
      assert.isTrue(findMinMax.called);

      assert.isFalse(findMinMax.args[0][1]);
      assert.isTrue(findMinMax.args[0][2]);
      assert.isTrue(findMinMax.args[0][3]);
      assert.isFalse(findMinMax.args[0][4]);
      assert.isFalse(findMinMax.args[0][5]);

      assert.deepEqual(exts, {
        x: ['a','b','c'],
        y: [0,1]
      });
    });

    test('time x and linear y', function() {
      sandbox.reset();
      extentCalc.xAxisType = 'time';
      extentCalc.yAxisType = 'linear';
      extentCalc.axes = [];

      var exts = extentCalc.determineExtents(data);

      assert.isTrue(checkForExtents.called);
      assert.isFalse(calcMultiAxisExtents.called);
      assert.isTrue(findMinMax.called);

      assert.isFalse(findMinMax.args[0][1]);
      assert.isTrue(findMinMax.args[0][2]);
      assert.isFalse(findMinMax.args[0][3]);
      assert.isFalse(findMinMax.args[0][4]);
      assert.isTrue(findMinMax.args[0][5]);

      assert.deepEqual(exts, {
        x: [1234567890, 1234567892],
        y: [0,1]
      });
    });

    test('linear x and linear y: sets Infinite to a default val', function() {
      sandbox.reset();
      extentCalc.xAxisType = 'linear';
      extentCalc.yAxisType = 'linear';
      extentCalc.axes = [];

      var exts = extentCalc.determineExtents(data);

      assert.isTrue(checkForExtents.called);
      assert.isFalse(calcMultiAxisExtents.called);
      assert.isTrue(findMinMax.called);

      assert.isTrue(findMinMax.args[0][1]);
      assert.isTrue(findMinMax.args[0][2]);
      assert.isFalse(findMinMax.args[0][3]);
      assert.isFalse(findMinMax.args[0][4]);
      assert.isFalse(findMinMax.args[0][5]);

      assert.deepEqual(exts, {
        x: [0,1],
        y: [0,1]
      });
    });

    test('linear x and linear y: sets same val to new val', function() {
      sandbox.reset();
      extentCalc.xAxisType = 'linear';
      extentCalc.yAxisType = 'linear';
      extentCalc.axes = [];
      extentCalc.chartExtents = { x: [20, 20], y: [10, 10] };

      var exts = extentCalc.determineExtents(data);

      assert.isTrue(checkForExtents.called);
      assert.isFalse(calcMultiAxisExtents.called);
      assert.isFalse(findMinMax.called);

      assert.deepEqual(exts, {
        x: [20,21],
        y: [10,11]
      });
    });


    test('_calcMultiAxisExtents', function() {
      sandbox.reset();
      extentCalc.xAxisType = 'linear';
      extentCalc.yAxisType = 'linear';
      extentCalc.axes = ['a1', 'a2'];

      var exts = extentCalc.determineExtents(data);

      assert.isTrue(checkForExtents.called);
      assert.isTrue(calcMultiAxisExtents.called);
      assert.isFalse(findMinMax.called);

      assert.deepEqual(exts.y, { a1: [ -10, 10], a2: [0, 100] });
    });

  }); //suite

  suite('_checkForExtents', function() {
    test('_checkForExtents works with ordinal data extents', function() {
      var dataExtents = { "y": ['a', 'b', 'c'] },
          chartExtents = { },
          axis = "y",
          isOrd = true;

      var exts = extentCalc._checkForExtents(isOrd, chartExtents, dataExtents, axis);
      assert.deepEqual(exts, ['a', 'b', 'c']);
    });

    test('_checkForExtents works with ordinal chart extents', function() {
      var dataExtents = { "y": ['a', 'b', 'c'] },
          chartExtents = { "y": ['d', 'e', 'f'] },
          axis = "y",
          isOrd = true;

      var exts = extentCalc._checkForExtents(isOrd, chartExtents, dataExtents, axis);
      assert.deepEqual(exts,  ['d', 'e', 'f']);
    });

    test('_checkForExtents returns defaults', function() {
      var dataExtents = { },
          chartExtents = { },
          axis = "y",
          isOrd = false;

      var exts = extentCalc._checkForExtents(isOrd, chartExtents, dataExtents, axis);
      assert.deepEqual(exts, [0, -Infinity]);
    });

    test('_checkForExtents works with data extents', function() {
      var dataExtents = { "y": [0, 20] },
          chartExtents = { },
          axis = "y",
          isOrd = false;

      var exts = extentCalc._checkForExtents(isOrd, chartExtents, dataExtents, axis);
      assert.deepEqual(exts, [0, 20]);
    });

    test('_checkForExtents works with chart extents', function() {
      var dataExtents = { },
          chartExtents = { "y": [5, 10] },
          axis = "y",
          isOrd = false;

      var exts = extentCalc._checkForExtents(isOrd, chartExtents, dataExtents, axis);
      assert.deepEqual(exts, [5, 10]);
    });
  }); //suite

  suite('_checkChartExtents', function() {
    test('_checkChartExtents converts "dynamic"', function() {
      var chartExtents = { "y": ["dynamic", "dynamic"]};
      var exts = extentCalc._checkChartExtents(chartExtents, "y");
      assert.deepEqual(exts, [Infinity, -Infinity]);
    });

    test('_checkChartExtents converts keeps a min val', function() {
      var chartExtents = { "y": [10, "dynamic"]};
      var exts = extentCalc._checkChartExtents(chartExtents, "y");
      assert.deepEqual(exts, [10, -Infinity]);
    });

    test('_checkChartExtents converts keeps a max val', function() {
      var chartExtents = { "y": ["dynamic", 10]};
      var exts = extentCalc._checkChartExtents(chartExtents, "y");
      assert.deepEqual(exts, [Infinity, 10]);
    });
  }); //suite

  suite('_checkDataExtents', function() {
    test('_checkDataExtents returns default ext if dataExtnts are malformed', function() {
      var dataExtents = { },
          chartExtents = { "y": ["dynamic", "dynamic"]},
          axis = "y",
          extsFromCE = true;

      var exts = extentCalc._checkDataExtents(dataExtents, chartExtents, axis, extsFromCE, [5, 10]);
      assert.deepEqual(exts, [5, 10]);
    });

    test('_checkDataExtents is used if chartExtents are dynamic', function() {
      var dataExtents = { "y": [0, 20] },
          chartExtents = { "y": ["dynamic", "dynamic"] },
          axis = "y",
          extsFromCE = true;

      var exts = extentCalc._checkDataExtents(dataExtents, chartExtents, axis, extsFromCE, [Infinity, -Infinity]);
      assert.deepEqual(exts, [0, 20]);
    });

    test('_checkDataExtents is not used if chartExtents are set', function() {
      var dataExtents = { "y": [0, 20] },
          chartExtents = { "y": [5, 10] },
          axis = "y",
          extsFromCE = true;

      var exts = extentCalc._checkDataExtents(dataExtents, chartExtents, axis, extsFromCE, [Infinity, -Infinity]);
      assert.deepEqual(exts, [5, 10]);
    });

    test('_checkDataExtents is used if there are no chartExtents', function() {
      var dataExtents = { "y": [-10, 20] },
          chartExtents = { },
          axis = "y",
          extsFromCE = false;

      var exts = extentCalc._checkDataExtents(dataExtents, chartExtents, axis, extsFromCE, []);
      assert.deepEqual(exts, [-10, 20]);
    });

    test('_checkDataExtents is compared to the _defaultScaleValue', function() {
      var dataExtents = { "y": [5, 20] },
          chartExtents = { },
          axis = "y",
          extsFromCE = false;

      var exts = extentCalc._checkDataExtents(dataExtents, chartExtents, axis, extsFromCE, []);
      assert.deepEqual(exts, [0, 20]);
    });

  }); //suite

  suite('_findMinMax', function() {
    var sandbox, findTimeMM, processDataValues;
    suiteSetup(function(){
      sandbox = sinon.sandbox.create();
      findTimeMM = sandbox.spy(extentCalc, '_findTimeMM');
      processDataValues = sandbox.spy(extentCalc, '_processDataValues');

      extentCalc.completeSeriesConfig = {
        y0: { x: 'timeStamp', y: 'y0' },
        y1: { x: 'timeStamp', y: 'y1' },
        y2: { x: 'timeStamp', y: 'y2' }
      };
    });

    suiteTeardown(function() {
      sandbox.restore();
    })

    test('_findMinMax calls _findTimeMM when timeX = true', function() {
      sandbox.reset();

      var data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }],
          doX = false,
          doY = false,
          ordX = false,
          ordY = false,
          timeX = true,
          keys = ['y0', 'y1', 'y2'],
          result  = {
            'x': [Infinity, -Infinity],
            'y': [Infinity, -Infinity]
          };
      extentCalc._findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys);

      assert.isTrue(findTimeMM.called);
      assert.isFalse(processDataValues.called);
      assert.isTrue(findTimeMM.args[0][4]);
      assert.isTrue(findTimeMM.args[0][5]);
    });

    test('_findMinMax calls _findTimeMM when timeX = true with non-default extents', function() {
      sandbox.reset();

      var data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }],
          doX = false,
          doY = false,
          ordX = false,
          ordY = false,
          timeX = true,
          keys = ['y0', 'y1', 'y2'],
          result  = {
            'x': [5, 10],
            'y': [Infinity, -Infinity]
          };
      extentCalc._findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys);

      assert.isTrue(findTimeMM.called);
      assert.isFalse(processDataValues.called);
      assert.isFalse(findTimeMM.args[0][4]);
      assert.isFalse(findTimeMM.args[0][5]);
    });

    test('_findMinMax calls processDataValues when doX is true', function() {
      sandbox.reset();

      var data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }],
          doX = true,
          doY = false,
          ordX = false,
          ordY = false,
          timeX = false,
          keys = ['y0', 'y1', 'y2'],
          result  = {
            'x': [Infinity, -Infinity],
            'y': [Infinity, -Infinity]
          };
      extentCalc._findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys);

      assert.isFalse(findTimeMM.called);
      assert.equal(processDataValues.callCount, 3);

      assert.equal(processDataValues.args[0][4], 'timeStamp');
      assert.equal(processDataValues.args[0][5], 0);
      assert.isTrue(processDataValues.args[0][6]);
      assert.isTrue(processDataValues.args[0][7]);
      assert.equal(processDataValues.args[0][8], 1234567890);
      assert.equal(processDataValues.args[0][9], 1234567890);

      assert.equal(processDataValues.args[1][4], 'timeStamp');
      assert.equal(processDataValues.args[1][5], 1);
      assert.isTrue(processDataValues.args[1][6]);
      assert.isTrue(processDataValues.args[1][7]);
      assert.equal(processDataValues.args[1][8], 1234567891);
      assert.equal(processDataValues.args[1][9], 1234567891);

      assert.equal(processDataValues.args[2][4], 'timeStamp');
      assert.equal(processDataValues.args[2][5], 2);
      assert.isTrue(processDataValues.args[2][6]);
      assert.isTrue(processDataValues.args[2][7]);
      assert.equal(processDataValues.args[2][8], 1234567892);
      assert.equal(processDataValues.args[2][9], 1234567892);
    });

    test('_findMinMax calls processDataValues when doX is true and non-defaul extents', function() {
      sandbox.reset();

      var data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }],
          doX = true,
          doY = false,
          ordX = false,
          ordY = false,
          timeX = false,
          keys = ['y0', 'y1', 'y2'],
          result  = {
            'x': [5, 10],
            'y': [Infinity, -Infinity]
          };
      extentCalc._findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys);

      assert.isFalse(findTimeMM.called);
      assert.equal(processDataValues.callCount, 3);

      assert.isFalse(processDataValues.args[0][6]);
      assert.isFalse(processDataValues.args[0][7]);
      assert.isFalse(processDataValues.args[1][6]);
      assert.isFalse(processDataValues.args[1][7]);
      assert.isFalse(processDataValues.args[2][6]);
      assert.isFalse(processDataValues.args[2][7]);
    });

    test('_findMinMax calls processDataValues when doY is true', function() {
      sandbox.reset();

      var data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }],
          doX = false,
          doY = true,
          ordX = false,
          ordY = false,
          timeX = false,
          keys = ['y0', 'y1', 'y2'],
          result  = {
            'x': [Infinity, -Infinity],
            'y': [Infinity, -Infinity]
          };
      extentCalc._findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys);

      assert.isFalse(findTimeMM.called);
      assert.equal(processDataValues.callCount, 3);

      assert.equal(processDataValues.args[0][4], 'y0');
      assert.equal(processDataValues.args[0][5], 0);
      assert.isTrue(processDataValues.args[0][6]);
      assert.isTrue(processDataValues.args[0][7]);
      assert.equal(processDataValues.args[0][8], 1);
      assert.equal(processDataValues.args[0][9], 3);

      assert.equal(processDataValues.args[1][4], 'y0');
      assert.equal(processDataValues.args[1][5], 1);
      assert.isTrue(processDataValues.args[1][6]);
      assert.isTrue(processDataValues.args[1][7]);
      assert.equal(processDataValues.args[1][8], 5);
      assert.equal(processDataValues.args[1][9], 7);

      assert.equal(processDataValues.args[2][4], 'y0');
      assert.equal(processDataValues.args[2][5], 2);
      assert.isTrue(processDataValues.args[2][6]);
      assert.isTrue(processDataValues.args[2][7]);
      assert.equal(processDataValues.args[2][8], 2);
      assert.equal(processDataValues.args[2][9], 4);
    });

    test('_findMinMax calls processDataValues when doY is true and non-default extents', function() {
      sandbox.reset();

      var data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }],
          doX = false,
          doY = true,
          ordX = false,
          ordY = false,
          timeX = false,
          keys = ['y0', 'y1', 'y2'],
          result  = {
            'x': [Infinity, -Infinity],
            'y': [5, 10]
          };
      extentCalc._findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys);

      assert.isFalse(findTimeMM.called);
      assert.equal(processDataValues.callCount, 3);

      assert.isFalse(processDataValues.args[0][6]);
      assert.isFalse(processDataValues.args[0][7]);
      assert.isFalse(processDataValues.args[1][6]);
      assert.isFalse(processDataValues.args[1][7]);
      assert.isFalse(processDataValues.args[2][6]);
      assert.isFalse(processDataValues.args[2][7]);
    });

    test('_findMinMax calls processDataValues when with ordinal vals', function() {
      sandbox.reset();

      var data = [{
            "timeStamp": 1234567890,
            "y0": 1,
            "y1": 2,
            "y2": 3
          }, {
            "timeStamp": 1234567891,
            "y0": 5,
            "y1": 6,
            "y2": 7
          }, {
            "timeStamp": 1234567892,
            "y0": 2,
            "y1": 3,
            "y2": 4
          }],
          doX = true,
          doY = true,
          ordX = true,
          ordY = true,
          timeX = false,
          keys = ['y0', 'y1', 'y2'],
          result  = {
            'x': [5, 10],
            'y': [5, 10]
          };
      extentCalc._findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys);

      assert.isFalse(findTimeMM.called);
      assert.equal(processDataValues.callCount, 6);

      assert.isFalse(processDataValues.args[0][6]);
      assert.isFalse(processDataValues.args[0][7]);
      assert.isFalse(processDataValues.args[1][6]);
      assert.isFalse(processDataValues.args[1][7]);
      assert.isFalse(processDataValues.args[2][6]);
      assert.isFalse(processDataValues.args[2][7]);
      assert.isFalse(processDataValues.args[3][6]);
      assert.isFalse(processDataValues.args[3][7]);
      assert.isFalse(processDataValues.args[4][6]);
      assert.isFalse(processDataValues.args[4][7]);
      assert.isFalse(processDataValues.args[5][6]);
      assert.isFalse(processDataValues.args[5][7]);
    });
  }); //suite

  suite('_getDataExtents', function() {
    suiteSetup(function() {
      extentCalc.completeSeriesConfig = {
        y0: { 'y': 'y0' },
        y1: { 'y': 'y1' },
        y2: { 'y': 'y2' },
        y3: { 'y': 'y3' }
      };
    });

    test('_getDataExtents extracts min and max vals', function() {
      var dataset = { time: 1234566789, y0: 5, y1: 10, y2: 7, y3: 9},
          keys = ['y0', 'y1', 'y2', 'y3'];

      var result = extentCalc._getDataExtents(dataset, keys);
      assert.deepEqual(result, [5,10]);
    });

    test('_getDataExtents works with 0', function() {
      var dataset = { time: 1234566789, y0: -5, y1: -4, y2: 0, y3: -9},
          keys = ['y0', 'y1', 'y2', 'y3'];

      var result = extentCalc._getDataExtents(dataset, keys);
      assert.deepEqual(result, [-9,0]);
    });

    test('_getDataExtents works with all vals the same', function() {
      var dataset = { time: 1234566789, y0: 5, y1: 5, y2: 5, y3: 5},
          keys = ['y0', 'y1', 'y2', 'y3'];

      var result = extentCalc._getDataExtents(dataset, keys);
      assert.deepEqual(result, [5,5]);
    });

    test('_getDataExtents works if vals are strings', function() {
      var dataset = { time: '1234566789', y0: '5', y1: '10', y2: '7', y3: '9'},
          keys = ['y0', 'y1', 'y2', 'y3'];

      var result = extentCalc._getDataExtents(dataset, keys);
      assert.deepEqual(result, [5,10]);
    });
  }); //suite

  suite('_findTimeMM', function() {
    test('_findTimeMM runs _setMin when doMin is true', function() {
      var result = { x: [Infinity,-Infinity] },
          d = [
            {time: 5},
            {time: 7},
            {time: 10}
          ],
          dlen = 3,
          key = "time",
          doMin = true,
          doMax = false;

      extentCalc._findTimeMM(result, d, dlen, key, doMin, doMax);
      assert.deepEqual(result, { x: [5,-Infinity] });
    });

    test('_findTimeMM runs _setMax when doMax is true', function() {
      var result = { x: [Infinity,-Infinity] },
          d = [
            {time: 5},
            {time: 7},
            {time: 10}
          ],
          dlen = 3,
          key = "time",
          doMin = false,
          doMax = true;

      extentCalc._findTimeMM(result, d, dlen, key, doMin, doMax);
      assert.deepEqual(result, { x: [Infinity, 10] });
    });

    test('_findTimeMM runs both _setMin &  _setMax when both are true', function() {
      var result = { x: [Infinity,-Infinity] },
          d = [
            {time: 5},
            {time: 7},
            {time: 10}
          ],
          dlen = 3,
          key = "time",
          doMin = true,
          doMax = true;

      extentCalc._findTimeMM(result, d, dlen, key, doMin, doMax);
      assert.deepEqual(result, { x: [5, 10] });
    });

    test('_findTimeMM runs neither _setMin &  _setMax when both are false', function() {
      var result = { x: [Infinity,-Infinity] },
          d = [
            {time: 5},
            {time: 7},
            {time: 10}
          ],
          dlen = 3,
          key = "time",
          doMin = false,
          doMax = false;

      extentCalc._findTimeMM(result, d, dlen, key, doMin, doMax);
      assert.deepEqual(result, { x: [Infinity,-Infinity] });
    });
  }); //suite

  suite('_setMin', function() {
    test('_setMin sets arr val if arr val is Infinity', function() {
      var arr = [Infinity,10];
      extentCalc._setMin(arr, 1);
      assert.equal(arr[0], 1);
    });

    test('_setMin sets arr val if d is smaller', function() {
      var arr = [5,10];
      extentCalc._setMin(arr, 1);
      assert.equal(arr[0], 1);
    });

    test('_setMin doesnt set arr val if d is larger', function() {
      var arr = [5,10];
      extentCalc._setMin(arr, 7);
      assert.equal(arr[0], 5);
    });

    test('_setMin works with d = 0', function() {
      var arr = [5,10];
      extentCalc._setMin(arr, 0);
      assert.equal(arr[0], 0);
    });

    test('_setMin works with arr[0] = 0', function() {
      var arr = [0,10];
      extentCalc._setMin(arr, -5);
      assert.equal(arr[0], -5);
    });

    test('_setMin works if arr[0] is a string', function() {
      var arr = ['5',10];
      extentCalc._setMin(arr, 6);
      assert.equal(arr[0], 5);
    });

     test('_setMin works if arr[0] is "dynamic"', function() {
      var arr = ['dynamic',10];
      extentCalc._setMin(arr, 1);
      assert.equal(arr[0], 1);
    });

    test('_setMin reject null vals', function() {
      var arr = [5,10];
      extentCalc._setMin(arr, null);
      assert.equal(arr[0], 5);
    });
  }); //suite

  suite('_setMax', function() {
    test('_setMax sets arr val if arr val is -Infinity', function() {
      var arr = [Infinity,-Infinity];
      extentCalc._setMax(arr, 1);
      assert.equal(arr[1], 1);
    });

    test('_setMax sets arr val if d is bigger', function() {
      var arr = [5,10];
      extentCalc._setMax(arr, 11);
      assert.equal(arr[1], 11);
    });

    test('_setMax doesnt set arr val if d is smaller', function() {
      var arr = [5,10];
      extentCalc._setMax(arr, 7);
      assert.equal(arr[1], 10);
    });

    test('_setMax works with d = 0', function() {
      var arr = [5,-10];
      extentCalc._setMax(arr, 0);
      assert.equal(arr[1], 0);
    });

    test('_setMax works with arr[1] = 0', function() {
      var arr = [-10,0];
      extentCalc._setMax(arr, 5);
      assert.equal(arr[1], 5);
    });

    test('_setMax works if arr[1] is a string', function() {
      var arr = ['5','10'];
      extentCalc._setMax(arr, 6);
      assert.equal(arr[1], 10);
    });

     test('_setMax works if arr[1] is "dynamic"', function() {
      var arr = ['dynamic','dynamic'];
      extentCalc._setMax(arr, 1);
      assert.equal(arr[1], 1);
    });

    test('_setMax reject null vals', function() {
      var arr = [5,10];
      extentCalc._setMax(arr, null);
      assert.equal(arr[1], 10);
    });
  }); //suite

  suite('_processDataValues', function() {
    test('_processDataValues adds unique ordinal values', function() {
      var isOrd = true,
          result = { "x": ["bof"] },
          data = [{"x": "ben"}],
          axis = "x",
          key = "x",
          i = 0,
          doMin,
          doMax,
          v0,
          v1;

      extentCalc._processDataValues(isOrd, result, data, axis, key, i, doMin, doMax, v0, v1);
      assert.deepEqual(result, {"x":["bof", "ben"]});
    });

    test('_processDataValues rejects non-unique ordinal values', function() {
      var isOrd = true,
          result = { "x": ["bof"] },
          data = [{"x": "bof"}],
          axis = "x",
          key = "x",
          i = 0,
          doMin,
          doMax,
          v0,
          v1;

      extentCalc._processDataValues(isOrd, result, data, axis, key, i, doMin, doMax, v0, v1);
      assert.deepEqual(result, {"x":["bof"]});
    });

    test('_processDataValues runs doMin', function() {
      var isOrd = false,
          result = { "x": [1,2] },
          data,
          axis = "x",
          key,
          i,
          doMin = true,
          doMax = false,
          v0 = 0,
          v1 = 10;

      extentCalc._processDataValues(isOrd, result, data, axis, key, i, doMin, doMax, v0, v1);
      assert.deepEqual(result, {"x":[0,2]});
    });

    test('_processDataValues runs doMax', function() {
      var isOrd = false,
          result = { "x": [1,2] },
          data,
          axis = "x",
          key,
          i,
          doMin = false,
          doMax = true,
          v0 = 0,
          v1 = 10;

      extentCalc._processDataValues(isOrd, result, data, axis, key, i, doMin, doMax, v0, v1);
      assert.deepEqual(result, {"x":[1,10]});
    });
  }); //suite

  suite('_calcMultiAxisExtents', function() {
    // suiteSetup(function(){
    //   var w = 500,
    //     h = 300,
    //     m = {
    //       "top": 10,
    //       "right": 5,
    //       "bottom": 20,
    //       "left": 15
    //     };


    // });

    // test('baseZoom fixture is created', function() {
    //   assert.isTrue(baseZoom !== null);
    // });
  }); //suite
} //runTests
