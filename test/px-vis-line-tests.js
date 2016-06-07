document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-sclae does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-line works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseLine = document.getElementById('baseLine');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(){
      var d = [{
            "series": [
            [1397102460000, 0.99],
            [1397139660000, 0.92],
            [1397177400000, 0.97],
            [1397228040000, 1.12],
            [1397248260000, 1.09],
            [1397291280000, 1],
            [1397351280000, 1.5]
          ]}],
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
      baseScale.set('chartData',d);

      baseLine.set('chartData',d[0]);

    });

    test('baseLine fixture is created', function() {
      assert.isTrue(baseLine !== null);
    });

    test('baseLine linePath created', function() {
      assert.equal(baseLine.linePath.node().tagName,'path');
    });

    test('baseLine line series ID is random', function() {
      assert.equal(baseLine.linePath.attr('series-id').length,15);
      assert.equal(baseLine.linePath.attr('series-id').split('_')[0],'line');
    });

    test('baseLine line series number is 0', function() {
      assert.equal(baseLine.linePath.attr('series-number'),0);
    });

    test('baseLine line series has the right color', function() {
      assert.equal(baseLine.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('baseLine line d', function() {
      assert.equal(baseLine.linePath.attr('d'),"M0,91.8L71.7627200385821,104.39999999999998L144.56715698095007,95.40000000000002L242.25705329153604,68.39999999999999L281.2635640221847,73.8L364.2536773571256,90.00000000000001L480,0");
    });
  }); //suite

  suite('px-vis-line with two series works', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var d = [{
          "series": [
            [1397102460000, 0.99],
            [1397139660000, 0.92],
            [1397177400000, 0.97],
            [1397228040000, 1.12],
            [1397248260000, 1.09],
            [1397291280000, 1],
            [1397351280000, 1.5]
          ]},{
          "series": [
            [1397102460000, 2],
            [1397139660000, 3],
            [1397177400000, 1],
            [1397228040000, 2],
            [1397248260000, 2],
            [1397291280000, 1],
            [1397351280000, 1]
          ]}],
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
      mutedScale.set('chartData',d);

      mutedLine1.set('seriesId','mySeries');
      mutedLine1.set('seriesNumber',1);
      mutedLine1.set('chartData',d[0]);

      mutedLine2.set('seriesId','mySeries2');
      mutedLine2.set('seriesNumber',2);
      mutedLine2.set('chartData',d[1]);
      // setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedLine1 fixture is created', function() {
      assert.isTrue(mutedLine1 !== null);
    });
    test('mutedLine2 fixture is created', function() {
      assert.isTrue(mutedLine2 !== null);
    });

    test('mutedLine1 linePath created', function() {
      assert.equal(mutedLine1.linePath.node().tagName,'path');
    });
    test('mutedLine1 line series ID is set', function() {
      assert.equal(mutedLine1.linePath.attr('series-id'),'mySeries');
    });
    test('mutedLine1 line series number is 1', function() {
      assert.equal(mutedLine1.linePath.attr('series-number'),1);
    });
    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine1.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine1 line series has the right color', function() {
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });
    test('mutedLine1 line d', function() {
      assert.equal(mutedLine1.linePath.attr('d'),"M0,180.89999999999998L71.7627200385821,187.20000000000002L144.56715698095007,182.70000000000002L242.25705329153604,169.20000000000002L281.2635640221847,171.9L364.2536773571256,180.00000000000003L480,135");
    });

    test('mutedLine2 linePath created', function() {
      assert.equal(mutedLine2.linePath.node().tagName,'path');
    });
    test('mutedLine2 line series ID is set', function() {
      assert.equal(mutedLine2.linePath.attr('series-id'),'mySeries2');
    });
    test('mutedLine2 line series number is 2', function() {
      assert.equal(mutedLine2.linePath.attr('series-number'),2);
    });
    test('mutedLine1 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[2] ]);
    });
    test('mutedLine2 line d', function() {
      assert.equal(mutedLine2.linePath.attr('d'),"M0,90.00000000000001L71.7627200385821,0L144.56715698095007,180.00000000000003L242.25705329153604,90.00000000000001L281.2635640221847,90.00000000000001L364.2536773571256,180.00000000000003L480,180.00000000000003");
    });
  }); //suite

  suite('px-vis-line mutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var m = {
        "mySeries1":false,
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
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),0.3);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[2] ]);
    });

  }); //suite

  suite('px-vis-line unmutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedLine1 = document.getElementById('mutedLine1'),
        mutedLine2 = document.getElementById('mutedLine2');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var m = {
        "mySeries1":false,
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
      assert.equal(mutedLine1.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

    test('mutedLine2 line series has the right stroke opacity', function() {
      assert.equal(mutedLine2.linePath.attr('stroke-opacity'),1);
    });
    test('mutedLine2 line series has the right color', function() {
      assert.equal(mutedLine2.linePath.attr('stroke').split(' ').join(''),colorSet[ colorOrder[2] ]);
    });

  }); //suite

} //runTests
