document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-svg does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isDefined(Polymer);
    });
  });

  suite('px-vis-svg svg with no properties does nothing', function() {
    var emptySVG = document.getElementById('empty');

    test('emptySVG fixture is created', function() {
      assert.isDefined(emptySVG);
    });

    test('emptySVG creates an svg', function() {
      assert.equal(emptySVG.querySelector('#chartSVG').tagName ,'svg');
    });

    test('emptySVG does not set svg property', function() {
      assert.isTrue(emptySVG._isVarUndefined(emptySVG.svg));
    });
  });

  suite('px-vis-svg missing one property does nothing', function() {
    var missingHeight = document.getElementById('missingHeight');

    test('missingHeight fixture is created', function() {
      assert.isDefined(missingHeight);
    });

    test('missingHeight creates an svg', function() {
      assert.equal(missingHeight.querySelector('#chartSVG').tagName ,'svg');
    });

    test('missingHeight does not set svg property', function() {
      assert.isTrue(missingHeight._isVarUndefined(missingHeight.svg));
    });
  });

  suite('px-vis-svg runs with basic declarative bindings', function() {
    var decSVG = document.getElementById('decSVG');
    var chartSVG = decSVG.querySelector('#chartSVG');

    test('decSVG fixture is created', function() {
      assert.isDefined(decSVG);
    });

    basicAttrs(decSVG, "decSVG", 500,300,{
      "top": 10,
      "right": 5,
      "bottom": 20,
      "left": 15
    });

    // Cant test the event firing because it is loaded before we can set up the listener. Something todo later if we figure it out...
  }); //suite

  suite('px-vis-svg runs with imperative bindings', function() {
    var eventObj,
        impSVG = document.getElementById('impSVG'),
        chartSVG = impSVG.querySelector('#chartSVG'),
        w = 600,
        h = 400,
        m = {
          "top": 5,
          "right": 5,
          "bottom": 20,
          "left": 8
        };

    suiteSetup(function(){
      document.addEventListener('px-vis-svg-updated',function(evt){
        eventObj = evt.detail;
      });
      impSVG.set('width',w)
      impSVG.set('height',h)
      impSVG.set('margin',m);
    });

    test('impSVG fixture is created', function() {
      assert.isDefined(impSVG);
    });

    basicAttrs(impSVG, "impSVG", w,h,m);

    // cant move thse into a func because then they dont get the eventObj update and tests fails
    test('impSVG fired off the svg event', function() {
      assert.isDefined(eventObj);
    });
    test('impSVG eventObj has a data var', function() {
      assert.equal(eventObj.data.node() , impSVG.svg.node());
    });
    test('impSVG eventObj has a dataVar var', function() {
      assert.equal(eventObj.dataVar , 'svg');
    });
    test('impSVG eventObj has a method var', function() {
      assert.equal(eventObj.method , 'set');
    });

  });

  suite('px-vis-svg updates imperitively', function() {
    var eventObj,
        updateSVG = document.getElementById('updateSVG'),
        chartSVG = updateSVG.querySelector('#chartSVG'),
        w = 400,
        h = 200;

    suiteSetup(function(){
      document.addEventListener('px-vis-svg-updated',function(evt){
        eventObj = evt.detail;
      });
      updateSVG.set('width',w)
      updateSVG.set('height',h)
    });

    test('updateSVG fixture is created', function() {
      assert.isDefined(updateSVG);
    });

    basicAttrs(updateSVG, "updateSVG", w,h,{
      "top": 10,
      "right": 5,
      "bottom": 20,
      "left": 15
    });

    // cant move thse into a func because then they dont get the eventObj update and tests fails
    test('updateSVG fired off the svg event', function() {
      assert.isDefined(eventObj);
    });
    test('updateSVG eventObj has a data var', function() {
      assert.equal(eventObj.data.node() , updateSVG.svg.node());
    });
    test('updateSVG eventObj has a dataVar var', function() {
      assert.equal(eventObj.dataVar , 'svg');
    });
    test('updateSVG eventObj has a method var', function() {
      assert.equal(eventObj.method , 'set');
    });
  });


  suite('px-vis-svg runs with an offset', function() {
    var offsetSVG = document.getElementById('offsetSVG');
    var chartSVG = offsetSVG.querySelector('#chartSVG');

    test('offsetSVG fixture is created', function() {
      assert.isDefined(offsetSVG);
    });

    test('offsetSVG has a correct translate', function() {
      var re = /translate\((\d+)\s?,?\s?(\d+)\)/;
      var matches = re.exec(offsetSVG.svg.attr('transform'));
      assert.equal(Number(matches[1]),265);
      assert.equal(Number(matches[2]),160);
    });
  }); //suite

} //runTests

function basicAttrs(elem, elemName, w,h,m){
  var chartSVG = elem.querySelector('#chartSVG');

  test(elemName + ' chartSVG has correct width',function(){
    assert.equal(chartSVG.getAttribute('width'),w);
  });
  test(elemName + ' chartSVG has correct height',function(){
    assert.equal(chartSVG.getAttribute('height'),h);
  });

  test(elemName + '.svg is a g element', function() {
    assert.equal(elem.svg.node().tagName, 'g');
  });
  test(elemName + '.svg has correct width', function() {
    assert.equal(elem.svg.attr('width'), w);
  });
  test(elemName + '.svg has correct height', function() {
    assert.equal(elem.svg.attr('height'), h);
  });
  test(elemName + '.svg has correct translation', function() {
    var re = /translate\((\d+)\s?,?\s?(\d+)\)/;
    var matches = re.exec(elem.svg.attr('transform'));
    assert.equal(Number(matches[1]),m.left);
    assert.equal(Number(matches[2]),m.top);

    // assert.isTrue(elem.svg.attr('transform').trim() === "translate("+m.left+","+m.top+")" || elem.svg.attr('transform').trim() === "translate("+m.left+" "+m.top+")");
  });

  test(elemName + ' pxSvgElem is set',function(){
    assert.isDefined(elem.pxSvgElem);
  });

  test(elemName + ' pxSvgElem is the svg',function(){
    assert.equal(elem.pxSvgElem.tagName, "svg");
  });

}
