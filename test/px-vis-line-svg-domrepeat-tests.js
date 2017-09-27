function runDRTests(){
  suite('px-vis-line-svg in a dom-repeat', function() {
    suite('One line', function() {
      var domRepeatScale = document.getElementById('domRepeatScale'),
          domRepeatSVG = document.getElementById('domRepeatSVG'),
          domRepeatDomBind = document.getElementById('domRepeatDomBind');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
      var domRepeatLines, linePath1;

      suiteSetup(function(done){
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
              "y":"y",
              "color": colorSet[0]
            }
          },
          seriesKeys = ['mySeries'],
          chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        var rendered = function() {
          domRepeatLines = document.querySelectorAll('.domRepeatLines');
          linePath1 =  domRepeatLines[0].lineGroup.select('path.series-line');

          document.getElementById('domRepeatDiv').removeEventListener('px-vis-line-svg-rendering-ended', rendered);

          done();
        };

        document.getElementById('domRepeatDiv').addEventListener('px-vis-line-svg-rendering-ended', rendered);

        domRepeatDomBind._myClass = function() { return 'domRepeatLines' };

        domRepeatSVG.set('width',w);
        domRepeatSVG.set('height',h);
        domRepeatSVG.set('margin',m);

        domRepeatScale.set('width',w);
        domRepeatScale.set('height',h);
        domRepeatScale.set('margin',m);
        domRepeatScale.set('chartExtents',chartExtents);
        domRepeatScale.set('dataExtents',chartExtents);

        domRepeatDomBind.set('completeSeriesConfig',completeSeriesConfig);
        domRepeatDomBind.set('seriesKeys',seriesKeys);
        domRepeatDomBind.set('chartData',d);
      });

      test('domRepeatLine1 fixture is created', function() {
        assert.lengthOf(domRepeatLines, 1);
      });

      test('domRepeatLine svg has correct number of paths', function() {
        var lines = domRepeatSVG.svg.selectAll('path.series-line');
        assert.lengthOf(lines.nodes(), 1);
      });

      test('domRepeatLine1 linePath created', function() {
        assert.equal(linePath1.node().tagName,'path');
      });
      test('domRepeatLine1 line series ID is set', function() {
        assert.equal(linePath1.attr('series-id'),'line_mySeries');
      });
      test('domRepeatLine1 line series has the right stroke opacity', function() {
        assert.equal(linePath1.attr('stroke-opacity'),1);
      });
      test('domRepeatLine1 line series has the right color', function() {
        assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[0]);
      });
      test('domRepeatLine1 line d', function() {
        assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210L240170L360230L480210');
      });
    }); //suite

    suite('three lines', function() {
      var domRepeatScale = document.getElementById('domRepeatScale'),
          domRepeatSVG = document.getElementById('domRepeatSVG'),
          domRepeatDomBind = document.getElementById('domRepeatDomBind');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
      var domRepeatLines, linePath1, linePath2, linePath3;

      suiteSetup(function(done){
        var d = [{
              "x": 1397102460000,
              "y": 1,
              "y2": 1,
              "y3": 1
            },{
              "x": 1397131620000,
              "y": 6,
              "y2": 21,
              "y3": 8
            },{
              "x": 1397160780000,
              "y": 10,
              "y2": 3,
              "y3": 10
            },{
              "x": 1397189940000,
              "y": 4,
              "y2": 10,
              "y3": 15
            },{
              "x": 1397219100000,
              "y": 6,
              "y2": 27,
              "y3": 20
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y",
              "color": colorSet[0]
            },
            "mySeries2":{
              "type":"line",
              "name":"mySeries2",
              "x":"x",
              "y":"y2",
              "color": colorSet[1]
            },
            "mySeries3":{
              "type":"line",
              "name":"mySeries3",
              "x":"x",
              "y":"y3",
              "color": colorSet[2]
            }
          },
          seriesKeys = ['mySeries', 'mySeries2', 'mySeries3'],
          chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          },
          counter =0;

        var rendered = function() {
          counter++;

          if(counter === 3) {
            domRepeatLines = document.querySelectorAll('.domRepeatLines');
            linePath1 =  domRepeatLines[0].lineGroup.select('path.series-line');
            linePath2 =  domRepeatLines[1].lineGroup.select('path.series-line');
            linePath3 =  domRepeatLines[2].lineGroup.select('path.series-line');

            document.getElementById('domRepeatDiv').removeEventListener('px-vis-line-svg-rendering-ended', rendered);

            done();
          }
        };

        document.getElementById('domRepeatDiv').addEventListener('px-vis-line-svg-rendering-ended', rendered);

        domRepeatDomBind._myClass = function(item) { return 'domRepeatLines' };


        domRepeatDomBind.set('completeSeriesConfig',completeSeriesConfig);
        domRepeatDomBind.set('seriesKeys',seriesKeys);
        domRepeatDomBind.set('chartData',d);
      });

      test('domRepeatLine fixture is created', function() {
        assert.lengthOf(domRepeatLines, 3);
      });

      test('domRepeatLine svg has correct number of paths', function() {
        var domRepeatSVG = document.getElementById('domRepeatSVG');
        var lines = domRepeatSVG.svg.selectAll('path.series-line');
        assert.lengthOf(lines.nodes(), 3);
      });

      test('domRepeatLine1 linePath created', function() {
        assert.equal(linePath1.node().tagName,'path');
      });
      test('domRepeatLine1 line series ID is set', function() {
        assert.equal(linePath1.attr('series-id'),'line_mySeries');
      });
      test('domRepeatLine1 line series has the right stroke opacity', function() {
        assert.equal(linePath1.attr('stroke-opacity'),1);
      });
      test('domRepeatLine1 line series has the right color', function() {
        assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[0]);
      });
      test('domRepeatLine1 line d', function() {
        assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210L240170L360230L480210');
      });

      test('domRepeatLine2 linePath created', function() {
        assert.equal(linePath2.node().tagName,'path');
      });
      test('domRepeatLine2 line series ID is set', function() {
        assert.equal(linePath2.attr('series-id'),'line_mySeries2');
      });
      test('domRepeatLine2 line series has the right stroke opacity', function() {
        assert.equal(linePath2.attr('stroke-opacity'),1);
      });
      test('domRepeatLine2 line series has the right color', function() {
        assert.equal(linePath2.attr('stroke').split(' ').join(''),colorSet[1]);
      });
      test('domRepeatLine2 line d', function() {
        assert.equal(linePath2.attr('d').split(/[\s,]+/).join(''),'M0260L12060L240240L360170L4800');
      });

      test('domRepeatLine3 linePath created', function() {
        assert.equal(linePath3.node().tagName,'path');
      });
      test('domRepeatLine3 line series ID is set', function() {
        assert.equal(linePath3.attr('series-id'),'line_mySeries3');
      });
      test('domRepeatLine3 line series has the right stroke opacity', function() {
        assert.equal(linePath3.attr('stroke-opacity'),1);
      });
      test('domRepeatLine3 line series has the right color', function() {
        assert.equal(linePath3.attr('stroke').split(' ').join(''),colorSet[2]);
      });
      test('domRepeatLine3 line d', function() {
        assert.equal(linePath3.attr('d').split(/[\s,]+/).join(''),'M0260L120190L240170L360120L48070');
      });
    }); //suite

    suite('delete #2', function() {
      var domRepeatScale = document.getElementById('domRepeatScale'),
          domRepeatSVG = document.getElementById('domRepeatSVG'),
          domRepeatDomBind = document.getElementById('domRepeatDomBind');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
      var domRepeatLines, linePath1, linePath2, linePath3;

      suiteSetup(function(done){
        var d = [{
              "x": 1397102460000,
              "y": 1,
              "y3": 1
            },{
              "x": 1397131620000,
              "y": 6,
              "y3": 8
            },{
              "x": 1397160780000,
              "y": 10,
              "y3": 10
            },{
              "x": 1397189940000,
              "y": 4,
              "y3": 15
            },{
              "x": 1397219100000,
              "y": 6,
              "y3": 20
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y",
              "color": colorSet[0]
            },
            "mySeries3":{
              "type":"line",
              "name":"mySeries3",
              "x":"x",
              "y":"y3",
              "color": colorSet[2]
            }
          },
          seriesKeys = ['mySeries', 'mySeries3'],
          chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          },
          counter = 0;

        var rendered = function() {
          counter++;

          if(counter === 2) {
            domRepeatLines = document.querySelectorAll('.domRepeatLines');
            linePath1 =  domRepeatLines[0].lineGroup.select('path.series-line');
            linePath3 =  domRepeatLines[1].lineGroup.select('path.series-line');

            document.getElementById('domRepeatDiv').removeEventListener('px-vis-line-svg-rendering-ended', rendered);

            done();
          }
        };

        document.getElementById('domRepeatDiv').addEventListener('px-vis-line-svg-rendering-ended', rendered);


        domRepeatDomBind._myClass = function(item) { return 'domRepeatLines' };

        domRepeatDomBind.set('seriesKeys',seriesKeys);
        domRepeatDomBind.set('chartData',d);
        window.setTimeout(function() {
          domRepeatDomBind.set('completeSeriesConfig',completeSeriesConfig);
        },10);

      });

      test('domRepeatLine fixture is created', function() {
        assert.lengthOf(domRepeatLines, 2);
      });

      test('domRepeatLine svg has correct number of paths', function() {
        var domRepeatSVG = document.getElementById('domRepeatSVG');
        var lines = domRepeatSVG.svg.selectAll('path.series-line');
        assert.lengthOf(lines.nodes(), 2);
      });

      test('domRepeatLine1 linePath created', function() {
        assert.equal(linePath1.node().tagName,'path');
      });
      test('domRepeatLine1 line series ID is set', function() {
        assert.equal(linePath1.attr('series-id'),'line_mySeries');
      });
      test('domRepeatLine1 line series has the right stroke opacity', function() {
        assert.equal(linePath1.attr('stroke-opacity'),1);
      });
      test('domRepeatLine1 line series has the right color', function() {
        assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[0]);
      });
      test('domRepeatLine1 line d', function() {
        assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210L240170L360230L480210');
      });

      test('domRepeatLine3 linePath created', function() {
        assert.equal(linePath3.node().tagName,'path');
      });
      test('domRepeatLine3 line series ID is set', function() {
        assert.equal(linePath3.attr('series-id'),'line_mySeries3');
      });
      test('domRepeatLine3 line series has the right stroke opacity', function() {
        assert.equal(linePath3.attr('stroke-opacity'),1);
      });
      test('domRepeatLine3 line series has the right color', function() {
        assert.equal(linePath3.attr('stroke').split(' ').join(''),colorSet[2]);
      });
      test('domRepeatLine3 line d', function() {
        assert.equal(linePath3.attr('d').split(/[\s,]+/).join(''),'M0260L120190L240170L360120L48070');
      });
    }); //suite

    suite('add #4', function() {
      var domRepeatScale = document.getElementById('domRepeatScale'),
          domRepeatSVG = document.getElementById('domRepeatSVG'),
          domRepeatDomBind = document.getElementById('domRepeatDomBind');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
      var domRepeatLines, linePath1, linePath4, linePath3;

      suiteSetup(function(done){
        var d = [{
              "x": 1397102460000,
              "y": 1,
              "y3": 1,
              "y4": 1
            },{
              "x": 1397131620000,
              "y": 6,
              "y3": 8,
              "y4": 3
            },{
              "x": 1397160780000,
              "y": 10,
              "y3": 10,
              "y4": 6
            },{
              "x": 1397189940000,
              "y": 4,
              "y3": 15,
              "y4": 9
            },{
              "x": 1397219100000,
              "y": 6,
              "y3": 20,
              "y4": 12
            }
          ],
          completeSeriesConfig = {
            "mySeries":{
              "type":"line",
              "name":"mySeries",
              "x":"x",
              "y":"y",
              "color": colorSet[0]
            },
            "mySeries3":{
              "type":"line",
              "name":"mySeries3",
              "x":"x",
              "y":"y3",
              "color": colorSet[2]
            },
            "mySeries4":{
              "type":"line",
              "name":"mySeries4",
              "x":"x",
              "y":"y4",
              "color": colorSet[3]
            }
          },
          seriesKeys = ['mySeries', 'mySeries4', 'mySeries3'],
          chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          },
          counter =0;

         var rendered = function() {
          counter++;

          if(counter === 3) {
            domRepeatLines = document.querySelectorAll('.domRepeatLines');
            linePath1 =  domRepeatLines[0].lineGroup.select('path.series-line');
            linePath4 =  domRepeatLines[1].lineGroup.select('path.series-line');
            linePath3 =  domRepeatLines[2].lineGroup.select('path.series-line');

            document.getElementById('domRepeatDiv').removeEventListener('px-vis-line-svg-rendering-ended', rendered);

            done();
          }
        };

        document.getElementById('domRepeatDiv').addEventListener('px-vis-line-svg-rendering-ended', rendered);


        domRepeatDomBind._myClass = function(item) { return 'domRepeatLines' };

        domRepeatDomBind.set('completeSeriesConfig',completeSeriesConfig);
        domRepeatDomBind.set('seriesKeys',seriesKeys);
        domRepeatDomBind.set('chartData',d);
      });

      test('domRepeatLine fixture is created', function() {
        assert.lengthOf(domRepeatLines, 3);
      });

      test('domRepeatLine svg has correct number of paths', function() {
        var domRepeatSVG = document.getElementById('domRepeatSVG');
        var lines = domRepeatSVG.svg.selectAll('path.series-line');
        assert.lengthOf(lines.nodes(), 3);
      });

      test('domRepeatLine1 linePath created', function() {
        assert.equal(linePath1.node().tagName,'path');
      });
      test('domRepeatLine1 line series ID is set', function() {
        assert.equal(linePath1.attr('series-id'),'line_mySeries');
      });
      test('domRepeatLine1 line series has the right stroke opacity', function() {
        assert.equal(linePath1.attr('stroke-opacity'),1);
      });
      test('domRepeatLine1 line series has the right color', function() {
        assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[0]);
      });
      test('domRepeatLine1 line d', function() {
        assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210L240170L360230L480210');
      });

      test('domRepeatLine4 linePath created', function() {
        assert.equal(linePath4.node().tagName,'path');
      });
      test('domRepeatLine4 line series ID is set', function() {
        assert.equal(linePath4.attr('series-id'),'line_mySeries4');
      });
      test('domRepeatLine4 line series has the right stroke opacity', function() {
        assert.equal(linePath4.attr('stroke-opacity'),1);
      });
      test('domRepeatLine4 line series has the right color', function() {
        assert.equal(linePath4.attr('stroke').split(' ').join(''),colorSet[3]);
      });
      test('domRepeatLine4 line d', function() {
        assert.equal(linePath4.attr('d').split(/[\s,]+/).join(''),'M0260L120240L240210L360180L480150');
      });

      test('domRepeatLine3 linePath created', function() {
        assert.equal(linePath3.node().tagName,'path');
      });
      test('domRepeatLine3 line series ID is set', function() {
        assert.equal(linePath3.attr('series-id'),'line_mySeries3');
      });
      test('domRepeatLine3 line series has the right stroke opacity', function() {
        assert.equal(linePath3.attr('stroke-opacity'),1);
      });
      test('domRepeatLine3 line series has the right color', function() {
        assert.equal(linePath3.attr('stroke').split(' ').join(''),colorSet[2]);
      });
      test('domRepeatLine3 line d', function() {
        assert.equal(linePath3.attr('d').split(/[\s,]+/).join(''),'M0260L120190L240170L360120L48070');
      });
    }); //suite

    suite('delete all', function() {
      var domRepeatScale = document.getElementById('domRepeatScale'),
          domRepeatSVG = document.getElementById('domRepeatSVG'),
          domRepeatDomBind = document.getElementById('domRepeatDomBind');


      var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
      var domRepeatLines;

      suiteSetup(function(done){
        var d = [],
          completeSeriesConfig = {},
          seriesKeys = [],
          chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
          w = 500,
          h = 300,
          m = {
            "top": 10,
            "right": 5,
            "bottom": 20,
            "left": 15
          };

        domRepeatDomBind._myClass = function(item) { return 'domRepeatLines' };

        domRepeatDomBind.set('seriesKeys',seriesKeys);
        domRepeatDomBind.set('chartData',d);
        window.setTimeout(function() { domRepeatDomBind.set('completeSeriesConfig',completeSeriesConfig); }, 10)

        window.setTimeout(function() {
          domRepeatLines = document.querySelectorAll('.domRepeatLines');
          done();
        }, 100);
      });

      test('domRepeatLine fixture is created', function() {
        assert.lengthOf(domRepeatLines, 0);
      });

      test('domRepeatLine svg has correct number of paths', function() {
        var domRepeatSVG = document.getElementById('domRepeatSVG');
        var lines = domRepeatSVG.svg.selectAll('path.series-line');
        assert.lengthOf(lines.nodes(), 0);
      });

    }); //suite

  }); //suite

} //runTests
