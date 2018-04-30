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

(function (window) {
  try {
    new MouseEvent('test');
    return false; // No need to polyfill
  } catch (e) {
    // Need to polyfill - fall through
  }

  // Polyfills DOM4 MouseEvent

  var MouseEvent = function (eventType, params) {
    params = params || { bubbles: false, cancelable: false };
    var mouseEvent = document.createEvent('MouseEvent');
    mouseEvent.initMouseEvent(eventType, params.bubbles, params.cancelable, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    return mouseEvent;
  }

  MouseEvent.prototype = Event.prototype;

  window.MouseEvent = MouseEvent;
})(window);

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
  suite('px-vis-event is instantiated', function() {
    var baseScale,
        linearScale,
        ordinalScale,
        baseSVG,
        timeEvent,
        linearEvent,
        ordinalEvent;

    suiteSetup(function(done) {
      let doneCounter = 0;
      window.addEventListener('px-vis-event-rendering-ended', () => {
        doneCounter += 1;
        if(doneCounter === 3) {
          done();
        }
      });

      baseSVG = document.getElementById('baseSVG');
      baseScale = document.getElementById('baseScale');
      linearScale = document.getElementById('linearScale');
      ordinalScale = document.getElementById('ordinalScale');

      timeEvent = document.getElementById('timeEvent');
      linearEvent = document.getElementById('linearEvent');
      ordinalEvent = document.getElementById('ordinalEvent');

      const w = 500;
      const h = 300;
      const m = {
        "top": 25,
        "right": 5,
        "bottom": 20,
        "left": 15
      };
      const d = [{
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
      }];
      const linearD = [{
        "x": 2,
        "y": 1
      },{
        "x": 4,
        "y": 6
      },{
        "x": 5,
        "y": 10
      },{
        "x": 6,
        "y": 4
      },{
        "x": 7,
        "y": 6
      }];
      const ordinalD = [{
        "x": "low",
        "y": 1
      },{
        "x": "low",
        "y": 6
      },{
        "x": "medium",
        "y": 10
      },{
        "x": "medium",
        "y": 4
      },{
        "x": "high",
        "y": 6
      }];
      const completeSeriesConfig = {
        "mySeries":{
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }
      };
      const chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]};
      const linearChartExtents = {"x":[0,10],"y":[0,10]};
      const ordinalChartExtents = {"x":["low","medium", "high"],"y":[0,10]};
      const timeData = [{
        "id": "123",
        "time": 1397131620000,
        "label": "image"
      },{
        "id": "456",
        "time": 1397102460000,
        "label": "choochoo"
      },{
        "id": "789",
        "time": 1397189940000,
        "label": "rocketsaway"
      },{
        "id": "333",
        "time": 1397160780000,
        "label": "Default"
      },{
        "id": "42",
        "time": 1397111451000
      },{
        "id": "444",
        "time": 1397170014000,
        "label": "offset"
      }];
      const linearData = [{
        "id": "666",
        "x": 3,
        "label": "linear"
      }];
      const ordinalData = [{
        "id": "6666",
        "x": "low",
        "label": "ordinal"
      }];
      const eventConfig =  {
        "rocketsaway": {
          "color": "blue",
          "icon": "px-fea:deployments",
          "type": "px",
          "offset":[0,0]
        },
        "choochoo":{
          "color": "green",
          "icon": "px-obj:locomotive",
          "type": "px",
          "offset":[1,0]
        },
        "image":{
          "icon": "../ge_logo.png",
          "type": "image",
          "offset":[0,-20],
          "size":"20"
        },
        "offset":{
          "icon": "px-obj:line-og",
          "color":"red",
          "lineColor": "salmon",
          "lineWeight": 3,
          "type": "px",
          "offset":[10,20]
        }
      };

      const defaultConfig =  {
        dataKey: 'x'
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

      linearScale.set('width',w);
      linearScale.set('height',h);
      linearScale.set('margin',m);
      linearScale.set('completeSeriesConfig',completeSeriesConfig);
      linearScale.set('chartExtents',linearChartExtents);
      linearScale.set('dataExtents',linearChartExtents);
      linearScale.set('chartData',linearD);

      ordinalScale.set('width',w);
      ordinalScale.set('height',h);
      ordinalScale.set('margin',m);
      ordinalScale.set('completeSeriesConfig',completeSeriesConfig);
      ordinalScale.set('chartExtents',ordinalChartExtents);
      ordinalScale.set('dataExtents',ordinalChartExtents);
      ordinalScale.set('chartData',ordinalD);

      timeEvent.set('height',h);
      linearEvent.set('height',h);
      ordinalEvent.set('height',h);

      timeEvent.set('margin',m);
      linearEvent.set('margin',m);
      ordinalEvent.set('margin',m);

      timeEvent.set('eventConfig',eventConfig);

      linearEvent.set('defaultEventConfig',defaultConfig);
      ordinalEvent.set('defaultEventConfig',defaultConfig);

      timeEvent.set('eventData',timeData);
      linearEvent.set('eventData',linearData);
      ordinalEvent.set('eventData',ordinalData);

    });

    test('timeEvent creates 6 events', function() {
      assert.equal(timeEvent.eventGroup.selectAll('.event').nodes().length, 6);
    });

    test('linearEvent creates 1 event', function() {
      assert.equal(linearEvent.eventGroup.selectAll('.event').nodes().length, 1);
    });

    test('ordinalEvent creates 1 event', function() {
      assert.equal(ordinalEvent.eventGroup.selectAll('.event').nodes().length, 1);
    });
  }); //suite




  suite('px-vis-event timeEvent works', function() {
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('timeEvent eventGroup created', function() {
      assert.equal(timeEvent.eventGroup.node().tagName,'g');
    });

    test('timeEvent eventGroup has class', function() {
      assert.isTrue(timeEvent.eventGroup.attr('class').indexOf('events') !== -1);
    });

    test('timeEvent event group set event-id', function() {
      assert.equal(timeEvent.eventGroup.select('g.event').attr('event-id'), '123');
    });

    test('timeEvent event icon created', function() {
      assert.equal(timeEvent.eventGroup.selectAll('.event-icon').nodes().length, 6);
    });

    test('timeEvent event svg icons transforms', function() {
      const icons = timeEvent.eventGroup.selectAll('g.event-icon').nodes();

      assert.equal(Px.d3.select(icons[0]).attr('transform').replace(',',' '), 'translate(-7 -21) scale(0.5)');
      assert.equal(Px.d3.select(icons[1]).attr('transform').replace(',',' '), 'translate(352 -21) scale(0.5)');
      assert.equal(Px.d3.select(icons[2]).attr('transform').replace(',',' '), 'translate(232 -21) scale(1)');
      assert.equal(Px.d3.select(icons[3]).attr('transform').replace(',',' '), 'translate(29 -21) scale(1)');
      assert.equal(Px.d3.select(icons[4]).attr('transform').replace(',',' '), 'translate(280 -1) scale(0.5)');
    });

    test('timeEvent event svg icons color', function() {
      const icons = timeEvent.eventGroup.selectAll('g.event-icon').nodes();

      assert.equal(Px.d3.select(icons[0].firstChild).attr('stroke').split(' ').join(''), 'green');
      assert.equal(Px.d3.select(icons[1].firstChild).attr('stroke').split(' ').join(''), 'blue');
      assert.equal(Px.d3.select(icons[2].firstChild).attr('stroke').split(' ').join(''), rgbToHex(colors['gray10']));
      assert.equal(Px.d3.select(icons[3].firstChild).attr('stroke').split(' ').join(''), rgbToHex(colors['gray10']));
      assert.equal(Px.d3.select(icons[4].firstChild).attr('stroke').split(' ').join(''), 'red');
    });

    test('timeEvent event icon image transform', function() {
      const icon = timeEvent.eventGroup.select('image.event-icon');

      assert.equal(icon.attr('transform').replace(',','').replace(' ',''), 'translate(110-25)');
    });

    test('timeEvent event icon image attrs', function() {
      const icon = timeEvent.eventGroup.select('image.event-icon');

      assert.equal(icon.attr('xlink:href'), '../ge_logo.png');
      assert.equal(icon.attr('width'), '20px');
      assert.equal(icon.attr('height'), '20px');
    });

    test('timeEvent event lines created', function() {
      const lines = timeEvent.eventGroup.selectAll('line.event-line');

      assert.equal(lines.nodes().length, 6)
    });
    test('timeEvent event lines stroke color', function() {
      const lines = timeEvent.eventGroup.selectAll('line.event-line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
      assert.equal(Px.d3.select(lines.nodes()[1]).attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
      assert.equal(Px.d3.select(lines.nodes()[2]).attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
      assert.equal(Px.d3.select(lines.nodes()[3]).attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
      assert.equal(Px.d3.select(lines.nodes()[5]).attr('stroke').split(' ').join(''),'salmon');
    });
    test('timeEvent event line stroke width', function() {
      const lines = timeEvent.eventGroup.selectAll('line.event-line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('stroke-width'),1);
      assert.equal(Px.d3.select(lines.nodes()[1]).attr('stroke-width'),1);
      assert.equal(Px.d3.select(lines.nodes()[2]).attr('stroke-width'),1);
      assert.equal(Px.d3.select(lines.nodes()[3]).attr('stroke-width'),1);
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('stroke-width'),1);
      assert.equal(Px.d3.select(lines.nodes()[5]).attr('stroke-width'),3);
    });
    test('timeEvent event line x1', function() {
      const lines = timeEvent.eventGroup.selectAll('line.event-line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('x1'),120);
      assert.equal(Px.d3.select(lines.nodes()[1]).attr('x1'),0);
      assert.equal(Px.d3.select(lines.nodes()[2]).attr('x1'),360);
      assert.equal(Px.d3.select(lines.nodes()[3]).attr('x1'),240);
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('x1'),37);
      assert.equal(Px.d3.select(lines.nodes()[5]).attr('x1'),278);
    });
    test('timeEvent event line x2', function() {
      const lines = timeEvent.eventGroup.selectAll('line.event-line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('x2'),120);
      assert.equal(Px.d3.select(lines.nodes()[1]).attr('x2'),0);
      assert.equal(Px.d3.select(lines.nodes()[2]).attr('x2'),360);
      assert.equal(Px.d3.select(lines.nodes()[3]).attr('x2'),240);
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('x2'),37);
      assert.equal(Px.d3.select(lines.nodes()[5]).attr('x2'),278);
    });
    test('timeEvent event line y1', function() {
      const lines = timeEvent.eventGroup.selectAll('line.event-line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('y1'),275);
      assert.equal(Px.d3.select(lines.nodes()[1]).attr('y1'),275);
      assert.equal(Px.d3.select(lines.nodes()[2]).attr('y1'),275);
      assert.equal(Px.d3.select(lines.nodes()[3]).attr('y1'),275);
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('y1'),275);
      assert.equal(Px.d3.select(lines.nodes()[5]).attr('y1'),275);
    });
    test('timeEvent event line y2', function() {
      const lines = timeEvent.eventGroup.selectAll('line.event-line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('y2'),0);
      assert.equal(Px.d3.select(lines.nodes()[1]).attr('y2'),0);
      assert.equal(Px.d3.select(lines.nodes()[2]).attr('y2'),0);
      assert.equal(Px.d3.select(lines.nodes()[3]).attr('y2'),0);
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('y2'),0);
      assert.equal(Px.d3.select(lines.nodes()[5]).attr('y2'),0);
    });
  }); //suite


  suite('px-vis-event with linear scale', function() {
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('linearEvent eventGroup created', function() {
      assert.equal(linearEvent.eventGroup.node().tagName,'g');
    });

    test('linearEvent eventGroup has class', function() {
      assert.isTrue(linearEvent.eventGroup.attr('class').indexOf('events') !== -1);
    });

    test('linearEvent event group set event-id', function() {
      assert.equal(linearEvent.eventGroup.select('g.event').attr('event-id'), '666');
    });

    test('linearEvent event icon created', function() {
      assert.equal(linearEvent.eventGroup.selectAll('.event-icon').nodes().length, 1);
    });

    test('linearEvent event svg icons transforms', function() {
      const icons = linearEvent.eventGroup.select('g.event-icon');

      assert.equal(icons.attr('transform').replace(',',' '), 'translate(136 -21) scale(1)');
    });

    test('linearEvent event svg icons color', function() {
      const icons = linearEvent.eventGroup.select('g.event-icon');

      assert.equal(Px.d3.select(icons.node().firstChild).attr('stroke').split(' ').join(''), rgbToHex(colors['gray10']));

    });

    test('linearEvent event lines created', function() {
      const lines = linearEvent.eventGroup.selectAll('line.event-line');

      assert.equal(lines.nodes().length, 1)
    });
    test('linearEvent event lines stroke color', function() {
      const lines = linearEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });
    test('linearEvent event line stroke width', function() {
      const lines = linearEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('stroke-width'),1);
    });
    test('linearEvent event line x1', function() {
      const lines = linearEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('x1'), 144);
    });
    test('linearEvent event line x2', function() {
      const lines = linearEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('x2'), 144);
    });
    test('linearEvent event line y1', function() {
      const lines = linearEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('y1'),275);
    });
    test('linearEvent event line y2', function() {
      const lines = linearEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('y2'),0);
    });
  }); //suite




  suite('px-vis-event with ordinal scale', function() {
    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('ordinalEvent eventGroup created', function() {
      assert.equal(ordinalEvent.eventGroup.node().tagName,'g');
    });

    test('ordinalEvent eventGroup has class', function() {
      assert.isTrue(ordinalEvent.eventGroup.attr('class').indexOf('events') !== -1);
    });

    test('ordinalEvent event group set event-id', function() {
      assert.equal(ordinalEvent.eventGroup.select('g.event').attr('event-id'), '6666');
    });

    test('ordinalEvent event icon created', function() {
      assert.equal(ordinalEvent.eventGroup.selectAll('.event-icon').nodes().length, 1);
    });

    test('ordinalEvent event svg icons transforms', function() {
      const icons = ordinalEvent.eventGroup.select('g.event-icon');

      assert.equal(icons.attr('transform').replace(',',' '), 'translate(72 -21) scale(1)');
    });

    test('ordinalEvent event svg icons color', function() {
      const icons = ordinalEvent.eventGroup.select('g.event-icon');

      assert.equal(Px.d3.select(icons.node().firstChild).attr('stroke').split(' ').join(''), rgbToHex(colors['gray10']));

    });

    test('ordinalEvent event lines created', function() {
      const lines = ordinalEvent.eventGroup.selectAll('line.event-line');

      assert.equal(lines.nodes().length, 1)
    });
    test('ordinalEvent event lines stroke color', function() {
      const lines = ordinalEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });
    test('ordinalEvent event line stroke width', function() {
      const lines = ordinalEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('stroke-width'),1);
    });
    test('ordinalEvent event line x1', function() {
      const lines = ordinalEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('x1'), 80);
    });
    test('ordinalEvent event line x2', function() {
      const lines = ordinalEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('x2'), 80);
    });
    test('ordinalEvent event line y1', function() {
      const lines = ordinalEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('y1'),275);
    });
    test('ordinalEvent event line y2', function() {
      const lines = ordinalEvent.eventGroup.select('line.event-line');

      assert.equal(lines.attr('y2'),0);
    });
  }); //suite

  suite('px-vis-event timeEvent works', function() {
    var detail;
    var icon;
    suiteSetup(function(done) {
      icon = timeEvent.eventGroup.selectAll('g.event-icon').nodes()[2];

      timeEvent.addEventListener('central-tooltip-display-request', (evt) => {
        detail = evt.detail;
        done();
      });

      icon.dispatchEvent(new MouseEvent("mouseenter", {
        bubbles: true,
        cancelable: true,
        view: window
      }));
    });

    test('detail has origin', function() {
      assert.equal(detail.origin, timeEvent);
    });

    test('detail has element', function() {
      assert.equal(detail.element, icon);
    });

    test('detail has data', function() {
      assert.deepEqual(detail.data, [{"title":"Default","data":[{"title":"id","value":"333"}],"time":1397160780000}]);
    });
  });
} //runTests
