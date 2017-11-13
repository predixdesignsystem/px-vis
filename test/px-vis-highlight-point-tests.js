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


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() {
            var g = baseSVG.svg.selectAll('g.layer')
                .data([0,1]);
            g.enter()
              .append("g")
              .attr("class", function(d,i) { return "layer" + i });

          basePoint.set('svg', baseSVG.svg.select('.layer1'));
          basePoint.set('layersToMask', baseSVG.svg.select('.layer0'));
          basePoint.set('timeData', 'timeStamp');
          basePoint.set('completeSeriesConfig',completeSeriesConfig);

          window.setTimeout(function() {
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

      test('basePoint didnt create defaultEmptyData', function() {
        assert.isNull(basePoint.defaultEmptyData);
      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var baseScale = document.getElementById('baseScale'),
          baseSVG = document.getElementById('baseSVG'),
          basePoint = document.getElementById('basePoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() { done(); }, 100);
      });

      test('basePoint scatters created', function() {
        assert.equal(basePoint._circles.node().tagName,'circle');
        assert.equal(basePoint._circles.nodes().length,2);
      });

      test('basePoint scatters have the right color', function() {
        assert.equal(Px.d3.select(basePoint._circles.nodes()[0]).attr('fill').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(basePoint._circles.nodes()[0]).attr('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(basePoint._circles.nodes()[1]).attr('fill').split(' ').join(''), colorSet[1]);
        assert.equal(Px.d3.select(basePoint._circles.nodes()[1]).attr('stroke').split(' ').join(''), colorSet[1]);
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

      test('tooltipPoint didnt create defaultEmptyData', function() {
        assert.isNull(basePoint.defaultEmptyData);
      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var baseScale = document.getElementById('baseScale'),
          baseSVG = document.getElementById('baseSVG'),
          basePoint = document.getElementById('basePoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        basePoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
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


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() {
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

          window.setTimeout(function() {
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


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() { done(); }, 100);
      });

      test('differentPoint scatters created', function() {
        assert.equal(differentPoint._circles.node().tagName,'circle');
        assert.equal(differentPoint._circles.nodes().length,2);
      });

      test('differentPoint scatters have the right color', function() {
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[0]).attr('fill').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[0]).attr('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[1]).attr('fill').split(' ').join(''), colorSet[1]);
        assert.equal(Px.d3.select(differentPoint._circles.nodes()[1]).attr('stroke').split(' ').join(''), colorSet[1]);
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


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        differentPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
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


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() {
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

          window.setTimeout(function() {
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


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() { done(); }, 100);
      });

      test('fuzzPoint scatters created', function() {
        assert.equal(fuzzPoint._circles.node().tagName,'circle');
        assert.equal(fuzzPoint._circles.nodes().length, 6);
      });

      test('fuzzPoint scatters have the right color', function() {
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('fill').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('fill').split(' ').join(''), colorSet[1]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('stroke').split(' ').join(''), colorSet[1]);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('fill').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('fill').split(' ').join(''), colorSet[1]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('stroke').split(' ').join(''), colorSet[1]);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('fill').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('fill').split(' ').join(''), colorSet[1]);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('stroke').split(' ').join(''), colorSet[1]);
      });

      test('fuzzPoint scatters x & y', function() {
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('cx'), 120);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[0]).attr('cy'), 108);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('cx'), 120);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[1]).attr('cy'), 189);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('cx'), 240);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[2]).attr('cy'), 162);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('cx'), 240);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[3]).attr('cy'), 54);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('cx'), 360);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[4]).attr('cy'), 54);

        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('cx'), 360);
        assert.equal(Px.d3.select(fuzzPoint._circles.nodes()[5]).attr('cy'), 162);
      });

      test('fuzzPoint fuzz layer mutes', function() {
        assert.isTrue(fuzzSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var fuzzScale = document.getElementById('fuzzScale'),
          fuzzSVG = document.getElementById('fuzzSVG'),
          fuzzPoint = document.getElementById('fuzzPoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        fuzzPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('fuzzPoint scatters removed', function() {
        assert.equal(fuzzPoint._circles.nodes().length, 0);
      });

      test('fuzzPoint fuzz layer unmutes', function() {
        assert.isFalse(fuzzSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite
  }); //suite




  suite('px-vis-highlight-point generatingCrosshairData', function() {
    suite('px-vis-highlight-point setup works', function() {
      var generatingScale = document.getElementById('generatingScale'),
          generatingSVG = document.getElementById('generatingSVG'),
          generatingPoint = document.getElementById('generatingPoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() {
            var g = generatingSVG.svg.selectAll('g.layer')
                .data([0,1]);
            g.enter()
              .append("g")
              .attr("class", function(d,i) { return "layer" + i });

          generatingPoint.set('svg', generatingSVG.svg.select('.layer1'));
          generatingPoint.set('layersToMask', generatingSVG.svg.select('.layer0'));
          generatingPoint.set('timeData', 'timeStamp');
          generatingPoint.set('completeSeriesConfig',completeSeriesConfig);

          window.setTimeout(function() {
            done();
          }, 100);

        }, 100);

      });

      test('generatingPoint fixture is created', function() {
        assert.isTrue(generatingPoint !== null);
      });

      test('generatingPoint scatters not created', function() {
        assert.isUndefined(generatingPoint._circles);
      });

      test('generatingPoint generating layer is not muted', function() {
        assert.isFalse(generatingSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var generatingScale = document.getElementById('generatingScale'),
          generatingSVG = document.getElementById('generatingSVG'),
          generatingPoint = document.getElementById('generatingPoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        generatingPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('generatingPoint scatters created', function() {
        assert.equal(generatingPoint._circles.node().tagName,'circle');
        assert.equal(generatingPoint._circles.nodes().length,2);
      });

      test('generatingPoint scatters have the right color', function() {
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[0]).attr('fill').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[0]).attr('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[1]).attr('fill').split(' ').join(''), colorSet[1]);
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[1]).attr('stroke').split(' ').join(''), colorSet[1]);
      });

      test('generatingPoint scatters x & y', function() {
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[0]).attr('cx'), 240);
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[0]).attr('cy'), 162);
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[1]).attr('cx'), 240);
        assert.equal(Px.d3.select(generatingPoint._circles.nodes()[1]).attr('cy'), 54);
      });

      test('generatingPoint generating layer mutes', function() {
        assert.isTrue(generatingSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var generatingScale = document.getElementById('generatingScale'),
          generatingSVG = document.getElementById('generatingSVG'),
          generatingPoint = document.getElementById('generatingPoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        generatingPoint.set('generatingCrosshairData',true);
        generatingPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('generatingPoint scatters removed', function() {
        assert.equal(generatingPoint._circles.nodes().length, 0);
      });

      test('generatingPoint generating layer unmutes', function() {
        assert.isFalse(generatingSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite
  }); //suite


  suite('px-vis-highlight-point drawWithLocalCrosshairData', function() {
    suite('px-vis-highlight-point setup works', function() {
      var forceScale = document.getElementById('forceScale'),
          forceSVG = document.getElementById('forceSVG'),
          forcePoint = document.getElementById('forcePoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() {
            var g = forceSVG.svg.selectAll('g.layer')
                .data([0,1]);
            g.enter()
              .append("g")
              .attr("class", function(d,i) { return "layer" + i });

          forcePoint.set('svg', forceSVG.svg.select('.layer1'));
          forcePoint.set('layersToMask', forceSVG.svg.select('.layer0'));
          forcePoint.set('timeData', 'timeStamp');
          forcePoint.set('completeSeriesConfig',completeSeriesConfig);
          forcePoint.set('drawWithLocalCrosshairData',true);

          window.setTimeout(function() {
            done();
          }, 100);

        }, 100);

      });

      test('forcePoint fixture is created', function() {
        assert.isTrue(forcePoint !== null);
      });

      test('forcePoint scatters not created', function() {
        assert.isUndefined(forcePoint._circles);
      });

      test('forcePoint force layer is not muted', function() {
        assert.isFalse(forceSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var forceScale = document.getElementById('forceScale'),
          forceSVG = document.getElementById('forceSVG'),
          forcePoint = document.getElementById('forcePoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        forcePoint.set('generatingCrosshairData',true);
        forcePoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('forcePoint scatters created', function() {
        assert.equal(forcePoint._circles.node().tagName,'circle');
        assert.equal(forcePoint._circles.nodes().length,2);
      });

      test('forcePoint scatters have the right color', function() {
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[0]).attr('fill').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[0]).attr('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[1]).attr('fill').split(' ').join(''), colorSet[1]);
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[1]).attr('stroke').split(' ').join(''), colorSet[1]);
      });

      test('forcePoint scatters x & y', function() {
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[0]).attr('cx'), 240);
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[0]).attr('cy'), 162);
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[1]).attr('cx'), 240);
        assert.equal(Px.d3.select(forcePoint._circles.nodes()[1]).attr('cy'), 54);
      });

      test('forcePoint force layer mutes', function() {
        assert.isTrue(forceSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var forceScale = document.getElementById('forceScale'),
          forceSVG = document.getElementById('forceSVG'),
          forcePoint = document.getElementById('forcePoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
        var d = {
            "rawData":[],
            "timeStamps": []
          };

        forcePoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('forcePoint scatters removed', function() {
        assert.equal(forcePoint._circles.nodes().length, 0);
      });

      test('forcePoint force layer unmutes', function() {
        assert.isFalse(forceSVG.svg.select('.layer0').node().classList.contains("secondaryDataMask"));

      });
    }); //suite
  }); //suite


  suite('px-vis-highlight-point creates tooltip data', function() {
    suite('px-vis-highlight-point setup works', function() {
      var tooltipScale = document.getElementById('tooltipScale'),
          tooltipSVG = document.getElementById('tooltipSVG'),
          tooltipPoint = document.getElementById('tooltipPoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        window.setTimeout(function() {
            var g = tooltipSVG.svg.selectAll('g.layer')
                .data([0,1]);
            g.enter()
              .append("g")
              .attr("class", function(d,i) { return "layer" + i });

          tooltipPoint.set('svg', tooltipSVG.svg.select('.layer1'));
          tooltipPoint.set('layersToMask', tooltipSVG.svg.select('.layer0'));
          tooltipPoint.set('seriesKeys', Object.keys(completeSeriesConfig));
          tooltipPoint.set('timeData', 'timeStamp');
          tooltipPoint.set('completeSeriesConfig',completeSeriesConfig);
          tooltipPoint.set('showTooltipData',true);

          window.setTimeout(function() {
            done();
          }, 100);

        }, 100);

      });

      test('tooltipPoint didnt create defaultEmptyData', function() {
        assert.isNull(tooltipPoint.defaultEmptyData);
      });
    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var tooltipScale = document.getElementById('tooltipScale'),
          tooltipSVG = document.getElementById('tooltipSVG'),
          tooltipPoint = document.getElementById('tooltipPoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

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

        tooltipPoint.set('crosshairData',d);

        window.setTimeout(function() { done(); }, 100);
      });

      test('tooltipPoint created defaultEmptyData', function() {
        assert.deepEqual(tooltipPoint.defaultEmptyData, {"time":1397160780000,"timeSeriesKey":null,"hidden":true,"series":[{"name":"mySeries","value":{"x":3,"y0":4},"coord":[240,162]},{"name":"mySeries2","value":{"x":3,"y1":8},"coord":[240,54]}],"mouse":[240,162],"xArr":[],"yArr":[],"rawData":[],"timeStamps":[],"timeStampsTracker":{}});
      });

      test('tooltipPoint created tooltipData', function() {
        assert.deepEqual(tooltipPoint.tooltipData, {"time":1397160780000,"timeSeriesKey":null,"hidden":true,"series":[{"name":"mySeries","value":{"x":3,"y0":4},"coord":[240,162]},{"name":"mySeries2","value":{"x":3,"y1":8},"coord":[240,54]}],"mouse":[240,162],"xArr":[],"yArr":[],"rawData":[],"timeStamps":[],"timeStampsTracker":{}});
      });

    }); //suite

    suite('px-vis-highlight-point mutes and draws', function() {
      var tooltipScale = document.getElementById('tooltipScale'),
          tooltipSVG = document.getElementById('tooltipSVG'),
          tooltipPoint = document.getElementById('tooltipPoint');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

      suiteSetup(function(done) {
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
        assert.deepEqual(tooltipPoint.tooltipData, {"time":null,"timeSeriesKey":null,"hidden":true,"series":[{"name":"mySeries","value":null},{"name":"mySeries2","value":null}],"mouse":null,"xArr":null,"yArr":null});
      });

    }); //suite
  }); //suite

} //runTests
