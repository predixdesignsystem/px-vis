document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-highlight-point does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-highlight-point setup works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        basePoint = document.getElementById('basePoint');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;

    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1
          },{
            "x": 1397131620000,
            "y": 6
          },{
            "x": 1397160780000,
            "y": 10
          },{
            "x": 1397189940000,
            "y": 4
          },{
            "x": 1397219100000,
            "y": 6
          }
        ],
        completeSeriesConfig = {
          "mySeries":{
            "type":"line",
            "name":"mySeries",
            "x":"x",
            "y":"y0",
            "color": colorSet[colorOrder[0]]
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y1",
            "color": colorSet[colorOrder[1]]
          },
        },
        chartExtents = {"x":[0,10],"y":[0,10]},
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

      setTimeout(function() {
          var g = baseSVG.svg.selectAll('g.layer')
              .data([0,1]);
          g.enter()
            .append("g")
            .attr("class", function(d,i) { return "layer" + i });

        basePoint.set('svg', baseSVG.svg.select('.layer1'));
        basePoint.set('layersToMask', baseSVG.svg.select('.layer0'));
        basePoint.set('timeData', 'timeStamp');
        basePoint.set('completeSeriesConfig',completeSeriesConfig);

        setTimeout(function() {
          done();
        }, 100);

      }, 100);

    });

    test('basePoint fixture is created', function() {
      assert.isTrue(basePoint !== null);
    });

    test('basePoint scatters not created', function() {
      assert.isUndefined(basePoint._circles);
    });

    test('basePoint base layer is not muted', function() {
      assert.isFalse(baseSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

    });
  }); //suite

  suite('px-vis-highlight-point mutes and draws', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        basePoint = document.getElementById('basePoint');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;

    suiteSetup(function(done) {
      var d = {
          "rawData":[{
            "timeStamp": 1397160780000,
            "x": 5,
            "y0": 4,
            "y1": 8
          }],
          "timeStamps": [1397160780000]
        };

      basePoint.set('crosshairData',d);

      setTimeout(function() { done(); }, 100);
    });

    test('basePoint scatters created', function() {
      assert.equal(basePoint._circles.node().tagName,'circle');
      assert.equal(basePoint._circles.nodes().length,2);
    });

    test('basePoint scatters have the right color', function() {
      assert.equal(Px.d3.select(basePoint._circles.nodes()[0]).attr('fill'), colorSet[colorOrder[0]]);
      assert.equal(Px.d3.select(basePoint._circles.nodes()[0]).attr('stroke'), colorSet[colorOrder[0]]);
      assert.equal(Px.d3.select(basePoint._circles.nodes()[1]).attr('fill'), colorSet[colorOrder[1]]);
      assert.equal(Px.d3.select(basePoint._circles.nodes()[1]).attr('stroke'), colorSet[colorOrder[1]]);
    });

    test('basePoint scatters x & y', function() {
      assert.equal(Px.d3.select(basePoint._circles.nodes()[0]).attr('cx'), 240);
      assert.equal(Px.d3.select(basePoint._circles.nodes()[0]).attr('cy'), 162);
      assert.equal(Px.d3.select(basePoint._circles.nodes()[1]).attr('cx'), 240);
      assert.equal(Px.d3.select(basePoint._circles.nodes()[1]).attr('cy'), 54);
    });

    test('basePoint base layer mutes', function() {
      assert.isTrue(baseSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

    });
  }); //suite

  suite('px-vis-highlight-point mutes and draws', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        basePoint = document.getElementById('basePoint');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;

    suiteSetup(function(done) {
      var d = {
          "rawData":[],
          "timeStamps": []
        };

      basePoint.set('crosshairData',d);

      setTimeout(function() { done(); }, 100);
    });

    test('basePoint scatters removed', function() {
      assert.equal(basePoint._circles.nodes().length, 0);
    });

    test('basePoint base layer unmutes', function() {
      assert.isFalse(baseSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

    });
  }); //suite

} //runTests
