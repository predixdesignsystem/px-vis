document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-pie does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-pie works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        basePie = document.getElementById('baseLine');

    suiteSetup(function(done){
      var d = [{"x":15,"y":"IPA","percentage":"26"},{"x":1,"y":"Pils","percentage":"2"},{"x":1,"y":"Lager","percentage":"2"},{"x":8,"y":"Lambic","percentage":"14"},{"x":12,"y":"Stout","percentage":"21"},{"x":7,"y":"Pale Ale","percentage":"12"},{"x":9,"y":"Porter","percentage":"16"},{"x":4,"y":"Heffeweisse","percentage":"7"}],
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
      setTimeout(function() {
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
          evt = document.createEvent("MouseEvent"),
          popover = Polymer.dom(basePie.root).querySelector('px-popover');

      evt.initMouseEvent("tap",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      //popover hidden
      assert.isFalse(popover.classList.contains('fadeFromHidden'));

      //click
      slice.dispatchEvent(evt);

      setTimeout(function() {
        var transform = basePie.pieGroup._groups[0][0].attributes['transform'].value.split(' ').join('');

        assert.equal(parseFloat(basePie._radToDeg(basePie._currentRotationAngle)), -47.368421052631575);
        //find actual rotation from transform...
        var rot = transform.substr(transform.indexOf('rotate(')+7);
        rot = rot.substr(0, rot.indexOf(')'));
        rot = parseFloat(parseFloat(rot).toFixed(1));

        //IE uses opposite
        assert.isTrue(rot === -47.4 || rot === (360-47.4));

        //popover should be shown
        assert.isTrue(popover.classList.contains('fadeFromHidden'));

        done();
      }, 1000);
    });

    // test('tooltip starts hidden', function() {
    //   var tooltip = Polymer.dom(basePie.root).querySelector('px-tooltip');
    //   console.log(tooltip._isShowing)
    //   //tooltip hidden
    //   assert.isFalse(tooltip._isShowing);
    // });

    test('hover shows tooltip', function(done) {
      var slice = basePie.pieGroup._groups[0][0].firstChild,
          evt = document.createEvent("MouseEvent"),
          tooltip = Polymer.dom(basePie.root).querySelector('px-tooltip');

      evt.initMouseEvent("mouseover",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      //hover
      slice.dispatchEvent(evt);

      setTimeout(function() {

        //tooltip should be shown
        assert.isTrue(tooltip._isShowing);
        done();
      }, 1000);
    });

    test('mouseleave hides tooltip', function(done) {
      var slice = basePie.pieGroup._groups[0][0].firstChild,
          evt = document.createEvent("MouseEvent"),
          tooltip = Polymer.dom(basePie.root).querySelector('px-tooltip');

      evt.initMouseEvent("mouseleave",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      //tooltip shown
      assert.isTrue(tooltip._isShowing);

      //hover
      slice.dispatchEvent(evt);

      setTimeout(function() {

        //tooltip should be hidden
        assert.isFalse(tooltip._isShowing);
        done();
      }, 10);
    });

    test('click on slice emits px-vis-pie-slice-clicked event with slice data', function(done) {
      var slice = basePie.pieGroup._groups[0][0].firstChild,
        evt = document.createEvent("MouseEvent"),
        sliceName = slice.__data__.data.y,
        sliceAmount = slice.__data__.data.x,
        slicePercentage = slice.__data__.data.percentage;

      evt.initMouseEvent("tap",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
      basePie.addEventListener('px-vis-pie-slice-clicked', function (e) {
        var eventSliceName = e.detail.data.y,
            eventSliceAmount = e.detail.data.x,
            eventSlicePercentage = e.detail.data.percentage;
        assert.equal(sliceName, eventSliceName);
        assert.equal(sliceAmount, eventSliceAmount);
        assert.equal(slicePercentage, eventSlicePercentage);
      });
      //click
      slice.dispatchEvent(evt);

      setTimeout(function() {

        done();
      }, 100);
    });

  }); //suite



} //runTests
