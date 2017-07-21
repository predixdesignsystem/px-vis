document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-radial-scale does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-radial-scale runs with basic declarative bindings', function() {
    var radialScale = document.getElementById('radialScale');

    test('radialScale fixture is created', function() {
      assert.isTrue(radialScale !== null);
    });


    test('radialScale creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('radialScale creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets currentDomainX', function() {
      assert.lengthOf(radialScale.currentDomainX,3);
    });

    test('radialScale sets currentDomainY', function() {
      assert.lengthOf(radialScale.currentDomainY,2);
    });

    test('radialScale currentDomainX is correct', function() {
      assert.equal( radialScale.currentDomainX[0], "y");
      assert.equal( radialScale.currentDomainX[1], "y1");
      assert.equal( radialScale.currentDomainX[2], "y2");
    });

    test('radialScale currentDomainY is correct', function() {
      assert.equal( JSON.stringify(radialScale.y.domain()), JSON.stringify([0,32]));
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


  suite('px-vis-radial-scale with extents', function() {
    var radialScale = document.getElementById('radialScale'),
        chartExtents = {"x":["y","y1","y2"],"y":[10,25] };

    suiteSetup(function(done) {
      radialScale.set('chartExtents',chartExtents);
      window.setTimeout(function() { done(); }, 100);
    });

    test('radialScale creates an x', function() {
      assert.isDefined(radialScale.x);
    });

    test('radialScale creates an y', function() {
      assert.isDefined(radialScale.y);
    });

    test('radialScale sets currentDomainX', function() {
      assert.lengthOf(radialScale.currentDomainX,3);
    });

    test('radialScale sets currentDomainY', function() {
      assert.lengthOf(radialScale.currentDomainY,2);
    });

    test('radialScale currentDomainX is correct', function() {
      assert.equal( radialScale.currentDomainX[0], "y");
      assert.equal( radialScale.currentDomainX[1], "y1");
      assert.equal( radialScale.currentDomainX[2], "y2");
    });

    test('radialScale currentDomainY is correct', function() {
      assert.equal( JSON.stringify(radialScale.y.domain()), JSON.stringify([10,25]));
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

  suite('px-vis-radial-scale with bad data', function() {
    var radialBadDataScale = document.getElementById('radialBadDataScale');

    test('radialBadDataScale creates an x', function() {
      assert.isDefined(radialBadDataScale.x);
    });

    test('radialBadDataScale creates an y', function() {
      assert.isDefined(radialBadDataScale.y);
    });

    test('radialBadDataScale sets currentDomainX', function() {
      assert.lengthOf(radialBadDataScale.currentDomainX,3);
    });

    test('radialBadDataScale sets currentDomainY', function() {
      assert.lengthOf(radialBadDataScale.currentDomainY,2);
    });

    test('radialBadDataScale currentDomainX is correct', function() {
      assert.equal( radialBadDataScale.currentDomainX[0], "y");
      assert.equal( radialBadDataScale.currentDomainX[1], "y1");
      assert.equal( radialBadDataScale.currentDomainX[2], "y2");
    });

    test('radialBadDataScale currentDomainY is correct', function() {
      assert.equal( JSON.stringify(radialBadDataScale.y.domain()), JSON.stringify([0,32]));
    });

  }); //suite


} //runTests
