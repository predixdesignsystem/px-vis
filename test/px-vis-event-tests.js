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
  suite('px-vis-scatter does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-event is instantiated', function() {
    var baseScale = document.getElementById('baseScale'),
        linearScale = document.getElementById('linearScale'),
        ordinalScale = document.getElementById('ordinalScale'),
        baseSVG = document.getElementById('baseSVG'),
        defaultEvent = document.getElementById('defaultEvent'),
        faEvent = document.getElementById('faEvent'),
        uniEvent = document.getElementById('uniEvent'),
        imgEvent = document.getElementById('imgEvent'),
        noLabelEvent = document.getElementById('noLabelEvent'),
        offsetEvent = document.getElementById('offsetEvent'),
        linearEvent = document.getElementById('linearEvent'),
        ordinalEvent = document.getElementById('ordinalEvent');

    suiteSetup(function(done) {
      var w = 500,
        h = 300,
        m = {
          "top": 25,
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
        linearD = [{
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
            }
        ],
        ordinalD = [{
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
          linearChartExtents = {"x":[0,10],"y":[0,10]},
          ordinalChartExtents = {"x":["low","medium", "high"],"y":[0,10]},
        dE = [{
          "id": "123",
          "x": 1397131620000,
          "label": "image"
        },{
          "id": "456",
          "x": 1397102460000,
          "label": "unicode"
        },{
          "id": "789",
          "x": 1397189940000,
          "label": "font awesome"
        },{
          "id": "333",
          "x": 1397160780000,
          "label": "Default"
        },{
          "id": "42",
          "x": 1397111451000
        },{
          "id": "444",
          "x": 1397170014000,
          "label": "offset"
        },{
          "id": "666",
          "x": 3,
          "label": "linear"
        },{
          "id": "6666",
          "x": "low",
          "label": "ordinal"
        }],
        eventConfig =  {
          "font awesome":{
            "color": "blue",
            "icon": "px-vis:mov",
            "type": "px",
            "offset":[0,0]
          },
          "unicode":{
            "color": "green",
            "icon": "\uf015",
            "type": "unicode",
            "offset":[1,0]
          },
          "image":{
            "icon": "../ge_logo.png",
            "type": "image",
            "offset":[0,-20],
            "size":"20"
          },
          "offset":{
            "icon": "px-vis:mov",
            "color":"red",
            "type": "px",
            "offset":[10,20]
          }
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

      defaultEvent.set('height',h);
      faEvent.set('height',h);
      uniEvent.set('height',h);
      imgEvent.set('height',h);
      noLabelEvent.set('height',h);
      noLabelEvent.set('height',h);
      offsetEvent.set('height',h);
      linearEvent.set('height',h);
      ordinalEvent.set('height',h);

      defaultEvent.set('margin',m);
      faEvent.set('margin',m);
      uniEvent.set('margin',m);
      imgEvent.set('margin',m);
      noLabelEvent.set('margin',m);
      noLabelEvent.set('margin',m);
      offsetEvent.set('margin',m);
      linearEvent.set('margin',m);
      ordinalEvent.set('margin',m);

      defaultEvent.set('eventConfig',eventConfig);
      faEvent.set('eventConfig',eventConfig);
      uniEvent.set('eventConfig',eventConfig);
      imgEvent.set('eventConfig',eventConfig);
      noLabelEvent.set('eventConfig',eventConfig);
      noLabelEvent.set('eventConfig',eventConfig);
      offsetEvent.set('eventConfig',eventConfig);
      linearEvent.set('eventConfig',eventConfig);
      ordinalEvent.set('eventConfig',eventConfig);

      defaultEvent.set('eventData',dE[3]);
      faEvent.set('eventData',dE[2]);
      uniEvent.set('eventData',dE[1]);
      imgEvent.set('eventData',dE[0]);
      noLabelEvent.set('eventData',dE[4]);
      offsetEvent.set('eventData',dE[5]);
      linearEvent.set('eventData',dE[6]);
      ordinalEvent.set('eventData',dE[7]);

      window.setTimeout(function(){

        //fake showing tooltip so it calculates its value
        defaultEvent._tooltipRequest();
        faEvent._tooltipRequest();
        uniEvent._tooltipRequest();
        imgEvent._tooltipRequest();
        noLabelEvent._tooltipRequest();
        offsetEvent._tooltipRequest();
        linearEvent._tooltipRequest();
        ordinalEvent._tooltipRequest();
        done();
      }.bind(this), 1500);
    });

    test('defaultEvent fixture is created', function() {
      assert.isTrue(defaultEvent !== null);
    });
    test('faEvent fixture is created', function() {
      assert.isTrue(faEvent !== null);
    });
    test('uniEvent fixture is created', function() {
      assert.isTrue(uniEvent !== null);
    });
    test('imgEvent fixture is created', function() {
      assert.isTrue(imgEvent !== null);
    });
    test('noLabelEvent fixture is created', function() {
      assert.isTrue(noLabelEvent !== null);
    });
  }); //suite

  suite('px-vis-event defaultEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        defaultEvent = document.getElementById('defaultEvent');

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('defaultEvent eventGroup created', function() {
      assert.equal(defaultEvent.eventGroup.node().tagName,'g');
    });
    test('defaultEvent eventGroup has class', function() {
      assert.equal(defaultEvent.eventGroup.attr('class'),'event');
    });
    test('defaultEvent eventGroup set event-id', function() {
      assert.equal(defaultEvent.eventGroup.attr('event-id'),defaultEvent.eventId);
    });

    test('defaultEvent eventIcon created', function() {
      assert.equal(defaultEvent.eventIcon.node().tagName,'g');
    });
    test('defaultEvent eventIcon transform', function() {
      assert.equal(defaultEvent.eventIcon.attr('transform').replace(',',' '), 'translate(232 -21) scale(1)');
    });

    test('defaultEvent eventLine created', function() {
      assert.equal(defaultEvent.eventLine.node().tagName,'line');
    });
    test('defaultEvent eventLine stroke color', function() {
      assert.equal(defaultEvent.eventLine.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });
    test('defaultEvent eventLine stroke width', function() {
      assert.equal(defaultEvent.eventLine.attr('stroke-width'),1);
    });
    test('defaultEvent eventLine x1', function() {
      assert.equal(defaultEvent.eventLine.attr('x1'),240);
    });
    test('defaultEvent eventLine x2', function() {
      assert.equal(defaultEvent.eventLine.attr('x2'),240);
    });
    test('defaultEvent eventLine y1', function() {
      assert.equal(defaultEvent.eventLine.attr('y1'),275);
    });
    test('defaultEvent eventLine y2', function() {
      assert.equal(defaultEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(defaultEvent.$$('px-tooltip') !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(defaultEvent.$$('px-tooltip').$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: DefaultID: 333Timestamp: 20:13:00 +0000 | 10 Apr 2014');
    });
  }); //suite

  suite('px-vis-event imgEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        imgEvent = document.getElementById('imgEvent');

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('imgEvent eventGroup created', function() {
      assert.equal(imgEvent.eventGroup.node().tagName,'g');
    });
    test('imgEvent eventGroup has class', function() {
      assert.equal(imgEvent.eventGroup.attr('class'),'event');
    });


    test('imgEvent eventIcon created', function() {
      assert.equal(imgEvent.eventIcon.node().tagName,'image');
    });
    test('imgEvent eventIcon xlink', function() {
      assert.equal(imgEvent.eventIcon.attr('xlink:href'),'../ge_logo.png');
    });
    test('imgEvent eventIcon width', function() {
      assert.equal(imgEvent.eventIcon.attr('width'),'20px');
    });
    test('imgEvent eventIcon height', function() {
      assert.equal(imgEvent.eventIcon.attr('height'),'20px');
    });
    test('imgEvent eventIcon transform', function() {
      assert.equal(imgEvent.eventIcon.attr('transform').replace(',',' '),'translate(110 -25)');
    });

    test('imgEvent eventLine created', function() {
      assert.equal(imgEvent.eventLine.node().tagName,'line');
    });
    test('imgEvent eventLine stroke color', function() {
      assert.equal(imgEvent.eventLine.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });
    test('imgEvent eventLine stroke width', function() {
      assert.equal(imgEvent.eventLine.attr('stroke-width'),1);
    });
    test('imgEvent eventLine x1', function() {
      assert.equal(imgEvent.eventLine.attr('x1'),120);
    });
    test('imgEvent eventLine x2', function() {
      assert.equal(imgEvent.eventLine.attr('x2'),120);
    });
    test('imgEvent eventLine y1', function() {
      assert.equal(imgEvent.eventLine.attr('y1'),275);
    });
    test('imgEvent eventLine y2', function() {
      assert.equal(imgEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(imgEvent.$$('px-tooltip') !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(imgEvent.$$('px-tooltip').$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: imageID: 123Timestamp: 12:07:00 +0000 | 10 Apr 2014');
    });
  }); //suite

  suite('px-vis-event noLabelEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        noLabelEvent = document.getElementById('noLabelEvent');

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('noLabelEvent eventGroup created', function() {
      assert.equal(noLabelEvent.eventGroup.node().tagName,'g');
    });
    test('noLabelEvent eventGroup has class', function() {
      assert.equal(noLabelEvent.eventGroup.attr('class'),'event');
    });

    test('noLabelEvent eventIcon transform', function() {
      assert.equal(noLabelEvent.eventIcon.attr('transform').replace(',',' '), 'translate(29 -21) scale(1)');
    });

    test('noLabelEvent eventLine created', function() {
      assert.equal(noLabelEvent.eventLine.node().tagName,'line');
    });
    test('noLabelEvent eventLine stroke color', function() {
      assert.equal(noLabelEvent.eventLine.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });
    test('noLabelEvent eventLine stroke width', function() {
      assert.equal(noLabelEvent.eventLine.attr('stroke-width'),1);
    });
    test('noLabelEvent eventLine x1', function() {
      assert.equal(noLabelEvent.eventLine.attr('x1'),37);
    });
    test('noLabelEvent eventLine x2', function() {
      assert.equal(noLabelEvent.eventLine.attr('x2'),37);
    });
    test('noLabelEvent eventLine y1', function() {
      assert.equal(noLabelEvent.eventLine.attr('y1'),275);
    });
    test('noLabelEvent eventLine y2', function() {
      assert.equal(noLabelEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(noLabelEvent.$$('px-tooltip') !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(noLabelEvent.$$('px-tooltip').$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event:ID: 42Timestamp: 06:30:51 +0000 | 10 Apr 2014');
    });
  }); //suite

  suite('px-vis-event offsetEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        offsetEvent = document.getElementById('offsetEvent');

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('offsetEvent eventGroup created', function() {
      assert.equal(offsetEvent.eventGroup.node().tagName,'g');
    });
    test('offsetEvent eventGroup has class', function() {
      assert.equal(offsetEvent.eventGroup.attr('class'),'event');
    });

    test('offsetEvent eventIcon created', function() {
      assert.equal(offsetEvent.eventIcon.node().tagName,'g');
    });

    test('offsetEvent eventIcon transform translate', function() {
      var normalized = offsetEvent.eventIcon.attr('transform').replace(',',' '),
          scaleIndex = normalized.indexOf('scale');
      assert.equal(normalized.substring(0,scaleIndex), 'translate(280 -1) ');
    });

    test('offsetEvent eventLine created', function() {
      assert.equal(offsetEvent.eventLine.node().tagName,'line');
    });
    test('offsetEvent eventLine stroke color', function() {
      assert.equal(offsetEvent.eventLine.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });
    test('offsetEvent eventLine stroke width', function() {
      assert.equal(offsetEvent.eventLine.attr('stroke-width'),1);
    });
    test('offsetEvent eventLine x1', function() {
      assert.equal(offsetEvent.eventLine.attr('x1'),278);
    });
    test('offsetEvent eventLine x2', function() {
      assert.equal(offsetEvent.eventLine.attr('x2'),278);
    });
    test('offsetEvent eventLine y1', function() {
      assert.equal(offsetEvent.eventLine.attr('y1'),275);
    });
    test('offsetEvent eventLine y2', function() {
      assert.equal(offsetEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(offsetEvent.$$('px-tooltip') !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(offsetEvent.$$('px-tooltip').$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: offsetID: 444Timestamp: 22:46:54 +0000 | 10 Apr 2014');
    });
  }); //suite


  suite('px-vis-event with linear scale', function() {
    var baseScale = document.getElementById('linearScale'),
        baseSVG = document.getElementById('baseSVG'),
        linearEvent = document.getElementById('linearEvent');

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('linearEvent eventGroup created', function() {
      assert.equal(linearEvent.eventGroup.node().tagName,'g');
    });
    test('linearEvent eventGroup has class', function() {
      assert.equal(linearEvent.eventGroup.attr('class'),'event');
    });

    test('linearEvent eventIcon created', function() {
      assert.equal(linearEvent.eventIcon.node().tagName,'g');
    });

    test('linearEvent eventLine created', function() {
      assert.equal(linearEvent.eventLine.node().tagName,'line');
    });
    test('linearEvent eventLine stroke color', function() {
      assert.equal(linearEvent.eventLine.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });

    test('linearEvent eventLine x1', function() {
      assert.equal(linearEvent.eventLine.attr('x1'),144);
    });
    test('linearEvent eventLine x2', function() {
      assert.equal(linearEvent.eventLine.attr('x2'),144);
    });
    test('linearEvent eventLine y1', function() {
      assert.equal(linearEvent.eventLine.attr('y1'),275);
    });
    test('linearEvent eventLine y2', function() {
      assert.equal(linearEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(linearEvent.$$('px-tooltip') !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(linearEvent.$$('px-tooltip').$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: linearID: 666X: 3');
    });
  }); //suite

  suite('px-vis-event with ordinal scale', function() {
    var baseScale = document.getElementById('ordinalScale'),
        baseSVG = document.getElementById('baseSVG'),
        ordinalEvent = document.getElementById('ordinalEvent');

    var colors = PxColorsBehavior.baseColors.properties.colors.value;

    test('ordinalEvent eventGroup created', function() {
      assert.equal(ordinalEvent.eventGroup.node().tagName,'g');
    });
    test('ordinalEvent eventGroup has class', function() {
      assert.equal(ordinalEvent.eventGroup.attr('class'),'event');
    });

    test('ordinalEvent eventIcon created', function() {
      assert.equal(ordinalEvent.eventIcon.node().tagName,'g');
    });

    test('ordinalEvent eventLine created', function() {
      assert.equal(ordinalEvent.eventLine.node().tagName,'line');
    });
    test('ordinalEvent eventLine stroke color', function() {
      assert.equal(ordinalEvent.eventLine.attr('stroke').split(' ').join(''),rgbToHex(colors['grey8']));
    });

    test('ordinalEvent eventLine x1', function() {
      assert.equal(ordinalEvent.eventLine.attr('x1'),80);
    });
    test('ordinalEvent eventLine x2', function() {
      assert.equal(ordinalEvent.eventLine.attr('x2'),80);
    });
    test('ordinalEvent eventLine y1', function() {
      assert.equal(ordinalEvent.eventLine.attr('y1'),275);
    });
    test('ordinalEvent eventLine y2', function() {
      assert.equal(ordinalEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(ordinalEvent.$$('px-tooltip') !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(ordinalEvent.$$('px-tooltip').$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: ordinalID: 6666X: low');
    });
  }); //suite
} //runTests
