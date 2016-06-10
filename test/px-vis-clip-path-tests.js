document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-clip-path does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-clip-path basic setup works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseLine = document.getElementById('baseLine'),
        baseClip = document.getElementById('baseClip');
    var eventObj;

    suiteSetup(function(done){
      var d = [{
        "series": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ]
        }],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        };

      document.addEventListener('px-vis-clip-path-updated',function(evt){
        eventObj = evt.detail;
      });

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('chartData',d);
      console.warn(baseLine);
      baseLine.set('chartData',d[0]);

      baseClip.set('margin',m);
      baseClip.set('width',w/2);
      baseClip.set('height',h/2);

      // setTimeout(function(){done()},5000);
      done();
    });

    test('baseClip fixture is created', function() {
      assert.isTrue(baseClip !== null);
    });
    test('event fired', function() {
      assert.isTrue(eventObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(eventObj.dataVar, 'clipPath');
    });
    test('event method', function() {
      assert.equal(eventObj.method, 'set');
    });
    test('event data', function() {
      assert.equal(eventObj.data.length, 13);
      assert.equal(eventObj.data.split('_')[0], 'cp');
    });
  });

  suite('px-vis-clip-path baseClip works', function() {
    var baseSVG = document.getElementById('baseSVG'),
        baseClip = document.getElementById('baseClip');
    var clipPath, rect;

    suiteSetup(function(){
      clipPath = baseSVG.svg.select('clipPath');
      // Safari 8 cant seem to find it with d3 select... fallback
      if(clipPath.node() === null){
        clipPath = d3.select(document.getElementsByTagName('clipPath')[0]);
      }
      rect = clipPath.select('rect');
    });

    test('baseClip ID is set', function() {
      assert.equal(clipPath.attr('id'),baseClip.clipPath);
    });
    test('baseClip y', function() {
      assert.equal(rect.attr('y'),-10);
    });
    test('baseClip width', function() {
      assert.equal(rect.attr('width'),200);
    });
    test('baseClip height', function() {
      assert.equal(rect.attr('height'),100);
    });
  }); //suite
} //runTests
