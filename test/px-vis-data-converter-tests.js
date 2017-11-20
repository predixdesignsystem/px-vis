document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-data-converter does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-data-converter single series works with defaults', function() {
    var singleConverter
    var eventObj,configObj;

    suiteSetup(function(){
      singleConverter = document.getElementById('singleConverter');
      var d = [{
        "data": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ],
        }];

      document.addEventListener('px-vis-chart-data',function(evt){
        dataObj = evt.detail;
      });
      document.addEventListener('px-vis-series-config',function(evt){
        configObj = evt.detail;
      });

      singleConverter.set('originalData',d);
    });

    test('singleConverter fixture is created', function() {
      assert.isTrue(singleConverter !== null);
    });

    suite('singleConverter data is converted', function() {
      test('singleConverter chartData has correct keys', function() {
        var keys = Object.keys(singleConverter.chartData[0]);
        assert.deepEqual(keys, ['x','y0']);
      });

      test('singleConverter chartData has correct values at [0]', function() {
        assert.equal(singleConverter.chartData[0]['x'], 1397102460000);
        assert.equal(singleConverter.chartData[0]['y0'], 1);
      });

      test('singleConverter chartData has correct values at [2]', function() {
        assert.equal(singleConverter.chartData[2]['x'], 1397160780000);
        assert.equal(singleConverter.chartData[2]['y0'], 10);
      });

      test('singleConverter chartData has correct values at [4]', function() {
        assert.equal(singleConverter.chartData[4]['x'], 1397219100000);
        assert.equal(singleConverter.chartData[4]['y0'], 6);
      });
    });

    suite('singleConverter seriesConfig is created', function() {
      test('singleConverter seriesConfig has correct keys', function() {
        var keys = Object.keys(singleConverter.seriesConfig)
        assert.deepEqual(keys, ['y0']);
      });

      test('singleConverter seriesConfig has correct keys', function() {
        var keys = Object.keys(singleConverter.seriesConfig['y0'])
        assert.deepEqual(keys, ['name','x','y']);
      });

      test('singleConverter seriesConfig has correct values', function() {
        assert.equal(singleConverter.seriesConfig['y0']['name'], 'y0');
        assert.equal(singleConverter.seriesConfig['y0']['x'], 'x');
        assert.equal(singleConverter.seriesConfig['y0']['y'], 'y0');
      });
    });

    suite('Events are fired', function() {
      test('singleConverter chartData matches the dataObj.data', function() {
        assert.deepEqual(singleConverter.chartData, dataObj.data);
      });
      test('singleConverter seriesConfig matches the configObj.data', function() {
        assert.deepEqual(singleConverter.seriesConfig, configObj.data);
      });
    });
  });


  suite('px-vis-data-converter single series works with data keys', function() {
    var singleConverterDataKeys

    suiteSetup(function(){
      singleConverterDataKeys = document.getElementById('singleConverterDataKeys');
      var d = [{
        "data": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ],
        "id": "myTest",
        "name": "My Test",
        "min": 1,
        "max": 10
      }];

      singleConverterDataKeys.set('originalData',d);
    });

    test('singleConverterDataKeys fixture is created', function() {
      assert.isTrue(singleConverterDataKeys !== null);
    });

    suite('singleConverterDataKeys data is converted', function() {
      test('singleConverterDataKeys chartData has correct keys', function() {
        var keys = Object.keys(singleConverterDataKeys.chartData[0]);
        assert.deepEqual(keys, ['x','myTest']);
      });

      test('singleConverterDataKeys chartData has correct values at [0]', function() {
        assert.equal(singleConverterDataKeys.chartData[0]['x'], 1397102460000);
        assert.equal(singleConverterDataKeys.chartData[0]['myTest'], 1);
      });

      test('singleConverterDataKeys chartData has correct values at [2]', function() {
        assert.equal(singleConverterDataKeys.chartData[2]['x'], 1397160780000);
        assert.equal(singleConverterDataKeys.chartData[2]['myTest'], 10);
      });

      test('singleConverterDataKeys chartData has correct values at [4]', function() {
        assert.equal(singleConverterDataKeys.chartData[4]['x'], 1397219100000);
        assert.equal(singleConverterDataKeys.chartData[4]['myTest'], 6);
      });
    });

    suite('singleConverterDataKeys seriesConfig is created', function() {
      test('singleConverterDataKeys seriesConfig has correct keys', function() {
        var keys = Object.keys(singleConverterDataKeys.seriesConfig)
        assert.deepEqual(keys, ['myTest']);
      });

      test('singleConverterDataKeys seriesConfig has correct keys', function() {
        var keys = Object.keys(singleConverterDataKeys.seriesConfig['myTest'])
        assert.deepEqual(keys, ['name','x','y', 'yMin','yMax']);
      });

      test('singleConverterDataKeys seriesConfig has correct values', function() {
        assert.equal(singleConverterDataKeys.seriesConfig['myTest']['name'], 'My Test');
        assert.equal(singleConverterDataKeys.seriesConfig['myTest']['x'], 'x');
        assert.equal(singleConverterDataKeys.seriesConfig['myTest']['y'], 'myTest');
        assert.equal(singleConverterDataKeys.seriesConfig['myTest']['yMin'], 1);
        assert.equal(singleConverterDataKeys.seriesConfig['myTest']['yMax'], 10);
      });
    });
  });

  suite('px-vis-data-converter single series works with options', function() {
    var singleConverterOptions

    suiteSetup(function(){
      singleConverterOptions = document.getElementById('singleConverterOptions');
      var d = [{
        "series": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ],
        "tag": "myTest",
        "title": "My Test",
        "interpolationFunction": "curveStepAfter"
      }];

      singleConverterOptions.set('originalData',d);
    });

    test('singleConverterOptions fixture is created', function() {
      assert.isTrue(singleConverterOptions !== null);
    });

    suite('singleConverterOptions data is converted', function() {
      test('singleConverterOptions chartData has correct keys', function() {
        var keys = Object.keys(singleConverterOptions.chartData[0]);
        assert.deepEqual(keys, ['time','myTest']);
      });

      test('singleConverterOptions chartData has correct values at [0]', function() {
        assert.equal(singleConverterOptions.chartData[0]['time'], 1397102460000);
        assert.equal(singleConverterOptions.chartData[0]['myTest'], 1);
      });

      test('singleConverterOptions chartData has correct values at [2]', function() {
        assert.equal(singleConverterOptions.chartData[2]['time'], 1397160780000);
        assert.equal(singleConverterOptions.chartData[2]['myTest'], 10);
      });

      test('singleConverterOptions chartData has correct values at [4]', function() {
        assert.equal(singleConverterOptions.chartData[4]['time'], 1397219100000);
        assert.equal(singleConverterOptions.chartData[4]['myTest'], 6);
      });
    });

    suite('singleConverterOptions seriesConfig is created', function() {
      test('singleConverterOptions seriesConfig has correct keys', function() {
        var keys = Object.keys(singleConverterOptions.seriesConfig)
        assert.deepEqual(keys, ['myTest']);
      });

      test('singleConverterOptions seriesConfig has correct keys', function() {
        var keys = Object.keys(singleConverterOptions.seriesConfig['myTest'])
        assert.deepEqual(keys, ['name','x','y', 'interpolationFunction']);
      });

      test('singleConverterOptions seriesConfig has correct values', function() {
        assert.equal(singleConverterOptions.seriesConfig['myTest']['name'], 'My Test');
        assert.equal(singleConverterOptions.seriesConfig['myTest']['x'], 'time');
        assert.equal(singleConverterOptions.seriesConfig['myTest']['y'], 'myTest');
        assert.equal(singleConverterOptions.seriesConfig['myTest']['interpolationFunction'], 'curveStepAfter');
      });
    });
  });

  suite('px-vis-data-converter works with two series', function() {
    var twoConverter

    suiteSetup(function(){
      twoConverter = document.getElementById('twoConverter');
      var d = [{
        "data": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ],
        "id": "myTest",
        "name": "My Test"
      },{
        "data": [
          [1397102460000, 5],
          [1397131630000, 4],
          [1397160780000, 1],
          [1397189940000, 3],
          [1397219100000, 6]
        ],
        "id": "myTest2",
        "name": "My Test 2"
      }];

      twoConverter.set('originalData',d);
    });

    test('twoConverter fixture is created', function() {
      assert.isTrue(twoConverter !== null);
    });

    suite('twoConverter data is converted', function() {
      test('twoConverter chartData is correct length', function() {
        assert.equal(twoConverter.chartData.length, 6);
      });
      test('twoConverter chartData has correct keys', function() {
        var keys = Object.keys(twoConverter.chartData[0]);
        assert.deepEqual(keys, ['x','myTest','myTest2']);
      });

      test('twoConverter chartData has correct values at [0]', function() {
        assert.equal(twoConverter.chartData[0]['x'], 1397102460000);
        assert.equal(twoConverter.chartData[0]['myTest'], 1);
        assert.equal(twoConverter.chartData[0]['myTest2'], 5);
      });

      test('twoConverter chartData has correct values at [1]', function() {
        assert.equal(twoConverter.chartData[1]['x'], 1397131620000);
        assert.equal(twoConverter.chartData[1]['myTest'], 6);
        assert.isUndefined(twoConverter.chartData[1]['myTest2']);
      });

      test('twoConverter chartData has correct values at [2]', function() {
        assert.equal(twoConverter.chartData[2]['x'], 1397131630000);
        assert.isUndefined(twoConverter.chartData[2]['myTest']);
        assert.equal(twoConverter.chartData[2]['myTest2'], 4);
      });

      test('twoConverter chartData has correct values at [3]', function() {
        assert.equal(twoConverter.chartData[3]['x'], 1397160780000);
        assert.equal(twoConverter.chartData[3]['myTest'],10);
        assert.equal(twoConverter.chartData[3]['myTest2'], 1);
      });

      test('twoConverter chartData has correct values at [4]', function() {
        assert.equal(twoConverter.chartData[4]['x'], 1397189940000);
        assert.equal(twoConverter.chartData[4]['myTest'],4);
        assert.equal(twoConverter.chartData[4]['myTest2'], 3);
      });

      test('twoConverter chartData has correct values at [5]', function() {
        assert.equal(twoConverter.chartData[5]['x'], 1397219100000);
        assert.equal(twoConverter.chartData[5]['myTest'], 6);
        assert.equal(twoConverter.chartData[5]['myTest2'], 6);
      });
    });

    suite('twoConverter seriesConfig is created', function() {
      test('twoConverter seriesConfig has correct keys', function() {
        var keys = Object.keys(twoConverter.seriesConfig)
        assert.deepEqual(keys, ['myTest','myTest2']);
      });

      test('twoConverter seriesConfig has correct values', function() {
        assert.equal(twoConverter.seriesConfig['myTest']['name'], 'My Test');
        assert.equal(twoConverter.seriesConfig['myTest']['x'], 'x');
        assert.equal(twoConverter.seriesConfig['myTest']['y'], 'myTest');

        assert.equal(twoConverter.seriesConfig['myTest2']['name'], 'My Test 2');
        assert.equal(twoConverter.seriesConfig['myTest2']['x'], 'x');
        assert.equal(twoConverter.seriesConfig['myTest2']['y'], 'myTest2');
      });
    });
  });

  suite('px-vis-data-converter works with two series of different lengths', function() {
    var twoConverterDiffLen

    suiteSetup(function(){
      twoConverterDiffLen = document.getElementById('twoConverterDiffLen');
      var d = [{
        "data": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ],
        "id": "myTest",
        "name": "My Test"
      },{
        "data": [
          [1397102460000, 5],
          [1397131630000, 4],
          [1397219100000, 6]
        ],
        "id": "myTest2",
        "name": "My Test 2"
      }];

      twoConverterDiffLen.set('originalData',d);
    });

    test('twoConverterDiffLen fixture is created', function() {
      assert.isTrue(twoConverterDiffLen !== null);
    });

    suite('twoConverterDiffLen data is converted', function() {
      test('twoConverterDiffLen chartData is correct length', function() {
        assert.equal(twoConverterDiffLen.chartData.length, 6);
      });
      test('twoConverterDiffLen chartData has correct keys', function() {
        var keys = Object.keys(twoConverterDiffLen.chartData[0]);
        assert.deepEqual(keys, ['x','myTest','myTest2']);
      });

      test('twoConverterDiffLen chartData has correct values at [0]', function() {
        assert.equal(twoConverterDiffLen.chartData[0]['x'], 1397102460000);
        assert.equal(twoConverterDiffLen.chartData[0]['myTest'], 1);
        assert.equal(twoConverterDiffLen.chartData[0]['myTest2'], 5);
      });

      test('twoConverterDiffLen chartData has correct values at [1]', function() {
        assert.equal(twoConverterDiffLen.chartData[1]['x'], 1397131620000);
        assert.equal(twoConverterDiffLen.chartData[1]['myTest'], 6);
        assert.isUndefined(twoConverterDiffLen.chartData[1]['myTest2']);
      });

      test('twoConverterDiffLen chartData has correct values at [2]', function() {
        assert.equal(twoConverterDiffLen.chartData[2]['x'], 1397131630000);
        assert.isUndefined(twoConverterDiffLen.chartData[2]['myTest']);
        assert.equal(twoConverterDiffLen.chartData[2]['myTest2'], 4);
      });

      test('twoConverterDiffLen chartData has correct values at [3]', function() {
        assert.equal(twoConverterDiffLen.chartData[3]['x'], 1397160780000);
        assert.equal(twoConverterDiffLen.chartData[3]['myTest'],10);
        assert.isUndefined(twoConverterDiffLen.chartData[3]['myTest2']);
      });

      test('twoConverterDiffLen chartData has correct values at [4]', function() {
        assert.equal(twoConverterDiffLen.chartData[4]['x'], 1397189940000);
        assert.equal(twoConverterDiffLen.chartData[4]['myTest'],4);
        assert.isUndefined(twoConverterDiffLen.chartData[4]['myTest2']);
      });

      test('twoConverterDiffLen chartData has correct values at [5]', function() {
        assert.equal(twoConverterDiffLen.chartData[5]['x'], 1397219100000);
        assert.equal(twoConverterDiffLen.chartData[5]['myTest'], 6);
        assert.equal(twoConverterDiffLen.chartData[5]['myTest2'], 6);
      });
    });

    suite('twoConverterDiffLen seriesConfig is created', function() {
      test('twoConverterDiffLen seriesConfig has correct keys', function() {
        var keys = Object.keys(twoConverterDiffLen.seriesConfig)
        assert.deepEqual(keys, ['myTest','myTest2']);
      });

      test('twoConverterDiffLen seriesConfig has correct values', function() {
        assert.equal(twoConverterDiffLen.seriesConfig['myTest']['name'], 'My Test');
        assert.equal(twoConverterDiffLen.seriesConfig['myTest']['x'], 'x');
        assert.equal(twoConverterDiffLen.seriesConfig['myTest']['y'], 'myTest');

        assert.equal(twoConverterDiffLen.seriesConfig['myTest2']['name'], 'My Test 2');
        assert.equal(twoConverterDiffLen.seriesConfig['myTest2']['x'], 'x');
        assert.equal(twoConverterDiffLen.seriesConfig['myTest2']['y'], 'myTest2');
      });
    });
  });

  suite('px-vis-data-converter works with three series', function() {
    var threeConverter

    suiteSetup(function(){
      threeConverter = document.getElementById('threeConverter');
      var d = [{
        "data": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6],
          [1397219300000, 9]
        ],
        "id": "myTest",
        "name": "My Test"
      },{
        "data": [
          [1397102460000, 5],
          [1397131630000, 4],
          [1397160780000, 1],
          [1397189940000, 3],
          [1397219100000, 6]
        ],
        "id": "myTest2",
        "name": "My Test 2"
      },{
        "data": [
          [1397102400000, 2],
          [1397131630000, 4],
          [1397160780000, 5],
          [1397189940000, 2],
          [1397219200000, 1],
          [1397219300000, 2]
        ],
        "id": "myTest3",
        "name": "My Test 3"
      }];

      threeConverter.set('originalData',d);
    });

    test('threeConverter fixture is created', function() {
      assert.isTrue(threeConverter !== null);
    });

    suite('threeConverter data is converted', function() {
      test('threeConverter chartData is correct length', function() {
        assert.equal(threeConverter.chartData.length, 9);
      });
      test('threeConverter chartData has correct keys', function() {
        var keys = Object.keys(threeConverter.chartData[4]);
        assert.deepEqual(keys, ['x','myTest','myTest2','myTest3']);
      });

      test('threeConverter chartData has correct values at [0]', function() {
        assert.equal(threeConverter.chartData[0]['x'], 1397102400000);
        assert.isUndefined(threeConverter.chartData[0]['myTest']);
        assert.isUndefined(threeConverter.chartData[0]['myTest2']);
        assert.equal(threeConverter.chartData[0]['myTest3'], 2);
      });

      test('threeConverter chartData has correct values at [1]', function() {
        assert.equal(threeConverter.chartData[1]['x'], 1397102460000);
        assert.equal(threeConverter.chartData[1]['myTest'], 1);
        assert.equal(threeConverter.chartData[1]['myTest2'], 5);
        assert.isUndefined(threeConverter.chartData[1]['myTest3']);
      });

      test('threeConverter chartData has correct values at [2]', function() {
        assert.equal(threeConverter.chartData[2]['x'], 1397131620000);
        assert.equal(threeConverter.chartData[2]['myTest'],6);
        assert.isUndefined(threeConverter.chartData[2]['myTest2']);
        assert.isUndefined(threeConverter.chartData[2]['myTest3']);
      });

      test('threeConverter chartData has correct values at [3]', function() {
        assert.equal(threeConverter.chartData[3]['x'], 1397131630000);
        assert.isUndefined(threeConverter.chartData[3]['myTest']);
        assert.equal(threeConverter.chartData[3]['myTest2'], 4);
        assert.equal(threeConverter.chartData[3]['myTest3'], 4);
      });

      test('threeConverter chartData has correct values at [4]', function() {
        assert.equal(threeConverter.chartData[4]['x'], 1397160780000);
        assert.equal(threeConverter.chartData[4]['myTest'],10);
        assert.equal(threeConverter.chartData[4]['myTest2'],1);
        assert.equal(threeConverter.chartData[4]['myTest3'],5);
      });

      test('threeConverter chartData has correct values at [5]', function() {
        assert.equal(threeConverter.chartData[5]['x'], 1397189940000);
        assert.equal(threeConverter.chartData[5]['myTest'], 4);
        assert.equal(threeConverter.chartData[5]['myTest2'], 3);
        assert.equal(threeConverter.chartData[5]['myTest3'], 2);
      });

      test('threeConverter chartData has correct values at [6]', function() {
        assert.equal(threeConverter.chartData[6]['x'], 1397219100000);
        assert.equal(threeConverter.chartData[6]['myTest'], 6);
        assert.equal(threeConverter.chartData[6]['myTest2'], 6);
        assert.isUndefined(threeConverter.chartData[6]['myTest3']);
      });

      test('threeConverter chartData has correct values at [7]', function() {
        assert.equal(threeConverter.chartData[7]['x'], 1397219200000);
        assert.isUndefined(threeConverter.chartData[7]['myTest']);
        assert.isUndefined(threeConverter.chartData[7]['myTest2']);
        assert.equal(threeConverter.chartData[7]['myTest3'], 1);
      });

      test('threeConverter chartData has correct values at [7]', function() {
        assert.equal(threeConverter.chartData[8]['x'], 1397219300000);
        assert.equal(threeConverter.chartData[8]['myTest'],9);
        assert.isUndefined(threeConverter.chartData[8]['myTest2']);
        assert.equal(threeConverter.chartData[8]['myTest3'], 2);
      });
    });

    suite('threeConverter seriesConfig is created', function() {
      test('threeConverter seriesConfig has correct keys', function() {
        var keys = Object.keys(threeConverter.seriesConfig)
        assert.deepEqual(keys, ['myTest','myTest2','myTest3']);
      });

      test('threeConverter seriesConfig has correct values', function() {
        assert.equal(threeConverter.seriesConfig['myTest']['name'], 'My Test');
        assert.equal(threeConverter.seriesConfig['myTest']['x'], 'x');
        assert.equal(threeConverter.seriesConfig['myTest']['y'], 'myTest');

        assert.equal(threeConverter.seriesConfig['myTest2']['name'], 'My Test 2');
        assert.equal(threeConverter.seriesConfig['myTest2']['x'], 'x');
        assert.equal(threeConverter.seriesConfig['myTest2']['y'], 'myTest2');

        assert.equal(threeConverter.seriesConfig['myTest3']['name'], 'My Test 3');
        assert.equal(threeConverter.seriesConfig['myTest3']['x'], 'x');
        assert.equal(threeConverter.seriesConfig['myTest3']['y'], 'myTest3');
      });
    });
  });

  suite('px-vis-data-converter works with three series with custom id and names', function() {
    var threeConverterCustom

    suiteSetup(function(){
      threeConverterCustom = document.getElementById('threeConverterCustom');
      var d = [{
        "data": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6],
          [1397219300000, 9]
        ],
        "id": "myTest",
        "name": "My Test"
      },{
        "data": [
          [1397102460000, 5],
          [1397131630000, 4],
          [1397160780000, 1],
          [1397189940000, 3],
          [1397219100000, 6]
        ],
        "id": "myTest2",
        "name": "My Test 2"
      },{
        "data": [
          [1397102400000, 2],
          [1397131630000, 4],
          [1397160780000, 5],
          [1397189940000, 2],
          [1397219200000, 1],
          [1397219300000, 2]
        ],
        "id": "myTest3",
        "name": "My Test 3"
      }];

      threeConverterCustom.set('originalData',d);
    });

    test('threeConverterCustom fixture is created', function() {
      assert.isTrue(threeConverterCustom !== null);
    });

    suite('threeConverterCustom data is converted', function() {
      test('threeConverterCustom chartData is correct length', function() {
        assert.equal(threeConverterCustom.chartData.length, 9);
      });
      test('threeConverterCustom chartData has correct keys', function() {
        var keys = Object.keys(threeConverterCustom.chartData[4]);
        assert.deepEqual(keys, ['x','series1','series2','series3']);
      });
    });

    suite('threeConverterCustom seriesConfig is created', function() {
      test('threeConverterCustom seriesConfig has correct keys', function() {
        var keys = Object.keys(threeConverterCustom.seriesConfig)
        assert.deepEqual(keys, ['series1','series2','series3']);
      });

      test('threeConverterCustom seriesConfig has correct values', function() {
        assert.equal(threeConverterCustom.seriesConfig['series1']['name'], 'Series 1');
        assert.equal(threeConverterCustom.seriesConfig['series1']['x'], 'x');
        assert.equal(threeConverterCustom.seriesConfig['series1']['y'], 'series1');

        assert.equal(threeConverterCustom.seriesConfig['series2']['name'], 'Series 2');
        assert.equal(threeConverterCustom.seriesConfig['series2']['x'], 'x');
        assert.equal(threeConverterCustom.seriesConfig['series2']['y'], 'series2');

        assert.equal(threeConverterCustom.seriesConfig['series3']['name'], 'Series 3');
        assert.equal(threeConverterCustom.seriesConfig['series3']['x'], 'x');
        assert.equal(threeConverterCustom.seriesConfig['series3']['y'], 'series3');
      });
    });
  });

} //runTests
