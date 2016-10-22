document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-gridlines does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-gridlines basic setup works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseGrid = document.getElementById('baseGrid');
    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.va1lue;
    var colors = commonColors.properties.colors.value;

    suiteSetup(function(done){
      var d = [
          {
            "x": 1397102460000,
            "y": 0,
            "y1": 23,
            "y2": 26
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 16,
            "y2": 32
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 11,
            "y2": 20
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 12,
            "y2": 22
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 19,
            "y2": 30
          }
        ],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        },
        min = 280/2,
        tickValues = [0,5,10,15,20,25,30];


      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',min);
      baseScale.set('margin',m);
      baseScale.set('chartData',d);

      baseGrid.set('margin',m);
      baseGrid.set('tickValues',tickValues);
      setTimeout(function(){ done() },100);
    });

    test('baseGrid fixture is created', function() {
      assert.isTrue(baseGrid !== null);
    });

    test('tickValues gets domain added', function() {
      assert.equal(baseGrid.tickValues.length, 8);
      assert.equal(baseGrid.tickValues[0], 0);
      assert.equal(baseGrid.tickValues[7], 32);
    });

    test('grid created _gridData', function() {
      assert.isTrue(baseGrid._gridData !== null);
      assert.equal(baseGrid._gridData[0]["y"], 0);
      assert.equal(baseGrid._gridData[6]["y"], 30);
      assert.equal(baseGrid._gridData[7]["y"], 32);
    });

    test('grid created config', function() {
      assert.isTrue(baseGrid._completeSeriesConfig !== null);
      assert.isTrue(baseGrid._completeSeriesConfig["radarGrids"] !== null);
      assert.equal(baseGrid._completeSeriesConfig["radarGrids"].color, colors["grey4"]);
      assert.equal(baseGrid._completeSeriesConfig["radarGrids"].x[0], "y");
      assert.equal(baseGrid._completeSeriesConfig["radarGrids"].x[1], "y1");
      assert.equal(baseGrid._completeSeriesConfig["radarGrids"].x[2], "y2");
    });

    test('confirm that lines were drawn', function() {
      var lines = baseGrid.$$('#line').linePath.nodes();

      assert.equal(lines.length, 8);
      assert.equal(lines[0].tagName, "path");
    });
  }); //suite
} //runTests
