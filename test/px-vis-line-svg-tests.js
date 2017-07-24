document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-line-svg does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-line-svg works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseLine = document.getElementById('baseLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
          "color": colorSet[0],
          "dashPattern": "5,2"
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
      baseScale.set('dataExtents',chartExtents);
      baseScale.set('chartData',d);

      baseLine.set('seriesId',"mySeries");
      baseLine.set('completeSeriesConfig',completeSeriesConfig);
      baseLine.set('chartData',d);

      // needed for the debounce in line
      window.setTimeout(function(){
        linePath =  baseLine.lineGroup.select('path.series-line');
        done();
      },250);;
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
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('baseLine line series has the right dash pattern', function() {
        assert.equal(linePath.attr('stroke-dasharray').split(' ').join(''),baseLine.completeSeriesConfig.mySeries.dashPattern);
    });

    test('baseLine line d', function() {
      assert.equal(linePath.attr('d').split(/[\s,]+/).join(''),'M0243L120108L2400L360162L480108');
    });
  }); //suite

  suite('px-vis-line-svg with two series works', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": colorSet[1]
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
        },
        counter = 0;

      var rendered = function() {
        counter++;

        if(counter === 2) {
          linePath1 = mutedLine1.lineGroup.select('path.series-line');
          linePath2 = mutedLine2.lineGroup.select('path.series-line');
          done();
        }
      };

      mutedLine1.addEventListener('px-vis-line-svg-rendering-ended', rendered);
      mutedLine2.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      mutedSVG.set('width',w);
      mutedSVG.set('height',h);
      mutedSVG.set('margin',m);

      mutedScale.set('width',w);
      mutedScale.set('height',h);
      mutedScale.set('margin',m);
      mutedScale.set('completeSeriesConfig',completeSeriesConfig);
      mutedScale.set('chartExtents',chartExtents);
      mutedScale.set('dataExtents',chartExtents);
      mutedScale.set('chartData',d);

      mutedLine1.set('completeSeriesConfig',completeSeriesConfig);
      mutedLine1.set('seriesId',"mySeries");
      mutedLine1.set('chartData',d);

      mutedLine2.set('completeSeriesConfig',completeSeriesConfig);
      mutedLine2.set('seriesId',"mySeries2");
      mutedLine2.set('chartData',d);



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
      assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[0]);
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
      assert.equal(linePath2.attr('stroke').split(' ').join(''),colorSet[1]);
    });
    test('mutedLine2 line d', function() {
      assert.equal(linePath2.attr('d').split(/[\s,]+/).join(''),'M0260L12060L240240L360170L4800');
    });
  }); //suite

  suite('px-vis-line-svg mutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":false,
        "mySeries2":true
      };
      mutedLine1.set('mutedSeries',m);
      mutedLine2.set('mutedSeries',m);
      // window.setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine1.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),0.3);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[1]);
    });

  }); //suite

  suite('px-vis-line-svg unmutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":false,
        "mySeries2":false
      };
      mutedLine1.set('mutedSeries',m);
      mutedLine2.set('mutedSeries',m);
      // window.setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine1.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[1]);
    });
  }); //suite

  suite('px-vis-line-svg with custom muted opacity', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":true,
        "mySeries2":true
      };
      mutedLine1.set('mutedOpacity',0);
      mutedLine2.set('mutedOpacity',0.6);
      mutedLine1.set('mutedSeries',m);
      mutedLine2.set('mutedSeries',m);
      // window.setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine1.linePath.attr('stroke-opacity'),0);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),0.6);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[1]);
    });

  }); //suite

  suite('px-vis-line-svg with missing data', function() {
    var missingDataPointScale = document.getElementById('missingDataPointScale'),
        missingDataPointSVG = document.getElementById('missingDataPointSVG'),
        missingDataPointLine1 = document.getElementById('missingDataPointLine1'),
        missingDataPointLine2 = document.getElementById('missingDataPointLine2');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": colorSet[1]
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
        },
        counter=0;

       var rendered = function() {

        counter++;
        if(counter === 2) {
          linePath1 = missingDataPointLine1.lineGroup.select('path.series-line');
          linePath2 = missingDataPointLine2.lineGroup.select('path.series-line');

          missingDataPointLine1.removeEventListener('px-vis-line-svg-rendering-ended', rendered);
          missingDataPointLine2.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

          done();
        }
      };

      missingDataPointLine1.addEventListener('px-vis-line-svg-rendering-ended', rendered);
      missingDataPointLine2.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      missingDataPointSVG.set('width',w);
      missingDataPointSVG.set('height',h);
      missingDataPointSVG.set('margin',m);

      missingDataPointScale.set('width',w);
      missingDataPointScale.set('height',h);
      missingDataPointScale.set('margin',m);
      missingDataPointScale.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointScale.set('chartExtents',chartExtents);
      missingDataPointScale.set('dataExtents',chartExtents);
      missingDataPointScale.set('chartData',d);

      missingDataPointLine1.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine1.set('seriesId',"mySeries");
      missingDataPointLine1.set('chartData',d);

      missingDataPointLine2.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine2.set('seriesId',"mySeries2");
      missingDataPointLine2.set('chartData',d);
    });

    test('missingDataPointLine1 fixture is created', function() {
      assert.isTrue(missingDataPointLine1 !== null);
    });
    test('missingDataPointLine2 fixture is created', function() {
      assert.isTrue(missingDataPointLine2 !== null);
    });

    test('missingDataPointLine1 line d', function() {
      assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210L120210L360230L480210');
    });

    test('missingDataPointLine2 line d', function() {
      assert.equal(linePath2.attr('d').split(/[\s,]+/).join(''),'M0260L12060L240240L360170L4800');
    });
  }); //suite

  suite('px-vis-line-svg with null data showing gaps', function() {
    var missingDataPointScaleNull = document.getElementById('missingDataPointScaleNull'),
        missingDataPointSVGNull = document.getElementById('missingDataPointSVGNull'),
        missingDataPointLine1Null = document.getElementById('missingDataPointLine1Null'),
        missingDataPointLine2Null = document.getElementById('missingDataPointLine2Null');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "y": null,
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
            "color": colorSet[0]
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": colorSet[1]
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
        },
        counter =0;

      var rendered = function() {

        counter++;
        if(counter === 2) {
          linePath1 = missingDataPointLine1Null.lineGroup.select('path.series-line');
          linePath2 = missingDataPointLine2Null.lineGroup.select('path.series-line');

          missingDataPointLine1Null.removeEventListener('px-vis-line-svg-rendering-ended', rendered);
          missingDataPointLine2Null.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

          done();
        }
      };

      missingDataPointLine1Null.addEventListener('px-vis-line-svg-rendering-ended', rendered);
      missingDataPointLine2Null.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      missingDataPointSVGNull.set('width',w);
      missingDataPointSVGNull.set('height',h);
      missingDataPointSVGNull.set('margin',m);

      missingDataPointScaleNull.set('width',w);
      missingDataPointScaleNull.set('height',h);
      missingDataPointScaleNull.set('margin',m);
      missingDataPointScaleNull.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointScaleNull.set('chartExtents',chartExtents);
      missingDataPointScaleNull.set('dataExtents',chartExtents);
      missingDataPointScaleNull.set('chartData',d);

      missingDataPointLine1Null.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine1Null.set('seriesId',"mySeries");
      missingDataPointLine1Null.set('chartData',d);

      missingDataPointLine2Null.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine2Null.set('seriesId',"mySeries2");
      missingDataPointLine2Null.set('chartData',d);
    });

    test('missingDataPointLine1Null fixture is created', function() {
      assert.isTrue(missingDataPointLine1Null !== null);
    });
    test('missingDataPointLine2Null fixture is created', function() {
      assert.isTrue(missingDataPointLine2Null !== null);
    });

    test('missingDataPointLine1Null line d', function() {
      assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210M360230L480210');
    });

    test('missingDataPointLine2Null line d', function() {
      assert.equal(linePath2.attr('d').split(/[\s,]+/).join(''),'M0260L12060L240240L360170L4800');
    });
  }); //suite

  suite('px-vis-line-svg with missing data showing gaps', function() {
    var missingDataPointScaleGap = document.getElementById('missingDataPointScaleGap'),
        missingDataPointSVGGap = document.getElementById('missingDataPointSVGGap'),
        missingDataPointLine1Gap = document.getElementById('missingDataPointLine1Gap'),
        missingDataPointLine2Gap = document.getElementById('missingDataPointLine2Gap');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": colorSet[1]
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
        },
        counter = 0;

      var rendered = function() {

        counter++;
        if(counter === 2) {
          linePath1 = missingDataPointLine1Gap.lineGroup.select('path.series-line');
          linePath2 = missingDataPointLine2Gap.lineGroup.select('path.series-line');

          missingDataPointLine1Gap.removeEventListener('px-vis-line-svg-rendering-ended', rendered);
          missingDataPointLine2Gap.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

          done();
        }
      };

      missingDataPointLine1Gap.addEventListener('px-vis-line-svg-rendering-ended', rendered);
      missingDataPointLine2Gap.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      missingDataPointSVGGap.set('width',w);
      missingDataPointSVGGap.set('height',h);
      missingDataPointSVGGap.set('margin',m);

      missingDataPointScaleGap.set('width',w);
      missingDataPointScaleGap.set('height',h);
      missingDataPointScaleGap.set('margin',m);
      missingDataPointScaleGap.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointScaleGap.set('chartExtents',chartExtents);
      missingDataPointScaleGap.set('dataExtents',chartExtents);
      missingDataPointScaleGap.set('chartData',d);

      missingDataPointLine1Gap.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine1Gap.set('seriesId',"mySeries");
      missingDataPointLine1Gap.set('chartData',d);

      missingDataPointLine2Gap.set('completeSeriesConfig',completeSeriesConfig);
      missingDataPointLine2Gap.set('seriesId',"mySeries2");
      missingDataPointLine2Gap.set('chartData',d);
    });

    test('missingDataPointLine1Gap fixture is created', function() {
      assert.isTrue(missingDataPointLine1Gap !== null);
    });
    test('missingDataPointLine2Gap fixture is created', function() {
      assert.isTrue(missingDataPointLine2Gap !== null);
    });

    test('missingDataPointLine1Gap line d', function() {
      assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L120210M360230L480210');
    });

    test('missingDataPointLine2Gap line d', function() {
      assert.equal(linePath2.attr('d').split(/[\s,]+/).join(''),'M0260L12060L240240L360170L4800');
    });
  }); //suite

  suite('px-vis-line-svg renders parallel axis to SVG', function() {
    var parallelScale = document.getElementById('parallelScale'),
        parallelSVG = document.getElementById('parallelSVG'),
        parallelLine = document.getElementById('parallelLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
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


      var rendered = function() {

        linePath = parallelLine.lineGroup.selectAll('path.series-line');

        parallelLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('baseLine line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });
  }); //suite

  suite('px-vis-line-svg renders parallel axis with gradient lines to SVG', function() {
    var paralleGradientlScale = document.getElementById('parallelGradientScale'),
        parallelGradientSVG = document.getElementById('parallelGradientSVG'),
        parallelGradientLine = document.getElementById('parallelGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
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

      var rendered = function() {

        linePath = parallelGradientLine.lineGroup.selectAll('path.series-line');

        parallelGradientLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelGradientLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[0]);
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

  }); //suite

  suite('px-vis-line-svg renders parallel axis with multiple categories to SVG', function() {
    var parallelCategoryScale = document.getElementById('parallelCategoryScale'),
        parallelCategorySVG = document.getElementById('parallelCategorySVG'),
        parallelCategoryLine = document.getElementById('parallelCategoryLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[3]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[1]
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

      var rendered = function() {

        linePath = parallelCategoryLine.lineGroup.selectAll('path.series-line');

        parallelCategoryLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelCategoryLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
    });

    test('baseLine line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });
  }); //suite

  suite('px-vis-line-svg renders parallel axis with multiple categories and gradients to SVG', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[1]
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

      var rendered = function() {

        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');

        parallelCategoryGradientLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelCategoryGradientLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
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

  }); //suite

  suite('px-vis-line-svg mutes parallel axis on SVG and selectedDomain changes gradient', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var m = {
        "1397102460000":true,
        "1397131620000":true
      };
      var sd = {'x':[1397160780000,1397219100000]};

      parallelCategoryGradientLine.set('selectedDomain',sd);
      parallelCategoryGradientLine.set('mutedSeries',m);

      window.setTimeout(function(){
        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
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

  suite('px-vis-line-svg unmutes parallel axis on SVG and selectedDomain changes gradient', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var m = {};
      var sd = {'x':[1397102460000,1397219100000]};

      parallelCategoryGradientLine.set('selectedDomain',sd);
      parallelCategoryGradientLine.set('mutedSeries',m);

      window.setTimeout(function(){
        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);;
    });

    test('baseLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
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

  suite('px-vis-line-svg polar works', function() {
    var polarScale = document.getElementById('polarScale'),
        polarSVG = document.getElementById('polarSVG'),
        polarLine = document.getElementById('polarLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color":colorSet[0]
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

      var rendered = function() {

        linePath =  polarLine.lineGroup.select('path.series-line');

        polarLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
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

  suite('px-vis-line-svg polar with degrees and counter clockwise works', function() {
    var polarDegreeScale = document.getElementById('polarDegreeScale'),
        polarDegreeSVG = document.getElementById('polarDegreeSVG'),
        polarDegreeLine = document.getElementById('polarDegreeLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color":colorSet[0]
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


      var rendered = function() {

        linePath =  polarDegreeLine.lineGroup.select('path.series-line');

        polarDegreeLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarDegreeLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
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

  suite('px-vis-line-svg polar with degrees and counter clockwise works', function() {
    var polarCCWScale = document.getElementById('polarCCWScale'),
        polarCCWSVG = document.getElementById('polarCCWSVG'),
        polarCCWLine = document.getElementById('polarCCWLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color":colorSet[0]
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

      var rendered = function() {

        linePath =  polarCCWLine.lineGroup.select('path.series-line');

        polarCCWLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarCCWLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
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


  suite('px-vis-line-svg polar with degrees and counter clockwise works', function() {
    var polarDegreeCCWScale = document.getElementById('polarDegreeCCWScale'),
        polarDegreeCCWSVG = document.getElementById('polarDegreeCCWSVG'),
        polarDegreeCCWLine = document.getElementById('polarDegreeCCWLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color":colorSet[0]
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

      var rendered = function() {

        linePath =  polarDegreeCCWLine.lineGroup.select('path.series-line');

        polarDegreeCCWLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarDegreeCCWLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
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

  suite('px-vis-line-svg polar missing data works', function() {
    var polarMissingScale = document.getElementById('polarMissingScale'),
        polarMissingSVG = document.getElementById('polarMissingSVG'),
        polarMissingLine = document.getElementById('polarMissingLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color":colorSet[0]
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

      var rendered = function() {

        linePath =  polarMissingLine.lineGroup.select('path.series-line');

        polarMissingLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarMissingLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
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


  suite('px-vis-line-svg renders radar to SVG', function() {
    var radarScale = document.getElementById('radarScale'),
        radarSVG = document.getElementById('radarSVG'),
        radarLine = document.getElementById('radarLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
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

      var rendered = function() {

        linePath = radarLine.lineGroup.selectAll('path.series-line');

        radarLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      radarLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
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

  suite('px-vis-line-svg radar small lines stop at 25', function() {
    var radarScale = document.getElementById('radarScale'),
        chartExtents = {"x":["y","y1","y2"],"y":[15,20] },
        linePath;

    suiteSetup(function(done) {
      radarScale.set('chartExtents',chartExtents);

      window.setTimeout(function(){
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

  suite('px-vis-line-svg radar with missing data', function() {
    var radarMissingScale = document.getElementById('radarMissingScale'),
        radarMissingSVG = document.getElementById('radarMissingSVG'),
        radarMissingLine = document.getElementById('radarMissingLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
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
            "color": colorSet[0]
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

      var rendered = function() {

        linePath = radarMissingLine.lineGroup.selectAll('path.series-line');

        radarMissingLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      radarMissingLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

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
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
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


  suite('px-vis-line-svg interpolationFunction', function() {
    var interpolationScale = document.getElementById('interpolationScale'),
        interpolationSVG = document.getElementById('interpolationSVG'),
        interpolationLine1 = document.getElementById('interpolationLine1'),
        interpolationLine2 = document.getElementById('interpolationLine2'),
        interpolationLine3 = document.getElementById('interpolationLine3');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath1,linePath2,linePath3;

    suiteSetup(function(done) {
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
            "color": colorSet[0]
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": colorSet[1],
            "interpolationFunction": Px.d3.curveBasis
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
        },
        iFnc = Px.d3.curveStep,
        counter = 0;

      var rendered = function() {

        counter++;

        if(counter === 2) {
          linePath1 = interpolationLine1.lineGroup.select('path.series-line');
          linePath2 = interpolationLine2.lineGroup.select('path.series-line');

          interpolationLine1.removeEventListener('px-vis-line-svg-rendering-ended', rendered);
          interpolationLine2.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

          done();
        }
      };

      interpolationLine1.addEventListener('px-vis-line-svg-rendering-ended', rendered);
      interpolationLine2.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      interpolationSVG.set('width',w);
      interpolationSVG.set('height',h);
      interpolationSVG.set('margin',m);

      interpolationScale.set('width',w);
      interpolationScale.set('height',h);
      interpolationScale.set('margin',m);
      interpolationScale.set('completeSeriesConfig',completeSeriesConfig);
      interpolationScale.set('chartExtents',chartExtents);
      interpolationScale.set('dataExtents',chartExtents);
      interpolationScale.set('chartData',d);

      interpolationLine1.set('interpolationFunction', iFnc);
      interpolationLine1.set('completeSeriesConfig',completeSeriesConfig);
      interpolationLine1.set('seriesId',"mySeries");
      interpolationLine1.set('chartData',d);

      interpolationLine2.set('interpolationFunction', iFnc);
      interpolationLine2.set('completeSeriesConfig',completeSeriesConfig);
      interpolationLine2.set('seriesId',"mySeries2");
      interpolationLine2.set('chartData',d);
    });

    test('interpolationLine1 fixture is created', function() {
      assert.isTrue(interpolationLine1 !== null);
    });
    test('interpolationLine2 fixture is created', function() {
      assert.isTrue(interpolationLine2 !== null);
    });

    test('interpolationLine1 linePath created', function() {
      assert.equal(linePath1.node().tagName,'path');
    });
    test('interpolationLine1 line series ID is set', function() {
      assert.equal(linePath1.attr('series-id'),'line_mySeries');
    });
    test('interpolationLine1 line series has the right stroke opacity', function() {
      assert.equal(linePath1.attr('stroke-opacity'),1);
    });
    test('interpolationLine1 line series has the right color', function() {
      assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[0]);
    });
    test('interpolationLine1 line d', function() {

      assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L60260L60210L180210L180170L300170L300230L420230L420210L480210');
    });

    test('interpolationLine2 linePath created', function() {
      assert.equal(linePath2.node().tagName,'path');
    });
    test('interpolationLine2 line series ID is set', function() {
      assert.equal(linePath2.attr('series-id'),'line_mySeries2');
    });
    test('interpolationLine2 line series has the right stroke opacity', function() {
      assert.equal(linePath2.attr('stroke-opacity'),1);
    });
    test('interpolationLine2 line series has the right color', function() {
      assert.equal(linePath2.attr('stroke').split(' ').join(''),colorSet[1]);
    });
    test('interpolationLine2 line d', function() {
      var re =  new RegExp ([
        "M\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "L\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "L\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?"
      ].join(''));
      var m = re.exec(linePath2.attr('d'));
      assert.closeTo(Number(m[1]), 0, 2);
      assert.closeTo(Number(m[2]), 260, 2);
      assert.closeTo(Number(m[3]), 20, 2);
      assert.closeTo(Number(m[4]), 226, 2);
      assert.closeTo(Number(m[5]), 40, 2);
      assert.closeTo(Number(m[6]), 193, 2);
      assert.closeTo(Number(m[7]), 80, 2);
      assert.closeTo(Number(m[8]), 126, 2);
      assert.closeTo(Number(m[9]), 120, 2);
      assert.closeTo(Number(m[10]), 123, 2);
      assert.closeTo(Number(m[11]), 160, 2);
      assert.closeTo(Number(m[12]), 120, 2);
      assert.closeTo(Number(m[13]), 200, 2);
      assert.closeTo(Number(m[14]), 180, 2);
      assert.closeTo(Number(m[15]), 240, 2);
      assert.closeTo(Number(m[16]), 198, 2);
      assert.closeTo(Number(m[17]), 280, 2);
      assert.closeTo(Number(m[18]), 216, 2);
      assert.closeTo(Number(m[19]), 320, 2);
      assert.closeTo(Number(m[20]), 193, 2);
      assert.closeTo(Number(m[21]), 360, 2);
      assert.closeTo(Number(m[22]), 153, 2);
      assert.closeTo(Number(m[23]), 400, 2);
      assert.closeTo(Number(m[24]), 113, 2);
      assert.closeTo(Number(m[25]), 440, 2);
      assert.closeTo(Number(m[26]), 56, 2);
      assert.closeTo(Number(m[27]), 460, 2);
      assert.closeTo(Number(m[28]), 28, 2);
      assert.closeTo(Number(m[29]), 480, 2);
      assert.closeTo(Number(m[30]), 0, 2);
    });
  }); //suite


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
