document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-sclae does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-scale scale with no properties does nothing', function() {
    var emptyScale = document.getElementById('empty');

    test('emptyScale fixture is created', function() {
      assert.isTrue(emptyScale !== null);
    });

    test('emptyScale does not set x property', function() {
      assert.equal(typeof(emptyScale.x), 'undefined');
    });
    test('emptyScale does not set y property', function() {
      assert.equal(typeof(emptyScale.y), 'undefined');
    });

    test('emptyScale does sets default xscale property', function() {
      assert.equal(emptyScale.xScale, 'ordinal');
    });
    test('emptyScale sets default yscale property', function() {
      assert.equal(emptyScale.yScale, 'ordinal');
    });
  });

  suite('px-vis-scale missing height property does not create create y', function() {
    var missingHeight = document.getElementById('missingHeight');

    test('missingHeight fixture is created', function() {
      assert.isTrue(missingHeight !== null);
    });

    test('missingHeight creates an x', function() {
      assert.isDefined(missingHeight.x);
    });

    test('missingHeight does not create an y', function() {
      assert.isUndefined(missingHeight.y);
    });

    test('missingHeight does not set currentDomainX', function() {
      assert.lengthOf(missingHeight.currentDomainX,0);
    });
  });

  suite('px-vis-scale missing chartData property does not set domains', function() {
    var missingData = document.getElementById('missingData');

    test('missingData fixture is created', function() {
      assert.isTrue(missingData !== null);
    });

    test('missingData creates an x', function() {
      assert.isDefined(missingData.x);
    });

    test('missingData does creates an y', function() {
      assert.isDefined(missingData.y);
    });

    test('missingData does not set currentDomainX', function() {
      assert.lengthOf(missingData.currentDomainX,0);
    });
    test('missingData does not set currentDomainY', function() {
      assert.lengthOf(missingData.currentDomainY,0);
    });
  });

  suite('px-vis-scale runs with basic declarative bindings', function() {
    var decTLScale = document.getElementById('decTLScale');
    var chartSVG = decTLScale.querySelector('#chartSVG');

    test('decTLScale fixture is created', function() {
      assert.isTrue(decTLScale !== null);
    });

    test('decTLScale sets x-scale', function() {
      assert.equal(decTLScale.xScale, 'time');
    });

    test('decTLScale sets y-scale', function() {
      assert.equal(decTLScale.yScale, 'linear');
    });

    test('decTLScale creates an x', function() {
      assert.isDefined(decTLScale.x);
    });

    test('decTLScale creates an y', function() {
      assert.isDefined(decTLScale.y);
    });

    test('decTLScale sets currentDomainX', function() {
      assert.lengthOf(decTLScale.currentDomainX,2);
    });
    test('decTLScale sets currentDomainY', function() {
      assert.lengthOf(decTLScale.currentDomainY,2);
    });

    test('decTLScale currentDomainX is correct', function() {
      assert.equal( +decTLScale.currentDomainX[0], 1397102460000);
      assert.equal( +decTLScale.currentDomainX[1], 1397291280000);
    });
    test('decTLScale currentDomainY is correct', function() {
      assert.equal( JSON.stringify(decTLScale.currentDomainY), JSON.stringify([0,1.12]));
    });

    test('decTLScale x returns correct value 1397102460000', function() {
      assert.equal( decTLScale.x(1397102460000), 0);
    });

    test('decTLScale x returns correct value 1397291280000', function() {
      assert.equal( decTLScale.x(1397291280000), 480);
    });

    test('decTLScale x returns correct value 1397196870000', function() {
      assert.equal( decTLScale.x(1397196870000), 240);
    });

    test('decTLScale y returns correct value 0', function() {
      assert.equal( decTLScale.y(0), 270);
    });

    test('decTLScale y returns correct value 1.12', function() {
      assert.equal( decTLScale.y(1.12), 0);
    });

    test('decTLScale y returns correct value 0.56', function() {
      assert.equal( decTLScale.y(0.56), 135);
    });


  }); //suite

} //runTests
