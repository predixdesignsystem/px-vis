document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-scatter does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-scatter works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseScatter = document.getElementById('baseScatter');

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
          seriesConfig = {"0":{"type":"scatter","name":"mySeries"}},
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
      baseScale.set('seriesConfig',seriesConfig);
      baseScale.set('chartData',d);

      baseScatter.set('chartData',d);

    });

    test('baseScatter fixture is created', function() {
      assert.isTrue(baseScatter !== null);
    });

    test('baseScatter scatterGroup created', function() {
      assert.equal(baseScatter.scatterGroup.node().tagName,'g');
    });
    test('baseScatter scatterDots created', function() {
      assert.equal(baseScatter.scatterDots.node().tagName,'circle');
    });

    test('baseScatter scatter series ID is random', function() {
      assert.equal(baseScatter.scatterGroup.attr('series-id'),'scatter_0');
    });

    test('baseScatter scatter series has the right color', function() {
      assert.equal(baseScatter.scatterGroup.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('baseScatter scatterDots markerSize is default', function() {
      assert.equal(baseScatter.scatterDots.attr('r'),4);
    });

    test('baseScatter scatterDot0 cx', function() {
      assert.equal(baseScatter.scatterDots[0][0].getAttribute('cx'),"0");
    });
    test('baseScatter scatterDot0 cy', function() {
      assert.equal(baseScatter.scatterDots[0][0].getAttribute('cy'),"243");
    });

    test('baseScatter scatterDot0 cx', function() {
      assert.equal(baseScatter.scatterDots[0][4].getAttribute('cx'),"480");
    });
    test('baseScatter scatterDot0 cy', function() {
      assert.equal(baseScatter.scatterDots[0][4].getAttribute('cy'),"108");
    });
  }); //suite

  suite('px-vis-scatter with two series works', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedScatter1 = document.getElementById('mutedScatter1'),
        mutedScatter2 = document.getElementById('mutedScatter2');

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
          seriesConfig = {"0":{"type":"scatter","name":"mySeries1"},"1":{"type":"scatter","name":"mySeries2"}},
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
      mutedScale.set('seriesConfig',seriesConfig);
      mutedScale.set('chartData',d);

      mutedScatter1.set('markerSize','4');
      mutedScatter1.set('chartData',d);

      mutedScatter2.set('markerSize','10');
      mutedScatter2.set('chartData',d);
      // setTimeout(function(){ done() }.bind(this),5000);
      done();
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
      assert.equal(mutedScatter1.scatterDots.node().tagName,'circle');
    });
    test('mutedScatter1 scatter series ID is set', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('series-id'),'scatter_0');
    });
    test('mutedScatter1 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter1 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter1 scatter series has the right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });
    test('mutedScatter1 scatterDots markerSize is default', function() {
      assert.equal(mutedScatter1.scatterDots.attr('r'),2);
    });
    test('mutedScatter1 scatterDot0 cx', function() {
      assert.equal(mutedScatter1.scatterDots[0][0].getAttribute('cx'),0);
    });
    test('mutedScatter1 scatterDot0 cy', function() {
      assert.equal(mutedScatter1.scatterDots[0][0].getAttribute('cy'),260);
    });
    test('mutedScatter1 scatterDot1 cx', function() {
      assert.equal(mutedScatter1.scatterDots[0][4].getAttribute('cx'),480);
    });
    test('mutedScatter1 scatterDot1 cy', function() {
      assert.equal(mutedScatter1.scatterDots[0][4].getAttribute('cy'),210);
    });

    test('mutedScatter2 scatterDots created', function() {
      assert.equal(mutedScatter2.scatterGroup.node().tagName,'g');
    });
    test('mutedScatter2 scatterDots created', function() {
      assert.equal(mutedScatter2.scatterDots.node().tagName,'circle');
    });
    test('mutedScatter2 scatter series ID is set', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('series-id'),'scatter_1');
    });
    test('mutedScatter2 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter2 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter2 scatter series has the right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });
    test('mutedScatter2 scatterDots markerSize is default', function() {
      assert.equal(mutedScatter2.scatterDots.attr('r'),5);
    });
    test('mutedScatter2 scatterDot0 cx', function() {
      assert.equal(mutedScatter2.scatterDots[0][0].getAttribute('cx'),0);
    });
    test('mutedScatter2 scatterDot0 cy', function() {
      assert.equal(mutedScatter2.scatterDots[0][0].getAttribute('cy'),260);
    });

    test('mutedScatter2 scatterDot1 cx', function() {
      assert.equal(mutedScatter2.scatterDots[0][4].getAttribute('cx'),480);
    });
    test('mutedScatter2 scatterDot1 cy', function() {
      assert.equal(mutedScatter2.scatterDots[0][4].getAttribute('cy'),0);
    });
  }); //suite

  suite('px-vis-scatter mutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedScatter1 = document.getElementById('mutedScatter1'),
        mutedScatter2 = document.getElementById('mutedScatter2');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var m = {
        "0":false,
        "1":true
      };
      mutedScatter1.set('mutedSeries',m);
      mutedScatter2.set('mutedSeries',m);
      // setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedScatter1 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter1 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter1 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });
    test('mutedScatter1 scatter series has the fill right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('mutedScatter2 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter2 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill-opacity'),0.3);
    });
    test('mutedScatter2 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });
    test('mutedScatter2 scatter series has the fill right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });
  }); //suite

  suite('px-vis-scatter unmutes', function() {
    var mutedScale = document.getElementById('mutedScale'),
        mutedSVG = document.getElementById('mutedSVG'),
        mutedScatter1 = document.getElementById('mutedScatter1'),
        mutedScatter2 = document.getElementById('mutedScatter2');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var m = {
        "0":false,
        "1":false
      };
      mutedScatter1.set('mutedSeries',m);
      mutedScatter2.set('mutedSeries',m);
      // setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('mutedScatter1 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter1 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter1 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('stroke').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });
    test('mutedScatter1 scatter series has the fill right color', function() {
      assert.equal(mutedScatter1.scatterGroup.attr('fill').split(' ').join(''),colorSet[ colorOrder[0] ]);
    });

    test('mutedScatter2 scatter series has the right stroke opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke-opacity'),1);
    });
    test('mutedScatter2 scatter series has the right fill opacity', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill-opacity'),0.6);
    });
    test('mutedScatter2 scatter series has the stroke right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('stroke').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });
    test('mutedScatter2 scatter series has the fill right color', function() {
      assert.equal(mutedScatter2.scatterGroup.attr('fill').split(' ').join(''),colorSet[ colorOrder[1] ]);
    });

  }); //suite

} //runTests
