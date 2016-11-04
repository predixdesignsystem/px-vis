document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-axis-brush does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-axis-brush basic setup works', function() {
    var multiScale = document.getElementById('multiScale'),
        multiSVG = document.getElementById('multiSVG'),
        multiBrush = document.getElementById('multiBrush');

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y':{'y':[1,10], 'y1':[1,20], 'y2':[1,27]}},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

        multiSVG.set('width',w);
        multiSVG.set('height',h);
        multiSVG.set('margin',m);

        multiScale.set('width',w);
        multiScale.set('height',h);
        multiScale.set('margin',m);
        multiScale.set('axes',dim);
        multiScale.set('completeSeriesConfig',completeSeriesConfig);
        multiScale.set('chartExtents',ext);
        multiScale.set('chartData',d);

        var g = multiSVG.svg.selectAll('g.dimension')
            .data(dim);
        g.enter()
          .append("g")
          .attr("class", "dimension")
          .attr("dimension", function(d) { return d })
          .attr("transform", function(d,i) {
            return "translate(" + (50 * i) + ",0)";
          });

        multiBrush.set('margin',m);
        multiBrush.set('height',h);
        multiBrush.set('seriesKey',"x");
        multiBrush.set('dimensions',dim);
        multiBrush.set('chartData',d);
        multiBrush.set('svg',multiSVG.svg.selectAll('g.dimension'));

      setTimeout(function(){done()},500);
      // done();
    });

    test('multiBrush fixture is created', function() {
      assert.isTrue(multiBrush !== null);
    });

    test('multiBrush._brushes are created', function() {
      assert.equal(multiBrush._brushes.nodes().length, 3);
    });
    test('multiBrush._brushes is not selected', function() {
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[0]),null);
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[1]),null);
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[2]),null);
    });

    test('multiBrush mutedSeries is correct', function() {
      assert.deepEqual(multiBrush.mutedSeries,{});
    });
  });

  suite('px-vis-axis-brush brush resizes to the inputed domain', function() {
    var multiBrush = document.getElementById('multiBrush');
    var colors = commonColors.properties.colors.value;
    var d;
    suiteSetup(function(done) {
      d = [~~multiBrush.axis['y1'](16),~~multiBrush.axis['y1'](9)];
      Px.d3.select(multiBrush._brushes.nodes()[1]).call(multiBrush._brush.move,d);
       setTimeout(function(){done()},100);
      //done();
    });

    test('multiBrush._brush extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[1]),[101,277]);
    });
    test('multiBrush._brushGroup.rect attr x', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('x'), -10);
    });
    test('multiBrush._brushGroup.rect attr width', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('width'), 20);
    });
    test('multiBrush._brushGroup.rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('y'), 101);
    });
    test('multiBrush._brushGroup.rect attr height', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('height'), 176);
    });
    test('multiBrush._brushGroup.rect correct fill', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('fill'), 'rgb(0,0,0)');
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('fill-opacity'), '0.15');
    });
    test('multiBrush._brushGroup.rect correct stroke', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('stroke'), colors["primary-blue"]);
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('stroke-dasharray'), null);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397160780000": true,
        "1397219100000": true
      };
      assert.deepEqual(multiBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush min size', function() {
    var multiBrush = document.getElementById('multiBrush');
    var d1, d2;

    suiteSetup(function(done) {
      d1 = [~~multiBrush.axis['y'](1.01),~~multiBrush.axis['y'](1)];
      d2 = [~~multiBrush.axis['y2'](27),~~multiBrush.axis['y2'](26.9)];
      Px.d3.select(multiBrush._brushes.nodes()[0]).call(multiBrush._brush.move,d1);
      Px.d3.select(multiBrush._brushes.nodes()[2]).call(multiBrush._brush.move,d2);
       setTimeout(function(){done()},100);
      //done();
    });
    test('multiBrush._brush y extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[0]),[475,480]);
    });
    test('multiBrush._brush y rect attr x', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('x'), -10);
    });
    test('multiBrush._brush y rect attr width', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('width'), 20);
    });
    test('multiBrush._brush y rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('y'), 475);
    });
    test('multiBrush._brush y rect attr height', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('height'), 5);
    });

    test('multiBrush._brush y2 extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[2]),[0,5]);
    });
    test('multiBrush._brush y2 rect attr x', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('x'), -10);
    });
    test('multiBrush._brush y2 rect attr width', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('width'), 20);
    });
    test('multiBrush._brush y2 rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('y'), 0);
    });
    test('multiBrush._brush y2 rect attr height', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('height'), 5);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397131620000": true,
        "1397160780000": true,
        "1397189940000": true,
        "1397219100000": true
      };

      assert.deepEqual(multiBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush resize', function() {
    var multiBrush = document.getElementById('multiBrush');
    var d1, d2;

    suiteSetup(function(done) {
      d1 = [~~multiBrush.axis['y'](5),~~multiBrush.axis['y'](1)];
      d2 = [~~multiBrush.axis['y2'](27),~~multiBrush.axis['y2'](15)];

      Px.d3.select(multiBrush._brushes.nodes()[0]).call(multiBrush._brush.move,d1);
      Px.d3.select(multiBrush._brushes.nodes()[2]).call(multiBrush._brush.move,d2);

      setTimeout(function(){done()},100);
      //done();
    });
    test('multiBrush._brush y extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[0]),[266,480]);
    });
    test('multiBrush._brush y rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('y'), 266);
    });
    test('multiBrush._brush y rect attr height', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('height'), 214);
    });

    test('multiBrush._brush y2 extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[2]),[0,221]);
    });
    test('multiBrush._brush y2 rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('y'), 0);
    });
    test('multiBrush._brush y2 rect attr height', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('height'), 221);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397131620000": true,
        "1397160780000": true,
        "1397189940000": true,
        "1397219100000": true
      };

      assert.deepEqual(multiBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush domain change', function() {
    var multiScale = document.getElementById('multiScale');
    var multiBrush = document.getElementById('multiBrush');
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':{'y':[3,10], 'y1':[6,18], 'y2':[1,18]}};

    suiteSetup(function(done) {
      multiScale.set('chartExtents',ext);

      setTimeout(function(){done()},100);

    });

    test('multiBrush._brush y extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[0]),[342,480]);
    });
    test('multiBrush._brush y rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('y'), 342);
    });
    test('multiBrush._brush y rect attr height', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[0]).select('rect.selection').attr('height'), 138);
    });

    test('multiBrush._brush y1 extents match', function() {
      assert.closeTo(Px.d3.brushSelection(multiBrush._brushes.nodes()[1])[0],80, 1);
      assert.closeTo(Px.d3.brushSelection(multiBrush._brushes.nodes()[1])[1],359,1);
    });
    test('multiBrush._brush y rect attr y1', function() {
      assert.closeTo(Number(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('y')), 80, 1);
    });
    test('multiBrush._brush y1 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('height')), 279,1 );
    });

    test('multiBrush._brush y2 extents match', function() {
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[2])[0],0);
      assert.closeTo(Px.d3.brushSelection(multiBrush._brushes.nodes()[2])[1],84,1);
    });
    test('multiBrush._brush y2 rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('y'), 0);
    });
    test('multiBrush._brush y2 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('height')), 84, 1);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397131620000": true,
        "1397160780000": true,
        "1397189940000": true,
        "1397219100000": true
      };

      assert.deepEqual(multiBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush domain change so brush falls outside', function() {
    var multiScale = document.getElementById('multiScale');
    var multiBrush = document.getElementById('multiBrush');
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':{'y':[6,10], 'y1':[6,18], 'y2':[1,18]}};

    suiteSetup(function(done) {
      multiScale.set('chartExtents',ext);

      setTimeout(function(){done()},100);

    });

    test('multiBrush._brush y extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[0]),null);
    });

    test('multiBrush._brush y1 extents match', function() {
      assert.closeTo(Px.d3.brushSelection(multiBrush._brushes.nodes()[1])[0],80, 1);
      assert.closeTo(Px.d3.brushSelection(multiBrush._brushes.nodes()[1])[1],359,1);
    });
    test('multiBrush._brush y rect attr y1', function() {
      assert.closeTo(Number(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('y')), 80, 1);
    });
    test('multiBrush._brush y1 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(multiBrush._brushes.nodes()[1]).select('rect.selection').attr('height')), 279,1 );
    });

    test('multiBrush._brush y2 extents match', function() {
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[2])[0],0);
      assert.closeTo(Px.d3.brushSelection(multiBrush._brushes.nodes()[2])[1],84,1);
    });
    test('multiBrush._brush y2 rect attr y', function() {
      assert.equal(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('y'), 0);
    });
    test('multiBrush._brush y2 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(multiBrush._brushes.nodes()[2]).select('rect.selection').attr('height')), 84, 1);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397131620000": true,
        "1397160780000": true,
        "1397189940000": true,
        "1397219100000": true
      };

      assert.deepEqual(multiBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush delete all', function() {
    var multiBrush = document.getElementById('multiBrush');

    suiteSetup(function(done) {
      multiBrush.deleteAllBrushes();

      setTimeout(function(){done()},100);
    });

    test('multiBrush._brush y brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[0]),null);
    });

    test('multiBrush._brush y1 brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[1]),null);
    });

    test('multiBrush._brush y2 brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[2]),null);
    });

    test('multiBrush mutedSeries is correct', function() {
      assert.deepEqual(multiBrush.mutedSeries, {});
    });
  });


  suite('px-vis-axis-brush radial setup works', function() {
    var radialScale = document.getElementById('radialScale'),
        radialSVG = document.getElementById('radialSVG'),
        radialBrush = document.getElementById('radialBrush');

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 300,
        h = 300,
        ext = { 'x': dim, 'y':[1,27] },
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

        radialSVG.set('width',w);
        radialSVG.set('height',h);
        radialSVG.set('margin',m);
        radialSVG.set('offset',[140,140]);

        radialScale.set('width',w/2);
        radialScale.set('height',h/2);
        radialScale.set('centerOffset',20);
        radialScale.set('margin',m);
        radialScale.set('amplitudeKeys',dim);
        radialScale.set('completeSeriesConfig',completeSeriesConfig);
        radialScale.set('chartExtents',ext);
        radialScale.set('chartData',d);

        var g = radialSVG.svg.selectAll('g.dimension')
            .data(dim);
        g.enter()
          .append("g")
          .attr("class", "dimension")
          .attr("dimension", function(d) { return d })
          .attr("transform", function(d) {
            return "rotate(" + (radialScale.x(d) * 180 / Math.PI + 180) + ")";
          });

        radialBrush.set('margin',m);
        radialBrush.set('height',h/2);
        radialBrush.set('centerOffset',20);
        radialBrush.set('seriesKey',"x");
        radialBrush.set('dimensions',dim);
        radialBrush.set('chartData',d);
        radialBrush.set('svg',radialSVG.svg.selectAll('g.dimension'));

      setTimeout(function(){done()},500);
      // done();
    });

    test('radialBrush fixture is created', function() {
      assert.isTrue(radialBrush !== null);
    });

    test('radialBrush._brushes are created', function() {
      assert.equal(radialBrush._brushes.nodes().length, 3);
    });
    test('radialBrush._brushes is not selected', function() {
      assert.equal(Px.d3.brushSelection(radialBrush._brushes.nodes()[0]),null);
      assert.equal(Px.d3.brushSelection(radialBrush._brushes.nodes()[1]),null);
      assert.equal(Px.d3.brushSelection(radialBrush._brushes.nodes()[2]),null);
    });

    test('radialBrush mutedSeries is correct', function() {
      assert.deepEqual(radialBrush.mutedSeries,{});
    });
  });

  suite('px-vis-axis-brush brush resizes to the inputed domain', function() {
    var radialBrush = document.getElementById('radialBrush');
    var colors = commonColors.properties.colors.value;
    var d;
    suiteSetup(function(done) {
      d = [radialBrush.axis(9),radialBrush.axis(16)];
      Px.d3.select(radialBrush._brushes.nodes()[1]).call(radialBrush._brush.move,d);
       setTimeout(function(){done()},100);
      //done();
    });

    test('radialBrush._brush extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush._brushes.nodes()[1]),[60,95]);
    });
    test('radialBrush._brushGroup.rect attr x', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('x'), -10);
    });
    test('radialBrush._brushGroup.rect attr width', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('width'), 20);
    });
    test('radialBrush._brushGroup.rect attr y', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('y'), 60);
    });
    test('radialBrush._brushGroup.rect attr height', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('height'), 35);
    });
    test('radialBrush._brushGroup.rect correct fill', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('fill'), 'rgb(0,0,0)');
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('fill-opacity'), '0.15');
    });
    test('radialBrush._brushGroup.rect correct stroke', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('stroke'), colors["primary-blue"]);
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('stroke-dasharray'), "5, 5");
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms = {
        "1397131620000": true,
        "1397189940000": true
      };
      assert.deepEqual(radialBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush resize', function() {
    var radialBrush = document.getElementById('radialBrush');
    var d1, d2;

    suiteSetup(function(done) {
      d1 = [radialBrush.axis(1),radialBrush.axis(5)];
      d2 = [radialBrush.axis(15),radialBrush.axis(27)];

      Px.d3.select(radialBrush._brushes.nodes()[0]).call(radialBrush._brush.move,d1);
      Px.d3.select(radialBrush._brushes.nodes()[2]).call(radialBrush._brush.move,d2);

      setTimeout(function(){done()},100);
      //done();
    });
    test('radialBrush._brush y extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush._brushes.nodes()[0]),[20,40]);
    });
    test('radialBrush._brush y rect attr y', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[0]).select('rect.selection').attr('y'), 20);
    });
    test('radialBrush._brush y rect attr height', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[0]).select('rect.selection').attr('height'), 20);
    });

    test('radialBrush._brush y2 extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush._brushes.nodes()[2]),[90,150]);
    });
    test('radialBrush._brush y2 rect attr y', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[2]).select('rect.selection').attr('y'), 90);
    });
    test('radialBrush._brush y2 rect attr height', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[2]).select('rect.selection').attr('height'), 60);
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397131620000": true,
        "1397189940000": true,
        "1397219100000": true
      };

      assert.deepEqual(radialBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush domain change', function() {
    var radialScale = document.getElementById('radialScale');
    var radialBrush = document.getElementById('radialBrush');
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[3,18]};

    suiteSetup(function(done) {
      radialScale.set('chartExtents',ext);

      setTimeout(function(){done()},100);
    });

    test('radialBrush._brush y extents match', function() {
      assert.equal(Px.d3.brushSelection(radialBrush._brushes.nodes()[0])[0],20);
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[0])[1],37, 1);
    });
    test('radialBrush._brush y rect attr y', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[0]).select('rect.selection').attr('y'), 20);
    });
    test('radialBrush._brush y rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[0]).select('rect.selection').attr('height')), 17, 1);
    });

    test('radialBrush._brush y1 extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[1])[0],72, 1);
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[1])[1],133,1);
    });
    test('radialBrush._brush y rect attr y1', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('y')), 72, 1);
    });
    test('radialBrush._brush y1 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('height')), 61,1 );
    });

    test('radialBrush._brush y2 extents match', function() {
      assert.equal(Px.d3.brushSelection(radialBrush._brushes.nodes()[2])[0],124);
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[2])[1],150,1);
    });
    test('radialBrush._brush y2 rect attr y', function() {
      assert.equal(Px.d3.select(radialBrush._brushes.nodes()[2]).select('rect.selection').attr('y'), 124);
    });
    test('radialBrush._brush y2 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[2]).select('rect.selection').attr('height')), 26, 1);
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms = {
        "1397189940000": true,
        "1397131620000": true
      };
      assert.deepEqual(radialBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush domain change so brush falls outside', function() {
    var radialScale = document.getElementById('radialScale');
    var radialBrush = document.getElementById('radialBrush');
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[7,18]};

    suiteSetup(function(done) {
      radialScale.set('chartExtents',ext);

      setTimeout(function(){done()},100);

    });

    test('radialBrush._brush y extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush._brushes.nodes()[0]),null);
    });

    test('radialBrush._brush y1 extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[1])[0],44, 1);
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[1])[1],126,1);
    });
    test('radialBrush._brush y rect attr y1', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('y')), 44, 1);
    });
    test('radialBrush._brush y1 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[1]).select('rect.selection').attr('height')), 83,1 );
    });

    test('radialBrush._brush y2 extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[2])[0],115, 1);
      assert.closeTo(Px.d3.brushSelection(radialBrush._brushes.nodes()[2])[1],150,1);
    });
    test('radialBrush._brush y2 rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[2]).select('rect.selection').attr('y')), 115, 1);
    });
    test('radialBrush._brush y2 rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(radialBrush._brushes.nodes()[2]).select('rect.selection').attr('height')), 35, 1);
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms = {
        "1397131620000": true,
        "1397189940000": true
      };

      assert.deepEqual(radialBrush.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush delete all', function() {
    var radialBrush = document.getElementById('radialBrush');

    suiteSetup(function(done) {
      radialBrush.deleteAllBrushes();

      setTimeout(function(){done()},100);
    });

    test('radialBrush._brush y brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush._brushes.nodes()[0]),null);
    });

    test('radialBrush._brush y1 brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush._brushes.nodes()[1]),null);
    });

    test('radialBrush._brush y2 brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush._brushes.nodes()[2]),null);
    });

    test('radialBrush mutedSeries is correct', function() {
      assert.deepEqual(radialBrush.mutedSeries, {});
    });
  });

} //runTests
