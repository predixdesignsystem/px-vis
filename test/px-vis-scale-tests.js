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
      assert.isUndefined(emptyAxisType.xAxisType);
    });
    test('emptyAxisType sets default yAxisType property', function() {
      assert.isUndefined(emptyAxisType.yAxisType);
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
  });

  suite('px-vis-scale runs with basic declarative bindings', function() {
    var decTLScale = document.getElementById('decTLScale');
    suiteSetup(function(done){
      setTimeout(function() {
        done();
      },500);
    })

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

    test('decTLScale x domain is correct', function() {
      assert.equal( Number(decTLScale.x.domain()[0]), 1397102460000);
      assert.equal( Number(decTLScale.x.domain()[1]), 1397219100000);
    });
    test('decTLScale y domain is correct', function() {
      assert.equal( JSON.stringify(decTLScale.y.domain()), JSON.stringify([0,10]));
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

  // suite('px-vis-scale events fire', function() {
  //   var eventsScale = document.getElementById('eventsScale'),
  //       w = 500,
  //       h = 300;
  //   var eventX,eventY,eventDC;
  //
  //   suiteSetup(function(done){
  //     document.addEventListener('px-vis-x-updated',function(evt){
  //       eventX = evt.detail;
  //     });
  //     document.addEventListener('px-vis-y-updated',function(evt){
  //       eventY = evt.detail;
  //     });
  //     document.addEventListener('px-vis-domain-changed-updated',function(evt){
  //       eventDC = evt.detail;
  //     });
  //     eventsScale.set('width',w);
  //     eventsScale.set('height',h);
  //
  //     setTimeout(function() {
  //       done();
  //     }, 100);
  //   });
  //
  //   test('eventsScale fixture is created', function() {
  //     assert.isTrue(eventsScale !== null);
  //   });
  //
  //   test('eventsScale fires x event', function() {
  //     assert.isDefined(eventX);
  //   });
  //   test('eventX eventObj has a data var', function() {
  //     assert.equal(eventX.data(1397219100000), 480);
  //   });
  //   test('eventX eventObj has a dataVar var', function() {
  //     assert.equal(eventX.dataVar , 'x');
  //   });
  //   test('eventX eventObj has a method var', function() {
  //     assert.equal(eventX.method , 'set');
  //   });
  //
  //   test('eventsScale fires y event', function() {
  //     assert.isDefined(eventY);
  //   });
  //   test('eventY eventObj has a data var', function() {
  //     assert.equal(eventY.data(5), 135);
  //   });
  //   test('eventY eventObj has a dataVar var', function() {
  //     assert.equal(eventY.dataVar , 'y');
  //   });
  //   test('eventY eventObj has a method var', function() {
  //     assert.equal(eventY.method , 'set');
  //   });
  //
  //   test('eventsScale fires domainChanged event', function() {
  //     assert.isDefined(eventDC);
  //   });
  //   test('eventDC eventObj has a data var', function() {
  //     assert.equal( eventDC.data, false);
  //   });
  //   test('eventDC eventObj has a dataVar var', function() {
  //     assert.equal(eventDC.dataVar , 'domainChanged');
  //   });
  //   test('eventDC eventObj has a method var', function() {
  //     assert.equal(eventDC.method , 'set');
  //   });
  // }); //suite


  suite('px-vis-scale calcs extents', function() {
    var findExtents = document.getElementById('findExtents');

    suiteSetup(function(done) {
      var ext = {
        "x":[Infinity,-Infinity], "y": [0,-Infinity]
        }
      findExtents.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
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

    test('findExtents x domain is correct', function() {
      assert.equal( Number(findExtents.x.domain()[0]), 1397102460000);
      assert.equal( Number(findExtents.x.domain()[1]), 1397219100000);
    });
    test('findExtents y domain is correct', function() {
      assert.equal( JSON.stringify(findExtents.y.domain()), JSON.stringify([0,10]));
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

    suiteSetup(function(done) {
      var d = {
        "x":1397219900000, "y": 15
      },
      ext = {
        "x":[Infinity,-Infinity], "y": [0,-Infinity]
        }
      updateData.push('chartData',d);
      updateData.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
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


    test('updateData x domain is correct', function() {
      assert.equal( Number(updateData.x.domain()[0]), 1397102460000);
      assert.equal( Number(updateData.x.domain()[1]), 1397219900000);
    });
    test('updateData y domain is correct', function() {
      assert.equal( JSON.stringify(updateData.y.domain()), JSON.stringify([0,15]));
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

    suiteSetup(function(done) {
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
        updateData.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
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

    test('updateData x domain is correct', function() {
      assert.equal( +updateData.x.domain()[0], 1397102460000);
      assert.equal( +updateData.x.domain()[1], 1397219100000);
    });
    test('updateData y domain is correct', function() {
      assert.equal( JSON.stringify(updateData.y.domain()), JSON.stringify([0,20]));
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

    suiteSetup(function(done) {
      var ext = {
        "x":[Infinity,-Infinity], "y": [0,100]
        }
      findXExtents.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
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

    test('findXExtents x domain is correct', function() {
      assert.equal( Number(findXExtents.x.domain()[0]), 1397102460000);
      assert.equal( Number(findXExtents.x.domain()[1]), 1397219100000);
    });
    test('findXExtents y domain is correct', function() {
      assert.equal( JSON.stringify(findXExtents.y.domain()), JSON.stringify([0,100]));
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

    suiteSetup(function(done) {
      var ext = {
        "x":[1397100000000,1397300000000], "y": [Infinity,-Infinity]
        }
      findYExtents.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
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


    test('findYExtents x domain is correct', function() {
      assert.equal( Number(findYExtents.x.domain()[0]), 1397100000000);
      assert.equal( Number(findYExtents.x.domain()[1]), 1397300000000);
    });
    test('findYExtents y domain is correct', function() {
      assert.equal( JSON.stringify(findYExtents.y.domain()), JSON.stringify([0,10]));
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
      assert.equal( findYExtents.y(0), 270);
    });

    test('findYExtents y returns correct value 10', function() {
      assert.equal( findYExtents.y(10), 0);
    });

    test('findYExtents y returns correct value 5', function() {
      assert.equal( findYExtents.y(5), 135);
    });
  }); //suite

  suite('px-vis-scale calcs linear x ext ', function() {
    var findLinearX = document.getElementById('findLinearX');

    suiteSetup(function(done) {
      var ext = {
        "x":[Infinity,-Infinity], "y": [Infinity,-Infinity]
        }
      findLinearX.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
    });

    test('findLinearX fixture is created', function() {
      assert.isTrue(findLinearX !== null);
    });

    test('findLinearX creates an x', function() {
      assert.isDefined(findLinearX.x);
    });


    test('findLinearX x domain is correct', function() {
      JSON.stringify(findLinearX.x.domain()), JSON.stringify([1,10])
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

    suiteSetup(function(done) {
      var ext = {
        "x":[], "y": [Infinity,-Infinity]
        }
      findOrdinalX.set('dataExtents',ext);
      setTimeout(function() {
        done();
      }, 100);
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

    test('findOrdinalX x domain is correct', function() {
      assert.equal( findOrdinalX.x.domain()[0], 'a');
      assert.equal( findOrdinalX.x.domain()[1], 'c');
      assert.equal( findOrdinalX.x.domain()[2], 'b');
    });
    test('findOrdinalX y domain is correct', function() {
      assert.equal( JSON.stringify(findOrdinalX.y.domain()), JSON.stringify([0,10]));
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
      assert.equal( findOrdinalX.y(0), 270);
    });

    test('findOrdinalX y returns correct value 10', function() {
      assert.equal( findOrdinalX.y(10), 0);
    });

    test('findOrdinalX y returns correct value 5', function() {
      assert.equal( findOrdinalX.y(5), 135);
    });
  }); //suite

  suite('px-vis-scale sets x ordinal extents', function() {
    var setOrdinalX = document.getElementById('setOrdinalX');

    suiteSetup(function(done) {
      var ext = {
        "x":["a","b","c","d"], "y": [0,10]
        }
      setOrdinalX.set('chartExtents',ext);
      setOrdinalX.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
    });

    test('setOrdinalX fixture is created', function() {
      assert.isTrue(setOrdinalX !== null);
    });

    test('setOrdinalX creates an x', function() {
      assert.isDefined(setOrdinalX.x);
    });

    test('setOrdinalX x domain is correct', function() {
      assert.equal( setOrdinalX.x.domain()[0], 'a');
      assert.equal( setOrdinalX.x.domain()[1], 'b');
      assert.equal( setOrdinalX.x.domain()[2], 'c');
      assert.equal( setOrdinalX.x.domain()[3], 'd');
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

  suite('px-vis-scale two series, different x for each series', function() {
    var diffXforY = document.getElementById('diffXforY');

    suiteSetup(function(done) {
      var ext = {
        "x":[1397100000000,1397300000000], "y": [Infinity,-Infinity]
        }
      diffXforY.set('dataExtents',ext);

      setTimeout(function() {
        done();
      }, 100);
    });

    test('diffXforY fixture is created', function() {
      assert.isTrue(diffXforY !== null);
    });

    test('diffXforY creates an x', function() {
      assert.isDefined(diffXforY.x);
    });

    test('diffXforY creates an y', function() {
      assert.isDefined(diffXforY.y);
    });


    test('diffXforY x domain is correct', function() {
      assert.equal( Number(diffXforY.x.domain()[0]), 1397100000000);
      assert.equal( Number(diffXforY.x.domain()[1]), 1397300000000);
    });
    test('diffXforY y domain is correct', function() {
      assert.equal( JSON.stringify(diffXforY.y.domain()), JSON.stringify([0,10]));
    });

    test('diffXforY x returns correct value 1397100000000', function() {
      assert.equal( diffXforY.x(1397100000000), 0);
    });

    test('diffXforY x returns correct value 1397300000000', function() {
      assert.equal( diffXforY.x(1397300000000), 480);
    });

    test('diffXforY x returns correct value 1397160780000', function() {
      var n = (1397300000000 - 1397100000000)/2 + 1397100000000;
      assert.equal( diffXforY.x(n), 240);
    });

    test('diffXforY y returns correct value 0', function() {
      assert.equal( diffXforY.y(0), 270);
    });

    test('diffXforY y returns correct value 10', function() {
      assert.equal( diffXforY.y(10), 0);
    });

    test('diffXforY y returns correct value 5', function() {
      assert.equal( diffXforY.y(5), 135);
    });
  }); //suite

  suite('px-vis-scale chartExtents trumps dataExtents', function() {
    var cExts = document.getElementById('cExts');

    suiteSetup(function(done) {
      var dext = {
        "x":[1397000000000,1397700000000], "y": [5,25]
      },
      cext = {
        "x":[1397100000000,1397300000000], "y": [1,21]
        }
      cExts.set('chartExtents',cext);
      cExts.set('dataExtents',dext);

      setTimeout(function() {
        done();
      }, 100);
    });

    test('cExts fixture is created', function() {
      assert.isTrue(cExts !== null);
    });

    test('cExts creates an x', function() {
      assert.isDefined(cExts.x);
    });

    test('cExts creates an y', function() {
      assert.isDefined(cExts.y);
    });

    test('cExts x domain is correct', function() {
      assert.equal( Number(cExts.x.domain()[0]), 1397100000000);
      assert.equal( Number(cExts.x.domain()[1]), 1397300000000);
    });
    test('cExts y domain is correct', function() {
      assert.equal( JSON.stringify(cExts.y.domain()), JSON.stringify([1,21]));
    });

    test('cExts x returns correct value 1397100000000', function() {
      assert.equal( cExts.x(1397100000000), 0);
    });

    test('cExts x returns correct value 1397300000000', function() {
      assert.equal( cExts.x(1397300000000), 480);
    });

    test('cExts x returns correct value 1397160780000', function() {
      var n = (1397300000000 - 1397100000000)/2 + 1397100000000;
      assert.equal( cExts.x(n), 240);
    });

    test('cExts y returns correct value 0', function() {
      assert.equal( cExts.y(1), 270);
    });

    test('cExts y returns correct value 10', function() {
      assert.equal( cExts.y(21), 0);
    });

    test('cExts y returns correct value 5', function() {
      assert.equal( cExts.y(11), 135);
    });
  }); //suite

} //runTests
