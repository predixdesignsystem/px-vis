document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-highlight-point does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-highlight-point basic', function() {
    suite('px-vis-highlight-point setup works', function() {
      var baseScale = document.getElementById('baseScale'),
          baseSVG = document.getElementById('baseSVG'),
          basePoint = document.getElementById('basePoint');

      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;

      suiteSetup(function(done) {
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
              "x": 3,
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
  }); //suite



   suite('px-vis-highlight-point different dataset', function() {
    suite('px-vis-highlight-point setup works', function() {
      var differentScale = document.getElementById('differentScale'),
          differentSVG = document.getElementById('differentSVG'),
          differentPoint = document.getElementById('differentPoint');

      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;

      suiteSetup(function(done) {
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

        setTimeout(function() {
            var g = differentSVG.svg.selectAll('g.layer')
                .data([0,1]);
            g.enter()
              .append("g")
              .attr("class", function(d,i) { return "layer" + i });

          differentPoint.set('svg', differentSVG.svg.select('.layer1'));
          differentPoint.set('layersToMask', differentSVG.svg.select('.layer0'));
          differentPoint.set('timeData', 'timeStamp');
          differentPoint.set('completeSeriesConfig',completeSeriesConfig);
          differentPoint.set('chartData',d);

          setTimeout(function() {
            done();
          }, 100);

        }, 100);

      });

      test('differentPoint fixture is created', function() {
        assert.isTrue(differentPoint !== null);
      });

      test('differentPoint scatters not created', function() {
        assert.isUndefined(differentPoint._circles);
      });

      test('differentPoint different layer is not muted', function() {
        assert.isFalse(differentSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var differentScale = document.getElementById('differentScale'),
          differentSVG = document.getElementById('differentSVG'),
          differentPoint = document.getElementById('differentPoint');

      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;

      suiteSetup(function(done) {
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

        setTimeout(function() { done(); }, 100);
      });

      test('differentPoint scatters created', function() {
        assert.equal(differentPoint._circles.node().tagName,'circle');
        assert.equal(differentPoint._circles.nodes().length,2);
      });

      test('differentPoint scatters have the right color', function() {
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[0]).attr('fill'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[0]).attr('stroke'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[1]).attr('fill'), colorSet[colorOrder[1]]);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[1]).attr('stroke'), colorSet[colorOrder[1]]);
      });

      test('differentPoint scatters x & y', function() {
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[0]).attr('cx'), 240);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[0]).attr('cy'), 162);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[1]).attr('cx'), 240);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[1]).attr('cy'), 54);
      });

      test('differentPoint different layer mutes', function() {
        assert.isTrue(differentSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var differentScale = document.getElementById('differentScale'),
          differentSVG = document.getElementById('differentSVG'),
          differentPoint = document.getElementById('differentPoint');

      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;

      suiteSetup(function(done) {
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        differentPoint.set('crosshairData',d);

        setTimeout(function() { done(); }, 100);
      });

      test('differentPoint scatters removed', function() {
        assert.equal(differentPoint._circles.nodes().length, 0);
      });

      test('differentPoint different layer unmutes', function() {
        assert.isFalse(differentSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite
  }); //suite



  suite('px-vis-highlight-point fuzz', function() {
    suite('px-vis-highlight-point setup works', function() {
      var fuzzScale = document.getElementById('fuzzScale'),
          fuzzSVG = document.getElementById('fuzzSVG'),
          fuzzPoint = document.getElementById('fuzzPoint');

      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;

      suiteSetup(function(done) {
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

        setTimeout(function() {
            var g = fuzzSVG.svg.selectAll('g.layer')
                .data([0,1]);
            g.enter()
              .append("g")
              .attr("class", function(d,i) { return "layer" + i });

          fuzzPoint.set('svg', fuzzSVG.svg.select('.layer1'));
          fuzzPoint.set('layersToMask', fuzzSVG.svg.select('.layer0'));
          fuzzPoint.set('timeData', 'timeStamp');
          fuzzPoint.set('completeSeriesConfig',completeSeriesConfig);
          fuzzPoint.set('chartData',d);

          setTimeout(function() {
            done();
          }, 100);

        }, 100);

      });

      test('fuzzPoint fixture is created', function() {
        assert.isTrue(fuzzPoint !== null);
      });

      test('fuzzPoint scatters not created', function() {
        assert.isUndefined(fuzzPoint._circles);
      });

      test('fuzzPoint fuzz layer is not muted', function() {
        assert.isFalse(fuzzSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var fuzzScale = document.getElementById('fuzzScale'),
          fuzzSVG = document.getElementById('fuzzSVG'),
          fuzzPoint = document.getElementById('fuzzPoint');

      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;

      suiteSetup(function(done) {
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

        setTimeout(function() { done(); }, 100);
      });

      test('fuzzPoint scatters created', function() {
        assert.equal(fuzzPoint._circles.node().tagName,'circle');
        assert.equal(fuzzPoint._circles.nodes().length, 6);
      });

      test('fuzzPoint scatters have the right color', function() {
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('fill'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('stroke'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('fill'), colorSet[colorOrder[1]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('stroke'), colorSet[colorOrder[1]]);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('fill'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('stroke'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('fill'), colorSet[colorOrder[1]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('stroke'), colorSet[colorOrder[1]]);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('fill'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('stroke'), colorSet[colorOrder[0]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('fill'), colorSet[colorOrder[1]]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('stroke'), colorSet[colorOrder[1]]);
      });

      test('fuzzPoint scatters x & y', function() {
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('cx'), 240);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('cy'), 162);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('cx'), 240);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('cy'), 54);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('cx'), 360);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('cy'), 54);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('cx'), 360);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('cy'), 162);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('cx'), 120);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('cy'), 108);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('cx'), 120);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('cy'), 189);
      });

      test('fuzzPoint fuzz layer mutes', function() {
        assert.isTrue(fuzzSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var fuzzScale = document.getElementById('fuzzScale'),
          fuzzSVG = document.getElementById('fuzzSVG'),
          fuzzPoint = document.getElementById('fuzzPoint');

      var colorOrder = dataVisColors.properties.seriesColorOrder.value;
      var colorSet = dataVisColors.properties.dataVisColors.value;

      suiteSetup(function(done) {
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        fuzzPoint.set('crosshairData',d);

        setTimeout(function() { done(); }, 100);
      });

      test('fuzzPoint scatters removed', function() {
        assert.equal(fuzzPoint._circles.nodes().length, 0);
      });

      test('fuzzPoint fuzz layer unmutes', function() {
        assert.isFalse(fuzzSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite
  }); //suite

} //runTests
