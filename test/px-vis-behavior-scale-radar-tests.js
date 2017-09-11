document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-behavior-chart does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('radar scale is created', function() {
    var radialScale = document.getElementById('scale');
    var radius = 500,
        axes = ["y","y1","y2"],
        chartData = [
          {
            "x": 1397102460000,
            "y": 0,
            "y1": 23,
            "y2": 26
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 16,
            "y2": 32
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 11,
            "y2": 20
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 12,
            "y2": 22
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 19,
            "y2": 30
          }
        ],
        centerOffset = 50;

    suiteSetup(function(done) {
      radialScale.set('_radius', radius);
      radialScale.set('centerOffset', centerOffset);
      radialScale.set('chartData', chartData);
      radialScale.set('dimensions', axes);
      radialScale.set('commonAxis', false);

      var finish = function() {
        radialScale.removeEventListener('domain-changed-changed', finish)
        done();
      };

      // fake observers
      radialScale.addEventListener('_calculated-extents-changed', function() {
        radialScale._setDomain();
      });
      radialScale.addEventListener('domain-changed-changed', finish);

      radialScale._setXScale(radius);
      radialScale._setYScale(radius, centerOffset);
      radialScale._generateChartExtents();
    });


    test('radialScale fixture is created', function() {
      assert.isTrue(radialScale !== null);
    });

    test('radialScale creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('radialScale creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets x range', function() {
      assert.deepEqual(radialScale.x.range(),[0, 2*Math.PI]);
    });

    test('radialScale sets x domain', function() {
      assert.deepEqual(radialScale.x.domain(),axes);
    });

    test('radialScale sets y range', function() {
      assert.deepEqual(radialScale.y.range(),[50,500]);
    });

    test('radialScale sets y domain', function() {
      assert.deepEqual(radialScale.y.domain(),[0,32]);
    });

    test('radialScale x returns correct value "y"', function() {
      assert.equal( radialScale.x("y"), 0);
    });

    test('radialScale x returns correct value "y1"', function() {
      assert.equal( radialScale.x("y1"), 120 * Math.PI / 180);
    });

    test('radialScale x returns correct value "y2"', function() {
      assert.equal( radialScale.x("y2"), 240 * Math.PI / 180);
    });


    test('radialScale y returns correct value 0', function() {
      assert.equal( radialScale.y(0), 50);
    });

    test('radialScale y returns correct value 32', function() {
      assert.equal( radialScale.y(32), 500);
    });

    test('radialScale y returns correct value 16', function() {
      assert.equal( radialScale.y(16), 275);
    });

  }); //suite


  suite('radar scale works with chartExtents', function() {
    var radialScale = document.getElementById('scale');
    var radius = 500,
        axes = ["y","y1","y2"],
        chartData = [
          {
            "x": 1397102460000,
            "y": 0,
            "y1": 23,
            "y2": 26
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 16,
            "y2": 32
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 11,
            "y2": 20
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 12,
            "y2": 22
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 19,
            "y2": 30
          }
        ],
        centerOffset = 50,
        chartExtents = {"x":["y","y1","y2"],"y":[10,25] };

    suiteSetup(function(done) {
      radialScale.set('_radius', radius);
      radialScale.set('centerOffset', centerOffset);
      radialScale.set('chartData', chartData);
      radialScale.set('dimensions', axes);
      radialScale.set('commonAxis', false);
      radialScale.set('chartExtents', chartExtents);

      var finish = function() {
        radialScale.removeEventListener('domain-changed-changed', finish)
        done();
      };

      // fake observers
      radialScale.addEventListener('_calculated-extents-changed', function() {
        radialScale._setDomain();
      });
      radialScale.addEventListener('domain-changed-changed', finish);

      radialScale._setXScale(radius, true);
      radialScale._setYScale(radius, centerOffset, true);
      radialScale._generateChartExtents();
    });


    test('radialScale creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('radialScale creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets x range', function() {
      assert.deepEqual(radialScale.x.range(),[0, 2*Math.PI]);
    });

    test('radialScale sets x domain', function() {
      assert.deepEqual(radialScale.x.domain(),axes);
    });

    test('radialScale sets y range', function() {
      assert.deepEqual(radialScale.y.range(),[50,500]);
    });

    test('radialScale sets y domain', function() {
      assert.deepEqual(radialScale.y.domain(),[10,25]);
    });

    test('radialScale x returns correct value "y"', function() {
      assert.equal( radialScale.x("y"), 0);
    });

    test('radialScale x returns correct value "y1"', function() {
      assert.equal( radialScale.x("y1"), 120 * Math.PI / 180);
    });

    test('radialScale x returns correct value "y2"', function() {
      assert.equal( radialScale.x("y2"), 240 * Math.PI / 180);
    });

    test('radialScale y returns correct value 10', function() {
      assert.equal( radialScale.y(10), 50);
    });

    test('radialScale y returns correct value 25', function() {
      assert.equal( radialScale.y(25), 500);
    });

    test('radialScale y returns correct value 17.5', function() {
      assert.equal( radialScale.y(17.5), 275);
    });

  }); //suite

  suite('radar scale with null data', function() {
    var radialScale = document.getElementById('scale');
    var radius = 500,
        axes = ["y","y1","y2"],
        chartData = [
            {
              "x": 1397102460000,
              "y": 0,
              "y1": 23,
              "y2": 26
            },{
              "x": 1397131620000,
              "y": 6,
              "y2": 32
            },{
              "x": 1397160780000,
              "y": 10,
              "y1": null,
              "y2": 20
            },{
              "x": 1397189940000,
              "y": 4,
              "y1": 12,
              "y2": 22
            },{
              "x": 1397219100000,
              "y": 6,
              "y1": 19,
              "y2": 30
            }
          ],
        centerOffset = 50;

    suiteSetup(function(done) {
      radialScale.set('_radius', radius);
      radialScale.set('centerOffset', centerOffset);
      radialScale.set('chartData', chartData);
      radialScale.set('dimensions', axes);
      radialScale.set('commonAxis', false);
      radialScale.set('chartExtents', null);

      var finish = function() {
        radialScale.removeEventListener('domain-changed-changed', finish)
        done();
      };

      // fake observers
      radialScale.addEventListener('_calculated-extents-changed', function() {
        radialScale._setDomain();
      });
      radialScale.addEventListener('domain-changed-changed', finish);

      radialScale._setXScale(radius, true);
      radialScale._setYScale(radius, centerOffset, true);
      radialScale._generateChartExtents();
    });

    test('scale with null data creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('scale with null data creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets x range', function() {
      assert.deepEqual(radialScale.x.range(),[0, 2*Math.PI]);
    });

    test('radialScale sets x domain', function() {
      assert.deepEqual(radialScale.x.domain(),axes);
    });

    test('radialScale sets y range', function() {
      assert.deepEqual(radialScale.y.range(),[50,500]);
    });

    test('radialScale sets y domain', function() {
      assert.deepEqual(radialScale.y.domain(),[0, 32]);
    });

  }); //suite

}
