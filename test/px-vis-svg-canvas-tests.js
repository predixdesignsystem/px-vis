document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-svg-canvas does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isDefined(Polymer);
    });
  });


  suite('px-vis-svg-canvas runs with imperative bindings', function() {
    var canvasEvt,canvasEvtNE,
        svgEvt,svgEvtNE,
        svgCanvas = document.getElementById('svgCanvas'),
        canvasElem = svgCanvas.$$('px-vis-canvas'),
        svgElem = svgCanvas.$$('px-vis-svg'),
        w = 600,
        h = 400,
        m = {
          "top": 5,
          "right": 5,
          "bottom": 20,
          "left": 8
        };

    suiteSetup(function(){
      document.addEventListener('px-vis-canvas-context-updated',function(evt){
        canvasEvt = evt.detail;
        canvasEvtNE = Polymer.dom(evt);
      });
      document.addEventListener('px-vis-svg-updated',function(evt){
        svgEvt = evt.detail;
        svgEvtNE = Polymer.dom(evt);
      });
      svgCanvas.set('width',w)
      svgCanvas.set('height',h)
      svgCanvas.set('margin',m);
    });

    test('svgCanvas fixture is created', function() {
      assert.isDefined(svgCanvas);
    });

    test('svgCanvas fired off the canvas event', function() {
      assert.isDefined(canvasEvt);
    });
    test('svgCanvas canvasEvt has a data var', function() {
      assert.isDefined(canvasEvt.data);
    });
    test('svgCanvas canvasEvt has a dataVar var', function() {
      assert.equal(canvasEvt.dataVar , 'canvasContext');
    });
    test('svgCanvas canvasEvt has a method var', function() {
      assert.equal(canvasEvt.method , 'set');
    });

    test('svgCanvas fired off the svg event', function() {
      assert.isDefined(svgEvt);
    });
    test('svgCanvas svgEvt has a data var', function() {
      assert.equal(JSON.stringify(svgEvt.data) , JSON.stringify(svgElem.svg));
    });
    test('svgCanvas svgEvt has a dataVar var', function() {
      assert.equal(svgEvt.dataVar , 'svg');
    });
    test('svgCanvas svgEvt has a method var', function() {
      assert.equal(svgEvt.method , 'set');
    });

    test('rec-container has correct height', function(){
      var s = svgCanvas.$$('div.rel-container').style;
      assert.equal(s.height,'400px');
    });

  });

} //runTests
