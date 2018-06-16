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

function runTests() {
  suite('px-vis-cursor-line renders parallel axis cursor', function() {
    var parallelScale,
        parallelSVG,
        parallelCursor;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      parallelScale = document.getElementById('parallelScale');
      parallelSVG = document.getElementById('parallelSVG');
      parallelCursor = document.getElementById('parallelCursor');
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

        parallelCursor.set('svg', parallelSVG.svg.select('.layer2'));
        parallelCursor.set('svgDataLayer', parallelSVG.svg.select('.layer0'));
        parallelCursor.set('svgOverlayLayer', parallelSVG.svg.select('.layer1'));
        parallelCursor.set('dimensions',dim);
        parallelCursor.set('timeData', 'x');
        parallelCursor.set('completeSeriesConfig',completeSeriesConfig);
        parallelCursor.set('seriesId',"x");
        parallelCursor.set('categoryKey',"cat");
        parallelCursor.set('categories',categories);
        parallelCursor.set('chartData',d);

        window.setTimeout(function() { done(); }, 100);

      }, 100);
    });

    test('parallelCursor fixture is created', function() {
      assert.isTrue(parallelCursor !== null);
    });

    test('line within parallelCursor is created', function() {
      assert.isTrue(parallelCursor.$.myHighlighter !== null);
    });

    test('datalayer has transition', function() {
      assert.equal(parallelSVG.svg.select('.layer0').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('overlay layer has transition', function() {
      assert.equal(parallelSVG.svg.select('.layer1').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

  }); //suite


  suite('px-vis-cursor-line draws the cursor', function() {
    var parallelScale,
        parallelSVG,
        parallelCursor;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      parallelScale = document.getElementById('parallelScale');
      parallelSVG = document.getElementById('parallelSVG');
      parallelCursor = document.getElementById('parallelCursor');
      var ttd = {
        "x": 1397160780000,
        "y": 10,
        "y2": 3,
        "y3": 8,
        'cat': 'b'
      };

      parallelCursor.set("tooltipData", ttd);

      window.setTimeout(function() {
        linePath = parallelCursor.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 100);
    });

    test('datalayer has transition', function() {
      assert.isTrue(parallelSVG.svg.select('.layer0').node().classList.contains('primaryDataMask'));
    });

    test('overlay layer has transition', function() {
      assert.isTrue(parallelSVG.svg.select('.layer1').node().classList.contains('primaryOverlayMask'));
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 5 lines', function() {
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

  suite('px-vis-cursor-line clears the cursor', function() {
    var parallelScale,
        parallelSVG,
        parallelCursor;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      parallelScale = document.getElementById('parallelScale');
      parallelSVG = document.getElementById('parallelSVG');
      parallelCursor = document.getElementById('parallelCursor');
      var ttd = null;

      parallelCursor.set("tooltipData", ttd);

      window.setTimeout(function() {
        linePath = parallelCursor.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(parallelSVG.svg.select('.layer0').node().classList.contains('primaryDataMask'));
    });

    test('overlay layer has transition', function() {
      assert.isFalse(parallelSVG.svg.select('.layer1').node().classList.contains('primaryOverlayMask'));
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite













/* - disable tests failing on Safari 10 Canvas for the time being
  suite('px-vis-cursor-line with Canvas renders parallel axis cursor', function() {
    var parallelScaleCanvas,
        parallelSVGCanvas,
        parallelCursorCanvas;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      parallelScaleCanvas = document.getElementById('parallelScaleCanvas');
      parallelSVGCanvas = document.getElementById('parallelSVGCanvas');
      parallelCursorCanvas = document.getElementById('parallelCursorCanvas');
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

      parallelSVGCanvas.set('width',w);
      parallelSVGCanvas.set('height',h);
      parallelSVGCanvas.set('margin',m);
      parallelSVGCanvas.set('canvasLayersConfig',{'highlighter': {}});

      parallelScaleCanvas.set('width',w);
      parallelScaleCanvas.set('height',h);
      parallelScaleCanvas.set('margin',m);
      parallelScaleCanvas.set('completeSeriesConfig',completeSeriesConfig);
      parallelScaleCanvas.set('dataExtents',chartExtents);
      parallelScaleCanvas.set('chartData',d);
      parallelScaleCanvas.set('axes',dim);
      parallelScaleCanvas.set('dimensions',dim);

      parallelCursorCanvas.set('svg', parallelSVGCanvas.svg);
      parallelCursorCanvas.set('canvasDataLayer', parallelSVGCanvas.canvasContext);
      parallelCursorCanvas.set('dimensions',dim);
      parallelCursorCanvas.set('timeData', 'x');
      parallelCursorCanvas.set('completeSeriesConfig',completeSeriesConfig);
      parallelCursorCanvas.set('seriesId',"x");
      parallelCursorCanvas.set('chartData',d);

      window.setTimeout(function() {
        parallelCursorCanvas.set('canvasOverlayLayer', parallelSVGCanvas.canvasLayers.highlighter);
        done();
      }, 100);

    });

    test('parallelCursorCanvas fixture is created', function() {
      assert.isTrue(parallelCursorCanvas !== null);
    });

    test('line within parallelCursorCanvas is created', function() {
      assert.isTrue(parallelCursorCanvas.$.myHighlighter !== null);
    });

    test('datalayer has transition', function() {
      assert.equal(parallelSVGCanvas.canvasContext.canvas.style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('overlay layer has transition', function() {
      assert.equal(parallelSVGCanvas.canvasLayers.highlighter.canvas.style.transition.slice(0,12), 'opacity 0.2s');
    });

  }); //suite


  suite('px-vis-cursor-line canvas draws the cursor', function() {
    var parallelScaleCanvas,
        parallelSVGCanvas,
        parallelCursorCanvas;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      parallelScaleCanvas = document.getElementById('parallelScaleCanvas');
      parallelSVGCanvas = document.getElementById('parallelSVGCanvas');
      parallelCursorCanvas = document.getElementById('parallelCursorCanvas');
      var ttd = {
        "x": 1397160780000,
        "y": 10,
        "y2": 3,
        "y3": 8,
        'cat': 'b'
      };

      parallelCursorCanvas.set("tooltipData", ttd);

      window.setTimeout(function() {
        linePath = parallelCursorCanvas.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 100);
    });

    test('datalayer has transition', function() {
      assert.isTrue(parallelSVGCanvas.canvasContext.canvas.classList.contains('primaryDataMask'));
    });

    test('overlay layer has transition', function() {
      assert.isTrue(parallelSVGCanvas.canvasLayers.highlighter.canvas.classList.contains('primaryOverlayMask'));
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 5 lines', function() {
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

  suite('px-vis-cursor-line canvas clears the cursor', function() {
    var parallelScaleCanvas,
        parallelSVGCanvas,
        parallelCursorCanvas;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      parallelScaleCanvas = document.getElementById('parallelScaleCanvas');
      parallelSVGCanvas = document.getElementById('parallelSVGCanvas');
      parallelCursorCanvas = document.getElementById('parallelCursorCanvas');
      var ttd = null;

      parallelCursorCanvas.set("tooltipData", ttd);

      window.setTimeout(function() {
        linePath = parallelCursorCanvas.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(parallelSVGCanvas.canvasContext.canvas.classList.contains('primaryDataMask'));
    });

    test('overlay layer has transition', function() {
      assert.isFalse(parallelSVGCanvas.canvasLayers.highlighter.canvas.classList.contains('primaryOverlayMask'));
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite
*/














  suite('px-vis-cursor-line renders radar axis cursor', function() {
    var radarScale,
        radarSVG,
        radarCursor;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done) {
      radarScale = document.getElementById('radarScale');
      radarSVG = document.getElementById('radarSVG');
      radarCursor = document.getElementById('radarCursor');
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

        radarCursor.set('svg', radarSVG.svg.select('.layer2'));
        radarCursor.set('svgDataLayer', radarSVG.svg.select('.layer0'));
        radarCursor.set('svgOverlayLayer', radarSVG.svg.select('.layer1'));
        radarCursor.set('dimensions',dim);
        radarCursor.set('timeData', 'x');
        radarCursor.set('completeSeriesConfig',completeSeriesConfig);
        radarCursor.set('seriesId',"x");
        radarCursor.set('chartData',d);

        window.setTimeout(function() { done(); }, 100);

      }, 100);
    });

    test('radarCursor fixture is created', function() {
      assert.isTrue(radarCursor !== null);
    });

    test('line within radarCursor is created', function() {
      assert.isTrue(radarCursor.$.myHighlighter !== null);
    });

    test('datalayer has transition', function() {
      assert.equal(radarSVG.svg.select('.layer0').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

    test('overlay layer has transition', function() {
      assert.equal(radarSVG.svg.select('.layer1').node().style.transition.slice(0,12), 'opacity 0.2s');
    });

  }); //suite


  suite('px-vis-cursor-line draws the cursor', function() {
    var radarScale,
        radarSVG,
        radarCursor;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      radarScale = document.getElementById('radarScale');
      radarSVG = document.getElementById('radarSVG');
      radarCursor = document.getElementById('radarCursor');
      var ttd = {
        "x": 1397160780000,
        "y": 10,
        "y2": 3,
        "y3": 8,
        'cat': 'b'
      };

      radarCursor.set("tooltipData", ttd);

      window.setTimeout(function() {
        linePath = radarCursor.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 100);
    });

    test('datalayer has transition', function() {
      assert.isTrue(radarSVG.svg.select('.layer0').node().classList.contains('primaryDataMask'));
    });

    test('overlay layer has transition', function() {
      assert.isTrue(radarSVG.svg.select('.layer1').node().classList.contains('primaryOverlayMask'));
    });

    test('baseLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('baseLine linePath created 5 lines', function() {
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

  suite('px-vis-cursor-line clears the cursor', function() {
    var radarScale,
        radarSVG,
        radarCursor;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      radarScale = document.getElementById('radarScale');
      radarSVG = document.getElementById('radarSVG');
      radarCursor = document.getElementById('radarCursor');
      var ttd = null;

      radarCursor.set("tooltipData", ttd);

      window.setTimeout(function() {
        linePath = radarCursor.$.myHighlighter.lineGroup.selectAll('path.series-line');
        done();
      }, 100);
    });

    test('datalayer has transition', function() {
      assert.isFalse(radarSVG.svg.select('.layer0').node().classList.contains('primaryDataMask'));
    });

    test('overlay layer has transition', function() {
      assert.isFalse(radarSVG.svg.select('.layer1').node().classList.contains('primaryOverlayMask'));
    });

    test('baseLine linePath is empty', function() {
      assert.equal(linePath.nodes(), 0);
    });
  }); //suite

}
