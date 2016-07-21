document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-line does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-pie works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        basePie = document.getElementById('baseLine');

    suiteSetup(function(){
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
    });

    test('basePie fixture is created', function() {
      assert.isTrue(basePie !== null);
    });

    test('as many slices as data', function() {

      assert.equal(basePie.chartData.length,  basePie.pieGroup._groups[0][0].childNodes.length);
    });

    test('verify first slice path', function() {
      var slicePath = basePie.pieGroup._groups[0][0].firstChild.firstChild.attributes['d'].value.split(/[\s,]+/).join(''),
          normalPath = 'M1.3164953090834047e-14-215A215215001214.2656659964340217.754559276551454L00Z',
          iePath = 'M1.3165e-014-215A215215001214.26617.7546L00Z';
      assert.isTrue(slicePath === normalPath || slicePath === iePath);
    });

    test('pie has been initially translated by radius', function() {
      var transform = basePie.pieGroup._groups[0][0].attributes['transform'].value.replace(',','').split(" ").join('');
      assert.isTrue(transform.indexOf('translate(' + basePie._radius + basePie._radius + ')') !== -1);
    });

    test('pie has been translated by radius and rotated after animation', function(done) {

      setTimeout(function() {
        var transform = basePie.pieGroup._groups[0][0].attributes['transform'].value.replace('scale(1)','').replace(',','').split(" ").join(''),
            expected = 'translate(' + basePie._radius +  basePie._radius + ')rotate(-180)',
            expectedIe = 'translate(' + basePie._radius +  basePie._radius + ')rotate(180)';

        //opposite rotation for IE....
        assert.isTrue(transform === expected || transform === expectedIe);
        assert.equal(basePie._currentRotationAngle, -Math.PI);
        done();
      }, 1500);
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
      }, 800);
    });

    test('hover shows tooltip', function(done) {
      var slice = basePie.pieGroup._groups[0][0].firstChild,
          evt = document.createEvent("MouseEvent"),
          tooltip = Polymer.dom(basePie.root).querySelector('px-tooltip');

      evt.initMouseEvent("mouseover",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      //tooltip hidden
      assert.isFalse(tooltip._isShowing);

      //hover
      slice.dispatchEvent(evt);

      setTimeout(function() {

        //tooltip should be shown
        assert.isTrue(tooltip._isShowing);
        done();
      }, 100);
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

  }); //suite



} //runTests
