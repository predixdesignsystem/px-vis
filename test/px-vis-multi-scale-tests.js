document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-sclae does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-multi-scale runs with basic declarative bindings', function() {
    var multiScale = document.getElementById('multiScale');

    suiteSetup(function(done) {
      window.setTimeout(function() { done(); }, 100);
    });

    test('multiScale fixture is created', function() {
      assert.isTrue(multiScale !== null);
    });


    test('multiScale creates an x', function() {
      assert.isDefined(multiScale.x);
    });

    test('multiScale creates an y', function() {
      assert.isDefined(multiScale.y);
    });

    test('multiScale x returns correct value "y"', function() {
      assert.equal( multiScale.x("y"), 130);
    });

    test('multiScale x returns correct value "y1"', function() {
      assert.equal( multiScale.x("y1"), 390);
    });

    test('multiScale x returns correct value "y2"', function() {
      assert.equal( multiScale.x("y2"), 650);
    });


    test('multiScale y returns correct value 0', function() {
      assert.equal( multiScale.y["y"](0), 470);
    });

    test('multiScale y returns correct value 10', function() {
      assert.equal( multiScale.y["y"](10), 0);
    });

    test('multiScale y returns correct value 5', function() {
      assert.equal( multiScale.y["y"](5), 235);
    });


    test('multiScale y1 returns correct value 0', function() {
      assert.equal( multiScale.y["y1"](11), 470);
    });

    test('multiScale y1 returns correct value 10', function() {
      assert.equal( multiScale.y["y1"](23), 0);
    });

    test('multiScale y1 returns correct value 5', function() {
      assert.equal( multiScale.y["y1"](17), 235);
    });


    test('multiScale y2 returns correct value 0', function() {
      assert.equal( multiScale.y["y2"](20), 470);
    });

    test('multiScale y2 returns correct value 10', function() {
      assert.equal( multiScale.y["y2"](32), 0);
    });

    test('multiScale y2 returns correct value 5', function() {
      assert.equal( multiScale.y["y2"](26), 235);
    });
  }); //suite


  suite('px-vis-multi-scale with empty dims', function() {
    var multiScale = document.getElementById('multiScale'),
        chartExtents = {"x":[],"y":{"y":[0,10],"y1":[11,23],"y2":[20,32] }},
        domainChanged;

    suiteSetup(function(done) {
      domainChanged = multiScale.domainChanged;
      multiScale.set('chartExtents',chartExtents);

      window.setTimeout(function() { done(); }, 500);
    });


    test('domainChanged is flipped', function() {
      assert.equal(multiScale.domainChanged, !domainChanged);
    });
  });


} //runTests
