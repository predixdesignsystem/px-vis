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
    var emptyAxisType = document.getElementById('empty');

    test('emptyAxisType fixture is created', function() {
      assert.isTrue(emptyAxisType !== null);
    });

    test('emptyAxisType does not set x property', function() {
      assert.isUndefined(emptyAxisType.x);
    });
    test('emptyAxisType does not set y property', function() {
      assert.isUndefined(emptyAxisType.y);
    });

    test('emptyAxisType does sets default xAxisType property', function() {
      assert.equal(emptyAxisType.xAxisType, 'linear');
    });
    test('emptyAxisType sets default yAxisType property', function() {
      assert.equal(emptyAxisType.yAxisType, 'linear');
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
      assert.isUndefined(missingHeight.currentDomainX);
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
      assert.isUndefined(missingData.currentDomainX);
    });
    test('missingData does not set currentDomainY', function() {
      assert.isUndefined(missingData.currentDomainY);
    });
  });

  suite('px-vis-scale runs with basic declarative bindings', function() {
    var decTLScale = document.getElementById('decTLScale');

    test('decTLScale fixture is created', function() {
      assert.isTrue(decTLScale !== null);
    });

    test('decTLScale sets x-scale', function() {
      assert.equal(decTLScale.xAxisType, 'time');
    });

    test('decTLScale sets y-scale', function() {
      assert.equal(decTLScale.yAxisType, 'linear');
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
      assert.equal( Number(decTLScale.currentDomainX[0]), 1397102460000);
      assert.equal( Number(decTLScale.currentDomainX[1]), 1397219100000);
    });
    test('decTLScale currentDomainY is correct', function() {
      assert.equal( JSON.stringify(decTLScale.currentDomainY), JSON.stringify([0,10]));
    });

    test('decTLScale x returns correct value 1397102460000', function() {
      assert.equal( decTLScale.x(1397102460000), 0);
    });

    test('decTLScale x returns correct value 1397291280000', function() {
      assert.equal( decTLScale.x(1397219100000), 480);
    });

    test('decTLScale x returns correct value 1397160780000', function() {
      assert.equal( decTLScale.x(1397160780000), 240);
    });

    test('decTLScale y returns correct value 0', function() {
      assert.equal( decTLScale.y(0), 270);
    });

    test('decTLScale y returns correct value 10', function() {
      assert.equal( decTLScale.y(10), 0);
    });

    test('decTLScale y returns correct value 5', function() {
      assert.equal( decTLScale.y(5), 135);
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

    test('eventsScale fires x event', function() {
      assert.isDefined(eventX);
    });
    test('eventX eventObj has a data var', function() {
      assert.equal(eventX.data(1397219100000), 480);
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
      assert.equal(eventY.data(5), 135);
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
      assert.equal( Number(eventCDX.data[0]), 1397102460000);
      assert.equal( Number(eventCDX.data[1]), 1397219100000);
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
      assert.equal( JSON.stringify(eventCDY.data), JSON.stringify([0,10]));
    });
    test('eventCDY eventObj has a dataVar var', function() {
      assert.equal(eventCDY.dataVar , 'currentDomainY');
    });
    test('eventCDY eventObj has a method var', function() {
      assert.equal(eventCDY.method , 'set');
    });
  }); //suite


  suite('px-vis-scale calcs extents', function() {
    var findExtents = document.getElementById('findExtents');

    suiteSetup(function(){
      var ext = {
        "x":[Infinity,-Infinity], "y": [0,-Infinity]
        }
      findExtents.set('chartExtents',ext);
    });

    test('findExtents fixture is created', function() {
      assert.isTrue(findExtents !== null);
    });

    test('findExtents creates an x', function() {
      assert.isDefined(findExtents.x);
    });

    test('findExtents creates an y', function() {
      assert.isDefined(findExtents.y);
    });

    test('findExtents sets currentDomainX', function() {
      assert.lengthOf(findExtents.currentDomainX,2);
    });
    test('findExtents sets currentDomainY', function() {
      assert.lengthOf(findExtents.currentDomainY,2);
    });

    test('findExtents currentDomainX is correct', function() {
      assert.equal( Number(findExtents.currentDomainX[0]), 1397102460000);
      assert.equal( Number(findExtents.currentDomainX[1]), 1397219100000);
    });
    test('findExtents currentDomainY is correct', function() {
      assert.equal( JSON.stringify(findExtents.currentDomainY), JSON.stringify([0,10]));
    });

    test('findExtents x returns correct value 1397102460000', function() {
      assert.equal( findExtents.x(1397102460000), 0);
    });

    test('findExtents x returns correct value 1397219100000', function() {
      assert.equal( findExtents.x(1397219100000), 480);
    });

    test('findExtents x returns correct value 1397160780000', function() {
      assert.equal( findExtents.x(1397160780000), 240);
    });

    test('findExtents y returns correct value 0', function() {
      assert.equal( findExtents.y(0), 270);
    });

    test('findExtents y returns correct value 10', function() {
      assert.equal( findExtents.y(10), 0);
    });

    test('findExtents y returns correct value 5', function() {
      assert.equal( findExtents.y(5), 135);
    });
  }); //suite


  suite('px-vis-scale updates data', function() {
    var updateData = document.getElementById('updateData');

    suiteSetup(function(){
      var d = {
        "x":1397219900000, "y": 15
      },
      ext = {
        "x":[Infinity,-Infinity], "y": [0,-Infinity]
        }
      updateData.push('chartData',d);
      updateData.set('chartExtents',ext);
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
      assert.equal( Number(updateData.currentDomainX[0]), 1397102460000);
      assert.equal( Number(updateData.currentDomainX[1]), 1397219900000);
    });
    test('updateData currentDomainY is correct', function() {
      assert.equal( JSON.stringify(updateData.currentDomainY), JSON.stringify([0,15]));
    });

    test('updateData x returns correct value 1397102460000', function() {
      assert.equal( updateData.x(1397102460000), 0);
    });

    test('updateData x returns correct value 1397219900000', function() {
      assert.equal( updateData.x(1397219900000), 480);
    });

    test('updateData x returns correct value 1397196870000', function() {
      var n = (1397219900000 - 1397102460000)/2 + 1397102460000
      assert.equal( updateData.x(n), 240);
    });

    test('updateData y returns correct value 0', function() {
      assert.equal( updateData.y(0), 270);
    });

    test('updateData y returns correct value 15', function() {
      assert.equal( updateData.y(15), 0);
    });

    test('updateData y returns correct value 7.5', function() {
      assert.equal( updateData.y(7.5), 135);
    });
  }); //suite

  suite('px-vis-scale updates with additional series', function() {
    var updateData = document.getElementById('updateData');

    suiteSetup(function(){
      // updateData.chartData[0].series.push([1397351280000, 1.5])
      var d = [
          {
            "x": 1397102460000,
            "y": 1,
            "y1": 5
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 1
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 11
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 20
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 16
          }
        ],
        ext = {
          "x":[Infinity,-Infinity], "y": [0,-Infinity]
        },
        c = {
          "mySeries":{"type":"line","name":"mySeries","x":"x","y":"y"},
          "mySeries2":{"type":"line","name":"mySeries2","x":"x","y":"y1"},
        }
        updateData.set('completeSeriesConfig',c);
        updateData.set('chartData',d);
        updateData.set('chartExtents',ext);
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
      assert.equal( +updateData.currentDomainX[1], 1397219100000);
    });
    test('updateData currentDomainY is correct', function() {
      assert.equal( JSON.stringify(updateData.currentDomainY), JSON.stringify([0,20]));
    });

    test('updateData x returns correct value 1397102460000', function() {
      assert.equal( updateData.x(1397102460000), 0);
    });

    test('updateData x returns correct value 1397219100000', function() {
      assert.equal( updateData.x(1397219100000), 480);
    });
    test('updateData x returns correct value 1397226370000', function() {
      var n = (1397219100000 - 1397102460000)/2 + 1397102460000;
      assert.equal( updateData.x(n), 240);
    });

    test('updateData y returns correct value 0', function() {
      assert.equal( updateData.y(0), 270);
    });

    test('updateData y returns correct value 2', function() {
      assert.equal( updateData.y(20), 0);
    });

    test('updateData y returns correct value 1', function() {
      assert.equal( updateData.y(10), 135);
    });
  }); //suite


  suite('px-vis-scale calcs x extents', function() {
    var findXExtents = document.getElementById('findXExtents');

    suiteSetup(function(){
      var ext = {
        "x":[Infinity,-Infinity], "y": [0,100]
        }
      findXExtents.set('chartExtents',ext);
    });

    test('findXExtents fixture is created', function() {
      assert.isTrue(findXExtents !== null);
    });

    test('findXExtents creates an x', function() {
      assert.isDefined(findXExtents.x);
    });

    test('findXExtents creates an y', function() {
      assert.isDefined(findXExtents.y);
    });

    test('findXExtents sets currentDomainX', function() {
      assert.lengthOf(findXExtents.currentDomainX,2);
    });
    test('findXExtents sets currentDomainY', function() {
      assert.lengthOf(findXExtents.currentDomainY,2);
    });

    test('findXExtents currentDomainX is correct', function() {
      assert.equal( Number(findXExtents.currentDomainX[0]), 1397102460000);
      assert.equal( Number(findXExtents.currentDomainX[1]), 1397219100000);
    });
    test('findXExtents currentDomainY is correct', function() {
      assert.equal( JSON.stringify(findXExtents.currentDomainY), JSON.stringify([0,100]));
    });

    test('findXExtents x returns correct value 1397102460000', function() {
      assert.equal( findXExtents.x(1397102460000), 0);
    });

    test('findXExtents x returns correct value 1397219100000', function() {
      assert.equal( findXExtents.x(1397219100000), 480);
    });

    test('findXExtents x returns correct value 1397160780000', function() {
      assert.equal( findXExtents.x(1397160780000), 240);
    });

    test('findXExtents y returns correct value 0', function() {
      assert.equal( findXExtents.y(0), 270);
    });

    test('findXExtents y returns correct value 10', function() {
      assert.equal( findXExtents.y(100), 0);
    });

    test('findXExtents y returns correct value 5', function() {
      assert.equal( findXExtents.y(50), 135);
    });
  }); //suite

  suite('px-vis-scale calcs y extents', function() {
    var findYExtents = document.getElementById('findYExtents');

    suiteSetup(function(){
      var ext = {
        "x":[1397100000000,1397300000000], "y": [Infinity,-Infinity]
        }
      findYExtents.set('chartExtents',ext);
    });

    test('findYExtents fixture is created', function() {
      assert.isTrue(findYExtents !== null);
    });

    test('findYExtents creates an x', function() {
      assert.isDefined(findYExtents.x);
    });

    test('findYExtents creates an y', function() {
      assert.isDefined(findYExtents.y);
    });

    test('findYExtents sets currentDomainX', function() {
      assert.lengthOf(findYExtents.currentDomainX,2);
    });
    test('findYExtents sets currentDomainY', function() {
      assert.lengthOf(findYExtents.currentDomainY,2);
    });

    test('findYExtents currentDomainX is correct', function() {
      assert.equal( Number(findYExtents.currentDomainX[0]), 1397100000000);
      assert.equal( Number(findYExtents.currentDomainX[1]), 1397300000000);
    });
    test('findYExtents currentDomainY is correct', function() {
      assert.equal( JSON.stringify(findYExtents.currentDomainY), JSON.stringify([1,10]));
    });

    test('findYExtents x returns correct value 1397100000000', function() {
      assert.equal( findYExtents.x(1397100000000), 0);
    });

    test('findYExtents x returns correct value 1397300000000', function() {
      assert.equal( findYExtents.x(1397300000000), 480);
    });

    test('findYExtents x returns correct value 1397160780000', function() {
      var n = (1397300000000 - 1397100000000)/2 + 1397100000000;
      assert.equal( findYExtents.x(n), 240);
    });

    test('findYExtents y returns correct value 0', function() {
      assert.equal( findYExtents.y(1), 270);
    });

    test('findYExtents y returns correct value 10', function() {
      assert.equal( findYExtents.y(10), 0);
    });

    test('findYExtents y returns correct value 5', function() {
      assert.equal( findYExtents.y(5.5), 135);
    });
  }); //suite

  suite('px-vis-scale calcs linear x ext ', function() {
    var findLinearX = document.getElementById('findLinearX');

    suiteSetup(function(){
      var ext = {
        "x":[Infinity,-Infinity], "y": [Infinity,-Infinity]
        }
      findLinearX.set('chartExtents',ext);
    });

    test('findLinearX fixture is created', function() {
      assert.isTrue(findLinearX !== null);
    });

    test('findLinearX creates an x', function() {
      assert.isDefined(findLinearX.x);
    });

    test('findLinearX sets currentDomainX', function() {
      assert.lengthOf(findLinearX.currentDomainX,2);
    });
    test('findLinearX sets currentDomainY', function() {
      assert.lengthOf(findLinearX.currentDomainY,2);
    });

    test('findLinearX currentDomainX is correct', function() {
      JSON.stringify(findLinearX.currentDomainX), JSON.stringify([1,10])
    });

    test('findLinearX x returns correct value 1397100000000', function() {
      assert.equal( findLinearX.x(1), 0);
    });

    test('findLinearX x returns correct value 1397300000000', function() {
      assert.equal( findLinearX.x(11), 480);
    });

    test('findLinearX x returns correct value 1397160780000', function() {
      assert.equal( findLinearX.x(6), 240);
    });
  }); //suite

  suite('px-vis-scale calcs x ordinal extents', function() {
    var findOrdinalX = document.getElementById('findOrdinalX');

    suiteSetup(function(){
      var ext = {
        "x":[], "y": [Infinity,-Infinity]
        }
      findOrdinalX.set('chartExtents',ext);
    });

    test('findOrdinalX fixture is created', function() {
      assert.isTrue(findOrdinalX !== null);
    });

    test('findOrdinalX creates an x', function() {
      assert.isDefined(findOrdinalX.x);
    });

    test('findOrdinalX creates an y', function() {
      assert.isDefined(findOrdinalX.y);
    });

    test('findOrdinalX sets currentDomainX', function() {
      assert.lengthOf(findOrdinalX.currentDomainX,3);
    });
    test('findOrdinalX sets currentDomainY', function() {
      assert.lengthOf(findOrdinalX.currentDomainY,2);
    });

    test('findOrdinalX currentDomainX is correct', function() {
      assert.equal( findOrdinalX.currentDomainX[0], 'a');
      assert.equal( findOrdinalX.currentDomainX[1], 'c');
      assert.equal( findOrdinalX.currentDomainX[2], 'b');
    });
    test('findOrdinalX currentDomainY is correct', function() {
      assert.equal( JSON.stringify(findOrdinalX.currentDomainY), JSON.stringify([1,10]));
    });

    test('findOrdinalX x returns correct value a', function() {
      assert.equal( findOrdinalX.x("a"), 80);
    });

    test('findOrdinalX x returns correct value c', function() {
      assert.equal( findOrdinalX.x("c"), 240);
    });

    test('findOrdinalX x returns correct value b', function() {
      assert.equal( findOrdinalX.x("b"), 400);
    });

    test('findOrdinalX y returns correct value 0', function() {
      assert.equal( findOrdinalX.y(1), 270);
    });

    test('findOrdinalX y returns correct value 10', function() {
      assert.equal( findOrdinalX.y(10), 0);
    });

    test('findOrdinalX y returns correct value 5', function() {
      assert.equal( findOrdinalX.y(5.5), 135);
    });
  }); //suite

  suite('px-vis-scale sets x ordinal extents', function() {
    var setOrdinalX = document.getElementById('setOrdinalX');

    suiteSetup(function(){
      var ext = {
        "x":["a","b","c","d"], "y": [0,10]
        }
      setOrdinalX.set('chartExtents',ext);
    });

    test('setOrdinalX fixture is created', function() {
      assert.isTrue(setOrdinalX !== null);
    });

    test('setOrdinalX creates an x', function() {
      assert.isDefined(setOrdinalX.x);
    });

    test('setOrdinalX sets currentDomainX', function() {
      assert.lengthOf(setOrdinalX.currentDomainX,4);
    });

    test('setOrdinalX currentDomainX is correct', function() {
      assert.equal( setOrdinalX.currentDomainX[0], 'a');
      assert.equal( setOrdinalX.currentDomainX[1], 'b');
      assert.equal( setOrdinalX.currentDomainX[2], 'c');
      assert.equal( setOrdinalX.currentDomainX[3], 'd');
    });

    test('setOrdinalX x returns correct value a', function() {
      assert.equal( setOrdinalX.x("a"), 60);
    });

    test('setOrdinalX x returns correct value c', function() {
      assert.equal( setOrdinalX.x("b"), 180);
    });

    test('setOrdinalX x returns correct value b', function() {
      assert.equal( setOrdinalX.x("c"), 300);
    });

    test('setOrdinalX x returns correct value b', function() {
      assert.equal( setOrdinalX.x("d"), 420);
    });
  }); //suite

} //runTests
