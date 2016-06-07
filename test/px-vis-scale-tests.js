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

  suite('px-vis-scale events fire', function() {
    var eventsScale = document.getElementById('eventsScale'),
        w = 500,
        h = 300;
    var eventX,eventY,eventCDX,eventCDY;

    suiteSetup(function(){
      document.addEventListener('px-vis-x-updated',function(evt){
        eventX = evt.detail;
      });
      document.addEventListener('px-vis-y-updated',function(evt){
        eventY = evt.detail;
      });
      document.addEventListener('px-vis-current-domain-x-updated',function(evt){
        eventCDX = evt.detail;
      });
      document.addEventListener('px-vis-current-domain-y-updated',function(evt){
        eventCDY = evt.detail;
      });
      eventsScale.set('width',w)
      eventsScale.set('height',h)
    });

    test('eventsScale fixture is created', function() {
      assert.isTrue(eventsScale !== null);
    });

    test('eventsScale sets width', function() {
      assert.equal(eventsScale.width, 500);
    });

    test('eventsScale sets height', function() {
      assert.equal(eventsScale.height, 300);
    });

    test('eventsScale creates an x', function() {
      assert.isDefined(eventsScale.x);
    });

    test('eventsScale creates an y', function() {
      assert.isDefined(eventsScale.y);
    });

    test('eventsScale sets currentDomainX', function() {
      assert.lengthOf(eventsScale.currentDomainX,2);
    });
    test('eventsScale sets currentDomainY', function() {
      assert.lengthOf(eventsScale.currentDomainY,2);
    });

    test('eventsScale fires x event', function() {
      assert.isDefined(eventX);
    });
    test('eventX eventObj has a data var', function() {
      assert.equal(eventX.data(1397291280000), 480);
    });
    test('eventX eventObj has a dataVar var', function() {
      assert.equal(eventX.dataVar , 'x');
    });
    test('eventX eventObj has a method var', function() {
      assert.equal(eventX.method , 'set');
    });

    test('eventsScale fires y event', function() {
      assert.isDefined(eventY);
    });
    test('eventY eventObj has a data var', function() {
      assert.equal(eventY.data(0.56), 135);
    });
    test('eventY eventObj has a dataVar var', function() {
      assert.equal(eventY.dataVar , 'y');
    });
    test('eventY eventObj has a method var', function() {
      assert.equal(eventY.method , 'set');
    });

    test('eventsScale fires current-domain-x event', function() {
      assert.isDefined(eventCDX);
    });
    test('eventCDX eventObj has a data var', function() {
      assert.equal( +eventCDX.data[0], 1397102460000);
      assert.equal( +eventCDX.data[1], 1397291280000);
    });
    test('eventCDX eventObj has a dataVar var', function() {
      assert.equal(eventCDX.dataVar , 'currentDomainX');
    });
    test('eventCDX eventObj has a method var', function() {
      assert.equal(eventCDX.method , 'set');
    });

    test('eventsScale fires current-domain-y event', function() {
      assert.isDefined(eventCDY);
    });
    test('eventCDY eventObj has a data var', function() {
      assert.equal( JSON.stringify(eventCDY.data), JSON.stringify([0,1.12]));
    });
    test('eventCDY eventObj has a dataVar var', function() {
      assert.equal(eventCDY.dataVar , 'currentDomainY');
    });
    test('eventCDY eventObj has a method var', function() {
      assert.equal(eventCDY.method , 'set');
    });
  }); //suite

  suite('px-vis-scale updates data', function() {
    var updateData = document.getElementById('updateData');

    suiteSetup(function(){
      // updateData.chartData[0].series.push([1397351280000, 1.5])
      var d = [{
        "series": [
        [1397102460000, 0.99],
        [1397139660000, 0.92],
        [1397177400000, 0.97],
        [1397228040000, 1.12],
        [1397248260000, 1.09],
        [1397291280000, 1],
        [1397351280000, 1.5]
        ]}]
      updateData.set('chartData',d);
    });

    test('updateData fixture is created', function() {
      assert.isTrue(updateData !== null);
    });

    test('updateData creates an x', function() {
      assert.isDefined(updateData.x);
    });

    test('updateData creates an y', function() {
      assert.isDefined(updateData.y);
    });

    test('updateData sets currentDomainX', function() {
      assert.lengthOf(updateData.currentDomainX,2);
    });
    test('updateData sets currentDomainY', function() {
      assert.lengthOf(updateData.currentDomainY,2);
    });

    test('updateData currentDomainX is correct', function() {
      assert.equal( +updateData.currentDomainX[0], 1397102460000);
      assert.equal( +updateData.currentDomainX[1], 1397351280000);
    });
    test('updateData currentDomainY is correct', function() {
      assert.equal( JSON.stringify(updateData.currentDomainY), JSON.stringify([0,1.5]));
    });

    test('updateData x returns correct value 1397102460000', function() {
      assert.equal( updateData.x(1397102460000), 0);
    });

    test('updateData x returns correct value 1397291280000', function() {
      assert.equal( updateData.x(1397351280000), 480);
    });

    test('updateData x returns correct value 1397196870000', function() {
      assert.equal( updateData.x(1397226870000), 240);
    });

    test('updateData y returns correct value 0', function() {
      assert.equal( updateData.y(0), 270);
    });

    test('updateData y returns correct value 1.12', function() {
      assert.equal( updateData.y(1.5), 0);
    });

    test('updateData y returns correct value 0.56', function() {
      assert.equal( updateData.y(0.75), 135);
    });
  }); //suite

  suite('px-vis-scale updates with additional series', function() {
    var updateData = document.getElementById('updateData');

    suiteSetup(function(){
      // updateData.chartData[0].series.push([1397351280000, 1.5])
      var d = [{
        "series": [
          [1397102460000, 0.99],
          [1397139660000, 0.92],
          [1397177400000, 0.97],
          [1397228040000, 1.12],
          [1397248260000, 1.09],
          [1397291280000, 1],
          [1397351280000, 1.5]
        ]},{
        "series": [
          [1397101460000, 1],
          [1397139660000, 1],
          [1397177400000, 1],
          [1397228040000, 1],
          [1397248260000, 2],
          [1397291280000, 2]
        ]}];
      updateData.set('chartData',d);
    });

    test('updateData fixture is created', function() {
      assert.isTrue(updateData !== null);
    });

    test('updateData creates an x', function() {
      assert.isDefined(updateData.x);
    });

    test('updateData creates an y', function() {
      assert.isDefined(updateData.y);
    });

    test('updateData sets currentDomainX', function() {
      assert.lengthOf(updateData.currentDomainX,2);
    });
    test('updateData sets currentDomainY', function() {
      assert.lengthOf(updateData.currentDomainY,2);
    });

    test('updateData currentDomainX is correct', function() {
      assert.equal( +updateData.currentDomainX[0], 1397101460000);
      assert.equal( +updateData.currentDomainX[1], 1397351280000);
    });
    test('updateData currentDomainY is correct', function() {
      assert.equal( JSON.stringify(updateData.currentDomainY), JSON.stringify([0,2]));
    });

    test('updateData x returns correct value 1397102460000', function() {
      assert.equal( updateData.x(1397101460000), 0);
    });

    test('updateData x returns correct value 1397351280000', function() {
      assert.equal( updateData.x(1397351280000), 480);
    });
    test('updateData x returns correct value 1397226370000', function() {
      assert.equal( updateData.x(1397226370000), 240);
    });

    test('updateData y returns correct value 0', function() {
      assert.equal( updateData.y(0), 270);
    });

    test('updateData y returns correct value 2', function() {
      assert.equal( updateData.y(2), 0);
    });

    test('updateData y returns correct value 1', function() {
      assert.equal( updateData.y(1), 135);
    });
  }); //suite


} //runTests
