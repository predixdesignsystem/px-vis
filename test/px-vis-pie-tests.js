document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-pie does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-pie works', function() {
    var baseScale,
        baseSVG,
        basePie;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      basePie = document.getElementById('baseLine');
      var d = [{"x":15,"y":"IPA","percentage":"26", "colorIndex": 0},{"x":1,"y":"Pils","percentage":"2", "colorIndex": 1},{"x":1,"y":"Lager","percentage":"2", "colorIndex": 2},{"x":8,"y":"Lambic","percentage":"14", "colorIndex": 3},{"x":12,"y":"Stout","percentage":"21", "colorIndex": 4},{"x":7,"y":"Pale Ale","percentage":"12", "colorIndex": 5},{"x":9,"y":"Porter","percentage":"16", "colorIndex": 6},{"x":4,"y":"Heffeweisse","percentage":"7", "colorIndex": 7}],
          seriesConfig = {"y":{
            "type":"line",
            "y": "y",
            "x": "x",
            "name":"mySeries",
            "xAxisUnit":"pint"}};

      basePie.set('chartData',d);
      basePie.set('completeSeriesConfig',seriesConfig);
      basePie.set('seriesId',"y");

      //wait for animation to finish
      window.setTimeout(function() {
        done();
      }, 1000);
    });

    test('basePie fixture is created', function() {
      assert.isTrue(basePie !== null);
    });

    test('as many slices as data', function() {
      assert.equal(basePie.chartData.length,  basePie.pieGroup._groups[0][0].childNodes.length);
    });

    test('verify first slice path', function() {
      var slicePath = basePie.pieGroup._groups[0][0].firstChild.attributes['d'].value.split(/[\s,]+/).join(''),
          normalPath = 'M1.5308084989341916e-14-250A250250001249.1461232516674620.644836368083084L00Z',
          iePath = 'M1.53081e-014-250A250250001249.14620.6448L00Z';
      assert.isTrue(slicePath === normalPath || slicePath === iePath);
    });


    test('click on slice rotates pie', function(done) {
      var slice = basePie.pieGroup._groups[0][0].firstChild,
          evt = document.createEvent("MouseEvent");

      evt.initMouseEvent("tap",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      //click
      slice.dispatchEvent(evt);

      window.setTimeout(function() {
        var transform = basePie.pieGroup._groups[0][0].attributes['transform'].value.split(' ').join('');

        assert.equal(parseFloat(basePie._radToDeg(basePie._currentRotationAngle)), -47.368421052631575);
        //find actual rotation from transform...
        var rot = transform.substr(transform.indexOf('rotate(')+7);
        rot = rot.substr(0, rot.indexOf(')'));
        rot = parseFloat(parseFloat(rot).toFixed(1));

        //IE uses opposite
        assert.isTrue(rot === -47.4 || rot === (360-47.4));

        done();
      }, 1000);
    });

    test('click on slice emits px-vis-pie-slice-clicked event with slice data', function(done) {
      var slice = basePie.pieGroup._groups[0][0].firstChild,
        evt = document.createEvent("MouseEvent"),
        sliceName = slice.__data__.data.y,
        sliceAmount = slice.__data__.data.x,
        slicePercentage = slice.__data__.data.percentage;

      evt.initMouseEvent("tap",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
      basePie.addEventListener('px-vis-pie-slice-clicked', function (e) {

        var eventSliceName = e.detail.datum.data.y,
            eventSliceAmount = e.detail.datum.data.x,
            eventSlicePercentage = e.detail.datum.data.percentage;
        assert.equal(sliceName, eventSliceName);
        assert.equal(sliceAmount, eventSliceAmount);
        assert.equal(slicePercentage, eventSlicePercentage);
      });
      //click
      slice.dispatchEvent(evt);

      window.setTimeout(function() {

        done();
      }, 100);
    });

  }); //suite



} //runTests
