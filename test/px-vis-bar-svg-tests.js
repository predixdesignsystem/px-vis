document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {
  suite('px-vis-bar-svg does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-bar-svg column works', function() {
    var singleColumnScale = document.getElementById('singleColumnScale'),
        singleColumnSVG = document.getElementById('singleColumnSVG'),
        singleColumnBar = document.getElementById('singleColumnBar');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var barRect;

    suiteSetup(function(done){
      var d = [{
          'x': "A",
          'y': 0.56
        },{
          'x': "B",
          'y': 0.4
        },{
          'x': "C",
          'y': 0.43
        },{
          'x': "D",
          'y': 0.33
        },{
          'x': "E",
          'y': 0.47
        }],
        completeSeriesConfig = {"mySeries":{
          "type":"bar",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":["A","B","C","D","E"],"y":[0,0.6]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        stack = Px.d3.stack();

        stack.keys(["y"]);

        var stackData = stack(d);

      var rendered = function() {
        barRect =  singleColumnBar.barGroup.selectAll('rect.series-bar');
        done();
        singleColumnBar.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
      };
      singleColumnBar.addEventListener('px-vis-bar-svg-rendering-ended', rendered);

      singleColumnSVG.set('width',w);
      singleColumnSVG.set('height',h);
      singleColumnSVG.set('margin',m);

      singleColumnScale.set('width',w);
      singleColumnScale.set('height',h);
      singleColumnScale.set('margin',m);
      singleColumnScale.set('completeSeriesConfig',completeSeriesConfig);
      singleColumnScale.set('chartExtents',chartExtents);
      singleColumnScale.set('dataExtents',chartExtents);
      singleColumnScale.set('chartData',d);

      singleColumnBar.set('seriesKey',"y");
      singleColumnBar.set('completeSeriesConfig',completeSeriesConfig);
      singleColumnBar.set('chartData',stackData[0]);
    });

    test('singleColumnBar fixture is created', function() {
      assert.isTrue(singleColumnBar !== null);
    });

    test('singleColumnBar barRect created', function() {
      assert.equal(barRect.node().tagName,'rect');
    });

    test('singleColumnBar bar series ID', function() {
      assert.equal(barRect.attr('series-id'),'bar_mySeries_0');
    });

    test('singleColumnBar bar series has the right color', function() {
      assert.equal(barRect.attr('fill').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('singleColumnBar bar width', function() {
      assert.equal(barRect.attr('width'), 53);
    });

    test('singleColumnBar bar x', function() {
      var bars = barRect.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('x'), 2);
      assert.equal(Px.d3.select(bars[1]).attr('x'), 108);
      assert.equal(Px.d3.select(bars[2]).attr('x'), 214);
      assert.equal(Px.d3.select(bars[3]).attr('x'), 320);
      assert.equal(Px.d3.select(bars[4]).attr('x'), 426);
    });

    test('singleColumnBar bar y', function() {
      var bars = barRect.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('y')), 18, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('y')), 90, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('y')), 76.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('y')), 121.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('y')), 58.5, 1);
    });

    test('singleColumnBar bar heights', function() {
      var bars = barRect.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('height')), 252, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('height')), 180, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('height')), 193.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('height')), 148.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('height')), 211.5, 1);
    });
  }); //suite

  suite('px-vis-bar-svg column with three series works', function() {
    var multiColumnScale = document.getElementById('multiColumnScale'),
        multiColumnSVG = document.getElementById('multiColumnSVG'),
        multiColumnBar1 = document.getElementById('multiColumnBar1'),
        multiColumnBar2 = document.getElementById('multiColumnBar2'),
        multiColumnBar3 = document.getElementById('multiColumnBar3');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var barRect,barRect2,barRect3;

    suiteSetup(function(done){
      var d = value = [{
          'x': "A",
          'y': 0.56,
          'y1': 0.3,
          'y2': 0.1
        },{
          'x': "B",
          'y': 0.4,
          'y1': 0.4,
          'y2': 0.2
        },{
          'x': "C",
          'y': 0.43,
          'y1': 0.3,
          'y2': 0.3
        },{
          'x': "D",
          'y': 0.33,
          'y1': 0.4,
          'y2': 0.5
        },{
          'x': "E",
          'y': 0.47,
          'y1': 0.4,
          'y2': 0.6
        }],
        completeSeriesConfig = {
          "mySeries":{
            "type":"bar",
            "name":"mySeries",
            "x":"x",
            "y":"y",
            "color": colorSet[ colorOrder[0] ]
          },
          "mySeries2":{
            "type":"bar",
            "name":"mySeries2",
            "x":"x",
            "y":"y1",
            "color": colorSet[ colorOrder[1] ]
          },
          "mySeries3":{
            "type":"bar",
            "name":"mySeries3",
            "x":"x",
            "y":"y2",
            "color": colorSet[ colorOrder[2] ]
          },
        },
        chartExtents = {"x":["A","B","C","D","E"],"y":[0,1.6]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        stack = Px.d3.stack(),
        counter = 0;

        stack.keys(["y", "y1", "y2"]);

        var stackData = stack(d);

      var rendered = function() {
        counter++;

        if(counter === 3) {
          barRect =  multiColumnBar1.barGroup.selectAll('rect.series-bar');
          barRect2 =  multiColumnBar2.barGroup.selectAll('rect.series-bar');
          barRect3 =  multiColumnBar3.barGroup.selectAll('rect.series-bar');
          multiColumnBar1.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
          multiColumnBar2.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
          multiColumnBar3.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
          done();
        }
      };
      multiColumnBar1.addEventListener('px-vis-bar-svg-rendering-ended', rendered);
      multiColumnBar2.addEventListener('px-vis-bar-svg-rendering-ended', rendered);
      multiColumnBar3.addEventListener('px-vis-bar-svg-rendering-ended', rendered);

      multiColumnSVG.set('width',w);
      multiColumnSVG.set('height',h);
      multiColumnSVG.set('margin',m);

      multiColumnScale.set('width',w);
      multiColumnScale.set('height',h);
      multiColumnScale.set('margin',m);
      multiColumnScale.set('completeSeriesConfig',completeSeriesConfig);
      multiColumnScale.set('chartExtents',chartExtents);
      multiColumnScale.set('dataExtents',chartExtents);
      multiColumnScale.set('chartData',d);

      multiColumnBar1.set('seriesKey',"y");
      multiColumnBar1.set('completeSeriesConfig',completeSeriesConfig);
      multiColumnBar1.set('chartData',stackData[0]);

      multiColumnBar2.set('seriesKey',"y1");
      multiColumnBar2.set('completeSeriesConfig',completeSeriesConfig);
      multiColumnBar2.set('chartData',stackData[1]);

      multiColumnBar3.set('seriesKey',"y2");
      multiColumnBar3.set('completeSeriesConfig',completeSeriesConfig);
      multiColumnBar3.set('chartData',stackData[2]);
    });

    test('multiColumnBar fixture is created', function() {
      assert.isTrue(multiColumnBar1 !== null);
      assert.isTrue(multiColumnBar2 !== null);
      assert.isTrue(multiColumnBar3 !== null);
    });

    test('multiColumnBar barRect created', function() {
      assert.equal(barRect.node().tagName,'rect');
      assert.equal(barRect2.node().tagName,'rect');
      assert.equal(barRect3.node().tagName,'rect');
    });

    test('multiColumnBar1 bar series ID', function() {
      assert.equal(barRect.attr('series-id'),'bar_mySeries_0');
    });

    test('multiColumnBar1 bar series has the right color', function() {
      assert.equal(barRect.attr('fill').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('multiColumnBar1 bar width', function() {
      assert.equal(barRect.attr('width'), 53);
    });

    test('multiColumnBar1 bar x', function() {
      var bars = barRect.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('x'), 2);
      assert.equal(Px.d3.select(bars[1]).attr('x'), 108);
      assert.equal(Px.d3.select(bars[2]).attr('x'), 214);
      assert.equal(Px.d3.select(bars[3]).attr('x'), 320);
      assert.equal(Px.d3.select(bars[4]).attr('x'), 426);
    });

    test('multiColumnBar1 bar y', function() {
      var bars = barRect.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('y')), 175.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('y')), 202.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('y')), 197.4, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('y')), 214.3, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('y')), 190.7, 1);
    });

    test('multiColumnBar1 bar heights', function() {
      var bars = barRect.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('height')), 94.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('height')), 67.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('height')), 72.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('height')), 55.7, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('height')), 79.3, 1);
    });

    test('multiColumnBar2 bar series ID', function() {
      assert.equal(barRect2.attr('series-id'),'bar_mySeries2_0');
    });

    test('multiColumnBar2 bar series has the right color', function() {
      assert.equal(barRect2.attr('fill').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('multiColumnBar2 bar width', function() {
      assert.equal(barRect2.attr('width'), 53);
    });

    test('multiColumnBar2 bar x', function() {
      var bars = barRect2.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('x'), 2);
      assert.equal(Px.d3.select(bars[1]).attr('x'), 108);
      assert.equal(Px.d3.select(bars[2]).attr('x'), 214);
      assert.equal(Px.d3.select(bars[3]).attr('x'), 320);
      assert.equal(Px.d3.select(bars[4]).attr('x'), 426);
    });

    test('multiColumnBar2 bar y', function() {
      var bars = barRect2.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('y')), 124.8, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('y')), 135, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('y')), 146.8, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('y')), 146.8, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('y')), 123.1, 1);
    });

    test('multiColumnBar2 bar heights', function() {
      var bars = barRect2.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('height')), 50.6, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('height')), 67.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('height')), 50.6, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('height')), 67.5, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('height')), 67.5, 1);
    });

    test('multiColumnBar3 bar series ID', function() {
      assert.equal(barRect3.attr('series-id'),'bar_mySeries3_0');
    });

    test('multiColumnBar3 bar series has the right color', function() {
      assert.equal(barRect3.attr('fill').split(' ').join(''),colorSet[ colorOrder[2] ]);
    });

    test('multiColumnBar3 bar width', function() {
      assert.equal(barRect3.attr('width'), 53);
    });

    test('multiColumnBar3 bar x', function() {
      var bars = barRect3.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('x'), 2);
      assert.equal(Px.d3.select(bars[1]).attr('x'), 108);
      assert.equal(Px.d3.select(bars[2]).attr('x'), 214);
      assert.equal(Px.d3.select(bars[3]).attr('x'), 320);
      assert.equal(Px.d3.select(bars[4]).attr('x'), 426);
    });

    test('multiColumnBar3 bar y', function() {
      var bars = barRect3.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('y')), 108, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('y')), 101.2, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('y')), 96.2, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('y')), 62.4, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('y')), 21.9, 1);
    });

    test('multiColumnBar3 bar heights', function() {
      var bars = barRect3.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('height')), 16.8, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('height')), 33.7, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('height')), 50.6, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('height')), 84.3, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('height')), 101.2, 1);
    });
  }); //suite


  suite('px-vis-bar-svg bar works', function() {
    var singleBarScale = document.getElementById('singleBarScale'),
        singleBarSVG = document.getElementById('singleBarSVG'),
        singleBarBar = document.getElementById('singleBarBar');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var barRect;

    suiteSetup(function(done){
      var d = [{
          'x': "A",
          'y': 0.56
        },{
          'x': "B",
          'y': 0.4
        },{
          'x': "C",
          'y': 0.43
        },{
          'x': "D",
          'y': 0.33
        },{
          'x': "E",
          'y': 0.47
        }],
        completeSeriesConfig = {"mySeries":{
          "type":"bar",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":[0,0.6],"y":["A","B","C","D","E"]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        stack = Px.d3.stack();

        stack.keys(["y"]);

        var stackData = stack(d);

      var rendered = function() {

        barRect =  singleBarBar.barGroup.selectAll('rect.series-bar');
        singleBarBar.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
        done();
      };
      singleBarBar.addEventListener('px-vis-bar-svg-rendering-ended', rendered);

      singleBarSVG.set('width',w);
      singleBarSVG.set('height',h);
      singleBarSVG.set('margin',m);

      singleBarScale.set('width',w);
      singleBarScale.set('height',h);
      singleBarScale.set('margin',m);
      singleBarScale.set('completeSeriesConfig',completeSeriesConfig);
      singleBarScale.set('chartExtents',chartExtents);
      singleBarScale.set('dataExtents',chartExtents);
      singleBarScale.set('chartData',d);

      singleBarBar.set('seriesKey',"y");
      singleBarBar.set('completeSeriesConfig',completeSeriesConfig);
      singleBarBar.set('chartData',stackData[0]);
    });

    test('singleBarBar fixture is created', function() {
      assert.isTrue(singleBarBar !== null);
    });

    test('singleBarBar barRect created', function() {
      assert.equal(barRect.node().tagName,'rect');
    });

    test('singleBarBar bar series ID', function() {
      assert.equal(barRect.attr('series-id'),'bar_mySeries_0');
    });

    test('singleBarBar bar series has the right color', function() {
      assert.equal(barRect.attr('fill').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('singleBarBar bar width', function() {
      var bars = barRect.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('width')), 448, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('width')), 320, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('width')), 344, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('width')), 264, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('width')), 376, 1);
    });

    test('singleBarBar bar x', function() {
      var bars = barRect.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[1]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[2]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[3]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[4]).attr('x'), 0);
    });

    test('singleBarBar bar y', function() {
      var bars = barRect.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('y'), 240);
      assert.equal(Px.d3.select(bars[1]).attr('y'), 180);
      assert.equal(Px.d3.select(bars[2]).attr('y'), 120);
      assert.equal(Px.d3.select(bars[3]).attr('y'), 60);
      assert.equal(Px.d3.select(bars[4]).attr('y'), 0);
    });

    test('singleBarBar bar height', function() {
      assert.equal(barRect.attr('height'), 30);
    });
  }); //suite

  suite('px-vis-bar-svg bar with three series works', function() {
    var multiBarScale = document.getElementById('multiBarScale'),
        multiBarSVG = document.getElementById('multiBarSVG'),
        multiBarBar1 = document.getElementById('multiBarBar1'),
        multiBarBar2 = document.getElementById('multiBarBar2'),
        multiBarBar3 = document.getElementById('multiBarBar3');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var barRect,barRect2,barRect3;

    suiteSetup(function(done){
      var d = value = [{
          'x': "A",
          'y': 0.56,
          'y1': 0.3,
          'y2': 0.1
        },{
          'x': "B",
          'y': 0.4,
          'y1': 0.4,
          'y2': 0.2
        },{
          'x': "C",
          'y': 0.43,
          'y1': 0.3,
          'y2': 0.3
        },{
          'x': "D",
          'y': 0.33,
          'y1': 0.4,
          'y2': 0.5
        },{
          'x': "E",
          'y': 0.47,
          'y1': 0.4,
          'y2': 0.6
        }],
        completeSeriesConfig = {
          "mySeries":{
            "type":"bar",
            "name":"mySeries",
            "x":"x",
            "y":"y",
            "color": colorSet[ colorOrder[0] ]
          },
          "mySeries2":{
            "type":"bar",
            "name":"mySeries2",
            "x":"x",
            "y":"y1",
            "color": colorSet[ colorOrder[1] ]
          },
          "mySeries3":{
            "type":"bar",
            "name":"mySeries3",
            "x":"x",
            "y":"y2",
            "color": colorSet[ colorOrder[2] ]
          },
        },
        chartExtents = {"x":[0,1.6],"y":["A","B","C","D","E"]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        stack = Px.d3.stack(),
        counter = 0;

        stack.keys(["y", "y1", "y2"]);

        var stackData = stack(d);

      var rendered = function() {
        counter++;

        if(counter === 3) {
          barRect =  multiBarBar1.barGroup.selectAll('rect.series-bar');
          barRect2 =  multiBarBar2.barGroup.selectAll('rect.series-bar');
          barRect3 =  multiBarBar3.barGroup.selectAll('rect.series-bar');
          multiBarBar1.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
          multiBarBar2.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
          multiBarBar3.removeEventListener('px-vis-bar-svg-rendering-ended', rendered);
          done();
        }
      };
      multiBarBar1.addEventListener('px-vis-bar-svg-rendering-ended', rendered);
      multiBarBar2.addEventListener('px-vis-bar-svg-rendering-ended', rendered);
      multiBarBar3.addEventListener('px-vis-bar-svg-rendering-ended', rendered);

      multiBarSVG.set('width',w);
      multiBarSVG.set('height',h);
      multiBarSVG.set('margin',m);

      multiBarScale.set('width',w);
      multiBarScale.set('height',h);
      multiBarScale.set('margin',m);
      multiBarScale.set('completeSeriesConfig',completeSeriesConfig);
      multiBarScale.set('chartExtents',chartExtents);
      multiBarScale.set('dataExtents',chartExtents);
      multiBarScale.set('chartData',d);

      multiBarBar1.set('seriesKey',"y");
      multiBarBar1.set('completeSeriesConfig',completeSeriesConfig);
      multiBarBar1.set('chartData',stackData[0]);

      multiBarBar2.set('seriesKey',"y1");
      multiBarBar2.set('completeSeriesConfig',completeSeriesConfig);
      multiBarBar2.set('chartData',stackData[1]);

      multiBarBar3.set('seriesKey',"y2");
      multiBarBar3.set('completeSeriesConfig',completeSeriesConfig);
      multiBarBar3.set('chartData',stackData[2]);
    });

    test('multiBarBar fixture is created', function() {
      assert.isTrue(multiBarBar1 !== null);
      assert.isTrue(multiBarBar2 !== null);
      assert.isTrue(multiBarBar3 !== null);
    });

    test('multiBarBar barRect created', function() {
      assert.equal(barRect.node().tagName,'rect');
      assert.equal(barRect2.node().tagName,'rect');
      assert.equal(barRect3.node().tagName,'rect');
    });

    test('multiBarBar1 bar series ID', function() {
      assert.equal(barRect.attr('series-id'),'bar_mySeries_0');
    });

    test('multiBarBar1 bar series has the right color', function() {
      assert.equal(barRect.attr('fill').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('multiBarBar1 bar width', function() {
      var bars = barRect.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('width')), 168, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('width')), 120, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('width')), 129, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('width')), 99, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('width')), 141, 1);
    });

    test('multiBarBar1 bar x', function() {
      var bars = barRect.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[1]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[2]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[3]).attr('x'), 0);
      assert.equal(Px.d3.select(bars[4]).attr('x'), 0);
    });

    test('multiBarBar1 bar y', function() {
      var bars = barRect.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('y'), 240);
      assert.equal(Px.d3.select(bars[1]).attr('y'), 180);
      assert.equal(Px.d3.select(bars[2]).attr('y'), 120);
      assert.equal(Px.d3.select(bars[3]).attr('y'), 60);
      assert.equal(Px.d3.select(bars[4]).attr('y'), 0);
    });

    test('multiBarBar1 bar heights', function() {
      assert.equal(barRect.attr('height'), 30);
    });

    test('multiBarBar2 bar series ID', function() {
      assert.equal(barRect2.attr('series-id'),'bar_mySeries2_0');
    });

    test('multiBarBar2 bar series has the right color', function() {
      assert.equal(barRect2.attr('fill').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('multiBarBar2 bar width', function() {
      var bars = barRect2.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('width')), 90, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('width')), 120, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('width')), 90, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('width')), 120, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('width')), 120, 1);
    });

    test('multiBarBar2 bar x', function() {
      var bars = barRect2.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('x')), 168, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('x')), 120, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('x')), 129, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('x')), 99, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('x')), 141, 1);
    });

    test('multiBarBar2 bar y', function() {
      var bars = barRect2.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('y'), 240);
      assert.equal(Px.d3.select(bars[1]).attr('y'), 180);
      assert.equal(Px.d3.select(bars[2]).attr('y'), 120);
      assert.equal(Px.d3.select(bars[3]).attr('y'), 60);
      assert.equal(Px.d3.select(bars[4]).attr('y'), 0);
    });

    test('multiBarBar2 bar heights', function() {
      assert.equal(barRect2.attr('height'), 30);
    });

    test('multiBarBar3 bar series ID', function() {
      assert.equal(barRect3.attr('series-id'),'bar_mySeries3_0');
    });

    test('multiBarBar3 bar series has the right color', function() {
      assert.equal(barRect3.attr('fill').split(' ').join(''),colorSet[ colorOrder[2] ]);
    });

    test('multiBarBar3 bar width', function() {
      var bars = barRect3.nodes();

      assert.closeTo(Number(Px.d3.select(bars[0]).attr('width')), 30, 1);
      assert.closeTo(Number(Px.d3.select(bars[1]).attr('width')), 60, 1);
      assert.closeTo(Number(Px.d3.select(bars[2]).attr('width')), 90, 1);
      assert.closeTo(Number(Px.d3.select(bars[3]).attr('width')), 150, 1);
      assert.closeTo(Number(Px.d3.select(bars[4]).attr('width')), 180, 1);
    });

    test('multiBarBar3 bar x', function() {
      var bars = barRect3.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('x'), 258);
      assert.equal(Px.d3.select(bars[1]).attr('x'), 240);
      assert.equal(Px.d3.select(bars[2]).attr('x'), 219);
      assert.equal(Px.d3.select(bars[3]).attr('x'), 219);
      assert.equal(Px.d3.select(bars[4]).attr('x'), 261);
    });

    test('multiBarBar3 bar y', function() {
      var bars = barRect3.nodes();

      assert.equal(Px.d3.select(bars[0]).attr('y'), 240);
      assert.equal(Px.d3.select(bars[1]).attr('y'), 180);
      assert.equal(Px.d3.select(bars[2]).attr('y'), 120);
      assert.equal(Px.d3.select(bars[3]).attr('y'), 60);
      assert.equal(Px.d3.select(bars[4]).attr('y'), 0);
    });

    test('multiBarBar3 bar heights', function() {
      assert.equal(barRect3.attr('height'), 30);
    });
  }); //suite
} //runTests
