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
        brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');

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
          .attr("class", function(d,i) { return "dimension" + i})
          .attr("dimension", function(d) { return d })
          .attr("transform", function(d,i) {
            return "translate(" + (50 * i) + ",0)";
          });

        brush1.set('margin',m);
        brush1.set('height',h);
        brush1.set('seriesKey',"x");
        brush1.set('dimension',dim[0]);
        brush1.set('chartData',d);

        brush2.set('margin',m);
        brush2.set('height',h);
        brush2.set('seriesKey',"x");
        brush2.set('dimension',dim[1]);
        brush2.set('chartData',d);

        brush3.set('margin',m);
        brush3.set('height',h);
        brush3.set('seriesKey',"x");
        brush3.set('dimension',dim[2]);
        brush3.set('chartData',d);

        brush1.set('axis', multiScale.y['y']);
        brush2.set('axis', multiScale.y['y1']);
        brush3.set('axis', multiScale.y['y2']);

        brush1.set('svg', multiSVG.svg.select('g.dimension0'));
        brush2.set('svg', multiSVG.svg.select('g.dimension1'));
        brush3.set('svg', multiSVG.svg.select('g.dimension2'));

      setTimeout(function(){done()}, 1000);
      // done();
    });

    test('brush fixture is created', function() {
      assert.isTrue(brush1 !== null);
      assert.isTrue(brush2 !== null);
      assert.isTrue(brush3 !== null);
    });

    test('brush._brushD3 are created', function() {

      assert.equal(brush1._brushD3.nodes().length, 1);
      assert.equal(brush2._brushD3.nodes().length, 1);
      assert.equal(brush3._brushD3.nodes().length, 1);
    });
    test('brush._brushD3 is not selected', function() {
      assert.equal(Px.d3.brushSelection(brush1._brushElem), null);
      assert.equal(Px.d3.brushSelection(brush2._brushElem), null);
      assert.equal(Px.d3.brushSelection(brush3._brushElem), null);
    });

    test('brush mutedSeries is correct', function() {
      assert.deepEqual(brush1.mutedSeries, {});
      assert.deepEqual(brush2.mutedSeries, {});
      assert.deepEqual(brush3.mutedSeries, {});
    });
  });

  suite('px-vis-axis-brush brush resizes to the inputed domain', function() {
    var brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');
    var colors = baseColors.properties.colors.value;
    var d;

    suiteSetup(function(done) {
      d = [brush2.axis(16),brush2.axis(9)];
      brush2._brushD3.call(brush2._brush.move,d);

      setTimeout(function(){ done() }, 300);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0], 101, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1], 277, 2);
    });
    test('brush2._brushGroup.rect attr x', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('x'), -10);
    });
    test('brush2._brushGroup.rect attr width', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('width'), 20);
    });
    test('brush2._brushGroup.rect attr y', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('y')), 101, 2);
    });
    test('brush2._brushGroup.rect attr height', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('height')), 176, 2);
    });
    test('brush2._brushGroup.rect correct fill', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('fill').split(' ').join(''), colors["grey5"]);
      assert.equal(brush2._brushD3.select('rect.selection').attr('fill-opacity'), '0.3');
    });
    test('brush2._brushGroup.rect correct stroke', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('stroke').split(' ').join(''), colors["primary-blue"]);
      assert.equal(brush2._brushD3.select('rect.selection').attr('stroke-dasharray'), null);
    });

    test('brush2 mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397160780000": true,
        "1397219100000": true
      };
      assert.deepEqual(brush2.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush min size', function() {
    var brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');
    var d1, d2;

    suiteSetup(function(done) {
      d1 = [brush1.axis(1.01),brush1.axis(1)];
      d2 = [brush3.axis(27),brush3.axis(26.9)];

      brush1._brushD3.call(brush1._brush.move, d1);
      brush3._brushD3.call(brush3._brush.move, d2);

      setTimeout(function(){done()}, 100);

    });
    test('brush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[0], 475, 2);
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[1], 480, 2);
    });
    test('brush1._brush rect attr x', function() {
      assert.equal(Px.d3.select(brush1._brushElem).select('rect.selection').attr('x'), -10);
    });
    test('brush1._brush rect attr width', function() {
      assert.equal(Px.d3.select(brush1._brushElem).select('rect.selection').attr('width'), 20);
    });
    test('brush1._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('y')), 475, 2);
    });
    test('brush1._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('height')), 5,2 );
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 5, 2);
    });
    test('brush3._brush rect attr x', function() {
      assert.equal(Px.d3.select(brush3._brushElem).select('rect.selection').attr('x'), -10);
    });
    test('brush3._brush rect attr width', function() {
      assert.equal(Px.d3.select(brush3._brushElem).select('rect.selection').attr('width'), 20);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('height')), 5, 2);
    });

    test('brush mutedSeries is correct', function() {
      var ms = {
        "1397102460000": true,
        "1397131620000": true,
        "1397160780000": true,
        "1397189940000": true,
        "1397219100000": true
      };

      assert.deepEqual(brush1.mutedSeries, ms);
      assert.deepEqual(brush3.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush resize', function() {
    var brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');
    var d1, d2;

    suiteSetup(function(done) {
      d1 = [brush1.axis(5),brush1.axis(1)];
      d2 = [brush3.axis(27),brush3.axis(15)];

      brush1._brushD3.call(brush1._brush.move, d1);
      brush3._brushD3.call(brush3._brush.move, d2);

      setTimeout(function(){done()}, 500);
    });
    test('brush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[0],266, 2);
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[1], 480, 2);
    });
    test('brush1._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('y')), 266, 2);
    });
    test('brush1._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('height')), 214, 2);
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 221, 2);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('height')), 221, 2);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms1 = {
            "1397102460000": true,
            "1397131620000": true,
            "1397160780000": true,
            "1397219100000": true
          },
          ms3 = {
            "1397102460000": true,
            "1397160780000": true,
            "1397189940000": true,
            "1397219100000": true
         };

      assert.deepEqual(brush1.mutedSeries, ms1);
      assert.deepEqual(brush3.mutedSeries, ms3);
    });
  });

  suite('px-vis-axis-brush domain change', function() {
    var multiScale = document.getElementById('multiScale');
    var brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');

    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':{'y':[3,10], 'y1':[6,18], 'y2':[1,18]}};

    suiteSetup(function(done) {
      multiScale.set('chartExtents', ext);

      setTimeout(function() { done() }, 100);

    });

    test('brush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[0], 342, 2);
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[1], 480, 2);
    });
    test('brush1._brush rect attr y', function() {
      assert.closeTo(Number(brush1._brushD3.select('rect.selection').attr('y')), 342 ,2);
    });
    test('brush1._brush rect attr height', function() {
      assert.closeTo(Number(brush1._brushD3.select('rect.selection').attr('height')), 138, 2);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0], 80, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1], 359, 2);
    });
    test('brush2._brush rect attr y1', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('y')), 80, 2);
    });
    test('brush2._brush rect attr height', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('height')), 279, 2);
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 84, 2);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('height')), 84, 2);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms1 = {
            "1397102460000": true,
            "1397131620000": true,
            "1397160780000": true,
            "1397219100000": true
          },
          ms2 = {
            "1397102460000": true,
            "1397160780000": true,
            "1397219100000": true
          },
          ms3 = {
            "1397102460000": true,
            "1397131620000": true,
            "1397160780000": true,
            "1397189940000": true,
            "1397219100000": true
          };

      assert.deepEqual(brush1.mutedSeries, ms1);
      assert.deepEqual(brush2.mutedSeries, ms2);
      assert.deepEqual(brush3.mutedSeries, ms3);
    });
  });

  suite('px-vis-axis-brush domain change so brush falls outside', function() {
    var multiScale = document.getElementById('multiScale');
    var brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':{'y':[6,10], 'y1':[6,18], 'y2':[1,18]}};

    suiteSetup(function(done) {
      multiScale.set('chartExtents',ext);

      setTimeout(function(){ done() }, 100);

    });

    test('brush1._brush extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(brush1._brushElem), null);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0],80, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1],359, 2);
    });
    test('brush2._brush rect attr y1', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('y')), 80, 2);
    });
    test('brush2._brush rect attr height', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('height')), 279, 2);
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 84, 2);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('height')), 84, 2);
    });

    test('multiBrush mutedSeries is correct', function() {
      var ms1 = {},
          ms2 = {
            "1397102460000": true,
            "1397160780000": true,
            "1397219100000": true
          },
          ms3 = {
            "1397102460000": true,
            "1397131620000": true,
            "1397160780000": true,
            "1397189940000": true,
            "1397219100000": true
          };

      assert.deepEqual(brush1.mutedSeries, ms1);
      assert.deepEqual(brush2.mutedSeries, ms2);
      assert.deepEqual(brush3.mutedSeries, ms3);
    });
  });

  suite('px-vis-axis-brush delete works', function() {
    var brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');

    suiteSetup(function(done) {
      brush1.deleteBrush();
      brush2.deleteBrush();
      brush3.deleteBrush();

      setTimeout(function(){ done() }, 500);
    });

    test('brush1._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(brush1._brushElem), null);
    });

    test('brush2._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(brush2._brushElem),null);
    });

    test('brush3._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(brush3._brushElem),null);
    });

    test('brushes mutedSeries is correct', function() {
      assert.deepEqual(brush1.mutedSeries, {});
      assert.deepEqual(brush2.mutedSeries, {});
      assert.deepEqual(brush3.mutedSeries, {});
    });
  });

  suite('px-vis-axis-brush draw still works after delete', function() {
    var brush1 = document.getElementById('brush1'),
        brush2 = document.getElementById('brush2'),
        brush3 = document.getElementById('brush3');

    suiteSetup(function(done) {
      d = [brush2.axis(16),brush2.axis(9)];
      brush2._brushD3.call(brush2._brush.move,d);

      setTimeout(function(){ done() }, 300);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0], 80, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1], 359, 2);
    });
  });


  suite('px-vis-axis-brush radial setup works', function() {
    var radialScale = document.getElementById('radialScale'),
        radialSVG = document.getElementById('radialSVG'),
        radialBrush1 = document.getElementById('radialBrush1'),
        radialBrush2 = document.getElementById('radialBrush2'),
        radialBrush3 = document.getElementById('radialBrush3');

    suiteSetup(function(done) {
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
          .attr("class", function(d,i) { return "dimension" + i })
          .attr("dimension", function(d) { return d })
          .attr("transform", function(d) {
            return "rotate(" + (radialScale.x(d) * 180 / Math.PI + 180) + ")";
          });

        radialBrush1.set('margin',m);
        radialBrush1.set('height',h/2);
        radialBrush1.set('centerOffset',20);
        radialBrush1.set('seriesKey',"x");
        radialBrush1.set('dimension',dim[0]);
        radialBrush1.set('chartData',d);

        radialBrush2.set('margin',m);
        radialBrush2.set('height',h/2);
        radialBrush2.set('centerOffset',20);
        radialBrush2.set('seriesKey',"x");
        radialBrush2.set('dimension',dim[1]);
        radialBrush2.set('chartData',d);

        radialBrush3.set('margin',m);
        radialBrush3.set('height',h/2);
        radialBrush3.set('centerOffset',20);
        radialBrush3.set('seriesKey',"x");
        radialBrush3.set('dimension',dim[2]);
        radialBrush3.set('chartData',d);

        radialBrush1.set('svg', radialSVG.svg.select('g.dimension0'));
        radialBrush2.set('svg', radialSVG.svg.select('g.dimension1'));
        radialBrush3.set('svg', radialSVG.svg.select('g.dimension2'));

      setTimeout(function(){done()}, 500);
    });

    test('radialBrush fixture is created', function() {
      assert.isTrue(radialBrush1 !== null);
      assert.isTrue(radialBrush2 !== null);
      assert.isTrue(radialBrush3 !== null);
    });

    test('radialBrush._brushes are created', function() {
      assert.equal(radialBrush1._brushD3.nodes().length, 1);
      assert.equal(radialBrush2._brushD3.nodes().length, 1);
      assert.equal(radialBrush3._brushD3.nodes().length, 1);
    });
    test('radialBrush._brushes is not selected', function() {

      assert.equal(Px.d3.brushSelection(radialBrush1._brushElem), null);
      assert.equal(Px.d3.brushSelection(radialBrush2._brushElem), null);
      assert.equal(Px.d3.brushSelection(radialBrush3._brushElem), null);
    });

    test('radialBrush mutedSeries is correct', function() {
      assert.deepEqual(radialBrush1.mutedSeries,{});
      assert.deepEqual(radialBrush2.mutedSeries,{});
      assert.deepEqual(radialBrush3.mutedSeries,{});
    });
  });

  suite('px-vis-axis-brush brush resizes to the inputed domain', function() {
    var radialBrush1 = document.getElementById('radialBrush1'),
        radialBrush2 = document.getElementById('radialBrush2'),
        radialBrush3 = document.getElementById('radialBrush3');
    var colors = baseColors.properties.colors.value;
    var d;
    suiteSetup(function(done) {
      d = [radialBrush2.axis(9), radialBrush2.axis(16)];
      radialBrush2._brushD3.call(radialBrush2._brush.move, d);
      setTimeout(function() { done() }, 100);
    });

    test('radialBrush._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0], 60, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1], 95, 2);
    });
    test('radialBrush._brushGroup.rect attr x', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('x'), -10);
    });
    test('radialBrush._brushGroup.rect attr width', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('width'), 20);
    });
    test('radialBrush._brushGroup.rect attr y', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('y'), 60);
    });
    test('radialBrush._brushGroup.rect attr height', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('height'), 35);
    });
    test('radialBrush._brushGroup.rect correct fill', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('fill').split(' ').join(''), colors['grey5']);
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('fill-opacity'), '0.3');
    });
    test('radialBrush._brushGroup.rect correct stroke', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('stroke').split(' ').join(''), colors["primary-blue"]);
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('stroke-dasharray').split(' ').join(''), "5,5");
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms = {
        "1397131620000": true,
        "1397189940000": true
      };
      assert.deepEqual(radialBrush2.mutedSeries, ms);
    });
  });

  suite('px-vis-axis-brush resize', function() {
    var radialBrush1 = document.getElementById('radialBrush1'),
        radialBrush2 = document.getElementById('radialBrush2'),
        radialBrush3 = document.getElementById('radialBrush3');
    var d1, d2;

    suiteSetup(function(done) {
      d1 = [radialBrush1.axis(1),radialBrush1.axis(5)];
      d2 = [radialBrush3.axis(15),radialBrush3.axis(27)];

      radialBrush1._brushD3.call(radialBrush1._brush.move,d1);
      radialBrush3._brushD3.call(radialBrush3._brush.move,d2);

      setTimeout(function(){ done() }, 100);
    });
    test('radialBrush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[0], 20, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[1], 40, 2);
    });
    test('radialBrush1._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('y')), 20, 2);
    });
    test('radialBrush1._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('height')), 20, 2);
    });

    test('radialBrush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[0], 90, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[1], 150, 2);
    });
    test('radialBrush3._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('y')), 90, 2);
    });
    test('radialBrush3._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('height')), 60, 2);
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms1 = {
            "1397102460000": true,
            "1397189940000": true
          },
          ms3 = {
            "1397131620000": true,
            "1397219100000": true
          };

      assert.deepEqual(radialBrush1.mutedSeries, ms1);
      assert.deepEqual(radialBrush3.mutedSeries, ms3);
    });
  });

  suite('px-vis-axis-brush domain change', function() {
    var radialScale = document.getElementById('radialScale');
    var radialBrush1 = document.getElementById('radialBrush1'),
        radialBrush2 = document.getElementById('radialBrush2'),
        radialBrush3 = document.getElementById('radialBrush3');
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[3,18]};

    suiteSetup(function(done) {
      radialScale.set('chartExtents',ext);

      setTimeout(function(){done()},100);
    });

    test('radialBrush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[0], 20, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[1], 37, 2);
    });
    test('radialBrush1._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('y')), 20, 2);
    });
    test('radialBrush1._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('height')), 17, 2);
    });

    test('radialBrush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0],72, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1],133,2);
    });
    test('radialBrush2._brush rect attr y1', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('y')), 72, 2);
    });
    test('radialBrush2._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('height')), 61, 2);
    });

    test('radialBrush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[0], 124, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[1], 150, 2);
    });
    test('radialBrush3._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('y')), 124, 2);
    });
    test('radialBrush3._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('height')), 26, 1);
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms1 = {
            "1397189940000": true
          },
          ms2 = {
            "1397131620000": true,
            "1397189940000": true
          },
          ms3 = {};

      assert.deepEqual(radialBrush1.mutedSeries, ms1);
      assert.deepEqual(radialBrush2.mutedSeries, ms2);
      assert.deepEqual(radialBrush3.mutedSeries, ms3);
    });
  });

  suite('px-vis-axis-brush domain change so brush falls outside', function() {
    var radialScale = document.getElementById('radialScale');
    var radialBrush1 = document.getElementById('radialBrush1'),
        radialBrush2 = document.getElementById('radialBrush2'),
        radialBrush3 = document.getElementById('radialBrush3');
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[7,18]};

    suiteSetup(function(done) {
      radialScale.set('chartExtents',ext);

      setTimeout(function(){ done() }, 100);

    });

    test('radialBrush1._brush extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush1._brushElem), null);
    });

    test('radialBrush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0],44, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1],126, 2);
    });
    test('radialBrush2._brush rect attr y1', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('y')), 44, 2);
    });
    test('radialBrush2._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('height')), 83, 2);
    });

    test('radialBrush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[0],115, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[1],150, 2);
    });
    test('radialBrush3._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('y')), 115, 2);
    });
    test('radialBrush3._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('height')), 35, 2);
    });

    test('radialBrush mutedSeries is correct', function() {
      var ms1 = {},
          ms2 = {
            "1397131620000": true,
            "1397189940000": true
          },
          ms3 = {};

      assert.deepEqual(radialBrush1.mutedSeries, ms1);
      assert.deepEqual(radialBrush2.mutedSeries, ms2);
      assert.deepEqual(radialBrush3.mutedSeries, ms3);
    });
  });

  suite('px-vis-axis-brush delete works', function() {
    var radialBrush1 = document.getElementById('radialBrush1'),
        radialBrush2 = document.getElementById('radialBrush2'),
        radialBrush3 = document.getElementById('radialBrush3');

    suiteSetup(function(done) {
      radialBrush1.deleteBrush();
      radialBrush2.deleteBrush();
      radialBrush3.deleteBrush();

      setTimeout(function(){ done() }, 500);
    });

    test('radialBrush1._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush1._brushElem), null);
    });

    test('radialBrush2._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush2._brushElem),null);
    });

    test('radialBrush3._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush3._brushElem),null);
    });

    test('brushes mutedSeries is correct', function() {
      assert.deepEqual(radialBrush1.mutedSeries, {});
      assert.deepEqual(radialBrush2.mutedSeries, {});
      assert.deepEqual(radialBrush3.mutedSeries, {});
    });
  });

  suite('px-vis-axis-brush draw still works after delete', function() {
    var radialBrush1 = document.getElementById('radialBrush1'),
        radialBrush2 = document.getElementById('radialBrush2'),
        radialBrush3 = document.getElementById('radialBrush3');

    suiteSetup(function(done) {
      d = [radialBrush2.axis(9),radialBrush2.axis(16)];
      radialBrush2._brushD3.call(radialBrush2._brush.move,d);

      setTimeout(function(){ done() }, 300);
    });

    test('radialBrush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0], 44, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1], 126, 2);
    });
  });

} //runTests
