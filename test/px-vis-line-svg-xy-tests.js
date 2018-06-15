/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function runXYTests(){
  suite('px-vis-line-svg does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-line-svg works', function() {
    var baseScale,
        baseSVG,
        baseLine;


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


      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseLine = document.getElementById('baseLine');

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
    	// dasharray can be <number> or <number>px
        assert.equal(linePath.attr('stroke-dasharray').split('px').join('').split(' ').join(''),baseLine.completeSeriesConfig.mySeries.dashPattern);
    });

    test('baseLine line d', function() {
      assert.equal(linePath.attr('d').split(/[\s,]+/).join(''),'M0243L120108L2400L360162L480108');
    });
  }); //suite

  suite('px-vis-line-svg with two series works', function() {
    var mutedScale,
        mutedSVG,
        mutedLine1,
        mutedLine2;


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

      flush(function() {


      mutedScale = document.getElementById('mutedScale');
      mutedSVG = document.getElementById('mutedSVG');
      mutedLine1 = document.getElementById('mutedLine1');
      mutedLine2 = document.getElementById('mutedLine2');

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
    var mutedScale,
        mutedSVG,
        mutedLine1,
        mutedLine2;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":false,
        "mySeries2":true
      };
      mutedScale = document.getElementById('mutedScale'),
      mutedSVG = document.getElementById('mutedSVG'),
      mutedLine1 = document.getElementById('mutedLine1'),
      mutedLine2 = document.getElementById('mutedLine2');
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
    var mutedScale,
        mutedSVG,
        mutedLine1,
        mutedLine2;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":false,
        "mySeries2":false
      };
      mutedScale = document.getElementById('mutedScale'),
      mutedSVG = document.getElementById('mutedSVG'),
      mutedLine1 = document.getElementById('mutedLine1'),
      mutedLine2 = document.getElementById('mutedLine2');
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
    var mutedScale,
        mutedSVG,
        mutedLine1,
        mutedLine2;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      var m = {
        "mySeries":true,
        "mySeries2":true
      };
      mutedScale = document.getElementById('mutedScale'),
      mutedSVG = document.getElementById('mutedSVG'),
      mutedLine1 = document.getElementById('mutedLine1'),
      mutedLine2 = document.getElementById('mutedLine2');
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
    var missingDataPointScale,
        missingDataPointSVG,
        missingDataPointLine1,
        missingDataPointLine2;


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

        missingDataPointScale = document.getElementById('missingDataPointScale'),
        missingDataPointSVG = document.getElementById('missingDataPointSVG'),
        missingDataPointLine1 = document.getElementById('missingDataPointLine1'),
        missingDataPointLine2 = document.getElementById('missingDataPointLine2');

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
    var missingDataPointScaleNull,
        missingDataPointSVGNull,
        missingDataPointLine1Null,
        missingDataPointLine2Null;


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

      missingDataPointScaleNull = document.getElementById('missingDataPointScaleNull'),
      missingDataPointSVGNull = document.getElementById('missingDataPointSVGNull'),
      missingDataPointLine1Null = document.getElementById('missingDataPointLine1Null'),
      missingDataPointLine2Null = document.getElementById('missingDataPointLine2Null');

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
    var missingDataPointScaleGap,
        missingDataPointSVGGap,
        missingDataPointLine1Gap,
        missingDataPointLine2Gap;


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

        missingDataPointScaleGap = document.getElementById('missingDataPointScaleGap'),
        missingDataPointSVGGap = document.getElementById('missingDataPointSVGGap'),
        missingDataPointLine1Gap = document.getElementById('missingDataPointLine1Gap'),
        missingDataPointLine2Gap = document.getElementById('missingDataPointLine2Gap');


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
} //runTests
