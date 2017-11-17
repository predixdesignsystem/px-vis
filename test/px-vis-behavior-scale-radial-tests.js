document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-behavior-chart does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('radial scale is created', function() {
    var radialScale;
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
      radialScale = document.getElementById('scale');
      radialScale.set('_radius', radius);
      radialScale.set('centerOffset', centerOffset);
      radialScale.set('chartData', chartData);
      radialScale.set('_amplitudeKey', axes);

      var finish = function() {
        radialScale.removeEventListener('domain-changed-changed', finish)
        done();
      };

      // fake observers
      radialScale.addEventListener('_calculated-extents-changed', function() {
        radialScale._setDomain();
      });
      radialScale.addEventListener('domain-changed-changed', finish);

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

    test('radialScale sets y range', function() {
      assert.deepEqual(radialScale.y.range(),[50,500]);
    });

    test('radialScale sets y domain', function() {
      assert.deepEqual(radialScale.y.domain(),[0,32]);
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


  suite('radial scale works with amplitudeExtents', function() {
    var radialScale;
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
        amplitudeExtents = [10,25];

    suiteSetup(function(done) {
      radialScale = document.getElementById('scale');
      radialScale.set('_radius', radius);
      radialScale.set('centerOffset', centerOffset);
      radialScale.set('chartData', chartData);
      radialScale.set('_amplitudeKey', axes);
      radialScale.set('amplitudeExtents', amplitudeExtents);

      var finish = function() {
        radialScale.removeEventListener('domain-changed-changed', finish)
        done();
      };

      // fake observers
      radialScale.addEventListener('_calculated-extents-changed', function() {
        radialScale._setDomain();
      });
      radialScale.addEventListener('domain-changed-changed', finish);

      radialScale._setYScale(radius, centerOffset);
      radialScale._generateChartExtents();
    });


    test('radialScale creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('radialScale creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets y range', function() {
      assert.deepEqual(radialScale.y.range(),[50,500]);
    });

    test('radialScale sets y domain', function() {
      assert.deepEqual(radialScale.y.domain(),[10,25]);
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

  suite('radial scale with null data', function() {
    var radialScale;
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
      radialScale = document.getElementById('scale');
      radialScale.set('_radius', radius);
      radialScale.set('centerOffset', centerOffset);
      radialScale.set('chartData', chartData);
      radialScale.set('_amplitudeKey', axes);
      radialScale.set('amplitudeExtents', null);

      var finish = function() {
        radialScale.removeEventListener('domain-changed-changed', finish)
        done();
      };

      // fake observers
      radialScale.addEventListener('_calculated-extents-changed', function() {
        radialScale._setDomain();
      });
      radialScale.addEventListener('domain-changed-changed', finish);

      radialScale._setYScale(radius, centerOffset);
      radialScale._generateChartExtents();
    });

    test('scale with null data creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('scale with null data creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets y range', function() {
      assert.deepEqual(radialScale.y.range(),[50,500]);
    });

    test('radialScale sets y domain', function() {
      assert.deepEqual(radialScale.y.domain(),[0, 32]);
    });
  }); //suite

  suite('radial scale with negative data resets to 0', function() {
    var radialScale;
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
              "y2": 30
            },{
              "x": 1397160780000,
              "y": 10,
              "y1": -10,
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
      radialScale = document.getElementById('scale');
      radialScale.set('_radius', radius);
      radialScale.set('centerOffset', centerOffset);
      radialScale.set('chartData', chartData);
      radialScale.set('_amplitudeKey', axes);

      var finish = function() {
        radialScale.removeEventListener('domain-changed-changed', finish)
        done();
      };

      // fake observers
      radialScale.addEventListener('_calculated-extents-changed', function() {
        radialScale._setDomain();
      });
      radialScale.addEventListener('domain-changed-changed', finish);

      radialScale._setYScale(radius, centerOffset);
      radialScale._generateChartExtents();
    });

    test('scale with null data creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('scale with null data creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets y range', function() {
      assert.deepEqual(radialScale.y.range(),[50,500]);
    });

    test('radialScale sets y domain', function() {
      assert.deepEqual(radialScale.y.domain(),[0, 30]);
    });
  }); //suite

}
