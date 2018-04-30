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

document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-scatter does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-scatter works', function() {
    var baseScale,
        baseSVG,
        baseScatter;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done) {
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseScatter = document.getElementById('baseScatter');
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
          "color": colorSet[0]
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

      var rendered = function() {
        done();
        baseScatter.removeEventListener('px-vis-scatter-rendering-ended', rendered);
      };
      baseScatter.addEventListener('px-vis-scatter-rendering-ended', rendered);

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

      baseScatter.set('completeSeriesConfig',completeSeriesConfig);
      baseScatter.set('seriesId',"mySeries");
      baseScatter.set('chartData',d);
    });

    test('baseScatter fixture is created', function() {
      assert.isTrue(baseScatter !== null);
    });

    test('baseScatter scatterGroup created', function() {
      assert.equal(baseScatter.scatterGroup.node().tagName,'g');
    });
    test('baseScatter scatterDots created', function() {
      assert.isTrue(baseScatter.scatterDots.node().getAttribute("class").indexOf('symbol') !== -1);
    });

    test('baseScatter scatter series ID is random', function() {
      assert.equal(baseScatter.scatterGroup.attr('series-id'),'scatter_mySeries');
    });

    test('baseScatter scatter series has the right color', function() {
      assert.equal(baseScatter.scatterGroup.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('baseScatter scatterDots markerSize is default', function() {
      assert.equal(baseScatter.scatterDots.attr('transform').split('scale')[1],'(1)');
    });

    test('baseScatter scatterDot0 x & y', function() {
      var t = baseScatter.scatterDots.nodes()[0].getAttribute('transform');
      var re = new RegExp(/translate\((\d+)\s?,?\s?(\d+)\)/);
      var x = re.exec(t);
      assert.equal(x[1],"0");
      assert.equal(x[2],"243");
    });

    test('baseScatter scatterDot4 x', function() {
      var t = baseScatter.scatterDots.nodes()[4].getAttribute('transform');
      var re = new RegExp(/translate\((\d+)\s?,?\s?(\d+)\)/);
      var x = re.exec(t);
      assert.equal(x[1],"480");
      assert.equal(x[2],"108");
    });
  }); //suite

  suite('px-vis-scatter with two series works', function() {
    var mutedScale,
        mutedSVG,
        mutedScatter1,
        mutedScatter2;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      mutedScale = document.getElementById('mutedScale');
      mutedSVG = document.getElementById('mutedSVG');
      mutedScatter1 = document.getElementById('mutedScatter1');
      mutedScatter2 = document.getElementById('mutedScatter2');
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
          mutedScatter1.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          mutedScatter2.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          done();
        }
      };
      mutedScatter1.addEventListener('px-vis-scatter-rendering-ended', rendered);
      mutedScatter2.addEventListener('px-vis-scatter-rendering-ended', rendered);

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

      mutedScatter1.set('markerScale','0.5');
      mutedScatter1.set('completeSeriesConfig',completeSeriesConfig);
      mutedScatter1.set('seriesId',"mySeries");
      mutedScatter1.set('chartData',d);

      mutedScatter2.set('markerScale','2');
      mutedScatter2.set('completeSeriesConfig',completeSeriesConfig);
      mutedScatter2.set('seriesId',"mySeries2");
      mutedScatter2.set('chartData',d);
    });

    test('mutedScatter1 fixture is created', function() {
      assert.isTrue(mutedScatter1 !== null);
    });
    test('mutedScatter2 fixture is created', function() {
      assert.isTrue(mutedScatter2 !== null);
    });

    test('mutedScatter1 scatterDots created', function() {
      assert.equal(mutedScatter1.scatterGroup.node().tagName,'g');
    });
    test('mutedScatter1 scatterDots created', function() {
      assert.isTrue(mutedScatter1.scatterDots.node().getAttribute("class").indexOf('symbol') !== -1);
    });
    test('mutedScatter1 scatter series ID is set', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('series-id'),'scatter_mySeries');
    });
    test('mutedScatter1 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter1 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill-opacity'),'0.6');
    });
    test('mutedScatter1 scatter series has the right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke').split(' ').join(''),colorSet[0]);
    });
    test('mutedScatter1 scatterDots markerSize is correct', function() {
      assert.equal(mutedScatter1.scatterDots.attr('transform').split('scale')[1],'(1)');
    });

    test('mutedScatter1 scatterDot0 x & y', function() {
      var t = mutedScatter1.scatterDots.nodes()[0].getAttribute('transform');
      var re = new RegExp(/translate\((\d+)\s?,?\s?(\d+)\)/);
      var x = re.exec(t);
      assert.equal(x[1],"0");
      assert.equal(x[2],"260");
    });

    test('mutedScatter1 scatterDot4 x & y', function() {
      var t = mutedScatter1.scatterDots.nodes()[4].getAttribute('transform');
      var re = new RegExp(/translate\((\d+)\s?,?\s?(\d+)\)/);
      var x = re.exec(t);
      assert.equal(x[1],"480");
      assert.equal(x[2],"210");
    });

    test('mutedScatter2 scatterDots created', function() {
      assert.equal(mutedScatter2.scatterGroup.node().tagName,'g');
    });
    test('mutedScatter2 scatterDots created', function() {
      assert.isTrue(mutedScatter2.scatterDots.node().getAttribute("class").indexOf('symbol') !== -1);
    });
    test('mutedScatter2 scatter series ID is set', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('series-id'),'scatter_mySeries2');
    });
    test('mutedScatter2 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter2 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter2 scatter series has the right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke').split(' ').join(''),colorSet[1]);
    });
    test('mutedScatter2 scatterDots markerSize is correct', function() {
      assert.equal(mutedScatter2.scatterDots.attr('transform').split('scale')[1],'(1)');
    });

    test('mutedScatter2 scatterDot0 x & y', function() {
      var t = mutedScatter2.scatterDots.nodes()[0].getAttribute('transform');
      var re = new RegExp(/translate\((\d+)\s?,?\s?(\d+)\)/);
      var x = re.exec(t);
      assert.equal(x[1],"0");
      assert.equal(x[2],"260");
    });

    test('mutedScatter2 scatterDot4 x & y', function() {
      var t = mutedScatter2.scatterDots.nodes()[4].getAttribute('transform');
      var re = new RegExp(/(translate\((\d+)\s?,?\s?(\d+)?\))/);
      var x = re.exec(t);
      assert.equal(x[2],"480");
      if(typeof(x[3]) === 'undefined') { assert.equal(x[1] , 'translate(480)'); }
      else { assert.equal(x[3] , "0"); }
    });
  }); //suite

  suite('px-vis-scatter mutes', function() {
    var mutedScale,
        mutedSVG,
        mutedScatter1,
        mutedScatter2;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      mutedScale = document.getElementById('mutedScale');
      mutedSVG = document.getElementById('mutedSVG');
      mutedScatter1 = document.getElementById('mutedScatter1');
      mutedScatter2 = document.getElementById('mutedScatter2');
      var m = {
        "mySeries":false,
        "mySeries2":true
      };

      mutedScatter1.set('mutedSeries',m);
      mutedScatter2.set('mutedSeries',m);

      window.setTimeout(function() {
        done();
      }, 400);
    });

    test('mutedScatter1 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter1 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter1 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke').split(' ').join(''),colorSet[0]);
    });
    test('mutedScatter1 scatter series has the fill right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill').split(' ').join(''),colorSet[0]);
    });

    test('mutedScatter2 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke-opacity'),0);
    });
    test('mutedScatter2 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill-opacity'),0.3);
    });
    test('mutedScatter2 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke').split(' ').join(''),colorSet[1]);
    });
    test('mutedScatter2 scatter series has the fill right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill').split(' ').join(''),colorSet[1]);
    });
  }); //suite

  suite('px-vis-scatter unmutes', function() {
    var mutedScale,
        mutedSVG,
        mutedScatter1,
        mutedScatter2;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      mutedScale = document.getElementById('mutedScale');
      mutedSVG = document.getElementById('mutedSVG');
      mutedScatter1 = document.getElementById('mutedScatter1');
      mutedScatter2 = document.getElementById('mutedScatter2');
      var m = {
        "mySeries":false,
        "mySeries2":false
      };

      mutedScatter1.set('mutedSeries',m);
      mutedScatter2.set('mutedSeries',m);

      window.setTimeout(function() {
        done();
      }, 400);
    });

    test('mutedScatter1 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter1 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter1 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke').split(' ').join(''),colorSet[0]);
    });
    test('mutedScatter1 scatter series has the fill right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill').split(' ').join(''),colorSet[0]);
    });

    test('mutedScatter2 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter2 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter2 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke').split(' ').join(''),colorSet[1]);
    });
    test('mutedScatter2 scatter series has the fill right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill').split(' ').join(''),colorSet[1]);
    });

  }); //suite

  suite('marker symbols', function() {
    var markerScale,
        markerSVG,
        markerCircle,
        markerCross,
        markerDiamond,
        markerSquare,
        markerTriangle,
        markerStar,
        markerWye;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;

    suiteSetup(function(done){
      markerScale = document.getElementById('markerScale');
      markerSVG = document.getElementById('markerSVG');
      markerCircle = document.getElementById('markerCircle');
      markerCross = document.getElementById('markerCross');
      markerDiamond = document.getElementById('markerDiamond');
      markerSquare = document.getElementById('markerSquare');
      markerTriangle = document.getElementById('markerTriangle');
      markerStar = document.getElementById('markerStar');
      markerWye = document.getElementById('markerWye');
      var d = [{
            "x": 1397102460000,
            "circle": 1
          },{
            "x": 1397117040000,
            "cross": 1
          },{
            "x": 1397131620000,
            "diamond": 1
          },{
            "x": 1397146200000,
            "square": 1
          },{
            "x": 1397160780000,
            "triangle-up": 1
          },{
            "x": 1397175360000,
            "star": 1
          },{
            "x": 1397189940000,
            "wye": 1
          }
        ],
        completeSeriesConfig = {
          "circle":{
            "name":"circle",
            "x":"x",
            "y":"circle",
            "color": "rgb(255,0,0)"
          },
          "cross":{
            "name":"cross",
            "x":"x",
            "y":"cross",
            "color": "rgb(255,0,0)"
          },
          "diamond":{
            "name":"diamond",
            "x":"x",
            "y":"diamond",
            "color": "rgb(255,0,0)"
          },
          "square":{
            "name":"square",
            "x":"x",
            "y":"square",
            "color": "rgb(255,0,0)"
          },
          "triangle":{
            "name":"triangle-up",
            "x":"x",
            "y":"triangle-up",
            "color": "rgb(255,0,0)"
          },
          "star":{
            "name":"star",
            "x":"x",
            "y":"star",
            "color": "rgb(255,0,0)"
          },
          "wye":{
            "name":"wye",
            "x":"x",
            "y":"wye",
            "color": "rgb(255,0,0)"
          }
        },
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
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
        if(counter === 7) {
          markerCircle.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          markerCross.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          markerWye.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          markerDiamond.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          markerSquare.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          markerTriangle.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          markerStar.removeEventListener('px-vis-scatter-rendering-ended', rendered);
          done();
        }
      };
      markerCircle.addEventListener('px-vis-scatter-rendering-ended', rendered);
      markerCross.addEventListener('px-vis-scatter-rendering-ended', rendered);
      markerWye.addEventListener('px-vis-scatter-rendering-ended', rendered);
      markerDiamond.addEventListener('px-vis-scatter-rendering-ended', rendered);
      markerSquare.addEventListener('px-vis-scatter-rendering-ended', rendered);
      markerTriangle.addEventListener('px-vis-scatter-rendering-ended', rendered);
      markerStar.addEventListener('px-vis-scatter-rendering-ended', rendered);

      markerSVG.set('width',w);
      markerSVG.set('height',h);
      markerSVG.set('margin',m);

      markerScale.set('width',w);
      markerScale.set('height',h);
      markerScale.set('margin',m);
      markerScale.set('completeSeriesConfig',completeSeriesConfig);
      markerScale.set('chartExtents',chartExtents);
      markerScale.set('dataExtents',chartExtents);
      markerScale.set('chartData',d);

      markerCircle.set('completeSeriesConfig',completeSeriesConfig);
      markerCircle.set('markerSymbol',"circle");
      markerCircle.set('seriesId',"circle");
      markerCircle.set('chartData',d);

      markerCross.set('completeSeriesConfig',completeSeriesConfig);
      markerCross.set('markerSymbol',"cross");
      markerCross.set('seriesId',"cross");
      markerCross.set('chartData',d);

      markerDiamond.set('completeSeriesConfig',completeSeriesConfig);
      markerDiamond.set('markerSymbol',"diamond");
      markerDiamond.set('seriesId',"diamond");
      markerDiamond.set('chartData',d);

      markerSquare.set('completeSeriesConfig',completeSeriesConfig);
      markerSquare.set('markerSymbol',"square");
      markerSquare.set('seriesId',"square");
      markerSquare.set('chartData',d);

      markerTriangle.set('completeSeriesConfig',completeSeriesConfig);
      markerTriangle.set('markerSymbol',"triangle-up");
      markerTriangle.set('seriesId',"triangle");
      markerTriangle.set('chartData',d);

      markerStar.set('completeSeriesConfig',completeSeriesConfig);
      markerStar.set('markerSymbol',"star");
      markerStar.set('seriesId',"star");
      markerStar.set('chartData',d);

      markerWye.set('completeSeriesConfig',completeSeriesConfig);
      markerWye.set('markerSymbol',"wye");
      markerWye.set('seriesId',"wye");
      markerWye.set('chartData',d);
    });

    test('correct number of circles', function() {
      assert.equal(markerCircle.scatterDots.nodes().length, 1);
    });
    test('marker is a circle', function() {
      assert.isTrue(markerCircle.scatterDots.node().getAttribute('class').indexOf('symbol') !== -1);
    });

    test('correct number of circles', function() {
      assert.equal(markerCross.scatterDots.nodes().length, 1);
    });
    test('marker is a cross', function() {
      assert.isTrue(markerCross.scatterDots.node().getAttribute('class').indexOf('symbol') !== -1);
    });

    test('correct number of circles', function() {
      assert.equal(markerDiamond.scatterDots.nodes().length, 1);
    });
    test('marker is a diamond', function() {
      assert.isTrue(markerDiamond.scatterDots.node().getAttribute('class').indexOf('symbol') !== -1);
    });

    test('correct number of circles', function() {
      assert.equal(markerSquare.scatterDots.nodes().length, 1);
    });
    test('marker is a square', function() {
      assert.isTrue(markerSquare.scatterDots.node().getAttribute('class').indexOf('symbol') !== -1);
    });

    test('correct number of circles', function() {
      assert.equal(markerTriangle.scatterDots.nodes().length, 1);
    });
    test('marker is a triangle', function() {
      assert.isTrue(markerTriangle.scatterDots.node().getAttribute('class').indexOf('symbol') !== -1);
    });

    test('correct number of circles', function() {
      assert.equal(markerStar.scatterDots.nodes().length, 1);
    });
    test('marker is a star', function() {
      assert.isTrue(markerStar.scatterDots.node().getAttribute('class').indexOf('symbol') !== -1);
    });

    test('correct number of circles', function() {
      assert.equal(markerWye.scatterDots.nodes().length, 1);
    });
    test('marker is a wye', function() {
      assert.isTrue(markerWye.scatterDots.node().getAttribute('class').indexOf('symbol') !== -1);
    });

  }); //suite

} //runTests
