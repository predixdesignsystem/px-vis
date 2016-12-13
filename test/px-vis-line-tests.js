document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-line does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-line works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseLine = document.getElementById('baseLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

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
        completeSeriesConfig = {"mySeries":{
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
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
      baseScale.set('chartData',d);

      baseLine.set('seriesId',"mySeries");
      baseLine.set('completeSeriesConfig',completeSeriesConfig);
      baseLine.set('chartData',d);

      // needed for the debounce in line
      setTimeout(function(){
        linePath =  baseLine.lineGroup.select('path.series-line');
        done();
      },100);;
    });

    test('baseLine fixture is created', function() {
      assert.isTrue(baseLine !== null);
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('baseLine line d', function() {
      assert.equal(linePath.attr('d').split(/[\s,]+/).join(''),'M0243L120108L2400L360162L480108');
    });
  }); //suite

  suite('px-vis-line with two series works', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath1,linePath2;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "mySeries":{
            "type":"line",
            "name":"mySeries",
            "x":"x",
            "y":"y",
            "color": "rgb(93,165,218)"
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": "rgb(250,164,58)"
          }
        },
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      mutedSVG.set('width',w);
      mutedSVG.set('height',h);
      mutedSVG.set('margin',m);

      mutedScale.set('width',w);
      mutedScale.set('height',h);
      mutedScale.set('margin',m);
      mutedScale.set('completeSeriesConfig',completeSeriesConfig);
      mutedScale.set('chartExtents',chartExtents);
      mutedScale.set('chartData',d);

      mutedLine1.set('completeSeriesConfig',completeSeriesConfig);
      mutedLine1.set('seriesId',"mySeries");
      mutedLine1.set('chartData',d);

      mutedLine2.set('completeSeriesConfig',completeSeriesConfig);
      mutedLine2.set('seriesId',"mySeries2");
      mutedLine2.set('chartData',d);
      setTimeout(function(){
        linePath1 = mutedLine1.lineGroup.select('path.series-line');
        linePath2 = mutedLine2.lineGroup.select('path.series-line');
        done();
      },100);;
    });

    test('mutedLine1 fixture is created', function() {
      assert.isTrue(mutedLine1 !== null);
    });
    test('mutedLine2 fixture is created', function() {
      assert.isTrue(mutedLine2 !== null);
    });

    test('mutedLine1 linePath created', function() {
      assert.equal(linePath1.node().tagName,'path');
    });
    test('mutedLine1 line series ID is set', function() {
      assert.equal(linePath1.attr('series-id'),'line_mySeries');
    });
    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(linePath1.attr('stroke-opacity'),1);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });
    test('mutedLine1 line d', function() {
      assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210L240170L360230L480210');
    });

    test('mutedLine2 linePath created', function() {
      assert.equal(linePath2.node().tagName,'path');
    });
    test('mutedLine2 line series ID is set', function() {
      assert.equal(linePath2.attr('series-id'),'line_mySeries2');
    });
    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(linePath2.attr('stroke-opacity'),1);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(linePath2.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });
    test('mutedLine2 line d', function() {
      assert.equal(linePath2.attr('d').split(/[\s,]+/).join(''),'M0260L12060L240240L360170L4800');
    });
  }); //suite

  suite('px-vis-line mutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":false,
        "mySeries2":true
      };
      mutedLine1.set('mutedSeries',m);
      mutedLine2.set('mutedSeries',m);
      // setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine1.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),0.3);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

  }); //suite

  suite('px-vis-line unmutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":false,
        "mySeries2":false
      };
      mutedLine1.set('mutedSeries',m);
      mutedLine2.set('mutedSeries',m);
      // setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine1.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });
  }); //suite

  suite('px-vis-line with custom muted opacity', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":true,
        "mySeries2":true
      };
      mutedLine1.set('mutedOpacity',0);
      mutedLine2.set('mutedOpacity',0.6);
      mutedLine1.set('mutedSeries',m);
      mutedLine2.set('mutedSeries',m);
      // setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine1.linePath.attr('stroke-opacity'),0);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),0.6);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

  }); //suite

  suite('px-vis-line with missing data', function() {
    var missingDataPointScale = document.getElementById('missingDataPointScale'),
        missingDataPointSVG = document.getElementById('missingDataPointSVG'),
        missingDataPointLine1 = document.getElementById('missingDataPointLine1'),
        missingDataPointLine2 = document.getElementById('missingDataPointLine2');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath1,linePath2;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21
          },{
            "x": 1397160780000,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "mySeries":{
            "type":"line",
            "name":"mySeries",
            "x":"x",
            "y":"y",
            "color": "rgb(93,165,218)"
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": "rgb(250,164,58)"
          }
        },
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      missingDataPointSVG.set('width',w);
      missingDataPointSVG.set('height',h);
      missingDataPointSVG.set('margin',m);

      missingDataPointScale.set('width',w);
      missingDataPointScale.set('height',h);
      missingDataPointScale.set('margin',m);
      missingDataPointScale.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointScale.set('chartExtents',chartExtents);
      missingDataPointScale.set('chartData',d);

      missingDataPointLine1.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine1.set('seriesId',"mySeries");
      missingDataPointLine1.set('chartData',d);

      missingDataPointLine2.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine2.set('seriesId',"mySeries2");
      missingDataPointLine2.set('chartData',d);
      setTimeout(function(){
        linePath1 = missingDataPointLine1.lineGroup.select('path.series-line');
        linePath2 = missingDataPointLine2.lineGroup.select('path.series-line');
        done();
      },100);;
    });

    test('missingDataPointLine1 fixture is created', function() {
      assert.isTrue(missingDataPointLine1 !== null);
    });
    test('missingDataPointLine2 fixture is created', function() {
      assert.isTrue(missingDataPointLine2 !== null);
    });

    test('missingDataPointLine1 line d', function() {
      assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210M360230L480210');
    });

    test('missingDataPointLine2 line d', function() {
      assert.equal(linePath2.attr('d').split(/[\s,]+/).join(''),'M0260L12060L240240L360170L4800');
    });
  }); //suite

  // suite('px-vis-line with two series renders to canvas', function() {
  //   var canvasScale = document.getElementById('canvasScale'),
  //       canvasSVG = document.getElementById('canvasSVG'),
  //       canvasLine1 = document.getElementById('canvasLine1'),
  //       canvasLine2 = document.getElementById('canvasLine2');
  //
  //   var colorOrder = dataVisColors.properties.seriesColorOrder.value;
  //   var colorSet = dataVisColors.properties.dataVisColors.value;
  //   var linePath1,linePath2;
  //
  //   suiteSetup(function(done){
  //     var d = [{
  //           "x": 1397102460000,
  //           "y": 1,
  //           "y2": 1
  //         },{
  //           "x": 1397131620000,
  //           "y": 6,
  //           "y2": 21
  //         },{
  //           "x": 1397160780000,
  //           "y": 10,
  //           "y2": 3
  //         },{
  //           "x": 1397189940000,
  //           "y": 4,
  //           "y2": 10
  //         },{
  //           "x": 1397219100000,
  //           "y": 6,
  //           "y2": 27
  //         }
  //       ],
  //       completeSeriesConfig = {
  //         "mySeries":{
  //           "type":"line",
  //           "name":"mySeries",
  //           "x":"x",
  //           "y":"y",
  //           "color": "rgb(93,165,218)"
  //         },
  //         "mySeries2":{
  //           "type":"line",
  //           "name":"mySeries2",
  //           "x":"x",
  //           "y":"y2",
  //           "color": "rgb(250,164,58)"
  //         }
  //       },
  //       chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
  //       w = 500,
  //       h = 300,
  //       m = {
  //         "top": 10,
  //         "right": 5,
  //         "bottom": 20,
  //         "left": 15
  //       };
  //
  //     canvasSVG.set('width',w);
  //     canvasSVG.set('height',h);
  //     canvasSVG.set('margin',m);
  //
  //     canvasScale.set('width',w);
  //     canvasScale.set('height',h);
  //     canvasScale.set('margin',m);
  //     canvasScale.set('completeSeriesConfig',completeSeriesConfig);
  //     canvasScale.set('chartExtents',chartExtents);
  //     canvasScale.set('chartData',d);
  //
  //     canvasLine1.set('completeSeriesConfig',completeSeriesConfig);
  //     canvasLine1.set('seriesId',"mySeries");
  //     canvasLine1.set('chartData',d);
  //
  //     canvasLine2.set('completeSeriesConfig',completeSeriesConfig);
  //     canvasLine2.set('seriesId',"mySeries2");
  //     canvasLine2.set('chartData',d);
  //     setTimeout(function(){
  //       linePath1 = canvasLine1.lineGroup;
  //       linePath2 = canvasLine2.lineGroup;
  //       done();
  //     },100);;
  //   });
  //
  //   test('canvasLine1 fixture is created', function() {
  //     assert.isTrue(canvasLine1 !== null);
  //   });
  //   test('canvasLine2 fixture is created', function() {
  //     assert.isTrue(canvasLine2 !== null);
  //   });
  //
  //   test('context has correct total lines ', function() {
  //     assert.equal(canvasSVG.canvasContext._pxLinesTotal, 2);
  //   });
  //
  //   test('context has drawn 2 lines ', function() {
  //     assert.equal(canvasSVG.canvasContext._pxLinesRedraw, 2);
  //   });
  //
  //   test('context has added both to its list', function() {
  //     assert.equal(Object.keys(canvasSVG.canvasContext._pxLinesSeries).length, 2);
  //     assert.equal(canvasSVG.canvasContext._pxLinesSeries['mySeries'], true);
  //     assert.equal(canvasSVG.canvasContext._pxLinesSeries['mySeries2'], true);
  //   });
  //
  // }); //suite


  suite('px-vis-line renders parallel axis to SVG', function() {
    var parallelScale = document.getElementById('parallelScale'),
        parallelSVG = document.getElementById('parallelSVG'),
        parallelLine = document.getElementById('parallelLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(93,165,218)"
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
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
      parallelScale.set('chartExtents',chartExtents);
      parallelScale.set('dimensions',dim);
      parallelScale.set('axes',dim);
      parallelScale.set('chartData',d);

      parallelLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelLine.set('seriesId',"x");
      parallelLine.set('chartData',d);

      setTimeout(function(){
        linePath = parallelLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);;
    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelLine !== null);
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('baseLine line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });

    test('context has 0 total lines ', function() {
      assert.equal(parallelSVG.canvasContext._pxLinesTotal, 0);
    });

    test('context has drawn 0 lines ', function() {
      assert.equal(parallelSVG.canvasContext._pxLinesRedraw, 0);
    });

    test('context has no series in its list', function() {
      assert.equal(JSON.stringify(parallelSVG.canvasContext._pxLinesSeries), '{}');
    });

  }); //suite

  suite('px-vis-line renders parallel axis with gradient lines to SVG', function() {
    var paralleGradientlScale = document.getElementById('parallelGradientScale'),
        parallelGradientSVG = document.getElementById('parallelGradientSVG'),
        parallelGradientLine = document.getElementById('parallelGradientLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(93,165,218)"
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      parallelGradientSVG.set('width',w);
      parallelGradientSVG.set('height',h);
      parallelGradientSVG.set('margin',m);

      parallelGradientScale.set('width',w);
      parallelGradientScale.set('height',h);
      parallelGradientScale.set('margin',m);
      parallelGradientScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelGradientScale.set('chartExtents',chartExtents);
      parallelGradientScale.set('dimensions',dim);
      parallelGradientScale.set('axes',dim);
      parallelGradientScale.set('chartData',d);

      parallelGradientLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelGradientLine.set('seriesId',"x");
      parallelGradientLine.set('chartData',d);

      setTimeout(function(){
        linePath = parallelGradientLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);;
    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelGradientLine !== null);
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[0]).attr('stroke-opacity').split(' ').join('') * 10)/10,0.2);
      assert.equal(Math.round(d3.select(linePath.nodes()[1]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.4);
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.8);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('baseLine line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });

    test('context has 0 total lines ', function() {
      assert.equal(parallelGradientSVG.canvasContext._pxLinesTotal, 0);
    });

    test('context has drawn 0 lines ', function() {
      assert.equal(parallelGradientSVG.canvasContext._pxLinesRedraw, 0);
    });

    test('context has no series in its list', function() {
      assert.equal(JSON.stringify(parallelGradientSVG.canvasContext._pxLinesSeries), '{}');
    });

  }); //suite

  suite('px-vis-line renders parallel axis with multiple categories to SVG', function() {
    var parallelCategoryScale = document.getElementById('parallelCategoryScale'),
        parallelCategorySVG = document.getElementById('parallelCategorySVG'),
        parallelCategoryLine = document.getElementById('parallelCategoryLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(93,165,218)"
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(93,165,218)"
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(250,164,58)"
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      parallelCategorySVG.set('width',w);
      parallelCategorySVG.set('height',h);
      parallelCategorySVG.set('margin',m);

      parallelCategoryScale.set('width',w);
      parallelCategoryScale.set('height',h);
      parallelCategoryScale.set('margin',m);
      parallelCategoryScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryScale.set('chartExtents',chartExtents);
      parallelCategoryScale.set('dimensions',dim);
      parallelCategoryScale.set('axes',dim);
      parallelCategoryScale.set('chartData',d);

      parallelCategoryLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryLine.set('seriesId',"x");
      parallelCategoryLine.set('categoryKey',"cat");
      parallelCategoryLine.set('categories',categories);
      parallelCategoryLine.set('chartData',d);

      setTimeout(function(){
        linePath = parallelCategoryLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);;
    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelCategoryLine !== null);
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('baseLine line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });

    test('context has 0 total lines ', function() {
      assert.equal(parallelCategorySVG.canvasContext._pxLinesTotal, 0);
    });

    test('context has drawn 0 lines ', function() {
      assert.equal(parallelCategorySVG.canvasContext._pxLinesRedraw, 0);
    });

    test('context has no series in its list', function() {
      assert.equal(JSON.stringify(parallelCategorySVG.canvasContext._pxLinesSeries), '{}');
    });

  }); //suite

  suite('px-vis-line renders parallel axis with multiple categories and gradients to SVG', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(93,165,218)"
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(93,165,218)"
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": "rgb(250,164,58)"
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      parallelCategoryGradientSVG.set('width',w);
      parallelCategoryGradientSVG.set('height',h);
      parallelCategoryGradientSVG.set('margin',m);

      parallelCategoryGradientScale.set('width',w);
      parallelCategoryGradientScale.set('height',h);
      parallelCategoryGradientScale.set('margin',m);
      parallelCategoryGradientScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryGradientScale.set('chartExtents',chartExtents);
      parallelCategoryGradientScale.set('dimensions',dim);
      parallelCategoryGradientScale.set('axes',dim);
      parallelCategoryGradientScale.set('chartData',d);

      parallelCategoryGradientLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryGradientLine.set('seriesId',"x");
      parallelCategoryGradientLine.set('categoryKey',"cat");
      parallelCategoryGradientLine.set('categories',categories);
      parallelCategoryGradientLine.set('chartData',d);

      setTimeout(function(){
        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);
    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelCategoryGradientLine !== null);
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('baseLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[0]).attr('stroke-opacity').split(' ').join('') * 10)/10,0.2);
      assert.equal(Math.round(d3.select(linePath.nodes()[1]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.4);
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.8);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('baseLine line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });

    test('context has 0 total lines ', function() {
      assert.equal(parallelCategoryGradientSVG.canvasContext._pxLinesTotal, 0);
    });

    test('context has drawn 0 lines ', function() {
      assert.equal(parallelCategoryGradientSVG.canvasContext._pxLinesRedraw, 0);
    });

    test('context has no series in its list', function() {
      assert.equal(JSON.stringify(parallelCategoryGradientSVG.canvasContext._pxLinesSeries), '{}');
    });

  }); //suite

  suite('px-vis-line mutes parallel axis on SVG and selectedDomain changes gradient', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var m = {
        "1397102460000":true,
        "1397131620000":true
      };
      var sd = {'x':[1397160780000,1397219100000]};

      parallelCategoryGradientLine.set('selectedDomain',sd);
      parallelCategoryGradientLine.set('mutedSeries',m);

      setTimeout(function(){
        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.2);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(linePath.nodes()[0].style.display, 'none');
      assert.equal(linePath.nodes()[1].style.display, 'none');
      assert.equal(linePath.nodes()[2].style.display, '');
      assert.equal(linePath.nodes()[3].style.display, '');
      assert.equal(linePath.nodes()[4].style.display, '');
    });
  }); //suite

  suite('px-vis-line unmutes parallel axis on SVG and selectedDomain changes gradient', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var m = {};
      var sd = {'x':[1397102460000,1397219100000]};

      parallelCategoryGradientLine.set('selectedDomain',sd);
      parallelCategoryGradientLine.set('mutedSeries',m);

      setTimeout(function(){
        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);;
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[0]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.2);
      assert.equal(Math.round(d3.select(linePath.nodes()[1]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.4);
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.8);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('baseLine line series has the right opacity', function() {
      assert.equal(linePath.nodes()[0].style.display, '');
      assert.equal(linePath.nodes()[1].style.display, '');
      assert.equal(linePath.nodes()[2].style.display, '');
      assert.equal(linePath.nodes()[3].style.display, '');
      assert.equal(linePath.nodes()[4].style.display, '');
    });
  }); //suite


  // suite('px-vis-line renders parallel axis to canvas', function() {
  //   var parallelCanvasScale = document.getElementById('parallelCanvasScale'),
  //       parallelCanvasSVG = document.getElementById('parallelCanvasSVG'),
  //       parallelCanvasLine = document.getElementById('parallelCanvasLine');
  //
  //   var colorOrder = dataVisColors.properties.seriesColorOrder.value;
  //   var colorSet = dataVisColors.properties.dataVisColors.value;
  //   var linePath1;
  //
  //   suiteSetup(function(done){
  //     var d = [{
  //           "x": 1397102460000,
  //           "y": 1,
  //           "y2": 1
  //         },{
  //           "x": 1397131620000,
  //           "y": 6,
  //           "y2": 21
  //         },{
  //           "x": 1397160780000,
  //           "y": 10,
  //           "y2": 3
  //         },{
  //           "x": 1397189940000,
  //           "y": 4,
  //           "y2": 10
  //         },{
  //           "x": 1397219100000,
  //           "y": 6,
  //           "y2": 27
  //         }
  //       ],
  //       completeSeriesConfig = {
  //         "x":{
  //           "type":"line",
  //           "name":"mySeries",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(93,165,218)"
  //         }
  //       },
  //       dim = ['y','y2'],
  //       chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
  //       w = 500,
  //       h = 300,
  //       m = {
  //         "top": 10,
  //         "right": 5,
  //         "bottom": 20,
  //         "left": 15
  //       };
  //
  //     parallelCanvasSVG.set('width',w);
  //     parallelCanvasSVG.set('height',h);
  //     parallelCanvasSVG.set('margin',m);
  //
  //     parallelCanvasScale.set('width',w);
  //     parallelCanvasScale.set('height',h);
  //     parallelCanvasScale.set('margin',m);
  //     parallelCanvasScale.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelCanvasScale.set('chartExtents',chartExtents);
  //     parallelCanvasScale.set('dimensions',dim);
  //     parallelCanvasScale.set('axes',dim);
  //     parallelCanvasScale.set('chartData',d);
  //
  //     parallelCanvasLine.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelCanvasLine.set('seriesId',"x");
  //     parallelCanvasLine.set('chartData',d);
  //
  //     setTimeout(function(){
  //       linePath1 = parallelCanvasLine.lineGroup;
  //       done();
  //     },1000);;
  //   });
  //
  //   test('parallelCanvasLine fixture is created', function() {
  //     assert.isTrue(parallelCanvasLine !== null);
  //   });
  //
  //   test('context has correct total lines ', function() {
  //     assert.equal(parallelCanvasSVG.canvasContext._pxLinesTotal, 1);
  //   });
  //
  //   test('context has drawn 2 lines ', function() {
  //     assert.equal(parallelCanvasSVG.canvasContext._pxLinesRedraw, 1);
  //   });
  //
  //   test('context has added both to its list', function() {
  //     assert.equal(Object.keys(parallelCanvasSVG.canvasContext._pxLinesSeries).length, 1);
  //     assert.equal(parallelCanvasSVG.canvasContext._pxLinesSeries['x'], true);
  //   });
  //
  // }); //suite
  //
  // suite('px-vis-line renders parallel axis with gradient to canvas', function() {
  //   var parallelGradientCanvasScale = document.getElementById('parallelGradientCanvasScale'),
  //       parallelGradientCanvasSVG = document.getElementById('parallelGradientCanvasSVG'),
  //       parallelGradientCanvasLine = document.getElementById('parallelGradientCanvasLine');
  //
  //   var colorOrder = dataVisColors.properties.seriesColorOrder.value;
  //   var colorSet = dataVisColors.properties.dataVisColors.value;
  //   var linePath1;
  //
  //   suiteSetup(function(done){
  //     var d = [{
  //           "x": 1397102460000,
  //           "y": 1,
  //           "y2": 1
  //         },{
  //           "x": 1397131620000,
  //           "y": 6,
  //           "y2": 21
  //         },{
  //           "x": 1397160780000,
  //           "y": 10,
  //           "y2": 3
  //         },{
  //           "x": 1397189940000,
  //           "y": 4,
  //           "y2": 10
  //         },{
  //           "x": 1397219100000,
  //           "y": 6,
  //           "y2": 27
  //         }
  //       ],
  //       completeSeriesConfig = {
  //         "x":{
  //           "type":"line",
  //           "name":"mySeries",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(93,165,218)"
  //         }
  //       },
  //       dim = ['y','y2'],
  //       chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
  //       w = 500,
  //       h = 300,
  //       m = {
  //         "top": 10,
  //         "right": 5,
  //         "bottom": 20,
  //         "left": 15
  //       };
  //
  //     parallelGradientCanvasSVG.set('width',w);
  //     parallelGradientCanvasSVG.set('height',h);
  //     parallelGradientCanvasSVG.set('margin',m);
  //
  //     parallelGradientCanvasScale.set('width',w);
  //     parallelGradientCanvasScale.set('height',h);
  //     parallelGradientCanvasScale.set('margin',m);
  //     parallelGradientCanvasScale.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelGradientCanvasScale.set('chartExtents',chartExtents);
  //     parallelGradientCanvasScale.set('dimensions',dim);
  //     parallelGradientCanvasScale.set('axes',dim);
  //     parallelGradientCanvasScale.set('chartData',d);
  //
  //     parallelGradientCanvasLine.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelGradientCanvasLine.set('seriesId',"x");
  //     parallelGradientCanvasLine.set('chartData',d);
  //
  //     setTimeout(function(){
  //       linePath1 = parallelGradientCanvasLine.lineGroup;
  //       done();
  //     },1000);;
  //   });
  //
  //   test('parallelCanvasLine fixture is created', function() {
  //     assert.isTrue(parallelGradientCanvasLine !== null);
  //   });
  //
  //   test('context has correct total lines ', function() {
  //     assert.equal(parallelGradientCanvasSVG.canvasContext._pxLinesTotal, 1);
  //   });
  //
  //   test('context has drawn 2 lines ', function() {
  //     assert.equal(parallelGradientCanvasSVG.canvasContext._pxLinesRedraw, 1);
  //   });
  //
  //   test('context has added both to its list', function() {
  //     assert.equal(Object.keys(parallelCanvasSVG.canvasContext._pxLinesSeries).length, 1);
  //     assert.equal(parallelGradientCanvasSVG.canvasContext._pxLinesSeries['x'], true);
  //   });
  //
  // }); //suite
  //
  // suite('px-vis-line renders parallel axis with categories to canvas', function() {
  //   var parallelCategoryCanvasScale = document.getElementById('parallelCategoryCanvasScale'),
  //       parallelCategoryCanvasSVG = document.getElementById('parallelCategoryCanvasSVG'),
  //       parallelCategoryCanvasLine = document.getElementById('parallelCategoryCanvasLine');
  //
  //   var colorOrder = dataVisColors.properties.seriesColorOrder.value;
  //   var colorSet = dataVisColors.properties.dataVisColors.value;
  //   var linePath1;
  //
  //   suiteSetup(function(done){
  //     var d = [{
  //           "x": 1397102460000,
  //           "y": 1,
  //           "y2": 1,
  //           'cat': 'a'
  //         },{
  //           "x": 1397131620000,
  //           "y": 6,
  //           "y2": 21,
  //           'cat': 'a'
  //         },{
  //           "x": 1397160780000,
  //           "y": 10,
  //           "y2": 3,
  //           'cat': 'b'
  //         },{
  //           "x": 1397189940000,
  //           "y": 4,
  //           "y2": 10,
  //           'cat': 'a'
  //         },{
  //           "x": 1397219100000,
  //           "y": 6,
  //           "y2": 27,
  //           'cat': 'b'
  //         }
  //       ],
  //       completeSeriesConfig = {
  //         "x":{
  //           "type":"line",
  //           "name":"mySeries",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(93,165,218)"
  //         },
  //         "a":{
  //           "type":"line",
  //           "name":"a",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(93,165,218)"
  //         },
  //         "b":{
  //           "type":"line",
  //           "name":"b",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(250,164,58)"
  //         }
  //       },
  //       dim = ['y','y2'],
  //       chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
  //       categories = ['a','b'],
  //       w = 500,
  //       h = 300,
  //       m = {
  //         "top": 10,
  //         "right": 5,
  //         "bottom": 20,
  //         "left": 15
  //       };
  //
  //     parallelCategoryCanvasSVG.set('width',w);
  //     parallelCategoryCanvasSVG.set('height',h);
  //     parallelCategoryCanvasSVG.set('margin',m);
  //
  //     parallelCategoryCanvasScale.set('width',w);
  //     parallelCategoryCanvasScale.set('height',h);
  //     parallelCategoryCanvasScale.set('margin',m);
  //     parallelCategoryCanvasScale.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelCategoryCanvasScale.set('chartExtents',chartExtents);
  //     parallelCategoryCanvasScale.set('dimensions',dim);
  //     parallelCategoryCanvasScale.set('axes',dim);
  //     parallelCategoryCanvasScale.set('chartData',d);
  //
  //     parallelCategoryCanvasLine.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelCategoryCanvasLine.set('seriesId',"x");
  //     parallelCategoryCanvasLine.set('categoryKey','cat');
  //     parallelCategoryCanvasLine.set('categories',categories);
  //     parallelCategoryCanvasLine.set('chartData',d);
  //
  //     setTimeout(function(){
  //       linePath1 = parallelCategoryCanvasLine.lineGroup;
  //       done();
  //     },1000);;
  //   });
  //
  //   test('parallelCanvasLine fixture is created', function() {
  //     assert.isTrue(parallelCategoryCanvasLine !== null);
  //   });
  //
  //   test('context has correct total lines ', function() {
  //     assert.equal(parallelCategoryCanvasSVG.canvasContext._pxLinesTotal, 1);
  //   });
  //
  //   test('context has drawn 2 lines ', function() {
  //     assert.equal(parallelCategoryCanvasSVG.canvasContext._pxLinesRedraw, 1);
  //   });
  //
  //   test('context has added both to its list', function() {
  //     assert.equal(Object.keys(parallelCategoryCanvasSVG.canvasContext._pxLinesSeries).length, 1);
  //     assert.equal(parallelCategoryCanvasSVG.canvasContext._pxLinesSeries['x'], true);
  //   });
  //
  // }); //suite
  //
  // suite('px-vis-line renders parallel axis with categories and gradient to canvas', function() {
  //   var parallelCategoryGradientCanvasScale = document.getElementById('parallelCategoryGradientCanvasScale'),
  //       parallelCategoryGradientCanvasSVG = document.getElementById('parallelCategoryGradientCanvasSVG'),
  //       parallelCategoryGradientCanvasLine = document.getElementById('parallelCategoryGradientCanvasLine');
  //
  //   var colorOrder = dataVisColors.properties.seriesColorOrder.value;
  //   var colorSet = dataVisColors.properties.dataVisColors.value;
  //   var linePath1;
  //
  //   suiteSetup(function(done){
  //     var d = [{
  //           "x": 1397102460000,
  //           "y": 1,
  //           "y2": 1,
  //           'cat': 'a'
  //         },{
  //           "x": 1397131620000,
  //           "y": 6,
  //           "y2": 21,
  //           'cat': 'a'
  //         },{
  //           "x": 1397160780000,
  //           "y": 10,
  //           "y2": 3,
  //           'cat': 'b'
  //         },{
  //           "x": 1397189940000,
  //           "y": 4,
  //           "y2": 10,
  //           'cat': 'a'
  //         },{
  //           "x": 1397219100000,
  //           "y": 6,
  //           "y2": 27,
  //           'cat': 'b'
  //         }
  //       ],
  //       completeSeriesConfig = {
  //         "x":{
  //           "type":"line",
  //           "name":"mySeries",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(93,165,218)"
  //         },
  //         "a":{
  //           "type":"line",
  //           "name":"a",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(93,165,218)"
  //         },
  //         "b":{
  //           "type":"line",
  //           "name":"b",
  //           "x":['y','y2'],
  //           "y":['y','y2'],
  //           "color": "rgb(250,164,58)"
  //         }
  //       },
  //       dim = ['y','y2'],
  //       chartExtents = {"x":['y','y2'],"y":{'y':[0,27],'y2':[0,27]}},
  //       categories = ['a','b'],
  //       w = 500,
  //       h = 300,
  //       m = {
  //         "top": 10,
  //         "right": 5,
  //         "bottom": 20,
  //         "left": 15
  //       };
  //
  //     parallelCategoryGradientCanvasSVG.set('width',w);
  //     parallelCategoryGradientCanvasSVG.set('height',h);
  //     parallelCategoryGradientCanvasSVG.set('margin',m);
  //
  //     parallelCategoryGradientCanvasScale.set('width',w);
  //     parallelCategoryGradientCanvasScale.set('height',h);
  //     parallelCategoryGradientCanvasScale.set('margin',m);
  //     parallelCategoryGradientCanvasScale.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelCategoryGradientCanvasScale.set('chartExtents',chartExtents);
  //     parallelCategoryGradientCanvasScale.set('dimensions',dim);
  //     parallelCategoryGradientCanvasScale.set('axes',dim);
  //     parallelCategoryGradientCanvasScale.set('chartData',d);
  //
  //     parallelCategoryGradientCanvasLine.set('completeSeriesConfig',completeSeriesConfig);
  //     parallelCategoryGradientCanvasLine.set('seriesId',"x");
  //     parallelCategoryGradientCanvasLine.set('categoryKey','cat');
  //     parallelCategoryGradientCanvasLine.set('categories',categories);
  //     parallelCategoryGradientCanvasLine.set('chartData',d);
  //
  //     setTimeout(function(){
  //       linePath1 = parallelCategoryGradientCanvasLine.lineGroup;
  //       done();
  //     },1000);
  //   });
  //
  //   test('parallelCanvasLine fixture is created', function() {
  //     assert.isTrue(parallelCategoryGradientCanvasLine !== null);
  //   });
  //
  //   test('context has correct total lines ', function() {
  //     assert.equal(parallelCategoryGradientCanvasSVG.canvasContext._pxLinesTotal, 1);
  //   });
  //
  //   test('context has drawn 2 lines ', function() {
  //     assert.equal(parallelCategoryGradientCanvasSVG.canvasContext._pxLinesRedraw, 1);
  //   });
  //
  //   test('context has added both to its list', function() {
  //     assert.equal(Object.keys(parallelCategoryGradientCanvasSVG.canvasContext._pxLinesSeries).length, 1);
  //     assert.equal(parallelCategoryGradientCanvasSVG.canvasContext._pxLinesSeries['x'], true);
  //   });
  // }); //suite

  suite('px-vis-line polar works', function() {
    var polarScale = document.getElementById('polarScale'),
        polarSVG = document.getElementById('polarSVG'),
        polarLine = document.getElementById('polarLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": Math.PI/2,
            "y": 3
          },{
            "x": Math.PI,
            "y": 5
          },{
            "x": Math.PI * 3/2,
            "y": 3
          },{
            "x": Math.PI * 2,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":"rgb(93,165,218)"
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };
      polarSVG.set('width',w);
      polarSVG.set('height',h);
      polarSVG.set('margin',m);
      polarSVG.set('offset',offset);

      polarScale.set('width',min);
      polarScale.set('margin',m);
      polarScale.set('amplitudeKeys',['y']);
      polarScale.set('chartData',d);

      polarLine.set('seriesId',"mySeries");
      polarLine.set('completeSeriesConfig',completeSeriesConfig);
      polarLine.set('chartData',d);

      // needed for the debounce in line
      setTimeout(function(){
        linePath =  polarLine.lineGroup.select('path.series-line');
        done();
      },100);
    });

    test('polarLine fixture is created', function() {
      assert.isTrue(polarLine !== null);
    });

    test('polarLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('polarLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),-144,1);
      assert.closeTo(Number(matches[10]),2,1);
      //logically should be 0, but I guess we get a rounding error  :-/
      assert.closeTo(Number(matches[11]),-5,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite

  suite('px-vis-line polar with degrees and counter clockwise works', function() {
    var polarDegreeScale = document.getElementById('polarDegreeScale'),
        polarDegreeSVG = document.getElementById('polarDegreeSVG'),
        polarDegreeLine = document.getElementById('polarDegreeLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": 90,
            "y": 3
          },{
            "x": 180,
            "y": 5
          },{
            "x": 270,
            "y": 3
          },{
            "x": 0,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":"rgb(93,165,218)"
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };
      polarDegreeSVG.set('width',w);
      polarDegreeSVG.set('height',h);
      polarDegreeSVG.set('margin',m);
      polarDegreeSVG.set('offset',offset);

      polarDegreeScale.set('width',min);
      polarDegreeScale.set('margin',m);
      polarDegreeScale.set('amplitudeKeys',['y']);
      polarDegreeScale.set('chartData',d);

      polarDegreeLine.set('seriesId',"mySeries");
      polarDegreeLine.set('completeSeriesConfig',completeSeriesConfig);
      polarDegreeLine.set('chartData',d);

      // needed for the debounce in line
      setTimeout(function(){
        linePath =  polarDegreeLine.lineGroup.select('path.series-line');
        done();
      },100);
    });

    test('polarDegreeLine fixture is created', function() {
      assert.isTrue(polarDegreeLine !== null);
    });

    test('polarDegreeLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarDegreeLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarDegreeLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('polarDegreeLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),-144,1);
      assert.closeTo(Number(matches[10]),2,1);
      assert.closeTo(Number(matches[11]),0,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite

  suite('px-vis-line polar with degrees and counter clockwise works', function() {
    var polarCCWScale = document.getElementById('polarCCWScale'),
        polarCCWSVG = document.getElementById('polarCCWSVG'),
        polarCCWLine = document.getElementById('polarCCWLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": Math.PI/2,
            "y": 3
          },{
            "x": Math.PI,
            "y": 5
          },{
            "x": Math.PI * 3/2,
            "y": 3
          },{
            "x": Math.PI * 2,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":"rgb(93,165,218)"
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };
      polarCCWSVG.set('width',w);
      polarCCWSVG.set('height',h);
      polarCCWSVG.set('margin',m);
      polarCCWSVG.set('offset',offset);

      polarCCWScale.set('width',min);
      polarCCWScale.set('margin',m);
      polarCCWScale.set('amplitudeKeys',['y']);
      polarCCWScale.set('chartData',d);

      polarCCWLine.set('seriesId',"mySeries");
      polarCCWLine.set('completeSeriesConfig',completeSeriesConfig);
      polarCCWLine.set('chartData',d);

      // needed for the debounce in line
      setTimeout(function(){
        linePath =  polarCCWLine.lineGroup.select('path.series-line');
        done();
      },100);
    });

    test('polarCCWLine fixture is created', function() {
      assert.isTrue(polarCCWLine !== null);
    });

    test('polarCCWLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarCCWLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarCCWLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('polarCCWLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),-144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),-2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),144,1);
      assert.closeTo(Number(matches[10]),2,1);
      assert.closeTo(Number(matches[11]),5,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite


  suite('px-vis-line polar with degrees and counter clockwise works', function() {
    var polarDegreeCCWScale = document.getElementById('polarDegreeCCWScale'),
        polarDegreeCCWSVG = document.getElementById('polarDegreeCCWSVG'),
        polarDegreeCCWLine = document.getElementById('polarDegreeCCWLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": 90,
            "y": 3
          },{
            "x": 180,
            "y": 5
          },{
            "x": 270,
            "y": 3
          },{
            "x": 0,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":"rgb(93,165,218)"
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };
      polarDegreeCCWSVG.set('width',w);
      polarDegreeCCWSVG.set('height',h);
      polarDegreeCCWSVG.set('margin',m);
      polarDegreeCCWSVG.set('offset',offset);

      polarDegreeCCWScale.set('width',min);
      polarDegreeCCWScale.set('margin',m);
      polarDegreeCCWScale.set('amplitudeKeys',['y']);
      polarDegreeCCWScale.set('chartData',d);

      polarDegreeCCWLine.set('seriesId',"mySeries");
      polarDegreeCCWLine.set('completeSeriesConfig',completeSeriesConfig);
      polarDegreeCCWLine.set('chartData',d);

      // needed for the debounce in line
      setTimeout(function(){
        linePath =  polarDegreeCCWLine.lineGroup.select('path.series-line');
        done();
      },100);
    });

    test('polarDegreeCCWLine fixture is created', function() {
      assert.isTrue(polarDegreeCCWLine !== null);
    });

    test('polarDegreeCCWLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarDegreeCCWLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarDegreeCCWLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('polarDegreeCCWLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),-144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),-2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),144,1);
      assert.closeTo(Number(matches[10]),2,1);
      assert.closeTo(Number(matches[11]),0,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite

  suite('px-vis-line polar missing data works', function() {
    var polarMissingScale = document.getElementById('polarMissingScale'),
        polarMissingSVG = document.getElementById('polarMissingSVG'),
        polarMissingLine = document.getElementById('polarMissingLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": Math.PI/2,
            "y": null
          },{
            "x": Math.PI
          },{
            "x": Math.PI * 3/2,
            "y": 3
          },{
            "x": Math.PI * 2,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":"rgb(93,165,218)"
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };
      polarMissingSVG.set('width',w);
      polarMissingSVG.set('height',h);
      polarMissingSVG.set('margin',m);
      polarMissingSVG.set('offset',offset);

      polarMissingScale.set('width',min);
      polarMissingScale.set('margin',m);
      polarMissingScale.set('amplitudeKeys',['y']);
      polarMissingScale.set('chartData',d);

      polarMissingLine.set('seriesId',"mySeries");
      polarMissingLine.set('completeSeriesConfig',completeSeriesConfig);
      polarMissingLine.set('chartData',d);

      // needed for the debounce in line
      setTimeout(function(){
        linePath =  polarMissingLine.lineGroup.select('path.series-line');
        done();
      },100);
    });

    test('polarMissingLine fixture is created', function() {
      assert.isTrue(polarMissingLine !== null);
    });

    test('polarMissingLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarMissingLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarMissingLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('polarMissingLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),-144,1);
      assert.closeTo(Number(matches[6]),2,1);
      assert.closeTo(Number(matches[7]),-5,1);
      assert.closeTo(Number(matches[8]),-240,1);
    });
  }); //suite


  suite('px-vis-line renders radar to SVG', function() {
    var radarScale = document.getElementById('radarScale'),
        radarSVG = document.getElementById('radarSVG'),
        radarLine = document.getElementById('radarLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      radarSVG.set('width',w);
      radarSVG.set('height',h);
      radarSVG.set('margin',m);
      radarSVG.set('offset',offset);

      radarScale.set('width',min);
      radarScale.set('margin',m);
      radarScale.set('amplitudeKeys',dim);
      radarScale.set('centerOffset',50);
      radarScale.set('chartData',d);

      radarLine.set('completeSeriesConfig',completeSeriesConfig);
      radarLine.set('seriesId',"x");
      radarLine.set('chartData',d);

      setTimeout(function(){
        linePath = radarLine.lineGroup.selectAll('path.series-line');
        done();
      },500);;
    });

    test('radarLine fixture is created', function() {
      assert.isTrue(radarLine !== null);
    });

    test('radarLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('radarLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('radarLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('radarLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('radarLine line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = [];
      for(var i = 0; i < 5; i++){
        matches.push(re.exec(Px.d3.select(linePath.nodes()[i]).attr('d')));
      }

      assert.closeTo(Number(matches[0][1]),0,1);
      assert.closeTo(Number(matches[0][2]),-50,1);
      assert.closeTo(Number(matches[0][3]),43,1);
      assert.closeTo(Number(matches[0][4]),24,1);
      assert.closeTo(Number(matches[0][5]),-43,1);
      assert.closeTo(Number(matches[0][6]),25,1);
      assert.closeTo(Number(matches[0][7]),0,1);
      assert.closeTo(Number(matches[0][8]),-50,1);

      assert.closeTo(Number(matches[1][1]),0,1);
      assert.closeTo(Number(matches[1][2]),-86,1);
      assert.closeTo(Number(matches[1][3]),131,1);
      assert.closeTo(Number(matches[1][4]),75,1);
      assert.closeTo(Number(matches[1][5]),-169,1);
      assert.closeTo(Number(matches[1][6]),98,1);
      assert.closeTo(Number(matches[1][7]),0,1);
      assert.closeTo(Number(matches[1][8]),-86,1);

      assert.closeTo(Number(matches[2][1]),0,1);
      assert.closeTo(Number(matches[2][2]),-115,1);
      assert.closeTo(Number(matches[2][3]),87,1);
      assert.closeTo(Number(matches[2][4]),50,1);
      assert.closeTo(Number(matches[2][5]),-55,1);
      assert.closeTo(Number(matches[2][6]),32,1);
      assert.closeTo(Number(matches[2][7]),0,1);
      assert.closeTo(Number(matches[2][8]),-115,1);

      assert.closeTo(Number(matches[3][1]),0,1);
      assert.closeTo(Number(matches[3][2]),-71,1);
      assert.closeTo(Number(matches[3][3]),99,1);
      assert.closeTo(Number(matches[3][4]),57,1);
      assert.closeTo(Number(matches[3][5]),-99,1);
      assert.closeTo(Number(matches[3][6]),57,1);
      assert.closeTo(Number(matches[3][7]),0,1);
      assert.closeTo(Number(matches[3][8]),-71,1);

      assert.closeTo(Number(matches[4][1]),0,1);
      assert.closeTo(Number(matches[4][2]),-86,1);
      assert.closeTo(Number(matches[4][3]),162,1);
      assert.closeTo(Number(matches[4][4]),93,1);
      assert.closeTo(Number(matches[4][5]),-207,1);
      assert.closeTo(Number(matches[4][6]),120,1);
      assert.closeTo(Number(matches[4][7]),0,1);
      assert.closeTo(Number(matches[4][8]),-86,1);
    });

  }); //suite

  suite('px-vis-line radar small lines stop at 25', function() {
    var radarScale = document.getElementById('radarScale'),
        chartExtents = {"x":["y","y1","y2"],"y":[15,20] },
        linePath;

    suiteSetup(function(done) {
      radarScale.set('chartExtents',chartExtents);

      setTimeout(function(){
        linePath = radarLine.lineGroup.selectAll('path.series-line');
        done();
      },500);;
    });

    test('radarLine line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = [];
      for(var i = 0; i < 5; i++){
        matches.push(re.exec(Px.d3.select(linePath.nodes()[i]).attr('d')));
      }

      assert.closeTo(Number(matches[0][1]),0,1);
      assert.closeTo(Number(matches[0][2]),-25,1);
      assert.closeTo(Number(matches[0][3]),21,1);
      assert.closeTo(Number(matches[0][4]),12,1);
      assert.closeTo(Number(matches[0][5]),-21,1);
      assert.closeTo(Number(matches[0][6]),12,1);
      assert.closeTo(Number(matches[0][7]),0,1);
      assert.closeTo(Number(matches[0][8]),-25,1);

      assert.closeTo(Number(matches[1][1]),0,1);
      assert.closeTo(Number(matches[1][2]),-25,1);
      assert.closeTo(Number(matches[1][3]),43,1);
      assert.closeTo(Number(matches[1][4]),24,1);
      assert.closeTo(Number(matches[1][5]),-240,1);
      assert.closeTo(Number(matches[1][6]),139,1);
      assert.closeTo(Number(matches[1][7]),0,1);
      assert.closeTo(Number(matches[1][8]),-25,1);

      assert.closeTo(Number(matches[2][1]),0,1);
      assert.closeTo(Number(matches[2][2]),-25,1);
      assert.closeTo(Number(matches[2][3]),21,1);
      assert.closeTo(Number(matches[2][4]),12,1);
      assert.closeTo(Number(matches[2][5]),-21,1);
      assert.closeTo(Number(matches[2][6]),12,1);
      assert.closeTo(Number(matches[2][7]),0,1);
      assert.closeTo(Number(matches[2][8]),-25,1);

      assert.closeTo(Number(matches[3][1]),0,1);
      assert.closeTo(Number(matches[3][2]),-25,1);
      assert.closeTo(Number(matches[3][3]),21,1);
      assert.closeTo(Number(matches[3][4]),12,1);
      assert.closeTo(Number(matches[3][5]),-21,1);
      assert.closeTo(Number(matches[3][6]),12,1);
      assert.closeTo(Number(matches[3][7]),0,1);
      assert.closeTo(Number(matches[3][8]),-25,1);

      assert.closeTo(Number(matches[4][1]),0,1);
      assert.closeTo(Number(matches[4][2]),-25,1);
      assert.closeTo(Number(matches[4][3]),207,1);
      assert.closeTo(Number(matches[4][4]),119,1);
      assert.closeTo(Number(matches[4][5]),-438,1);
      assert.closeTo(Number(matches[4][6]),253,1);
      assert.closeTo(Number(matches[4][7]),0,1);
      assert.closeTo(Number(matches[4][8]),-25,1);
    });

  }); //suite

  suite('px-vis-line radar with missing data', function() {
    var radarMissingScale = document.getElementById('radarMissingScale'),
        radarMissingSVG = document.getElementById('radarMissingSVG'),
        radarMissingLine = document.getElementById('radarMissingLine');

    var colorOrder = dataVisColors.properties.seriesColorOrder.value;
    var colorSet = dataVisColors.properties.dataVisColors.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": null,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      radarMissingSVG.set('width',w);
      radarMissingSVG.set('height',h);
      radarMissingSVG.set('margin',m);
      radarMissingSVG.set('offset',offset);

      radarMissingScale.set('width',min);
      radarMissingScale.set('margin',m);
      radarMissingScale.set('amplitudeKeys',dim);
      radarMissingScale.set('centerOffset',50);
      radarMissingScale.set('chartData',d);

      radarMissingLine.set('completeSeriesConfig',completeSeriesConfig);
      radarMissingLine.set('seriesId',"x");
      radarMissingLine.set('chartData',d);

      setTimeout(function(){
        linePath = radarMissingLine.lineGroup.selectAll('path.series-line');
        done();
      },500);;
    });

    test('radarMissingLine fixture is created', function() {
      assert.isTrue(radarMissingLine !== null);
    });

    test('radarMissingLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('radarMissingLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('radarMissingLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('radarMissingLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('radarMissingLine full lines d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = [];
      matches.push(re.exec(Px.d3.select(linePath.nodes()[2]).attr('d')));
      matches.push(re.exec(Px.d3.select(linePath.nodes()[3]).attr('d')));

      assert.closeTo(Number(matches[0][1]),0,1);
      assert.closeTo(Number(matches[0][2]),-115,1);
      assert.closeTo(Number(matches[0][3]),87,1);
      assert.closeTo(Number(matches[0][4]),50,1);
      assert.closeTo(Number(matches[0][5]),-55,1);
      assert.closeTo(Number(matches[0][6]),32,1);
      assert.closeTo(Number(matches[0][7]),0,1);
      assert.closeTo(Number(matches[0][8]),-115,1);

      assert.closeTo(Number(matches[1][1]),0,1);
      assert.closeTo(Number(matches[1][2]),-71,1);
      assert.closeTo(Number(matches[1][3]),99,1);
      assert.closeTo(Number(matches[1][4]),57,1);
      assert.closeTo(Number(matches[1][5]),-99,1);
      assert.closeTo(Number(matches[1][6]),57,1);
      assert.closeTo(Number(matches[1][7]),0,1);
      assert.closeTo(Number(matches[1][8]),-71,1);
    });

    test('radarMissingLine missing first point line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(Px.d3.select(linePath.nodes()[4]).attr('d'));

      assert.closeTo(Number(matches[1]),162,1);
      assert.closeTo(Number(matches[2]),93,1);
      assert.closeTo(Number(matches[3]),-207,1);
      assert.closeTo(Number(matches[4]),120,1);
    });

    test('radarMissingLine missing second point line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?Z\\s?',
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(Px.d3.select(linePath.nodes()[0]).attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),-50,1);
      assert.closeTo(Number(matches[3]),-43,1);
      assert.closeTo(Number(matches[4]),25,1);
      assert.closeTo(Number(matches[5]),0,1);
      assert.closeTo(Number(matches[6]),-50,1);
    });

    test('radarMissingLine missing third point line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
      ].join(''));

      var matches = re.exec(Px.d3.select(linePath.nodes()[1]).attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),-86,1);
      assert.closeTo(Number(matches[3]),131,1);
      assert.closeTo(Number(matches[4]),75,1);
      assert.closeTo(Number(matches[5]),0,1);
      assert.closeTo(Number(matches[6]),-86,1);
    });

  }); //suite

} //runTests
