document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-scatter does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis- threshold is instantiated', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseLine = document.getElementById('baseLine'),
        defaultThreshold = document.getElementById('defaultThreshold'),
        boxThreshold = document.getElementById('boxThreshold');

    suiteSetup(function(done){
      var w = 500,
        h = 300,
        m = {
          "top": 5,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        d = [{
        "series": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ]}],
        dT = [
          { "for":"mySeries", "type":"max", "value":2 },
          { "for":"", "type":"mean", "value":8 }
        ],
        dTB = [
          { "for":"mySeries", "type":"min", "value":4 },
          { "for":"", "type":"median", "value":6 }
        ];

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('chartData',d);

      baseLine.set('chartData',d[0]);

      defaultThreshold.set('chartData',dT);
      boxThreshold.set('chartData',dTB);

      // need a small delay for stuff to work
      setTimeout(function(){ done() }.bind(this),10);
    });

    test('defaultThreshold fixture is created', function() {
      assert.isTrue(defaultThreshold !== null);
    });
    test('boxThreshold fixture is created', function() {
      assert.isTrue(boxThreshold !== null);
    });
  }); //suite

  suite('px-vis- threshold defaultThreshold 0 works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        defaultThreshold = document.getElementById('defaultThreshold');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;
    var colors = commonColors.properties.colors.value;

    test('defaultThreshold thresholdGroup created', function() {
      assert.equal(defaultThreshold.thresholdGroup.node().tagName,'g');
    });
    test('defaultThreshold thresholdGroup created', function() {
      assert.equal(defaultThreshold.thresholdGroup[0][0].getAttribute('threshold-id'),'mySeries0');
    });

    test('defaultThreshold thresholdLine created', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].tagName,'line');
    });
    test('defaultThreshold thresholdLine stroke width', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].getAttribute('stroke-width'),1);
    });
    test('defaultThreshold thresholdLine stroke dasharray', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].getAttribute('stroke-dasharray'),'5,2');
    });
    test('defaultThreshold thresholdLine x1', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].getAttribute('x1'),0);
    });
    test('defaultThreshold thresholdLine x2', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].getAttribute('x2'),480);
    });
    test('defaultThreshold thresholdLine y1', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].getAttribute('y1'),220);
    });
    test('defaultThreshold thresholdLine y2', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].getAttribute('y2'),220);
    });
    test('defaultThreshold thresholdLine stroke', function() {
      assert.equal(defaultThreshold.thresholdLine[0][0].getAttribute('stroke').split(' ').join(''),colorSet[colorOrder[0]]);
    });

    test('defaultThreshold thresholdRect created', function() {
      assert.equal(defaultThreshold.thresholdRect[0][0].tagName,'rect');
    });
    test('defaultThreshold thresholdRect x', function() {
      assert.equal(defaultThreshold.thresholdRect[0][0].getAttribute('x'),5);
    });
    test('defaultThreshold thresholdRect y', function() {
      assert.equal(defaultThreshold.thresholdRect[0][0].getAttribute('y'),219);
    });
    test('defaultThreshold thresholdRect width', function() {
      assert.equal(defaultThreshold.thresholdRect[0][0].getAttribute('width'),defaultThreshold.thresholdText[0][0].getBBox().width + 5);
    });
    test('defaultThreshold thresholdRect height', function() {
      assert.equal(defaultThreshold.thresholdRect[0][0].getAttribute('height'),18);
    });
    test('defaultThreshold thresholdRect fill', function() {
      assert.equal(defaultThreshold.thresholdRect[0][0].getAttribute('fill'),'none');
    });

    test('defaultThreshold thresholdText created', function() {
      assert.equal(defaultThreshold.thresholdText[0][0].tagName,'text');
    });
    test('defaultThreshold thresholdText font-size', function() {
      assert.equal(defaultThreshold.thresholdText[0][0].getAttribute('font-size'),'12px');
    });
    test('defaultThreshold thresholdText font-style', function() {
      assert.equal(defaultThreshold.thresholdText[0][0].getAttribute('font-style'),'GE Inspira Sans');
    });
    test('defaultThreshold thresholdText x', function() {
      assert.equal(defaultThreshold.thresholdText[0][0].getAttribute('x'),8);
    });
    test('defaultThreshold thresholdText y', function() {
      assert.equal(defaultThreshold.thresholdText[0][0].getAttribute('y'),232);
    });
    test('defaultThreshold thresholdText text', function() {
      assert.equal(defaultThreshold.thresholdText[0][0].textContent,'2.00');
    });
  }); //suite

  suite('px-vis- threshold defaultThreshold 1 works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        defaultThreshold = document.getElementById('defaultThreshold');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;
    var colors = commonColors.properties.colors.value;

    test('defaultThreshold thresholdGroup created', function() {
      assert.equal(defaultThreshold.thresholdGroup[0][1].tagName,'g');
    });

    test('defaultThreshold thresholdGroup created', function() {
      assert.equal(defaultThreshold.thresholdGroup[0][1].getAttribute('threshold-id'),'1');
    });

    test('defaultThreshold thresholdLine created', function() {
      assert.equal(defaultThreshold.thresholdLine[0][1].tagName,'line');
    });
    test('defaultThreshold thresholdLine stroke width', function() {
      assert.equal(defaultThreshold.thresholdLine[0][1].getAttribute('stroke-width'),1);
    });
    test('defaultThreshold thresholdLine stroke dasharray', function() {
      assert.equal(defaultThreshold.thresholdLine[0][1].getAttribute('stroke-dasharray'),'5,2');
    });
    test('defaultThreshold thresholdLine x1', function() {
      assert.equal(defaultThreshold.thresholdLine[0][1].getAttribute('x1'),0);
    });
    test('defaultThreshold thresholdLine x2', function() {
      assert.equal(defaultThreshold.thresholdLine[0][1].getAttribute('x2'),480);
    });
    test('defaultThreshold thresholdLine y1', function() {
      assert.equal(Math.round(defaultThreshold.thresholdLine[0][1].getAttribute('y1')),55);
    });
    test('defaultThreshold thresholdLine y2', function() {
      assert.equal(Math.round(defaultThreshold.thresholdLine[0][1].getAttribute('y2')),55);
    });
    test('defaultThreshold thresholdLine stroke', function() {
      assert.equal(defaultThreshold.thresholdLine[0][1].getAttribute('stroke').split(' ').join(''),colors['grey8']);
    });

    test('defaultThreshold thresholdRect created', function() {
      assert.equal(defaultThreshold.thresholdRect[0][1].tagName,'rect');
    });
    test('defaultThreshold thresholdRect x', function() {
      assert.equal(defaultThreshold.thresholdRect[0][1].getAttribute('x'),5);
    });
    test('defaultThreshold thresholdRect y', function() {
      assert.equal(Math.round(defaultThreshold.thresholdRect[0][1].getAttribute('y')),38);
    });
    test('defaultThreshold thresholdRect width', function() {
      assert.equal(defaultThreshold.thresholdRect[0][1].getAttribute('width'),defaultThreshold.thresholdText[0][1].getBBox().width + 5);
    });
    test('defaultThreshold thresholdRect height', function() {
      assert.equal(defaultThreshold.thresholdRect[0][1].getAttribute('height'),18);
    });
    test('defaultThreshold thresholdRect fill', function() {
      assert.equal(defaultThreshold.thresholdRect[0][1].getAttribute('fill'),'none');
    });

    test('defaultThreshold thresholdText created', function() {
      assert.equal(defaultThreshold.thresholdText[0][1].tagName,'text');
    });
    test('defaultThreshold thresholdText font-size', function() {
      assert.equal(defaultThreshold.thresholdText[0][1].getAttribute('font-size'),'12px');
    });
    test('defaultThreshold thresholdText font-style', function() {
      assert.equal(defaultThreshold.thresholdText[0][1].getAttribute('font-style'),'GE Inspira Sans');
    });
    test('defaultThreshold thresholdText x', function() {
      assert.equal(defaultThreshold.thresholdText[0][1].getAttribute('x'),8);
    });
    test('defaultThreshold thresholdText y', function() {
      assert.equal(Math.round(defaultThreshold.thresholdText[0][1].getAttribute('y')),51);
    });
    test('defaultThreshold thresholdText text', function() {
      assert.equal(defaultThreshold.thresholdText[0][1].textContent,'8.00');
    });
  }); //suite

  suite('px-vis-threshold boxThresholds have color', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        boxThreshold = document.getElementById('boxThreshold');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;
    var colors = commonColors.properties.colors.value;

    test('boxThreshold thresholdLine stroke width', function() {
      assert.equal(boxThreshold.thresholdLine[0][0].getAttribute('stroke-width'),1);
    });
    test('boxThreshold thresholdLine stroke dasharray', function() {
      assert.equal(boxThreshold.thresholdLine[0][0].getAttribute('stroke-dasharray'),'5,2');
    });
    test('boxThreshold thresholdLine stroke', function() {
      assert.equal(boxThreshold.thresholdLine[0][0].getAttribute('stroke').split(' ').join(''),colorSet[colorOrder[0]]);
    });

    test('boxThreshold thresholdRect fill', function() {
      assert.equal(boxThreshold.thresholdRect[0][0].getAttribute('fill').split(' ').join(''),colorSet[colorOrder[0]]);
    });

    test('boxThreshold thresholdText fill', function() {
      assert.equal(boxThreshold.thresholdText[0][0].getAttribute('fill'),'white');
    });

    test('boxThreshold thresholdLine stroke width', function() {
      assert.equal(boxThreshold.thresholdLine[0][1].getAttribute('stroke-width'),1);
    });
    test('boxThreshold thresholdLine stroke dasharray', function() {
      assert.equal(boxThreshold.thresholdLine[0][1].getAttribute('stroke-dasharray'),'5,2');
    });
    test('boxThreshold thresholdLine stroke', function() {
      assert.equal(boxThreshold.thresholdLine[0][1].getAttribute('stroke').split(' ').join(''),colors['grey8']);
    });

    test('boxThreshold thresholdRect fill', function() {
      assert.equal(boxThreshold.thresholdRect[0][1].getAttribute('fill').split(' ').join(''),colors['grey8']);
    });

    test('boxThreshold thresholdText fill', function() {
      assert.equal(boxThreshold.thresholdText[0][1].getAttribute('fill'),'white');
    });
  }); //suite

} //runTests
