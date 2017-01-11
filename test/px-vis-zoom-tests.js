document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-zoom does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-zoom baseZoom setup works', function() {
    var baseSVG = document.getElementById('baseSVG'),
        baseZoom = document.getElementById('baseZoom');

    suiteSetup(function(){
      var w = 500,
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

      baseZoom.set('margin',m);
    });

    test('baseZoom fixture is created', function() {
      assert.isTrue(baseZoom !== null);
    });
  }); //suite

  suite('px-vis-zoom baseZoom extentsData added', function() {
    var baseSVG = document.getElementById('baseSVG'),
        baseZoom = document.getElementById('baseZoom');
    var eventObj = null;

    suiteSetup(function(done){
      var d = {
        "eX": [10, 52],
        "eY": [0, 10]
      };

      document.addEventListener('px-vis-selected-domain-updated',function(evt){
        eventObj = evt.detail;
      });

      baseZoom.set('extentsData',d);

      setTimeout(function(){ done() },10);
      // done();
    });

    test('event fired', function() {
      assert.isTrue(eventObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(eventObj.dataVar, 'selectedDomain');
    });
    test('event method', function() {
      assert.equal(eventObj.method, 'set');
    });
    test('event data exists and is an object', function() {
      assert.equal(typeof(eventObj.data),'object');
    });
    test('event data.x exists and is an array', function() {
      assert.isTrue(Array.isArray(eventObj.data.x));
    });
    test('event data.y exists and is an array', function() {
      assert.isTrue(Array.isArray(eventObj.data.y));
    });
    test('event data exists and matches expected', function() {
      assert.equal(eventObj.data.x[0],10);
      assert.equal(eventObj.data.x[1],52);
    });
  }); //suite

  suite('px-vis-zoom zoom stack', function() {
    var baseZoom = document.getElementById('baseZoom'),
        stack = [{eX:0,eY:0},{eX:1,eY:1},{eX:2,eY:2}];

    suiteSetup(function() {
      //manually reset
      baseZoom.set('selectedDomain', null);
      baseZoom.set('zoomStack', []);

      //zoom 3 times
      baseZoom.set('extentsData', stack[0]);
      baseZoom.set('extentsData', stack[1]);
      baseZoom.set('extentsData', stack[2]);
    });

    test('initial zoom stack', function() {
      assert.equal(baseZoom.zoomStack.length, 3);
    });
    test('undoZoom', function() {
      baseZoom.undoZoom();

      assert.equal(baseZoom.zoomStack.length, 2);
      assert.equal(baseZoom.selectedDomain.x, stack[1].eX);
      assert.equal(baseZoom.selectedDomain.x, stack[1].eY);
    });
    test('reset zoom', function() {
      baseZoom.resetZoom();

      assert.equal(baseZoom.zoomStack.length, 0);
      assert.equal(baseZoom.selectedDomain, 'reset');
    });
    test('last undo zoom = reset zoom', function() {
      //zoom once
      baseZoom.set('extentsData', stack[0]);

      assert.equal(baseZoom.zoomStack.length, 1);

      baseZoom.undoZoom();
      assert.equal(baseZoom.zoomStack.length, 0);
      assert.equal(baseZoom.selectedDomain, 'reset');
    });
  }); //suite

} //runTests
