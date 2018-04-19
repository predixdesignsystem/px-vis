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

function componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ?
        Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

function rgbToHex(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
        r = componentFromStr(result[1], result[2]);
        g = componentFromStr(result[3], result[4]);
        b = componentFromStr(result[5], result[6]);

        hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
}

function runTests(){
  var testTimeout = 100;
  suite('px-vis-scatter does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-threshold first draw', function() {
    var baseScale,
        baseSVG,
        defaultThreshold,
        thresholdGroups,
        thresholdLines,
        thresholdRects,
        thresholdTexts;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      defaultThreshold = document.getElementById('defaultThreshold');
      var w = 500,
        h = 300,
        m = {
          "top": 5,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        d = [{
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
        dT = [
          { "for":"", "type":"default", "value":8 },
          { "for":"", "type":"defaultTitleBox", "value": 7 },
          { "for":"", "type":"defaultBox", "value":6 },
          { "for":"mySeries", "type":"custom", "value": 5 },
          { "for":"mySeries", "type":"defaultSeriesBox", "value":4 },
          { "for":"mySeries", "type":"defaultSeriesTitleBox", "value": 3 },
          { "for":"mySeries", "type":"defaultSeries", "value": 2 },
        ],
        tConf = {
          "custom": {
            "color": "red",
            "dashPattern": "5,0",
            "title": "CUSTOM"
          },
          "defaultSeriesBox": {
            "showThresholdBox": true
          },
          "defaultBox": {
            "showThresholdBox": true,
          },
          "defaultTitle": {
            "showThresholdBox": true
          },
          "defaultTitleBox": {
            "showThresholdBox": true,
            "title": "show me"
          },
          "defaultSeriesTitleBox": {
            "showThresholdBox": true,
            "title": "show me too"
          }
        };

      var rendered = function() {
        thresholdGroups = defaultThreshold.thresholdGroup.selectAll('g.threshold');
        thresholdLines = thresholdGroups.selectAll('line.threshold-line');
        thresholdRects = thresholdGroups.selectAll('rect.threshold-rect');
        thresholdTexts = thresholdGroups.selectAll('text.threshold-text');
        defaultThreshold.removeEventListener('px-vis-threshold-rendering-ended', rendered);
        done();
      };

      defaultThreshold.addEventListener('px-vis-threshold-rendering-ended', rendered);

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

      defaultThreshold.set('width',w);
      defaultThreshold.set('height',h);
      defaultThreshold.set('margin',m);
      defaultThreshold.set('completeSeriesConfig',completeSeriesConfig);
      defaultThreshold.set('thresholdData',dT);
      defaultThreshold.set('thresholdConfig',tConf);
    });

    suite('px-vis-threshold everything drew', function() {

      test('defaultThreshold thresholdGroup created', function() {
        assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
        assert.isTrue(defaultThreshold.thresholdGroup.attr("class").indexOf('thresholds') !== -1);
      });

      test('defaultThreshold thresholdGroup groups are created', function() {
        assert.lengthOf(thresholdGroups.nodes(), 7);
      });

      test('defaultThreshold threshold lines are created', function() {
        assert.lengthOf(thresholdLines.nodes(), 7);
      });

      test('defaultThreshold threshold rects are created', function() {
        assert.lengthOf(thresholdRects.nodes(), 7);
      });

      test('defaultThreshold threshold texts are created', function() {
        assert.lengthOf(thresholdTexts.nodes(), 7);
      });
    });

    suite('px-vis-threshold thresholds have correct values', function() {
      test('defaultThreshold thresholdLine stroke width', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-width'), 1);
      });
      test('defaultThreshold thresholdLine stroke dasharray', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-dasharray').split(' ').join(''),'5,0');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
      });
      test('defaultThreshold thresholdLine x1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x1'),0);
      });
      test('defaultThreshold thresholdLine x2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x2'),480);
      });
      test('defaultThreshold thresholdLine y1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y1'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y1'),82.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y1'),110);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y1'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y1'),165);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y1'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y1'),220);
      });
      test('defaultThreshold thresholdLine y2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y2'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y2'),82.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y2'),110);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y2'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y2'),165);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y2'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y2'),220);
      });
      test('defaultThreshold thresholdLine stroke', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke').split(' ').join(''), 'red');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke').split(' ').join(''), colorSet[0]);
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke').split(' ').join(''), colorSet[0]);
      });

      test('defaultThreshold thresholdRect x', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[1].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[5].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('x'),5);
      });
      test('defaultThreshold thresholdRect y', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('y'), 55);
        assert.equal(thresholdRects.nodes()[1].getAttribute('y'), 82.5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('y'), 110);
        assert.equal(thresholdRects.nodes()[3].getAttribute('y'), 137.5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('y'), 165);
        assert.equal(thresholdRects.nodes()[5].getAttribute('y'), 192.5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('y'), 220);
      });
      test('defaultThreshold thresholdRect width', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[1].getAttribute('width')),
                       Number(thresholdTexts.nodes()[1].getBBox().width) + 6, 15); //dont understand why; FF only on travis has hugely differnt numbers. Everyone else passes with 2.
        assert.closeTo(Number(thresholdRects.nodes()[2].getAttribute('width')),
                       Number(thresholdTexts.nodes()[2].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[3].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[4].getAttribute('width')),
                       Number(thresholdTexts.nodes()[4].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[5].getAttribute('width')),
                       Number(thresholdTexts.nodes()[5].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[6].getAttribute('width'), 0);
      });
      test('defaultThreshold thresholdRect height', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[1].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[2].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[3].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[4].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[5].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[6].getAttribute('height'),18);
      });
      test('defaultThreshold thresholdRect fill', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[1].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[2].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[3].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[4].getAttribute('fill').split(' ').join(''), colorSet[0]);
        assert.equal(thresholdRects.nodes()[5].getAttribute('fill').split(' ').join(''), colorSet[0]);
        assert.equal(thresholdRects.nodes()[6].getAttribute('fill').split(' ').join(''), 'none');
      });

      test('defaultThreshold thresholdText font-size', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[1].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[2].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[3].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[5].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[6].getAttribute('font-size'),'12px');
      });
      test('defaultThreshold thresholdText x', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[2].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[4].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[5].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[6].getAttribute('x'),8);
      });
      test('defaultThreshold thresholdText y', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('y'),(55+13));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('y'),(82.5+13));
        assert.equal(thresholdTexts.nodes()[2].getAttribute('y'),(110+13));
        assert.equal(thresholdTexts.nodes()[3].getAttribute('y'),(137.5+13));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('y'),(165+13));
        assert.equal(thresholdTexts.nodes()[5].getAttribute('y'),(192.5+13));
        assert.equal(thresholdTexts.nodes()[6].getAttribute('y'),(220+13));
      });
      test('defaultThreshold thresholdText color', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[2].getAttribute('fill').split(' ').join(''), "white")
        assert.equal(thresholdTexts.nodes()[3].getAttribute('fill').split(' ').join(''), 'red');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[5].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[6].getAttribute('fill').split(' ').join(''), colorSet[0]);
      });
      test('defaultThreshold thresholdText text', function() {
        assert.equal(thresholdTexts.nodes()[0].textContent,'8.00');
        assert.equal(thresholdTexts.nodes()[1].textContent,'7.00 (show me)');
        assert.equal(thresholdTexts.nodes()[2].textContent,'6.00');
        assert.equal(thresholdTexts.nodes()[3].textContent,'5.00 (CUSTOM)');
        assert.equal(thresholdTexts.nodes()[4].textContent,'4.00');
        assert.equal(thresholdTexts.nodes()[5].textContent,'3.00 (show me too)');
        assert.equal(thresholdTexts.nodes()[6].textContent,'2.00');
      });
    }); //suite
  }); //suite


  suite('px-vis-threshold completeSeriesConfig changed', function() {
    var baseScale,
        baseSVG,
        defaultThreshold,
        thresholdGroups,
        thresholdLines,
        thresholdRects,
        thresholdTexts;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done) {
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      defaultThreshold = document.getElementById('defaultThreshold');
      var completeSeriesConfig = {
        "mySeries":{
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": colorSet[1]
        }};

      var rendered = function() {
        thresholdGroups = defaultThreshold.thresholdGroup.selectAll('g.threshold');
        thresholdLines = thresholdGroups.selectAll('line.threshold-line');
        thresholdRects = thresholdGroups.selectAll('rect.threshold-rect');
        thresholdTexts = thresholdGroups.selectAll('text.threshold-text');
        defaultThreshold.removeEventListener('px-vis-threshold-rendering-ended', rendered);
        done();
      };

      defaultThreshold.addEventListener('px-vis-threshold-rendering-ended', rendered);

      defaultThreshold.set('completeSeriesConfig', completeSeriesConfig);
    });

    suite('px-vis-threshold everything drew', function() {

      test('defaultThreshold thresholdGroup created', function() {
        assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
        assert.isTrue(defaultThreshold.thresholdGroup.attr("class").indexOf('thresholds') !== -1);
      });

      test('defaultThreshold thresholdGroup groups are created', function() {
        assert.lengthOf(thresholdGroups.nodes(), 7);
      });

      test('defaultThreshold threshold lines are created', function() {
        assert.lengthOf(thresholdLines.nodes(), 7);
      });

      test('defaultThreshold threshold rects are created', function() {
        assert.lengthOf(thresholdRects.nodes(), 7);
      });

      test('defaultThreshold threshold texts are created', function() {
        assert.lengthOf(thresholdTexts.nodes(), 7);
      });
    });

    suite('px-vis-threshold thresholds have correct values', function() {
      test('defaultThreshold thresholdLine stroke width', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-width'), 1);
      });
      test('defaultThreshold thresholdLine stroke dasharray', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-dasharray').split(' ').join(''),'5,0');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
      });
      test('defaultThreshold thresholdLine x1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x1'),0);
      });
      test('defaultThreshold thresholdLine x2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x2'),480);
      });
      test('defaultThreshold thresholdLine y1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y1'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y1'),82.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y1'),110);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y1'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y1'),165);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y1'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y1'),220);
      });
      test('defaultThreshold thresholdLine y2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y2'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y2'),82.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y2'),110);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y2'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y2'),165);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y2'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y2'),220);
      });
      test('defaultThreshold thresholdLine stroke', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke').split(' ').join(''), 'red');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke').split(' ').join(''), colorSet[1]);
      });

      test('defaultThreshold thresholdRect x', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[1].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[5].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('x'),5);
      });
      test('defaultThreshold thresholdRect y', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('y'), (55));
        assert.equal(thresholdRects.nodes()[1].getAttribute('y'), (82.5));
        assert.equal(thresholdRects.nodes()[2].getAttribute('y'), (110));
        assert.equal(thresholdRects.nodes()[3].getAttribute('y'), (137.5));
        assert.equal(thresholdRects.nodes()[4].getAttribute('y'), (165));
        assert.equal(thresholdRects.nodes()[5].getAttribute('y'), (192.5));
        assert.equal(thresholdRects.nodes()[6].getAttribute('y'), (220));
      });
      test('defaultThreshold thresholdRect width', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[1].getAttribute('width')),
                       Number(thresholdTexts.nodes()[1].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[2].getAttribute('width')),
                       Number(thresholdTexts.nodes()[2].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[3].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[4].getAttribute('width')),
                       Number(thresholdTexts.nodes()[4].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[5].getAttribute('width')),
                       Number(thresholdTexts.nodes()[5].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[6].getAttribute('width'), 0);
      });
      test('defaultThreshold thresholdRect height', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[1].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[2].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[3].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[4].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[5].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[6].getAttribute('height'),18);
      });
      test('defaultThreshold thresholdRect fill', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[1].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[2].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[3].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[4].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[5].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[6].getAttribute('fill').split(' ').join(''), 'none');
      });

      test('defaultThreshold thresholdText font-size', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[1].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[2].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[3].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[5].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[6].getAttribute('font-size'),'12px');
      });
      test('defaultThreshold thresholdText x', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[2].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[4].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[5].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[6].getAttribute('x'),8);
      });
      test('defaultThreshold thresholdText y', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('y'),(55+13));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('y'),(82.5+13));
        assert.equal(thresholdTexts.nodes()[2].getAttribute('y'),(110+13));
        assert.equal(thresholdTexts.nodes()[3].getAttribute('y'),(137.5+13));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('y'),(165+13));
        assert.equal(thresholdTexts.nodes()[5].getAttribute('y'),(192.5+13));
        assert.equal(thresholdTexts.nodes()[6].getAttribute('y'),(220+13));
      });
      test('defaultThreshold thresholdText color', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[2].getAttribute('fill').split(' ').join(''), "white")
        assert.equal(thresholdTexts.nodes()[3].getAttribute('fill').split(' ').join(''), 'red');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[5].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[6].getAttribute('fill').split(' ').join(''), colorSet[1]);
      });
      test('defaultThreshold thresholdText text', function() {
        assert.equal(thresholdTexts.nodes()[0].textContent,'8.00');
        assert.equal(thresholdTexts.nodes()[1].textContent,'7.00 (show me)');
        assert.equal(thresholdTexts.nodes()[2].textContent,'6.00');
        assert.equal(thresholdTexts.nodes()[3].textContent,'5.00 (CUSTOM)');
        assert.equal(thresholdTexts.nodes()[4].textContent,'4.00');
        assert.equal(thresholdTexts.nodes()[5].textContent,'3.00 (show me too)');
        assert.equal(thresholdTexts.nodes()[6].textContent,'2.00');
      });
    }); //suite
  }); //suite


  suite('px-vis-threshold update thresholds', function() {
    var baseScale,
        baseSVG,
        defaultThreshold,
        thresholdGroups,
        thresholdLines,
        thresholdRects,
        thresholdTexts;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      defaultThreshold = document.getElementById('defaultThreshold');
      var dT = [
          { "for":"mySeries", "type":"defaultSeriesTitleBox", "value":8 },
          { "for":"mySeries", "type":"defaultSeriesBox", "value": 7 },
          { "for":"mySeries", "type":"defaultSeries", "value":6 },
          { "for":"", "type":"defaultTitle", "value": 5 },
          { "for":"", "type":"default", "value":4 },
          { "for":"", "type":"defaultTitleBox", "value": 3 },
          { "for":"", "type":"custom", "value": 2 },
        ];

      var rendered = function() {
        thresholdGroups = defaultThreshold.thresholdGroup.selectAll('g.threshold');
        thresholdLines = thresholdGroups.selectAll('line.threshold-line');
        thresholdRects = thresholdGroups.selectAll('rect.threshold-rect');
        thresholdTexts = thresholdGroups.selectAll('text.threshold-text');
        defaultThreshold.removeEventListener('px-vis-threshold-rendering-ended', rendered);
        done();
      };

      defaultThreshold.addEventListener('px-vis-threshold-rendering-ended', rendered);

      defaultThreshold.set('thresholdData',dT);
    });

    suite('px-vis-threshold everything drew', function() {
      test('defaultThreshold thresholdGroup created', function() {
        assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
        assert.isTrue(defaultThreshold.thresholdGroup.attr("class").indexOf('thresholds') !== -1);
      });

      test('defaultThreshold thresholdGroup groups are created', function() {
        assert.lengthOf(thresholdGroups.nodes(), 7);
      });

      test('defaultThreshold threshold lines are created', function() {
        assert.lengthOf(thresholdLines.nodes(), 7);
      });

      test('defaultThreshold threshold rects are created', function() {
        assert.lengthOf(thresholdRects.nodes(), 7);
      });

      test('defaultThreshold threshold texts are created', function() {
        assert.lengthOf(thresholdTexts.nodes(), 7);
      });
    });

    suite('px-vis-threshold thresholds have correct values', function() {
      test('defaultThreshold thresholdLine stroke width', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-width'), 1);
      });
      test('defaultThreshold thresholdLine stroke dasharray', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-dasharray').split(' ').join(''),'5,0');
      });
      test('defaultThreshold thresholdLine x1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x1'),0);
      });
      test('defaultThreshold thresholdLine x2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x2'),480);
      });
      test('defaultThreshold thresholdLine y1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y1'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y1'),82.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y1'),110);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y1'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y1'),165);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y1'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y1'),220);
      });
      test('defaultThreshold thresholdLine y2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y2'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y2'),82.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y2'),110);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y2'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y2'),165);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y2'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y2'),220);
      });
      test('defaultThreshold thresholdLine stroke', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke').split(' ').join(''), 'red');
      });

      test('defaultThreshold thresholdRect x', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[1].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[5].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('x'),5);
      });
      test('defaultThreshold thresholdRect y', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('y'), 55);
        assert.equal(thresholdRects.nodes()[1].getAttribute('y'), 82.5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('y'), 110);
        assert.equal(thresholdRects.nodes()[3].getAttribute('y'), 137.5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('y'), 165);
        assert.equal(thresholdRects.nodes()[5].getAttribute('y'), 192.5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('y'), 220);
      });
      test('defaultThreshold thresholdRect width', function() {
        assert.closeTo(Number(thresholdRects.nodes()[0].getAttribute('width')),
                       Number(thresholdTexts.nodes()[0].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[1].getAttribute('width')),
                       Number(thresholdTexts.nodes()[1].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[2].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[3].getAttribute('width')),
                       Number(thresholdTexts.nodes()[3].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[4].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[5].getAttribute('width')),
                       Number(thresholdTexts.nodes()[5].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[6].getAttribute('width'), 0);
      });
      test('defaultThreshold thresholdRect height', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[1].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[2].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[3].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[4].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[5].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[6].getAttribute('height'),18);
      });
      test('defaultThreshold thresholdRect fill', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[1].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[2].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[3].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[4].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[5].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[6].getAttribute('fill').split(' ').join(''), 'none');
      });

      test('defaultThreshold thresholdText font-size', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[1].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[2].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[3].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[5].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[6].getAttribute('font-size'),'12px');
      });
      test('defaultThreshold thresholdText x', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[2].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[4].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[5].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[6].getAttribute('x'),8);
      });
      test('defaultThreshold thresholdText y', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('y'),(55+13));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('y'),(82.5+13));
        assert.equal(thresholdTexts.nodes()[2].getAttribute('y'),(110+13));
        assert.equal(thresholdTexts.nodes()[3].getAttribute('y'),(137.5+13));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('y'),(165+13));
        assert.equal(thresholdTexts.nodes()[5].getAttribute('y'),(192.5+13));
        assert.equal(thresholdTexts.nodes()[6].getAttribute('y'),(220+13));
      });
      test('defaultThreshold thresholdText color', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('fill').split(' ').join(''), 'white');
        assert.equal(thresholdTexts.nodes()[1].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[2].getAttribute('fill').split(' ').join(''), colorSet[1])
        assert.equal(thresholdTexts.nodes()[3].getAttribute('fill').split(' ').join(''), 'white');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdTexts.nodes()[5].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[6].getAttribute('fill').split(' ').join(''), 'red');
      });
      test('defaultThreshold thresholdText text', function() {
        assert.equal(thresholdTexts.nodes()[0].textContent,'8.00 (show me too)');
        assert.equal(thresholdTexts.nodes()[1].textContent,'7.00');
        assert.equal(thresholdTexts.nodes()[2].textContent,'6.00');
        assert.equal(thresholdTexts.nodes()[3].textContent,'5.00');
        assert.equal(thresholdTexts.nodes()[4].textContent,'4.00');
        assert.equal(thresholdTexts.nodes()[5].textContent,'3.00 (show me)');
        assert.equal(thresholdTexts.nodes()[6].textContent,'2.00 (CUSTOM)');
      });
    }); //suite
  }); //suite


  suite('px-vis-threshold update threshold values', function() {
    var baseScale,
        baseSVG,
        defaultThreshold,
        thresholdGroups,
        thresholdLines,
        thresholdRects,
        thresholdTexts;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      defaultThreshold = document.getElementById('defaultThreshold');
      var dT = [
          { "for":"mySeries", "type":"defaultSeriesTitleBox", "value":9 },
          { "for":"mySeries", "type":"defaultSeriesBox", "value": 7 },
          { "for":"mySeries", "type":"defaultSeries", "value":8 },
          { "for":"", "type":"defaultTitle", "value": 5 },
          { "for":"", "type":"default", "value":1 },
          { "for":"", "type":"defaultTitleBox", "value": 3 },
          { "for":"", "type":"custom", "value": 2 },
        ];

      var rendered = function() {
        thresholdGroups = defaultThreshold.thresholdGroup.selectAll('g.threshold');
        thresholdLines = thresholdGroups.selectAll('line.threshold-line');
        thresholdRects = thresholdGroups.selectAll('rect.threshold-rect');
        thresholdTexts = thresholdGroups.selectAll('text.threshold-text');
        defaultThreshold.removeEventListener('px-vis-threshold-rendering-ended', rendered);
        done();
      };

      defaultThreshold.addEventListener('px-vis-threshold-rendering-ended', rendered);

      defaultThreshold.set('thresholdData',dT);
    });

    suite('px-vis-threshold everything drew', function() {
      test('defaultThreshold thresholdGroup created', function() {
        assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
        assert.isTrue(defaultThreshold.thresholdGroup.attr("class").indexOf('thresholds') !== -1);
      });

      test('defaultThreshold thresholdGroup groups are created', function() {
        assert.lengthOf(thresholdGroups.nodes(), 7);
      });

      test('defaultThreshold threshold lines are created', function() {
        assert.lengthOf(thresholdLines.nodes(), 7);
      });

      test('defaultThreshold threshold rects are created', function() {
        assert.lengthOf(thresholdRects.nodes(), 7);
      });

      test('defaultThreshold threshold texts are created', function() {
        assert.lengthOf(thresholdTexts.nodes(), 7);
      });
    });

    suite('px-vis-threshold thresholds have correct values', function() {
      test('defaultThreshold thresholdLine stroke width', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-width'), 1);
      });
      test('defaultThreshold thresholdLine stroke dasharray', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-dasharray').split(' ').join(''),'5,0');
      });
      test('defaultThreshold thresholdLine x1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x1'),0);
      });
      test('defaultThreshold thresholdLine x2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x2'),480);
      });
      test('defaultThreshold thresholdLine y1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y1'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y1'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y1'),82.5);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y1'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y1'),247.5);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y1'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y1'),220);
      });
      test('defaultThreshold thresholdLine y2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y2'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y2'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y2'),82.5);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y2'),137.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y2'),247.5);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y2'),192.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y2'),220);
      });
      test('defaultThreshold thresholdLine stroke', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke').split(' ').join(''), 'red');
      });

      test('defaultThreshold thresholdRect x', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[1].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[5].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('x'),5);
      });
      test('defaultThreshold thresholdRect y', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('y'), 55);
        assert.equal(thresholdRects.nodes()[1].getAttribute('y'), 27.5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('y'), 82.5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('y'), 137.5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('y'), 247.5);
        assert.equal(thresholdRects.nodes()[5].getAttribute('y'), 192.5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('y'), 220);
      });
      test('defaultThreshold thresholdRect width', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[1].getAttribute('width')),
                       Number(thresholdTexts.nodes()[1].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[2].getAttribute('width')),
                       Number(thresholdTexts.nodes()[2].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[3].getAttribute('width')),
                       Number(thresholdTexts.nodes()[3].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[4].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[5].getAttribute('width')),
                       Number(thresholdTexts.nodes()[5].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[6].getAttribute('width'), 0);
      });
      test('defaultThreshold thresholdRect height', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[1].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[2].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[3].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[4].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[5].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[6].getAttribute('height'),18);
      });
      test('defaultThreshold thresholdRect fill', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[1].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[2].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[3].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[4].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[5].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[6].getAttribute('fill').split(' ').join(''), 'none');
      });

      test('defaultThreshold thresholdText font-size', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[1].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[2].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[3].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[5].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[6].getAttribute('font-size'),'12px');
      });
      test('defaultThreshold thresholdText x', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[2].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[4].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[5].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[6].getAttribute('x'),8);
      });
      test('defaultThreshold thresholdText y', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('y'),(55+13));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('y'),(27.5+13));
        assert.equal(thresholdTexts.nodes()[2].getAttribute('y'),(82.5+13));
        assert.equal(thresholdTexts.nodes()[3].getAttribute('y'),(137.5+13));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('y'),(247.5+13));
        assert.equal(thresholdTexts.nodes()[5].getAttribute('y'),(192.5+13));
        assert.equal(thresholdTexts.nodes()[6].getAttribute('y'),(220+13));
      });
      test('defaultThreshold thresholdText color', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[2].getAttribute('fill').split(' ').join(''), 'white')
        assert.equal(thresholdTexts.nodes()[3].getAttribute('fill').split(' ').join(''), 'white');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdTexts.nodes()[5].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[6].getAttribute('fill').split(' ').join(''), 'red');
      });
      test('defaultThreshold thresholdText text', function() {
        assert.equal(thresholdTexts.nodes()[0].textContent,'8.00');
        assert.equal(thresholdTexts.nodes()[1].textContent,'9.00 (show me too)');
        assert.equal(thresholdTexts.nodes()[2].textContent,'7.00');
        assert.equal(thresholdTexts.nodes()[3].textContent,'5.00');
        assert.equal(thresholdTexts.nodes()[4].textContent,'1.00');
        assert.equal(thresholdTexts.nodes()[5].textContent,'3.00 (show me)');
        assert.equal(thresholdTexts.nodes()[6].textContent,'2.00 (CUSTOM)');
      });
    }); //suite
  }); //suite


  suite('px-vis-threshold delete thresholds', function() {
    var baseScale,
        baseSVG,
        defaultThreshold,
        thresholdGroups,
        thresholdLines,
        thresholdRects,
        thresholdTexts;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;
    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      defaultThreshold = document.getElementById('defaultThreshold');
      var dT = [
          { "for":"mySeries", "type":"defaultSeriesTitleBox", "value":9 },
          { "for":"mySeries", "type":"defaultSeries", "value":8 },
          { "for":"", "type":"defaultTitle", "value": 5 },
          { "for":"", "type":"default", "value":1 },
          { "for":"", "type":"custom", "value": 2 },
        ];

      var rendered = function() {
        thresholdGroups = defaultThreshold.thresholdGroup.selectAll('g.threshold');
        thresholdLines = thresholdGroups.selectAll('line.threshold-line');
        thresholdRects = thresholdGroups.selectAll('rect.threshold-rect');
        thresholdTexts = thresholdGroups.selectAll('text.threshold-text');
        defaultThreshold.removeEventListener('px-vis-threshold-rendering-ended', rendered);
        done();
      };

      defaultThreshold.addEventListener('px-vis-threshold-rendering-ended', rendered);

      defaultThreshold.set('thresholdData', dT);
    });

    suite('px-vis-threshold everything drew', function() {
      test('defaultThreshold thresholdGroup created', function() {
        assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
        assert.isTrue(defaultThreshold.thresholdGroup.attr("class").indexOf('thresholds') !== -1);
      });

      test('defaultThreshold thresholdGroup groups are created', function() {
        assert.lengthOf(thresholdGroups.nodes(), 5);
      });

      test('defaultThreshold threshold lines are created', function() {
        assert.lengthOf(thresholdLines.nodes(), 5);
      });

      test('defaultThreshold threshold rects are created', function() {
        assert.lengthOf(thresholdRects.nodes(), 5);
      });

      test('defaultThreshold threshold texts are created', function() {
        assert.lengthOf(thresholdTexts.nodes(), 5);
      });
    });

    suite('px-vis-threshold thresholds have correct values', function() {
      test('defaultThreshold thresholdLine stroke width', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-width'), 1);
      });
      test('defaultThreshold thresholdLine stroke dasharray', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-dasharray').split(' ').join(''),'5,0');
      });
      test('defaultThreshold thresholdLine x1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x1'),0);
      });
      test('defaultThreshold thresholdLine x2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x2'),480);
      });
      test('defaultThreshold thresholdLine y1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y1'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y1'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y1'),137.5);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y1'),247.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y1'),220);
      });
      test('defaultThreshold thresholdLine y2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y2'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y2'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y2'),137.5);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y2'),247.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y2'),220);
      });
      test('defaultThreshold thresholdLine stroke', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke').split(' ').join(''), 'red');
      });

      test('defaultThreshold thresholdRect x', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[1].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('x'),5);
      });
      test('defaultThreshold thresholdRect y', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('y'), 55);
        assert.equal(thresholdRects.nodes()[1].getAttribute('y'), 27.5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('y'), 137.5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('y'), 247.5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('y'), 220);
      });
      test('defaultThreshold thresholdRect width', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[1].getAttribute('width')),
                       Number(thresholdTexts.nodes()[1].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[2].getAttribute('width')),
                       Number(thresholdTexts.nodes()[2].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[3].getAttribute('width'), 0);
        assert.equal(thresholdRects.nodes()[4].getAttribute('width'), 0);
      });
      test('defaultThreshold thresholdRect height', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[1].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[2].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[3].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[4].getAttribute('height'),18);
      });
      test('defaultThreshold thresholdRect fill', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[1].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[2].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[3].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[4].getAttribute('fill').split(' ').join(''), 'none');
      });

      test('defaultThreshold thresholdText font-size', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[1].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[2].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[3].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('font-size'),'12px');
      });
      test('defaultThreshold thresholdText x', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[2].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[4].getAttribute('x'),8);
      });
      test('defaultThreshold thresholdText y', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('y'),(55+13));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('y'),(27.5+13));
        assert.equal(thresholdTexts.nodes()[2].getAttribute('y'),(137.5+13));
        assert.equal(thresholdTexts.nodes()[3].getAttribute('y'),(247.5+13));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('y'),(220+13));
      });
      test('defaultThreshold thresholdText color', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[2].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[3].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('fill').split(' ').join(''), 'red');
      });
      test('defaultThreshold thresholdText text', function() {
        assert.equal(thresholdTexts.nodes()[0].textContent,'8.00');
        assert.equal(thresholdTexts.nodes()[1].textContent,'9.00 (show me too)');
        assert.equal(thresholdTexts.nodes()[2].textContent,'5.00');
        assert.equal(thresholdTexts.nodes()[3].textContent,'1.00');
        assert.equal(thresholdTexts.nodes()[4].textContent,'2.00 (CUSTOM)');
      });
    }); //suite
  }); //suite


  suite('px-vis-threshold add thresholds', function() {
    var baseScale,
        baseSVG,
        defaultThreshold,
        thresholdGroups,
        thresholdLines,
        thresholdRects,
        thresholdTexts;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;
    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      defaultThreshold = document.getElementById('defaultThreshold');
      var dT = [
          { "for":"mySeries", "type":"defaultSeriesTitleBox", "value":9 },
          { "for":"mySeries", "type":"defaultSeries", "value":8 },
          { "for":"", "type":"defaultTitle", "value": 5 },
          { "for":"", "type":"default", "value":1 },
          { "for":"", "type":"custom", "value": 2 },
          { "for":"", "type":"custom", "value": 7 },
          { "for":"", "type":"defaultSeries", "value": 3 }
        ];

      var rendered = function() {
        thresholdGroups = defaultThreshold.thresholdGroup.selectAll('g.threshold');
        thresholdLines = thresholdGroups.selectAll('line.threshold-line');
        thresholdRects = thresholdGroups.selectAll('rect.threshold-rect');
        thresholdTexts = thresholdGroups.selectAll('text.threshold-text');
        defaultThreshold.removeEventListener('px-vis-threshold-rendering-ended', rendered);
        done();
      };

      defaultThreshold.addEventListener('px-vis-threshold-rendering-ended', rendered);

      defaultThreshold.set('thresholdData', dT);
    });

    suite('px-vis-threshold everything drew', function() {
      test('defaultThreshold thresholdGroup created', function() {
        assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
        assert.isTrue(defaultThreshold.thresholdGroup.attr("class").indexOf('thresholds') !== -1);
      });

      test('defaultThreshold thresholdGroup groups are created', function() {
        assert.lengthOf(thresholdGroups.nodes(), 7);
      });

      test('defaultThreshold threshold lines are created', function() {
        assert.lengthOf(thresholdLines.nodes(), 7);
      });

      test('defaultThreshold threshold rects are created', function() {
        assert.lengthOf(thresholdRects.nodes(), 7);
      });

      test('defaultThreshold threshold texts are created', function() {
        assert.lengthOf(thresholdTexts.nodes(), 7);
      });
    });

    suite('px-vis-threshold thresholds have correct values', function() {
      test('defaultThreshold thresholdLine stroke width', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-width'), 1);
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-width'), 1);
      });
      test('defaultThreshold thresholdLine stroke dasharray', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke-dasharray').split(' ').join(''),'5,0');
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke-dasharray').split(' ').join(''),'5,0');
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke-dasharray').split(' ').join(''),'5,2');
      });
      test('defaultThreshold thresholdLine x1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x1'),0);
      });
      test('defaultThreshold thresholdLine x2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x2'),480);
      });
      test('defaultThreshold thresholdLine y1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y1'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y1'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y1'),137.5);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y1'),247.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y1'),220);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y1'),82.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y1'),192.5);
      });
      test('defaultThreshold thresholdLine y2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y2'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y2'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y2'),137.5);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y2'),247.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y2'),220);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y2'),82.5);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y2'),192.5);
      });
      test('defaultThreshold thresholdLine stroke', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[1].getAttribute('stroke').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdLines.nodes()[2].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[3].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdLines.nodes()[4].getAttribute('stroke').split(' ').join(''), 'red');
        assert.equal(thresholdLines.nodes()[5].getAttribute('stroke').split(' ').join(''), 'red');
        assert.equal(thresholdLines.nodes()[6].getAttribute('stroke').split(' ').join(''), rgbToHex(colors["grey12"]));
      });

      test('defaultThreshold thresholdRect x', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[1].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[5].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('x'),5);
      });
      test('defaultThreshold thresholdRect y', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('y'),55);
        assert.equal(thresholdRects.nodes()[1].getAttribute('y'),27.5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('y'),137.5);
        assert.equal(thresholdRects.nodes()[3].getAttribute('y'),247.5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('y'),220);
        assert.equal(thresholdRects.nodes()[5].getAttribute('y'),82.5);
        assert.equal(thresholdRects.nodes()[6].getAttribute('y'),192.5);
      });
      test('defaultThreshold thresholdRect width', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[1].getAttribute('width')),
                       Number(thresholdTexts.nodes()[1].getBBox().width) + 6, 15);
        assert.closeTo(Number(thresholdRects.nodes()[2].getAttribute('width')),
                       Number(thresholdTexts.nodes()[2].getBBox().width) + 6, 15);
        assert.equal(thresholdRects.nodes()[3].getAttribute('width'), 0);
        assert.equal(thresholdRects.nodes()[4].getAttribute('width'), 0);
        assert.equal(thresholdRects.nodes()[5].getAttribute('width'), 0);
        assert.equal(thresholdRects.nodes()[6].getAttribute('width'), 0);
      });
      test('defaultThreshold thresholdRect height', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[1].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[2].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[3].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[4].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[5].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[6].getAttribute('height'),18);
      });
      test('defaultThreshold thresholdRect fill', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[1].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdRects.nodes()[2].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdRects.nodes()[3].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[4].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[5].getAttribute('fill').split(' ').join(''), 'none');
        assert.equal(thresholdRects.nodes()[6].getAttribute('fill').split(' ').join(''), 'none');
      });

      test('defaultThreshold thresholdText font-size', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[1].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[2].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[3].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[4].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[5].getAttribute('font-size'),'12px');
        assert.equal(thresholdTexts.nodes()[6].getAttribute('font-size'),'12px');
      });
      test('defaultThreshold thresholdText x', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[2].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[4].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[5].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[6].getAttribute('x'),8);
      });
      test('defaultThreshold thresholdText y', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('y'),(55+13));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('y'),(27.5+13));
        assert.equal(thresholdTexts.nodes()[2].getAttribute('y'),(137.5+13));
        assert.equal(thresholdTexts.nodes()[3].getAttribute('y'),(247.5+13));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('y'),(220+13));
        assert.equal(thresholdTexts.nodes()[5].getAttribute('y'),(82.5+13));
        assert.equal(thresholdTexts.nodes()[6].getAttribute('y'),(192.5+13));
      });
      test('defaultThreshold thresholdText color', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('fill').split(' ').join(''), colorSet[1]);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('fill').split(' ').join(''), "white");
        assert.equal(thresholdTexts.nodes()[2].getAttribute('fill').split(' ').join(''), 'white');
        assert.equal(thresholdTexts.nodes()[3].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('fill').split(' ').join(''), 'red');
        assert.equal(thresholdTexts.nodes()[5].getAttribute('fill').split(' ').join(''), 'red');
        assert.equal(thresholdTexts.nodes()[6].getAttribute('fill').split(' ').join(''), rgbToHex(colors["grey12"]));
      });
      test('defaultThreshold thresholdText text', function() {
        assert.equal(thresholdTexts.nodes()[0].textContent,'8.00');
        assert.equal(thresholdTexts.nodes()[1].textContent,'9.00 (show me too)');
        assert.equal(thresholdTexts.nodes()[2].textContent,'5.00');
        assert.equal(thresholdTexts.nodes()[3].textContent,'1.00');
        assert.equal(thresholdTexts.nodes()[4].textContent,'2.00 (CUSTOM)');
        assert.equal(thresholdTexts.nodes()[5].textContent,'7.00 (CUSTOM)');
        assert.equal(thresholdTexts.nodes()[6].textContent,'3.00');
      });
    }); //suite
  }); //suite

  suite('px-vis-threshold go vertical', function() {
    var baseScale,
        baseSVG,
        defaultThreshold,
        thresholdGroups,
        thresholdLines,
        thresholdRects,
        thresholdTexts;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      defaultThreshold = document.getElementById('defaultThreshold');
      const data = [
        { "for":"mySeries", "type":"defaultSeriesTitleBox", "value":9 },
        { "for":"mySeries", "type":"defaultSeries", "value":8 },
        { "for":"", "type":"defaultTitle", "value": 1397160780000 },
        { "for":"", "type":"default", "value":1 },
        { "for":"", "type":"custom", "value": 1397131620000 },
        { "for":"", "type":"custom", "value": 1397189940000 },
        { "for":"", "type":"defaultSeries", "value": 3 }
      ];

      const conf = {
        "custom": {
          "color": "red",
          "dashPattern": "5,0",
          "title": "CUSTOM",
          "direction": "vertical"
        },
        "defaultSeriesBox": {
          "showThresholdBox": true
        },
        "defaultBox": {
          "showThresholdBox": true
        },
        "defaultTitle": {
          "showThresholdBox": true,
          "direction": "vertical"
        },
        "defaultTitleBox": {
          "showThresholdBox": true,
          "title": "show me"
        },
        "defaultSeriesTitleBox": {
          "showThresholdBox": true,
          "title": "show me too",
          "direction": "horizontal"
        }
      };

      var rendered = function() {
        thresholdGroups = defaultThreshold.thresholdGroup.selectAll('g.threshold');
        thresholdLines = thresholdGroups.selectAll('line.threshold-line');
        thresholdRects = thresholdGroups.selectAll('rect.threshold-rect');
        thresholdTexts = thresholdGroups.selectAll('text.threshold-text');
        defaultThreshold.removeEventListener('px-vis-threshold-rendering-ended', rendered);
        done();
      };

      defaultThreshold.addEventListener('px-vis-threshold-rendering-ended', rendered);

      defaultThreshold.set('thresholdData', data);
      defaultThreshold.set('thresholdConfig', conf);
    });

    suite('px-vis-threshold everything drew', function() {
      test('defaultThreshold thresholdGroup created', function() {
        assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
        assert.isTrue(defaultThreshold.thresholdGroup.attr("class").indexOf('thresholds') !== -1);
      });

      test('defaultThreshold thresholdGroup groups are created', function() {
        assert.lengthOf(thresholdGroups.nodes(), 7);
      });

      test('defaultThreshold threshold lines are created', function() {
        assert.lengthOf(thresholdLines.nodes(), 7);
      });

      test('defaultThreshold threshold rects are created', function() {
        assert.lengthOf(thresholdRects.nodes(), 7);
      });

      test('defaultThreshold threshold texts are created', function() {
        assert.lengthOf(thresholdTexts.nodes(), 7);
      });
    });

    suite('px-vis-threshold thresholds have correct values', function() {
      test('defaultThreshold thresholdLine x1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x1'),240);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x1'),0);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x1'),120);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x1'),360);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x1'),0);
      });
      test('defaultThreshold thresholdLine x2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[1].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[2].getAttribute('x2'),240);
        assert.equal(thresholdLines.nodes()[3].getAttribute('x2'),480);
        assert.equal(thresholdLines.nodes()[4].getAttribute('x2'),120);
        assert.equal(thresholdLines.nodes()[5].getAttribute('x2'),360);
        assert.equal(thresholdLines.nodes()[6].getAttribute('x2'),480);
      });
      test('defaultThreshold thresholdLine y1', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y1'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y1'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y1'),0);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y1'),247.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y1'),0);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y1'),0);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y1'),192.5);
      });
      test('defaultThreshold thresholdLine y2', function() {
        assert.equal(thresholdLines.nodes()[0].getAttribute('y2'),55);
        assert.equal(thresholdLines.nodes()[1].getAttribute('y2'),27.5);
        assert.equal(thresholdLines.nodes()[2].getAttribute('y2'),275);
        assert.equal(thresholdLines.nodes()[3].getAttribute('y2'),247.5);
        assert.equal(thresholdLines.nodes()[4].getAttribute('y2'),275);
        assert.equal(thresholdLines.nodes()[5].getAttribute('y2'),275);
        assert.equal(thresholdLines.nodes()[6].getAttribute('y2'),192.5);
      });

      test('defaultThreshold thresholdRect x', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[1].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('x'),240);
        assert.equal(thresholdRects.nodes()[3].getAttribute('x'),5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('x'),120);
        assert.equal(thresholdRects.nodes()[5].getAttribute('x'),360);
        assert.equal(thresholdRects.nodes()[6].getAttribute('x'),5);
      });
      test('defaultThreshold thresholdRect y', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('y'),55);
        assert.equal(thresholdRects.nodes()[1].getAttribute('y'),27.5);
        assert.equal(thresholdRects.nodes()[2].getAttribute('y'),2);
        assert.equal(thresholdRects.nodes()[3].getAttribute('y'),247.5);
        assert.equal(thresholdRects.nodes()[4].getAttribute('y'),2);
        assert.equal(thresholdRects.nodes()[5].getAttribute('y'),2);
        assert.equal(thresholdRects.nodes()[6].getAttribute('y'),192.5);
      });
      test('defaultThreshold thresholdRect width', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('width'), 0);
        assert.closeTo(Number(thresholdRects.nodes()[1].getAttribute('width')), 104, 15);
        assert.closeTo(Number(thresholdRects.nodes()[2].getAttribute('width')), 104, 15);
        assert.equal(thresholdRects.nodes()[3].getAttribute('width'), 0);
        assert.equal(thresholdRects.nodes()[4].getAttribute('width'), 0);
        assert.equal(thresholdRects.nodes()[5].getAttribute('width'), 0);
        assert.equal(thresholdRects.nodes()[6].getAttribute('width'), 0);
      });
      test('defaultThreshold thresholdRect height', function() {
        assert.equal(thresholdRects.nodes()[0].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[1].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[2].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[3].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[4].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[5].getAttribute('height'),18);
        assert.equal(thresholdRects.nodes()[6].getAttribute('height'),18);
      });

      test('defaultThreshold thresholdText x', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[1].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[2].getAttribute('x'),236);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('x'),8);
        assert.equal(thresholdTexts.nodes()[4].getAttribute('x'),116);
        assert.equal(thresholdTexts.nodes()[5].getAttribute('x'),356);
        assert.equal(thresholdTexts.nodes()[6].getAttribute('x'),8);
      });
      test('defaultThreshold thresholdText y', function() {
        assert.equal(thresholdTexts.nodes()[0].getAttribute('y'),(55+13));
        assert.equal(thresholdTexts.nodes()[1].getAttribute('y'),(27.5+13));
        assert.equal(thresholdTexts.nodes()[2].getAttribute('y'),5);
        assert.equal(thresholdTexts.nodes()[3].getAttribute('y'),(247.5+13));
        assert.equal(thresholdTexts.nodes()[4].getAttribute('y'),5);
        assert.equal(thresholdTexts.nodes()[5].getAttribute('y'),5);
        assert.equal(thresholdTexts.nodes()[6].getAttribute('y'),(192.5+13));
      });
    }); //suite
  }); //suite

} //runTests
