document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-radial-gridlines does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-radial-gridlines basic setup works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        radialGrid = document.getElementById('radialGrid');

    suiteSetup(function(done){
      var d = [{
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
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":['y'],"y":[0,10]},
        w = 500,
        h = 500,
        min = 480/2,
        offset = [240,240],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        },
        tickValues = [3,6,9];

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('offset',offset);
      baseSVG.set('margin',m);

      baseScale.set('width',min);
      baseScale.set('margin',m);
      baseScale.set('amplitudeKeys','y');
      baseScale.set('completeSeriesConfig',completeSeriesConfig);
      baseScale.set('chartExtents',chartExtents);
      baseScale.set('chartData',d);

      radialGrid.set('margin',m);

      window.setTimeout(function(){ done() },100);
    });

    test('radialGrid fixture is created', function() {
      assert.isTrue(radialGrid !== null);
    });

    test('radialGrid lines are created', function() {
      var g = baseSVG.svg.select('g.axisGridLines'),
          lines = g.selectAll('line');

      assert.lengthOf(lines.nodes(),8);
    });

    test('radialGrid lines are the correct length', function() {
      var g = baseSVG.svg.select('g.axisGridLines'),
          lines = g.selectAll('line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('x2'),240);
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('x2'),240);
    });

    test('radialGrid lines are rotated correctly', function() {
      var g = baseSVG.svg.select('g.axisGridLines'),
          lineG = g.selectAll('line').nodes(),
          re = /rotate\((-?\d+)\)/,
          m0,m1,m2,m3,m4,m5,m6,m7;

          m0 = re.exec(Px.d3.select(lineG[0]).attr('transform'));
          m1 = re.exec(Px.d3.select(lineG[1]).attr('transform'));
          m2 = re.exec(Px.d3.select(lineG[2]).attr('transform'));
          m3 = re.exec(Px.d3.select(lineG[3]).attr('transform'));
          m4 = re.exec(Px.d3.select(lineG[4]).attr('transform'));
          m5 = re.exec(Px.d3.select(lineG[5]).attr('transform'));
          m6 = re.exec(Px.d3.select(lineG[6]).attr('transform'));
          m7 = re.exec(Px.d3.select(lineG[7]).attr('transform'));

      assert.equal(m0[1],"-30");
      assert.equal(m1[1],"-60");
      assert.equal(m2[1],"-120");
      assert.equal(m3[1],"-150");
      assert.equal(m4[1],"-210");
      assert.equal(m5[1],"-240");
      assert.equal(m6[1],"-310");
      assert.equal(m7[1],"-340");
    });

    test('radialGrid circles are created', function() {
      var g = baseSVG.svg.select('g.radialGridlines'),
          circle = g.selectAll('circle');

      assert.lengthOf(circle.nodes(), 6);
    });

    test('radialGrid circles have correct radius', function() {
      var g = baseSVG.svg.select('g.radialGridlines'),
          circle = g.selectAll('circle');

      assert.closeTo(Number(Px.d3.select(circle.nodes()[0]).attr('r')), 48, 1);
      assert.closeTo(Number(Px.d3.select(circle.nodes()[1]).attr('r')), 96, 1);
      assert.closeTo(Number(Px.d3.select(circle.nodes()[2]).attr('r')), 144, 1);
      assert.closeTo(Number(Px.d3.select(circle.nodes()[3]).attr('r')), 192, 1);
      assert.closeTo(Number(Px.d3.select(circle.nodes()[4]).attr('r')), 240, 1);
    });
  }); //suite

  suite('px-vis-radial-gridlines works with custom tick values', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        radialGrid = document.getElementById('radialGrid');

    suiteSetup(function(done){
      var tickValues = [3,6,9];

      radialGrid.set('tickValues',tickValues);

      window.setTimeout(function(){ done() },100);
    });

    test('radialGrid fixture is created', function() {
      assert.isTrue(radialGrid !== null);
    });

    test('radialGrid lines are created', function() {
      var g = baseSVG.svg.select('g.axisGridLines'),
          lines = g.selectAll('line');

      assert.lengthOf(lines.nodes(),8);
    });

    test('radialGrid lines are the correct length', function() {
      var g = baseSVG.svg.select('g.axisGridLines'),
          lines = g.selectAll('line');

      assert.equal(Px.d3.select(lines.nodes()[0]).attr('x2'),240);
      assert.equal(Px.d3.select(lines.nodes()[4]).attr('x2'),240);
    });

    test('radialGrid lines are rotated correctly', function() {
      var g = baseSVG.svg.select('g.axisGridLines'),
          lineG = g.selectAll('line').nodes(),
          re = /rotate\((-?\d+)\)/,
          m0,m1,m2,m3,m4,m5,m6,m7;

          m0 = re.exec(Px.d3.select(lineG[0]).attr('transform'));
          m1 = re.exec(Px.d3.select(lineG[1]).attr('transform'));
          m2 = re.exec(Px.d3.select(lineG[2]).attr('transform'));
          m3 = re.exec(Px.d3.select(lineG[3]).attr('transform'));
          m4 = re.exec(Px.d3.select(lineG[4]).attr('transform'));
          m5 = re.exec(Px.d3.select(lineG[5]).attr('transform'));
          m6 = re.exec(Px.d3.select(lineG[6]).attr('transform'));
          m7 = re.exec(Px.d3.select(lineG[7]).attr('transform'));

      assert.equal(m0[1],"-30");
      assert.equal(m1[1],"-60");
      assert.equal(m2[1],"-120");
      assert.equal(m3[1],"-150");
      assert.equal(m4[1],"-210");
      assert.equal(m5[1],"-240");
      assert.equal(m6[1],"-310");
      assert.equal(m7[1],"-340");
    });

    test('radialGrid circles are created', function() {
      var g = baseSVG.svg.select('g.radialGridlines'),
          circle = g.selectAll('circle');

      assert.lengthOf(circle.nodes(),4);
    });

    test('radialGrid circles have correct radius', function() {
      var g = baseSVG.svg.select('g.radialGridlines'),
          circle = g.selectAll('circle');

      assert.closeTo(Number(Px.d3.select(circle.nodes()[0]).attr('r')), 72, 1);
      assert.closeTo(Number(Px.d3.select(circle.nodes()[1]).attr('r')), 144, 1);
      assert.closeTo(Number(Px.d3.select(circle.nodes()[2]).attr('r')), 216, 1);
    });
  }); //suite
} //runTests
