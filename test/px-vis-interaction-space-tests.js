document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-interaction-space does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-interaction-space basic setup works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseIS = document.getElementById('baseIS');
    var eventObj,ttObj;

    suiteSetup(function(done){
      var d = [{
        "series": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ],
        "name":"mySeries"
        }],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };
      document.addEventListener('px-vis-interaction-svg-updated',function(evt){
        eventObj = evt.detail;
      });
      document.addEventListener('px-vis-tooltip-updated',function(evt){
        ttObj = evt.detail;
      });

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('chartData',d);

      baseIS.set('margin',m);
      baseIS.set('width',w);
      baseIS.set('height',h);
      baseIS.set('chartData',d);

      // setTimeout(function(){done()},5000);
      done();
    });

    test('baseIS fixture is created', function() {
      assert.isTrue(baseIS !== null);
    });
    test('event fired', function() {
      assert.isTrue(eventObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(eventObj.dataVar, 'interactionSvg');
    });
    test('event method', function() {
      assert.equal(eventObj.method, 'set');
    });
    test('event data', function() {
      assert.equal(eventObj.data.node().tagName, 'g');
    });

    test('event fired', function() {
      assert.isTrue(ttObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(ttObj.dataVar, 'tooltipData');
    });
    test('event method', function() {
      assert.equal(ttObj.method, 'set');
    });
    test('event data time', function() {
      assert.equal(ttObj.data.time, null);
    });
    test('event data mousePos', function() {
      assert.equal(ttObj.data.mouse, null);
    });
    // maybe should be using 2 series data?
    test('event data xArr', function() {
      assert.equal(ttObj.data.xArr, null);
    });
    test('event data yArr', function() {
      assert.equal(ttObj.data.yArr, null);
    });
    test('event data series.name', function() {
      assert.equal(ttObj.data.series[0]['name'], 'mySeries');
    });
    test('event data series.value', function() {
      assert.equal(JSON.stringify(ttObj.data.series[0]['value']), 'null');
    });
    test('event data series.coord', function() {
      assert.equal(ttObj.data.series[0]['coord'], null);
    });

  });

  suite('px-vis-interaction-space baseIS works', function() {
    var baseIS = document.getElementById('baseIS');

    test('baseIS _rect is created', function() {
      assert.isTrue(baseIS._rect !== null);
    });

    test('baseIs _rect width', function() {
      assert.equal(baseIS._rect.attr('width'), 480);
    });
    test('baseIs _rect height', function() {
      assert.equal(baseIS._rect.attr('height'), 280);
    });
    test('baseIs _rect fill', function() {
      assert.equal(baseIS._rect.attr('fill'), 'none');
    });
  }); //suite

  // TODO Figure out how to make this work in Edge

  // suite('px-vis-interaction-space baseIS mouseover event', function() {
  //   var baseIS = document.getElementById('baseIS');
  //   var ttObj;
  //   suiteSetup(function(done){
  //     document.addEventListener('px-vis-tooltip-updated',function(evt){
  //       ttObj = evt.detail;
  //     });
  //
  //     var box = baseIS._rect.node().getBoundingClientRect();
  //
  //     var e = new MouseEvent('mousemove',{
  //       "clientX": box.left + box.width/2,
  //       "clientY": box.top + box.height/2,
  //       "pageX": box.left + box.width/2,
  //       "pageY": box.top + box.height/2,
  //     });
  //     baseIS._rect.node().dispatchEvent(e);
  //
  //     // give event time to process and fire
  //     setTimeout(function(){ done(); },10);
  //   });
  //
  //   test('event fired', function() {
  //     assert.isTrue(ttObj !== null);
  //   });
  //   test('event dataVar', function() {
  //     assert.equal(ttObj.dataVar, 'tooltipData');
  //   });
  //   test('event method', function() {
  //     assert.equal(ttObj.method, 'set');
  //   });
  //   test('event data time', function() {
  //     assert.equal(+ttObj.data.time, 1397163210000);
  //   });
  //   test('event data mousePos', function() {
  //     var arr = ttObj.data.mouse;
  //     // account for floating point rounding error
  //     assert.closeTo(arr[0], 250, 1);
  //     assert.closeTo(arr[1], 150, 1);
  //   });
  //   // maybe should be using 2 series data?
  //   test('event data xArr', function() {
  //     assert.equal(JSON.stringify(ttObj.data.xArr), '[240]');
  //   });
  //   test('event data yArr', function() {
  //     assert.equal(JSON.stringify(ttObj.data.yArr), '[0]');
  //   });
  //   test('event data series.name', function() {
  //     assert.equal(ttObj.data.series[0]['name'], 'mySeries');
  //   });
  //   test('event data series.value', function() {
  //     assert.equal(JSON.stringify(ttObj.data.series[0]['value']), '[1397160780000,10]');
  //   });
  //   test('event data series.coord', function() {
  //     assert.equal(JSON.stringify(ttObj.data.series[0]['coord']), '[240,0]');
  //   });
  // }); //suite

  suite('px-vis-interaction-space baseIS mouseoff event', function() {
    var baseIS = document.getElementById('baseIS');
    var ttObj;
    suiteSetup(function(done){
      document.addEventListener('px-vis-tooltip-updated',function(evt){
        ttObj = evt.detail;
      });

      var e = new MouseEvent('mouseout',{
        "clientX": 250,
        "clientY": 100
      });
      baseIS._rect.node().dispatchEvent(e);

      // give event time to process and fire
      setTimeout(function(){ done(); },10);
    });

    test('event fired', function() {
      assert.isTrue(ttObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(ttObj.dataVar, 'tooltipData');
    });
    test('event method', function() {
      assert.equal(ttObj.method, 'set');
    });
    test('event data time', function() {
      assert.equal(ttObj.data.time, null);
    });
    test('event data mousePos', function() {
      assert.equal(ttObj.data.mouse, null);
    });
    // maybe should be using 2 series data?
    test('event data xArr', function() {
      assert.equal(ttObj.data.xArr, null);
    });
    test('event data yArr', function() {
      assert.equal(ttObj.data.yArr, null);
    });
    test('event data series.name', function() {
      assert.equal(ttObj.data.series[0]['name'], 'mySeries');
    });
    test('event data series.value', function() {
      assert.equal(JSON.stringify(ttObj.data.series[0]['value']), 'null');
    });
    test('event data series.coord', function() {
      assert.equal(ttObj.data.series[0]['coord'], null);
    });
  }); //suite
} //runTests
