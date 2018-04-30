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

function componentFromStr(numStr, percent) {
    var num = Math.max(0, parseInt(numStr, 10));
    return percent ?
        Math.floor(255 * Math.min(100, num) / 100) : Math.min(255, num);
}

function rgbToHex(rgb) {
    var rgbRegex = /^rgb\(\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*,\s*(-?\d+)(%?)\s*\)$/;
    var result, r, g, b, hex = "";
    if ( (result = rgbRegex.exec(rgb)) ) {
        r = componentFromStr(result[1], result[2]);
        g = componentFromStr(result[3], result[4]);
        b = componentFromStr(result[5], result[6]);

        hex = "#" + (0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    return hex;
}

function runTests(){
  suite('px-vis-axis-interaction-space does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-axis-interaction-space basic setup works', function() {
    var multiScale,
        multiSVG,
        brush1,
        brush2,
        brush3;

        //Polyfill for IE 11 codePointAt
    if (!String.prototype.codePointAt) {
        (function() {
          'use strict'; // needed to support `apply`/`call` with `undefined`/`null`
          var codePointAt = function(position) {
            if (this == null) {
              throw TypeError();
            }
            var string = String(this);
            var size = string.length;
            // `ToInteger`
            var index = position ? Number(position) : 0;
            if (index != index) { // better `isNaN`
              index = 0;
            }
            // Account for out-of-bounds indices:
            if (index < 0 || index >= size) {
              return undefined;
            }
            // Get the first code unit
            var first = string.charCodeAt(index);
            var second;
            if ( // check if it’s the start of a surrogate pair
              first >= 0xD800 && first <= 0xDBFF && // high surrogate
              size > index + 1 // there is a next code unit
            ) {
              second = string.charCodeAt(index + 1);
              if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
                // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
                return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
              }
            }
            return first;
          };
          if (Object.defineProperty) {
            Object.defineProperty(String.prototype, 'codePointAt', {
              'value': codePointAt,
              'configurable': true,
              'writable': true
            });
          } else {
            String.prototype.codePointAt = codePointAt;
          }
        }());
      }

    suiteSetup(function(done){
      multiScale = document.getElementById('multiScale');
      multiSVG = document.getElementById('multiSVG');
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y':[1,10], 'y1':[1,20], 'y2':[1,27]},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        },
        actionConfig = {
          'mouseout': 'null',
          'mousemove': 'null',
          'mousedown': 'callAxisMute',
          'mouseup': 'callAxisMute'
        };

        multiSVG.set('width',w);
        multiSVG.set('height',h);
        multiSVG.set('margin',m);

        multiScale.set('width',w);
        multiScale.set('height',h);
        multiScale.set('margin',m);
        multiScale.set('completeSeriesConfig',completeSeriesConfig);
        multiScale.set('dataExtents',ext);
        multiScale.set('chartData',d);
        multiScale.set('axes',dim);
        multiScale.set('dimensions',dim);
        multiScale.set('chartExtents',ext);

        var g = multiSVG.svg.selectAll('g.dimension')
            .data(dim);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "dimension" + i})
          .attr("dimension", function(d) { return d })
          .attr("transform", function(d,i) {
            return "translate(" + (50 * i) + ",0)";
          });

        brush1.set('orientation','left');
        brush1.set('actionConfig', actionConfig);
        brush1.set('margin',m);
        brush1.set('height',h);
        brush1.set('seriesKey',"x");
        brush1.set('dimension',dim[0]);
        brush1.set('chartData',d);
        brush1.set('iconType',"fa-eraser");

        brush2.set('orientation','left');
        brush2.set('actionConfig', actionConfig);
        brush2.set('margin',m);
        brush2.set('height',h);
        brush2.set('seriesKey',"x");
        brush2.set('dimension',dim[1]);
        brush2.set('chartData',d);

        brush3.set('orientation','left');
        brush3.set('actionConfig', actionConfig);
        brush3.set('margin',m);
        brush3.set('height',h);
        brush3.set('seriesKey',"x");
        brush3.set('dimension',dim[2]);
        brush3.set('chartData',d);

        brush1.set('y', multiScale.y['y']);
        brush2.set('y', multiScale.y['y1']);
        brush3.set('y', multiScale.y['y2']);

        brush1.set('svg', multiSVG.svg.select('g.dimension0'));
        brush2.set('svg', multiSVG.svg.select('g.dimension1'));
        brush3.set('svg', multiSVG.svg.select('g.dimension2'));

        async.until(
          ()=> {
            return !!brush1._brushD3;
          },
          (callback)=> {
            setTimeout(callback, 50);
          },
          ()=> {

            done();
          }
        );

    });

    test('brush fixture is created', function() {
      assert.isTrue(brush1 !== null);
      assert.isTrue(brush2 !== null);
      assert.isTrue(brush3 !== null);
    });

    test('brush._brushD3 are created', function() {

      assert.equal(brush1._brushD3.nodes().length, 1);
      assert.equal(brush2._brushD3.nodes().length, 1);
      assert.equal(brush3._brushD3.nodes().length, 1);
    });
    test('brush._brushD3 is not selected', function() {
      assert.equal(Px.d3.brushSelection(brush1._brushElem), null);
      assert.equal(Px.d3.brushSelection(brush2._brushElem), null);
      assert.equal(Px.d3.brushSelection(brush3._brushElem), null);
    });

    test('brush mutedSeries is correct', function() {
      assert.deepEqual(brush1.mutedSeries, {});
      assert.deepEqual(brush2.mutedSeries, {});
      assert.deepEqual(brush3.mutedSeries, {});
    });

    test('icon applied', function() {
      assert.equal(brush1._icon.node().tagName, 'g');
    });
  });

  suite('px-vis-axis-interaction-space brush resizes to the inputed domain', function() {
    var brush1,
        brush2,
        brush3;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;
    var d, bd;

    suiteSetup(function(done) {
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      d = [16,9];
      bd = {
        muted: {
          y1: d
        }
      };

      brush2.set('brushDomains',bd);

      window.setTimeout(function(){ done() }, 300);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0], 101, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1], 277, 2);
    });
    test('brush2._brushGroup.rect attr x', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('x'), -10);
    });
    test('brush2._brushGroup.rect attr width', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('width'), 20);
    });
    test('brush2._brushGroup.rect attr y', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('y')), 101, 2);
    });
    test('brush2._brushGroup.rect attr height', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('height')), 176, 2);
    });
    test('brush2._brushGroup.rect correct fill', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('fill').split(' ').join(''), rgbToHex(colors["grey7"]));
      assert.equal(brush2._brushD3.select('rect.selection').attr('fill-opacity'), '0.3');
    });
    test('brush2._brushGroup.rect correct stroke', function() {
      assert.equal(brush2._brushD3.select('rect.selection').attr('stroke').split(' ').join(''), rgbToHex(colors["primary-default"]));
      assert.equal(brush2._brushD3.select('rect.selection').attr('stroke-dasharray'), null);
    });
  });

  suite('px-vis-axis-interaction-space min size', function() {
    var brush1,
        brush2,
        brush3;
    var d1, d2, bd;

    suiteSetup(function(done) {
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      bd = brush2.brushDomains;
      d1 = [1.01,1];
      d2 = [27,26.9];
      bd.muted['y'] = d1;
      bd.muted['y2'] = d2;

      brush1.set('brushDomains',bd);
      brush2.set('brushDomains',bd);
      brush3.set('brushDomains',bd);

      window.setTimeout(function(){ done(); }, 1000);

    });
    test('brush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[0], 475, 2);
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[1], 480, 2);
    });
    test('brush1._brush rect attr x', function() {
      assert.equal(Px.d3.select(brush1._brushElem).select('rect.selection').attr('x'), -10);
    });
    test('brush1._brush rect attr width', function() {
      assert.equal(Px.d3.select(brush1._brushElem).select('rect.selection').attr('width'), 20);
    });
    test('brush1._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('y')), 475, 2);
    });
    test('brush1._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('height')), 5,2 );
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 5, 2);
    });
    test('brush3._brush rect attr x', function() {
      assert.equal(Px.d3.select(brush3._brushElem).select('rect.selection').attr('x'), -10);
    });
    test('brush3._brush rect attr width', function() {
      assert.equal(Px.d3.select(brush3._brushElem).select('rect.selection').attr('width'), 20);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('height')), 5, 2);
    });
  });

  suite('px-vis-axis-interaction-space resize', function() {
    var brush1,
        brush2,
        brush3;
    var d1, d2, bd;

    suiteSetup(function(done) {
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      d1 = [5,1];
      d2 = [27,15];

      brush1.set('brushDomains.muted.y',d1);
      brush3.set('brushDomains.muted.y2',d2);

      window.setTimeout(function(){done()}, 500);
    });
    test('brush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[0],266, 2);
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[1], 480, 2);
    });
    test('brush1._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('y')), 266, 2);
    });
    test('brush1._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush1._brushElem).select('rect.selection').attr('height')), 214, 2);
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 221, 2);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(Px.d3.select(brush3._brushElem).select('rect.selection').attr('height')), 221, 2);
    });
  });

  suite('px-vis-axis-interaction-space domain change', function() {
    var multiScale;
    var brush1,
        brush2,
        brush3;

    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[3,10], 'y1':[6,18], 'y2':[1,18]};

    suiteSetup(function(done) {
      multiScale = document.getElementById('multiScale');
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      multiScale.set('chartExtents', ext);

      async.until(
        ()=> {
          return Px.d3.brushSelection(brush1._brushElem)[0] > 340 && Px.d3.brushSelection(brush1._brushElem)[0] < 344;
        },
        (callback)=> {
          setTimeout(callback, 1000);
        },
        ()=> {
          done();
        }
      );
    });

    test('brush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[0], 342, 2);
      assert.closeTo(Px.d3.brushSelection(brush1._brushElem)[1], 480, 2);
    });
    test('brush1._brush rect attr y', function() {
      assert.closeTo(Number(brush1._brushD3.select('rect.selection').attr('y')), 342 ,2);
    });
    test('brush1._brush rect attr height', function() {
      assert.closeTo(Number(brush1._brushD3.select('rect.selection').attr('height')), 138, 2);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0], 80, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1], 359, 2);
    });
    test('brush2._brush rect attr y1', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('y')), 80, 2);
    });
    test('brush2._brush rect attr height', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('height')), 279, 2);
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 84, 2);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('height')), 84, 2);
    });
  });

  suite('px-vis-axis-interaction-space domain change so brush falls outside', function() {
    var multiScale;
    var brush1,
        brush2,
        brush3;
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[6,10], 'y1':[6,18], 'y2':[1,18]};

    suiteSetup(function(done) {
      multiScale = document.getElementById('multiScale');
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      multiScale.set('chartExtents',ext);

      async.until(
        ()=> {
          return Px.d3.brushSelection(brush1._brushElem) === null;
        },
        (callback)=> {
          setTimeout(callback, 1000);
        },
        ()=> {
          done();
        }
      );

    });

    test('brush1._brush extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(brush1._brushElem), null);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0],80, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1],359, 2);
    });
    test('brush2._brush rect attr y1', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('y')), 80, 2);
    });
    test('brush2._brush rect attr height', function() {
      assert.closeTo(Number(brush2._brushD3.select('rect.selection').attr('height')), 279, 2);
    });

    test('brush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[0], 0, 2);
      assert.closeTo(Px.d3.brushSelection(brush3._brushElem)[1], 84, 2);
    });
    test('brush3._brush rect attr y', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('y')), 0, 2);
    });
    test('brush3._brush rect attr height', function() {
      assert.closeTo(Number(brush3._brushD3.select('rect.selection').attr('height')), 84, 2);
    });
  });

  suite('px-vis-axis-interaction-space delete works', function() {
    var brush1,
        brush2,
        brush3;

    suiteSetup(function(done) {
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      brush1.deleteAndClearBrush();
      brush2.deleteAndClearBrush();
      brush3.deleteAndClearBrush();

      async.until(
        ()=> {
          return Px.d3.brushSelection(brush1._brushElem) === null;
        },
        (callback)=> {
          setTimeout(callback, 1000);
        },
        ()=> {
          done();
        }
      )
    });

    test('brush1._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(brush1._brushElem), null);
    });

    test('brush2._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(brush2._brushElem),null);
    });

    test('brush3._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(brush3._brushElem),null);
    });
  });

  suite('px-vis-axis-interaction-space draw still works after delete', function() {
    var brush1,
        brush2,
        brush3;

    suiteSetup(function(done) {
      brush1 = document.getElementById('brush1');
      brush2 = document.getElementById('brush2');
      brush3 = document.getElementById('brush3');
      brush2.set('brushDomains', {muted:{y1: [16, 9]}});

      window.setTimeout(function(){ done() }, 300);
    });

    test('brush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[0], 80, 2);
      assert.closeTo(Px.d3.brushSelection(brush2._brushElem)[1], 359, 2);
    });
  });


  suite('px-vis-axis-interaction-space radial setup works', function() {
    var radialScale,
        radialSVG,
        radialBrush1,
        radialBrush2,
        radialBrush3;

    suiteSetup(function(done) {
      radialScale = document.getElementById('radialScale');
      radialSVG = document.getElementById('radialSVG');
      radialBrush1 = document.getElementById('radialBrush1');
      radialBrush2 = document.getElementById('radialBrush2');
      radialBrush3 = document.getElementById('radialBrush3');
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 300,
        h = 300,
        min = 300/2,
        ext = { 'x': dim, 'y':[1,27] },
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        },
        actionConfig = {
          'mouseout': 'null',
          'mousemove': 'null',
          'mousedown': 'callAxisMute',
          'mouseup': 'callAxisMute'
        };

      radialSVG.set('width',w);
      radialSVG.set('height',h);
      radialSVG.set('offset',[140,140]);
      radialSVG.set('margin',m);

      radialScale.set('_radius',min);
      radialScale.set('centerOffset',20);
      radialScale.set('margin',m);
      radialScale.set('dimensions',dim);
      radialScale.set('completeSeriesConfig',completeSeriesConfig);
      radialScale.set('chartData',d);
      radialScale.set('chartExtents',ext);

      window.setTimeout(function() {
        var g = radialSVG.svg.selectAll('g.dimension')
            .data(dim);
        g.enter()
          .append("g")
          .attr("class", function(d,i) { return "dimension" + i })
          .attr("dimension", function(d) { return d })
          .attr("transform", function(d) {
            return "rotate(" + (radialScale.x(d) * 180 / Math.PI + 180) + ")";
          });

        radialBrush1.set('actionConfig',actionConfig);
        radialBrush1.set('margin',m);
        radialBrush1.set('height',h/2);
        radialBrush1.set('centerOffset',20);
        radialBrush1.set('seriesKey',"x");
        radialBrush1.set('dimension',dim[0]);
        radialBrush1.set('chartData',d);

        radialBrush2.set('actionConfig',actionConfig);
        radialBrush2.set('margin',m);
        radialBrush2.set('height',h/2);
        radialBrush2.set('centerOffset',20);
        radialBrush2.set('seriesKey',"x");
        radialBrush2.set('dimension',dim[1]);
        radialBrush2.set('chartData',d);

        radialBrush3.set('actionConfig',actionConfig);
        radialBrush3.set('margin',m);
        radialBrush3.set('height',h/2);
        radialBrush3.set('centerOffset',20);
        radialBrush3.set('seriesKey',"x");
        radialBrush3.set('dimension',dim[2]);
        radialBrush3.set('chartData',d);

        radialBrush1.set('svg', radialSVG.svg.select('g.dimension0'));
        radialBrush2.set('svg', radialSVG.svg.select('g.dimension1'));
        radialBrush3.set('svg', radialSVG.svg.select('g.dimension2'));

        window.setTimeout(function() { done(); }, 500);
      }, 100);
    });

    test('radialBrush fixture is created', function() {
      assert.isTrue(radialBrush1 !== null);
      assert.isTrue(radialBrush2 !== null);
      assert.isTrue(radialBrush3 !== null);
    });

    test('radialBrush._brushes are created', function() {
      assert.equal(radialBrush1._brushD3.nodes().length, 1);
      assert.equal(radialBrush2._brushD3.nodes().length, 1);
      assert.equal(radialBrush3._brushD3.nodes().length, 1);
    });
    test('radialBrush._brushes is not selected', function() {

      assert.equal(Px.d3.brushSelection(radialBrush1._brushElem), null);
      assert.equal(Px.d3.brushSelection(radialBrush2._brushElem), null);
      assert.equal(Px.d3.brushSelection(radialBrush3._brushElem), null);
    });
  });

  suite('px-vis-axis-interaction-space brush resizes to the inputed domain', function() {
    var radialBrush1,
        radialBrush2,
        radialBrush3;
    var colors = PxColorsBehavior.baseColors.properties.colors.value;
    var d, bd;
    suiteSetup(function(done) {
      radialBrush1 = document.getElementById('radialBrush1');
      radialBrush2 = document.getElementById('radialBrush2');
      radialBrush3 = document.getElementById('radialBrush3');
      d = [16,9];
      bd = {
        muted: {
          y1: d
        }
      };

      radialBrush2.set('brushDomains',bd);
      window.setTimeout(function() { done() }, 300);
    });

    test('radialBrush._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0], 60, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1], 95, 2);
    });
    test('radialBrush._brushGroup.rect attr x', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('x'), -10);
    });
    test('radialBrush._brushGroup.rect attr width', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('width'), 20);
    });
    test('radialBrush._brushGroup.rect attr y', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('y'), 60);
    });
    test('radialBrush._brushGroup.rect attr height', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('height'), 35);
    });
    test('radialBrush._brushGroup.rect correct fill', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('fill').split(' ').join(''), rgbToHex(colors['grey7']));
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('fill-opacity'), '0.3');
    });
    test('radialBrush._brushGroup.rect correct stroke', function() {
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('stroke').split(' ').join(''), rgbToHex(colors["primary-default"]));
      assert.equal(radialBrush2._brushD3.select('rect.selection').attr('stroke-dasharray').split(' ').join(''), "5,5");
    });
  });

  suite('px-vis-axis-interaction-space resize', function() {
    var radialBrush1,
        radialBrush2,
        radialBrush3;
    var d1, d2, bd;

    suiteSetup(function(done) {
      radialBrush1 = document.getElementById('radialBrush1');
      radialBrush2 = document.getElementById('radialBrush2');
      radialBrush3 = document.getElementById('radialBrush3');
      bd = radialBrush2.brushDomains;
      bd.muted['y'] = [5,1];
      bd.muted['y2'] = [27,15];

      radialBrush1.set('brushDomains', bd);
      radialBrush3.set('brushDomains', bd);

      window.setTimeout(function(){ done() }, 100);
    });
    test('radialBrush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[0], 20, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[1], 40, 2);
    });
    test('radialBrush1._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('y')), 20, 2);
    });
    test('radialBrush1._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('height')), 20, 2);
    });

    test('radialBrush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[0], 90, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[1], 150, 2);
    });
    test('radialBrush3._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('y')), 90, 2);
    });
    test('radialBrush3._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('height')), 60, 2);
    });
  });

  suite('px-vis-axis-interaction-space domain change', function() {
    var radialScale;
    var radialBrush1,
        radialBrush2,
        radialBrush3;
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[3,18]};

    suiteSetup(function(done) {
      radialScale = document.getElementById('radialScale');
      radialBrush1 = document.getElementById('radialBrush1');
      radialBrush2 = document.getElementById('radialBrush2');
      radialBrush3 = document.getElementById('radialBrush3');
      radialScale.set('chartExtents',ext);

      async.until(
        ()=> {
          return Px.d3.brushSelection(radialBrush2._brushElem)[0] > 70 && Px.d3.brushSelection(radialBrush2._brushElem)[0] < 74;
        },
        (callback)=> {
          setTimeout(callback, 1000);
        },
        ()=> {
          done();
        }
      );
    });

    test('radialBrush1._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[0], 20, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush1._brushElem)[1], 37, 2);
    });
    test('radialBrush1._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('y')), 20, 2);
    });
    test('radialBrush1._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush1._brushD3.select('rect.selection').attr('height')), 17, 2);
    });

    test('radialBrush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0],72, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1],133,2);
    });
    test('radialBrush2._brush rect attr y1', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('y')), 72, 2);
    });
    test('radialBrush2._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('height')), 61, 2);
    });

    test('radialBrush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[0], 124, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[1], 150, 2);
    });
    test('radialBrush3._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('y')), 124, 2);
    });
    test('radialBrush3._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('height')), 26, 1);
    });
  });

  suite('px-vis-axis-interaction-space domain change so brush falls outside', function() {
    var radialScale;
    var radialBrush1,
        radialBrush2,
        radialBrush3;
    var dim = ['y','y1','y2'];
    var ext = {'x': dim, 'y':[7,18]};

    suiteSetup(function(done) {
      radialScale = document.getElementById('radialScale');
      radialBrush1 = document.getElementById('radialBrush1');
      radialBrush2 = document.getElementById('radialBrush2');
      radialBrush3 = document.getElementById('radialBrush3');
      radialScale.set('chartExtents',ext);

      async.until(
        ()=> {
          return Px.d3.brushSelection(radialBrush1._brushElem) === null;
        },
        (callback)=> {
          setTimeout(callback, 1000);
        },
        ()=> {
          done();
        }
      );

    });

    test('radialBrush1._brush extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush1._brushElem), null);
    });

    test('radialBrush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0],44, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1],126, 2);
    });
    test('radialBrush2._brush rect attr y1', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('y')), 44, 2);
    });
    test('radialBrush2._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush2._brushD3.select('rect.selection').attr('height')), 83, 2);
    });

    test('radialBrush3._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[0],115, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush3._brushElem)[1],150, 2);
    });
    test('radialBrush3._brush rect attr y', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('y')), 115, 2);
    });
    test('radialBrush3._brush rect attr height', function() {
      assert.closeTo(Number(radialBrush3._brushD3.select('rect.selection').attr('height')), 35, 2);
    });
  });

  suite('px-vis-axis-interaction-space delete works', function() {
    var radialBrush1,
        radialBrush2,
        radialBrush3;

    suiteSetup(function(done) {
      radialBrush1 = document.getElementById('radialBrush1');
      radialBrush2 = document.getElementById('radialBrush2');
      radialBrush3 = document.getElementById('radialBrush3');
      radialBrush1.deleteAndClearBrush();
      radialBrush2.deleteAndClearBrush();
      radialBrush3.deleteAndClearBrush();

      async.until(
        ()=> {
          return Px.d3.brushSelection(radialBrush1._brushElem) === null;
        },
        (callback)=> {
          setTimeout(callback, 1000);
        },
        ()=> {
          done();
        }
      );
    });

    test('radialBrush1._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush1._brushElem), null);
    });

    test('radialBrush2._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush2._brushElem),null);
    });

    test('radialBrush3._brush brush deleted', function() {
      assert.deepEqual(Px.d3.brushSelection(radialBrush3._brushElem),null);
    });
  });

  suite('px-vis-axis-interaction-space draw still works after delete', function() {
    var radialBrush1,
        radialBrush2,
        radialBrush3;

    suiteSetup(function(done) {
      radialBrush1 = document.getElementById('radialBrush1');
      radialBrush2 = document.getElementById('radialBrush2');
      radialBrush3 = document.getElementById('radialBrush3');
      var d = [16,9];
      var bd = {
        muted: {
          y1: d
        }
      };

      radialBrush2.set('brushDomains',bd);

      window.setTimeout(function(){ done() }, 300);
    });

    test('radialBrush2._brush extents match', function() {
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[0], 44, 2);
      assert.closeTo(Px.d3.brushSelection(radialBrush2._brushElem)[1], 126, 2);
    });
  });

} //runTests
