document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-canvas does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isDefined(Polymer);
    });
  });

  suite('px-vis-canvas canvas with no properties does nothing', function() {
    var emptyCanvas = document.getElementById('empty');

    test('emptyCanvas fixture is created', function() {
      assert.isDefined(emptyCanvas);
    });

    test('emptyCanvas creates an canvas', function() {
      assert.equal(emptyCanvas.querySelector('#chartCanvas').tagName ,'CANVAS');
    });

    test('emptyCanvas does not set canvas or context property', function() {
      assert.isTrue(emptyCanvas._isVarUndefined(emptyCanvas._canvas));
      assert.isTrue(emptyCanvas._isVarUndefined(emptyCanvas.canvasContext));
    });
  });

  suite('px-vis-canvas missing one property does nothing', function() {
    var missingHeight = document.getElementById('missingHeight');

    test('missingHeight fixture is created', function() {
      assert.isDefined(missingHeight);
    });

    test('missingHeight creates an canvas', function() {
      assert.equal(missingHeight.querySelector('#chartCanvas').tagName ,'CANVAS');
    });

    test('missingHeight does not set canvas or context property', function() {
      assert.isTrue(missingHeight._isVarUndefined(missingHeight._canvas));
      assert.isTrue(missingHeight._isVarUndefined(missingHeight.canvasContext));
    });
  });

  suite('px-vis-canvas runs with basic declarative bindings', function() {
    var decCanvas = document.getElementById('decCanvas');
    var chartCanvas = decCanvas.querySelector('#chartCanvas');

    test('decCanvas fixture is created', function() {
      assert.isDefined(decCanvas);
    });

    basicAttrs(decCanvas, "decCanvas", 500,300,{
      "top": 10,
      "right": 5,
      "bottom": 20,
      "left": 15
    });

    // Cant test the event firing because it is loaded before we can set up the listener. Something todo later if we figure it out...
  }); //suite

  suite('px-vis-canvas runs with imperative bindings', function() {
    var eventObj,
        impCanvas = document.getElementById('impCanvas'),
        chartCanvas = impCanvas.querySelector('#chartCanvas'),
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
        eventObj = evt.detail;
      });
      impCanvas.set('width',w)
      impCanvas.set('height',h)
      impCanvas.set('margin',m);
    });

    test('impCanvas fixture is created', function() {
      assert.isDefined(impCanvas);
    });

    basicAttrs(impCanvas, "impCanvas", w,h,m);

    // cant move thse into a func because then they dont get the eventObj update and tests fails
    test('impCanvas fired off the canvas event', function() {
      assert.isDefined(eventObj);
    });
    test('impCanvas eventObj has a data var', function() {
      assert.equal(eventObj.data , impCanvas.canvasContext);
    });
    test('impCanvas eventObj has a dataVar var', function() {
      assert.equal(eventObj.dataVar , 'canvasContext');
    });
    test('impCanvas eventObj has a method var', function() {
      assert.equal(eventObj.method , 'set');
    });

  });

  suite('px-vis-canvas updates imperitively', function() {
    var eventObj,
        updateCanvas = document.getElementById('updateCanvas'),
        chartCanvas = updateCanvas.querySelector('#chartCanvas'),
        w = 400,
        h = 200;

    suiteSetup(function(){
      document.addEventListener('px-vis-canvas-context-updated',function(evt){
        eventObj = evt.detail;
      });
      updateCanvas.set('width',w)
      updateCanvas.set('height',h)
    });

    test('updateCanvas fixture is created', function() {
      assert.isDefined(updateCanvas);
    });

    basicAttrs(updateCanvas, "updateCanvas", w,h,{
      "top": 10,
      "right": 5,
      "bottom": 20,
      "left": 15
    });

    // cant move thse into a func because then they dont get the eventObj update and tests fails
    test('updateCanvas fired off the canvas event', function() {
      assert.isDefined(eventObj);
    });
    test('updateCanvas eventObj has a data var', function() {
      assert.equal(eventObj.data , updateCanvas.canvasContext);
    });
    test('updateCanvas eventObj has a dataVar var', function() {
      assert.equal(eventObj.dataVar , 'canvasContext');
    });
    test('updateCanvas eventObj has a method var', function() {
      assert.equal(eventObj.method , 'set');
    });
  });

  suite('px-vis-canvas with offset', function() {
    var offsetCanvas = document.getElementById('offsetCanvas');
    var chartCanvas = decCanvas.querySelector('#chartCanvas');

    test('offsetCanvas fixture is created', function() {
      assert.isDefined(offsetCanvas);
    });

    //no way to truly check the translation. At least look at our _translate prop
    test('offsetCanvas _translate is correct', function() {
      assert.equal(JSON.stringify(offsetCanvas.canvasContext._translation), '[265,160]');
    });

    // Cant test the event firing because it is loaded before we can set up the listener. Something todo later if we figure it out...
  }); //suite

} //runTests

function basicAttrs(elem, elemName, w,h,m){
  var chartCanvas = elem.querySelector('#chartCanvas');

  test(elemName + ' chartCanvas has correct width',function(){
    assert.equal(chartCanvas.getAttribute('width'),w);
  });
  test(elemName + ' chartCanvas has correct height',function(){
    assert.equal(chartCanvas.getAttribute('height'),h);
  });

  test(elemName + '._canvas is a canvas element', function() {
    assert.equal(elem._canvas.tagName, 'CANVAS');
  });
  test(elemName + '.canvas has correct width', function() {
    assert.equal(elem._canvas.getAttribute('width'), w);
  });
  test(elemName + '.canvas has correct height', function() {
    assert.equal(elem._canvas.getAttribute('height'), h);
  });

  test(elemName + ' canvasContext is set',function(){
    assert.isDefined(elem.canvasContext);
  });
  test(elemName + ' canvasContext has the canvas',function(){
    assert.equal(elem.canvasContext.canvas, elem._canvas);
  });

// currently, no universal support to get the transform on a canvas. Methods have been speced, but no way to test this currently. :-/
  // test(elemName + '.canvasContext has correct translation', function() {
  //   console.log(elem.canvasContext.currentTransform);
  //   assert.isTrue(elem.canvasContext.getTransform() === "translate("+m.left+","+m.top+")" || elem._canvas.attr('transform').trim() === "translate("+m.left+" "+m.top+")");
  // });

  test(elemName + ' canvasContext has correct line trackers',function(){
    assert.equal(JSON.stringify(elem.canvasContext._pxLinesSeries), '{}');
    assert.equal(elem.canvasContext._pxLinesTotal, 0);
    assert.equal(elem.canvasContext._pxLinesRedraw, 0);
  });

}
