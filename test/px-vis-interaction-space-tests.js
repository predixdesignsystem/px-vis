/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {
  suite('px-vis-interaction-space does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-interaction-space basic setup works', function() {
    var baseScale,
        baseSVG,
        baseIS;
    var eventObj,ttObj;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseIS = document.getElementById('baseIS');
      var d = [{
            "x": 1397102460000,
            "y": 1
          },{
            "x": 1397131620000,
            "y": 6
          },{
            "x": 1397160780000,
            "y": 10
          },{
            "x": 1397189940000,
            "y": 4
          },{
            "x": 1397219100000,
            "y": 6
          }
        ],
        completeSeriesConfig = {"mySeries":{
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        dataExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        },
        called = 0;

      var listener1 = function(evt){
        eventObj = evt.detail;
        called++;
        document.removeEventListener('px-vis-mouse-rect-updated', listener1);
        if(called === 2) {
          done();
        }
      };

      var listener2 = function(evt){
        ttObj = evt.detail;
        called++;
        document.removeEventListener('px-vis-tooltip-updated', listener2);
        if(called === 2) {
          done();
        }
      };

      document.addEventListener('px-vis-mouse-rect-updated', listener1);
      document.addEventListener('px-vis-tooltip-updated', listener2);

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('completeSeriesConfig',completeSeriesConfig);
      baseScale.set('dataExtents',dataExtents);
      baseScale.set('chartData',d);

      baseIS.set('margin',m);
      baseIS.set('width',w);
      baseIS.set('height',h);
      baseIS.set('completeSeriesConfig',completeSeriesConfig);
      baseIS.set('seriesKeys',['mySeries']);
      baseIS.set('chartData',d);
      baseIS.set('actionConfig', { 'mouseout': 'resetTooltip',
                'mousemove': 'calcTooltipData',
                'mousedown': 'startZooming',
                'mouseup': 'stopZooming'});
    });

    test('baseIS fixture is created', function() {
      assert.isTrue(baseIS !== null);
    });
    test('interaction-spcae event fired', function() {
      assert.isTrue(eventObj !== null);
    });
    test('interaction-spcae event dataVar', function() {
      assert.equal(eventObj.dataVar, 'mouseRect');
    });
    test('interaction-spcae event method', function() {
      assert.equal(eventObj.method, 'set');
    });
    test('interaction-spcae event data', function() {
      assert.equal(eventObj.data.tagName, 'rect');
    });

    test('tooltip event fired', function() {
      assert.isTrue(ttObj !== null);
    });
    test('tooltip event dataVar', function() {
      assert.equal(ttObj.dataVar, 'tooltipData');
    });
    test('tooltip event method', function() {
      assert.equal(ttObj.method, 'set');
    });
    test('tooltip event data time', function() {
      assert.equal(ttObj.data.time, null);
    });
    test('tooltip event data mousePos', function() {
      assert.equal(ttObj.data.mouse, null);
    });
    // maybe should be using 2 series data?
    test('tooltip event data xArr', function() {
      assert.equal(ttObj.data.xArr, null);
    });
    test('tooltip event data yArr', function() {
      assert.equal(ttObj.data.yArr, null);
    });
    test('tooltip event data series.name', function() {
      assert.equal(ttObj.data.series[0]['name'], 'mySeries');
    });
    test('tooltip event data series.value', function() {
      assert.equal(JSON.stringify(ttObj.data.series[0]['value']), 'null');
    });
    test('tooltip event data series.coord', function() {
      assert.equal(ttObj.data.series[0]['coord'], null);
    });

  });

  suite('px-vis-interaction-space baseIS works', function() {
    var baseIS;

    suiteSetup(function() {
      baseIS = document.getElementById('baseIS');
    });
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
  //
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
  //     window.setTimeout(function(){ done(); },10);
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
  //     assert.equal(Number(ttObj.data.time), 1397160780000);
  //   });
  //   test('event data mousePos', function() {
  //     var arr = ttObj.data.mouse;
  //     // account for floating point rounding error
  //     assert.closeTo(arr[0], 240, 1);
  //     assert.closeTo(arr[1], 140, 1);
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
  //     assert.equal(JSON.stringify(ttObj.data.series[0]['value']), '{"x":1397160780000,"y":10}');
  //   });
  //   test('event data series.coord', function() {
  //     assert.equal(JSON.stringify(ttObj.data.series[0]['coord']), '[240,0]');
  //   });
  // }); //suite

  suite('px-vis-interaction-space baseIS mouseoff event', function() {
    var baseIS;
    var ttObj;

    suiteSetup(function(done){
      baseIS = document.getElementById('baseIS');

      var listener = function(evt){
        ttObj = evt.detail;
        document.removeEventListener('px-vis-tooltip-updated', listener);
        done();
      };
      document.addEventListener('px-vis-tooltip-updated', listener);

      //can't use new MouseEvent cause IE
      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseout",true,true,window,0,0,0,250,100,false,false,false,false,0,null);

      baseIS._rect.node().dispatchEvent(e);
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


  suite('px-vis-interaction-space baseIS has no seriesKeys', function() {
    var baseIS;
    var ttObj;

    suiteSetup(function(done){
      baseIS = document.getElementById('baseIS');
      document.addEventListener('px-vis-tooltip-updated',function(evt){
        ttObj = evt.detail;
      });

      baseIS.set("seriesKeys", []);

      // give event time to process and fire
      window.setTimeout(function(){ done(); },10);
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
      assert.isUndefined(ttObj.data.series[0]);
    });
    test('event data series.value', function() {
      assert.isUndefined(ttObj.data.series[0]);
    });
    test('event data series.coord', function() {
      assert.isUndefined(ttObj.data.series[0]);
    });
  }); //suite

  suite('px-vis-interaction-space baseIS more seriesKeys', function() {
    var baseIS;
    var ttObj;

    suiteSetup(function(done){
      baseIS = document.getElementById('baseIS');
      document.addEventListener('px-vis-tooltip-updated',function(evt){
        ttObj = evt.detail;
      });

      var sc = JSON.parse(JSON.stringify(baseIS.completeSeriesConfig));
      sc["anotherSeries"] = {
        color:"rgb(93,165,218)",
        name:"mySeries",
        type:"line",
        x:"x",
        y:"y1"
      };
      baseIS.set("completeSeriesConfig", sc);
      baseIS.set("seriesKeys", ["mySeries", "anotherSeries"]);

      // give event time to process and fire
      window.setTimeout(function(){ done(); },10);
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
      assert.equal(ttObj.data.series[1]['name'], 'anotherSeries');
    });
    test('event data series.value', function() {
      assert.equal(JSON.stringify(ttObj.data.series[0]['value']), 'null');
      assert.equal(JSON.stringify(ttObj.data.series[1]['value']), 'null');
    });
    test('event data series.coord', function() {
      assert.equal(ttObj.data.series[0]['coord'], null);
      assert.equal(ttObj.data.series[1]['coord'], null);
    });
  }); //suite

  suite('px-vis-interaction-space defaultEmptyData', function() {
    var baseIS;
    var ttObj;

    suiteSetup(function(done){
      baseIS = document.getElementById('baseIS');
      document.addEventListener('px-vis-tooltip-updated',function(evt){
        ttObj = evt.detail;
      });

      var empty = {"time":1397160780000,"timeSeriesKey":null,"hidden":true,"series":[{"name":"mySeries","value":{"x":3,"y":4},"coord":[240,162]},{"name":"anotherSeries","value":{"x":3,"y":8},"coord":[240,54]}],"mouse":[240,162],"xArr":[],"yArr":[],"rawData":[],"timeStamps":[],"timeStampsTracker":{}};

      baseIS.set("defaultEmptyData", empty);
      baseIS._resetTooltipData();
      // give event time to process and fire
      window.setTimeout(function(){ done(); }, 500);
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
      assert.equal(ttObj.data.time, 1397160780000);
    });
    test('event data mousePos', function() {
      assert.deepEqual(ttObj.data.mouse, [240,162]);
    });
    // maybe should be using 2 series data?
    test('event data xArr', function() {
      assert.deepEqual(ttObj.data.xArr, []);
    });
    test('event data yArr', function() {
      assert.deepEqual(ttObj.data.yArr, []);
    });
    test('event data series.name', function() {
      assert.equal(ttObj.data.series[0]['name'], 'mySeries');
      assert.equal(ttObj.data.series[1]['name'], 'anotherSeries');
    });
    test('event data series.value', function() {
      assert.deepEqual(ttObj.data.series[0]['value'], {"x":3,"y":4});
      assert.deepEqual(ttObj.data.series[1]['value'], {"x":3,"y":8});
    });
    test('event data series.coord', function() {
      assert.deepEqual(ttObj.data.series[0]['coord'], [240,162]);
      assert.deepEqual(ttObj.data.series[1]['coord'], [240,54]);
    });
  }); //suite
} //runTests
