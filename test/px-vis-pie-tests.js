document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-line does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-line works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        basePie = document.getElementById('baseLine');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(){
      var d = [{"x":15,"y":"IPA","percentage":"26"},{"x":1,"y":"Pils","percentage":"2"},{"x":1,"y":"Lager","percentage":"2"},{"x":8,"y":"Lambic","percentage":"14"},{"x":12,"y":"Stout","percentage":"21"},{"x":7,"y":"Pale Ale","percentage":"12"},{"x":9,"y":"Porter","percentage":"16"},{"x":4,"y":"Heffeweisse","percentage":"7"}],
          seriesConfig = {"y":{
            "type":"line",
            "y": "y",
            "x": "x",
            "name":"mySeries"}};

      basePie.set('chartData',d);
      basePie.set('completeSeriesConfig',seriesConfig);
      basePie.set('seriesId',"y");
    });

    test('basePie fixture is created', function() {
      assert.isTrue(basePie !== null);
    });

    test('as many slices as data', function() {
      assert.equal(basePie.chartData.length,  basePie.pieGroup._groups[0][0].children.length);
    });

    test('verify first slice path', function() {
      var slice = basePie.pieGroup._groups[0][0].children[0].children[0].attributes['d'];
      assert.equal(slice.value,'M8.266365894244634e-15,-135A135,135,0,0,1,134.53890655590044,11.148211638764865L0,0Z');
    });

    test('pie has been translated and rotated by 180', function() {
      var transform = basePie.pieGroup._groups[0][0].attributes['transform'].
      assert.equal(basePie.linePath.attr('d').split(/[\s,]+/).join(''),'M1.0103336092965664e-14,-165A165,165,0,0,1,164.43644134610054,13.625592002934836L0,0Z');
    });
  }); //suite



} //runTests
