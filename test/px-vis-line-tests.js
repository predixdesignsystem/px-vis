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
            [1397102460000, 1],
            [1397131620000, 6],
            [1397160780000, 10],
            [1397189940000, 4],
            [1397219100000, 6]
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
      assert.equal(baseLine.linePath.attr('d'),'M0,243L120,108L240,0L360,162L480,108');
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
            [1397102460000, 1],
            [1397131620000, 6],
            [1397160780000, 10],
            [1397189940000, 4],
            [1397219100000, 6]
          ]},{
          "series": [
            [1397102460000, 1],
            [1397131620000, 21],
            [1397160780000, 3],
            [1397189940000, 10],
            [1397219100000, 27]
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
      assert.equal(mutedLine1.linePath.attr('d'),'M0,260L120,210L240,170L360,230L480,210');
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
      assert.equal(mutedLine2.linePath.attr('d'),'M0,260L120,60L240,240L360,170L480,0');
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
