document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {
  suite('px-vis-highlight-line renders parallel axis highlight', function() {
    var parallelScale,
        parallelSVG,
        parallelhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      parallelScale = document.getElementById('parallelScale');
      parallelSVG = document.getElementById('parallelSVG');
      parallelhighlight = document.getElementById('parallelhighlight');
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
        chartExtents = {"x": ['y','y2','y3'], 'y': [0,10], 'y2':[0,27], 'y3':[0,14] },
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      parallelSVG.set('width',w);
      parallelSVG.set('height',h);
      parallelSVG.set('margin',m);

      parallelScale.set('width',w);
      parallelScale.set('height',h);
      parallelScale.set('margin',m);
      parallelScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelScale.set('dataExtents',chartExtents);
      parallelScale.set('chartData',d);
      parallelScale.set('axes',dim);
      parallelScale.set('dimensions',dim);

      window.setTimeout(function() {
        var g = parallelSVG.svg.selectAll('g.layer')
            .data([0,1,2]);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "layer" + i });

        parallelhighlight.set('svg', parallelSVG.svg.select('.layer1'));
        parallelhighlight.set('layersToMask', parallelSVG.svg.select('.layer0'));
        parallelhighlight.set('dimensions',dim);
        parallelhighlight.set('timeData', 'x');
        parallelhighlight.set('completeSeriesConfig',completeSeriesConfig);
        parallelhighlight.set('seriesId',"x");
        parallelhighlight.set('categoryKey',"cat");
        parallelhighlight.set('categories',categories);
        parallelhighlight.set('chartData',d);

        window.setTimeout(function() { done(); }, 500);

      }, 100);
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
      assert.isFalse(parallelSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));
    });

    test('parallelhighlight has transition', function() {
      assert.equal(parallelSVG.svg.select('.layer0').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('parallelhighlight didnt create defaultEmptyData', function() {
      assert.isNull(parallelhighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var parallelScale,
        parallelSVG,
        parallelhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      parallelScale = document.getElementById('parallelScale');
      parallelSVG = document.getElementById('parallelSVG');
      parallelhighlight = document.getElementById('parallelhighlight');
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

      parallelhighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = parallelhighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(parallelSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
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

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 1 lines', function() {
      assert.equal(linePath.nodes().length, 1);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_1397160780000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[1]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(linePath.attr('stroke-opacity').split(' ').join(''), 1);
    });

    test('baseLine line d', function() {
      assert.equal(linePath.attr('d').split(/[\s,]+/).join(''),'M800L240241L400124');
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var parallelScale,
        parallelSVG,
        parallelhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      parallelScale = document.getElementById('parallelScale');
      parallelSVG = document.getElementById('parallelSVG');
      parallelhighlight = document.getElementById('parallelhighlight');
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      parallelhighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = parallelhighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer has transition', function() {
      assert.isFalse(parallelSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(parallelhighlight._highlightData, []);
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite


  suite('px-vis-highlight-line renders radar axis highlight', function() {
    var radarScale,
        radarSVG,
        radarhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      radarScale = document.getElementById('radarScale');
      radarSVG = document.getElementById('radarSVG');
      radarhighlight = document.getElementById('radarhighlight');
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

      radarSVG.set('width',w);
      radarSVG.set('height',h);
      radarSVG.set('margin',m);
      radarSVG.set('offset',offset);

      radarScale.set('_radius',min);
      radarScale.set('centerOffset',50);
      radarScale.set('chartExtents',chartExtents);
      radarScale.set('chartData',d);
      radarScale.set('axes',dim);
      radarScale.set('dimensions',dim);

      window.setTimeout(function() {
        var g = radarSVG.svg.selectAll('g.layer')
            .data([0,1,2]);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "layer" + i });

        radarhighlight.set('svg', radarSVG.svg.select('.layer2'));
        radarhighlight.set('layersToMask', radarSVG.svg.select('.layer0'));
        radarhighlight.set('dimensions',dim);
        radarhighlight.set('timeData', 'x');
        radarhighlight.set('completeSeriesConfig',completeSeriesConfig);
        radarhighlight.set('seriesId',"x");
        radarhighlight.set('chartData',d);

        window.setTimeout(function() { done(); }, 100);

      }, 500);
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
      assert.isFalse(radarSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));
    });

    test('radarhighlight didnt create defaultEmptyData', function() {
      assert.isNull(radarhighlight.defaultEmptyData);
    });

  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var radarScale,
        radarSVG,
        radarhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      radarScale = document.getElementById('radarScale');
      radarSVG = document.getElementById('radarSVG');
      radarhighlight = document.getElementById('radarhighlight');
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

      radarhighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = radarhighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(radarSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
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

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 1 lines', function() {
      assert.equal(linePath.nodes().length, 1);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_1397160780000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(linePath.attr('stroke-opacity').split(' ').join(''), 1);
    });

    test('baseLine line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join('')),
      matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]), 0, 1);
      assert.closeTo(Number(matches[2]), -120, 1);
      assert.closeTo(Number(matches[3]), 62, 1);
      assert.closeTo(Number(matches[4]), 35, 1);
      assert.closeTo(Number(matches[5]), -91, 1);
      assert.closeTo(Number(matches[6]), 53, 1);
      assert.closeTo(Number(matches[7]), 0, 1);
      assert.closeTo(Number(matches[8]), -120, 1);
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var radarScale,
        radarSVG,
        radarhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      radarScale = document.getElementById('radarScale');
      radarSVG = document.getElementById('radarSVG');
      radarhighlight = document.getElementById('radarhighlight');
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      radarhighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = radarhighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer has transition', function() {
      assert.isFalse(radarSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(radarhighlight._highlightData, []);
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite









  suite('px-vis-highlight-line renders different dataset highlight', function() {
    var differentScale,
        differentSVG,
        differenthighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      differentScale = document.getElementById('differentScale');
      differentSVG = document.getElementById('differentSVG');
      differenthighlight = document.getElementById('differenthighlight');
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
        chartExtents = {"x": ['y','y2','y3'], 'y': [0,10], 'y2':[0,27], 'y3':[0,14] },
        categories = ['a','b'],
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
      differentScale.set('dataExtents',chartExtents);
      differentScale.set('chartData',d);
      differentScale.set('axes',dim);
      differentScale.set('dimensions',dim);

      window.setTimeout(function() {
        var g = differentSVG.svg.selectAll('g.layer')
            .data([0,1,2]);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "layer" + i });

        differenthighlight.set('svg', differentSVG.svg.select('.layer1'));
        differenthighlight.set('layersToMask', differentSVG.svg.select('.layer0'));
        differenthighlight.set('dimensions',dim);
        differenthighlight.set('timeData', 'x');
        differenthighlight.set('completeSeriesConfig',completeSeriesConfig);
        differenthighlight.set('seriesId',"x");
        differenthighlight.set('categoryKey',"cat");
        differenthighlight.set('categories',categories);
        differenthighlight.set('chartData',d);

        window.setTimeout(function() { done(); }, 500);

      }, 100);
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
      assert.isFalse(differentSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));
    });

    test('differenthighlight has transition', function() {
      assert.equal(differentSVG.svg.select('.layer0').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('differenthighlight didnt create defaultEmptyData', function() {
      assert.isNull(differenthighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var differentScale,
        differentSVG,
        differenthighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      differentScale = document.getElementById('differentScale');
      differentSVG = document.getElementById('differentSVG');
      differenthighlight = document.getElementById('differenthighlight');
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

      differenthighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = differenthighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(differentSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
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


    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 1 lines', function() {
      assert.equal(linePath.nodes().length, 1);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_1397160780000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[1]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(linePath.attr('stroke-opacity').split(' ').join(''), 1);
    });

    test('baseLine line d', function() {
      assert.equal(linePath.attr('d').split(/[\s,]+/).join(''),'M800L240241L400124');
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var differentScale,
        differentSVG,
        differenthighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      differentScale = document.getElementById('differentScale');
      differentSVG = document.getElementById('differentSVG');
      differenthighlight = document.getElementById('differenthighlight');
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      differenthighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = differenthighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer has transition', function() {
      assert.isFalse(differentSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(differenthighlight._highlightData, []);
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite







  suite('px-vis-highlight-line renders fuzz dataset highlight', function() {
    var fuzzScale,
        fuzzSVG,
        fuzzhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      fuzzScale = document.getElementById('fuzzScale');
      fuzzSVG = document.getElementById('fuzzSVG');
      fuzzhighlight = document.getElementById('fuzzhighlight');
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
        chartExtents = {"x": ['y','y2','y3'], 'y': [0,10], 'y2':[0,27], 'y3':[0,14] },
        categories = ['a','b'],
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
      fuzzScale.set('dataExtents',chartExtents);
      fuzzScale.set('chartData',d);
      fuzzScale.set('axes',dim);
      fuzzScale.set('dimensions',dim);

      window.setTimeout(function() {
        var g = fuzzSVG.svg.selectAll('g.layer')
            .data([0,1,2]);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "layer" + i });

        fuzzhighlight.set('svg', fuzzSVG.svg.select('.layer1'));
        fuzzhighlight.set('layersToMask', fuzzSVG.svg.select('.layer0'));
        fuzzhighlight.set('dimensions',dim);
        fuzzhighlight.set('timeData', 'x');
        fuzzhighlight.set('completeSeriesConfig',completeSeriesConfig);
        fuzzhighlight.set('seriesId',"x");
        fuzzhighlight.set('categoryKey',"cat");
        fuzzhighlight.set('categories',categories);
        fuzzhighlight.set('chartData',d);

        window.setTimeout(function() { done(); }, 500);

      }, 100);
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
      assert.isFalse(fuzzSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));
    });

    test('fuzzhighlight has transition', function() {
      assert.equal(fuzzSVG.svg.select('.layer0').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('fuzzhighlight didnt create defaultEmptyData', function() {
      assert.isNull(fuzzhighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var fuzzScale,
        fuzzSVG,
        fuzzhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      fuzzScale = document.getElementById('fuzzScale');
      fuzzSVG = document.getElementById('fuzzSVG');
      fuzzhighlight = document.getElementById('fuzzhighlight');
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

      fuzzhighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = fuzzhighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(fuzzSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
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


    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 3 lines', function() {
      assert.equal(linePath.nodes().length, 3);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(Px.d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397131620000');
      assert.equal(Px.d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397160780000');
      assert.equal(Px.d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397189940000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(Px.d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''), colorSet[0]);
      assert.equal(Px.d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''), colorSet[1]);
      assert.equal(Px.d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''), colorSet[0]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(linePath.attr('stroke-opacity').split(' ').join(''), 1);
    });

    test('baseLine line d', function() {
      assert.equal(Px.d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M80120L24067L4000');
      assert.equal(Px.d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M800L240241L400124');
      assert.equal(Px.d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M80180L240173L40041');
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var fuzzScale,
        fuzzSVG,
        fuzzhighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      fuzzScale = document.getElementById('fuzzScale');
      fuzzSVG = document.getElementById('fuzzSVG');
      fuzzhighlight = document.getElementById('fuzzhighlight');
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      fuzzhighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = fuzzhighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer has transition', function() {
      assert.isFalse(fuzzSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(fuzzhighlight._highlightData, []);
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite









  suite('px-vis-highlight-line renders generating crosshair data axis highlight', function() {
    var generatingScale,
        generatingSVG,
        generatinghighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      generatingScale = document.getElementById('generatingScale');
      generatingSVG = document.getElementById('generatingSVG');
      generatinghighlight = document.getElementById('generatinghighlight');
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
        chartExtents = {"x": ['y','y2','y3'], 'y': [0,10], 'y2':[0,27], 'y3':[0,14] },
        categories = ['a','b'],
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
      generatingScale.set('dataExtents',chartExtents);
      generatingScale.set('chartData',d);
      generatingScale.set('axes',dim);
      generatingScale.set('dimensions',dim);

      window.setTimeout(function() {
        var g = generatingSVG.svg.selectAll('g.layer')
            .data([0,1,2]);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "layer" + i });

        generatinghighlight.set('svg', generatingSVG.svg.select('.layer1'));
        generatinghighlight.set('layersToMask', generatingSVG.svg.select('.layer0'));
        generatinghighlight.set('dimensions',dim);
        generatinghighlight.set('timeData', 'x');
        generatinghighlight.set('completeSeriesConfig',completeSeriesConfig);
        generatinghighlight.set('seriesId',"x");
        generatinghighlight.set('chartData',d);

        window.setTimeout(function() { done(); }, 500);

      }, 100);
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
      assert.isFalse(generatingSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));
    });

    test('generatinghighlight has transition', function() {
      assert.equal(generatingSVG.svg.select('.layer0').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('generatinghighlight didnt create defaultEmptyData', function() {
      assert.isNull(generatinghighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var generatingScale,
        generatingSVG,
        generatinghighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      generatingScale = document.getElementById('generatingScale');
      generatingSVG = document.getElementById('generatingSVG');
      generatinghighlight = document.getElementById('generatinghighlight');
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

      generatinghighlight.set('generatingCrosshairData',true);
      generatinghighlight.set("crosshairData", d);

      window.setTimeout(function() {
        // linePath = generatinghighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 1000);
    });

    test('datalayer gets masked', function() {
      assert.isFalse(generatingSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('generatinghighlight highlightData not created', function() {
      assert.equal(generatinghighlight._highlightData, undefined);
    });

  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var generatingScale,
        generatingSVG,
        generatinghighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      generatingScale = document.getElementById('generatingScale');
      generatingSVG = document.getElementById('generatingSVG');
      generatinghighlight = document.getElementById('generatinghighlight');
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      generatinghighlight.set("generatingCrosshairData", false);
      generatinghighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = generatinghighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer has transition', function() {
      assert.isFalse(generatingSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(generatinghighlight._highlightData, []);
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite












  suite('px-vis-highlight-line forces display when generatingCrosshairData', function() {
    var forceScale,
        forceSVG,
        forcehighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      forceScale = document.getElementById('forceScale');
      forceSVG = document.getElementById('forceSVG');
      forcehighlight = document.getElementById('forcehighlight');
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
        chartExtents = {"x": ['y','y2','y3'], 'y': [0,10], 'y2':[0,27], 'y3':[0,14] },
        categories = ['a','b'],
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
      forceScale.set('dataExtents',chartExtents);
      forceScale.set('chartData',d);
      forceScale.set('axes',dim);
      forceScale.set('dimensions',dim);

      window.setTimeout(function() {
        var g = forceSVG.svg.selectAll('g.layer')
            .data([0,1,2]);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "layer" + i });

        forcehighlight.set('svg', forceSVG.svg.select('.layer1'));
        forcehighlight.set('layersToMask', forceSVG.svg.select('.layer0'));
        forcehighlight.set('dimensions',dim);
        forcehighlight.set('timeData', 'x');
        forcehighlight.set('completeSeriesConfig',completeSeriesConfig);
        forcehighlight.set('seriesId',"x");
        forcehighlight.set('chartData',d);
        forcehighlight.set('drawWithLocalCrosshairData',true);

        window.setTimeout(function() { done(); }, 500);

      }, 100);
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
      assert.isFalse(forceSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));
    });

    test('forcehighlight has transition', function() {
      assert.equal(forceSVG.svg.select('.layer0').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('forcehighlight didnt create defaultEmptyData', function() {
      assert.isNull(forcehighlight.defaultEmptyData);
    });
  }); //suite


  suite('px-vis-highlight-line draws the highlight', function() {
    var forceScale,
        forceSVG,
        forcehighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      forceScale = document.getElementById('forceScale');
      forceSVG = document.getElementById('forceSVG');
      forcehighlight = document.getElementById('forcehighlight');
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

      forcehighlight.setAttribute("generatingCrosshairData", true);
      forcehighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = forcehighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer gets masked', function() {
      assert.isTrue(forceSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
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

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 1 lines', function() {
      assert.equal(linePath.nodes().length, 1);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_1397160780000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(linePath.attr('stroke-opacity').split(' ').join(''), 1);
    });

    test('baseLine line d', function() {
      assert.equal(linePath.attr('d').split(/[\s,]+/).join(''),'M800L240241L400124');
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var forceScale,
        forceSVG,
        forcehighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      forceScale = document.getElementById('forceScale');
      forceSVG = document.getElementById('forceSVG');
      forcehighlight = document.getElementById('forcehighlight');
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      forcehighlight.setAttribute("generatingCrosshairData", false);
      forcehighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = forcehighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer has transition', function() {
      assert.isFalse(forceSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(forcehighlight._highlightData, []);
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite












  suite('px-vis-highlight-line creates tooltipData', function() {
    var tooltipScale,
        tooltipSVG,
        tooltiphighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      tooltipScale = document.getElementById('tooltipScale');
      tooltipSVG = document.getElementById('tooltipSVG');
      tooltiphighlight = document.getElementById('tooltiphighlight');
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
        chartExtents = {"x": ['y','y2','y3'], 'y': [0,10], 'y2':[0,27], 'y3':[0,14] },
        categories = ['a','b'],
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
      tooltipScale.set('dataExtents',chartExtents);
      tooltipScale.set('chartData',d);
      tooltipScale.set('axes',dim);
      tooltipScale.set('dimensions',dim);

      window.setTimeout(function() {
        var g = tooltipSVG.svg.selectAll('g.layer')
            .data([0,1,2]);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "layer" + i; });

        tooltiphighlight.set('svg', tooltipSVG.svg.select('.layer1'));
        tooltiphighlight.set('layersToMask', tooltipSVG.svg.select('.layer0'));
        tooltiphighlight.set('dimensions',dim);
        tooltiphighlight.set('timeData', 'x');
        tooltiphighlight.set('completeSeriesConfig',completeSeriesConfig);
        tooltiphighlight.set('seriesId',"x");
        tooltiphighlight.set('chartData',d);
        tooltiphighlight.set('showTooltipData',true);
        tooltiphighlight.set('margin',m);

        window.setTimeout(function() { done(); }, 500);

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
    var tooltipScale,
        tooltipSVG,
        tooltiphighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      tooltipScale = document.getElementById('tooltipScale');
      tooltipSVG = document.getElementById('tooltipSVG');
      tooltiphighlight = document.getElementById('tooltiphighlight');
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

      tooltiphighlight.set("crosshairData", d);

      window.setTimeout(function() { done(); }, 1000);
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
      assert.equal(tooltiphighlight.defaultEmptyData.dataPos[0], 415);
      assert.closeTo(tooltiphighlight.defaultEmptyData.dataPos[1], 134, 4);
      assert.equal(tooltiphighlight.defaultEmptyData.time, 1397160780000);
      assert.deepEqual(tooltiphighlight.defaultEmptyData.dataset, {"x":1397160780000,"y":10,"y2":3,"y3":8,"cat":"b"});
      assert.deepEqual(tooltiphighlight.defaultEmptyData.series, [{"name":"y","value":{"y":10}},{"name":"y2","value":{"y2":3}},{"name":"y3","value":{"y3":8}}]);
      assert.equal(tooltiphighlight.defaultEmptyData.color.split(" ").join(""), colorSet[0]);
      assert.deepEqual(tooltiphighlight.defaultEmptyData.tooltipConfig, {"y":{"color":"rgb(0,0,0)","name":"y","yAxisUnit":"","y":"y"},"y2":{"color":"rgb(0,0,0)","name":"y2","yAxisUnit":"","y":"y2"},"y3":{"color":"rgb(0,0,0)","name":"y3","yAxisUnit":"","y":"y3"}});
    });
  }); //suite

  suite('px-vis-highlight-line clears the highlight', function() {
    var tooltipScale,
        tooltipSVG,
        tooltiphighlight;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      tooltipScale = document.getElementById('tooltipScale');
      tooltipSVG = document.getElementById('tooltipSVG');
      tooltiphighlight = document.getElementById('tooltiphighlight');
      var d = {
            "rawData":[],
            "timeStamps": []
          };

      tooltiphighlight.set("crosshairData", d);

      window.setTimeout(function() {
        linePath = tooltiphighlight.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 500);
    });

    test('datalayer has transition', function() {
      assert.isFalse(tooltipSVG.svg.select('.layer0').node().classList.contains('secondaryDataMask'));
    });

    test('data is empty', function() {
      assert.deepEqual(tooltiphighlight._highlightData, []);
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite

}
