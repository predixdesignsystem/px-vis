document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {
  suite('px-vis-area-svg does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-area-svg works', function() {
    var baseScale,
        baseSVG,
        baseArea;

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var areaPath;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseArea = document.getElementById('baseArea');
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
          "type":"area",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": colorSet[0]
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        stack = Px.d3.stack();

        stack.keys(["y"]);

        var stackData = stack(d);

      var rendered = function() {
        areaPath =  baseArea.areaGroup.select('path.series-area');
        baseArea.removeEventListener('px-vis-area-svg-rendering-ended', rendered);
        done();
      };

      baseArea.addEventListener('px-vis-area-svg-rendering-ended', rendered);

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('completeSeriesConfig',completeSeriesConfig);
      baseScale.set('chartExtents',chartExtents);
      baseScale.set('dataExtents',chartExtents);
      baseScale.set('chartData',d);

      baseArea.set('seriesId',"mySeries");
      baseArea.set('completeSeriesConfig',completeSeriesConfig);
      baseArea.set('chartData',stackData);
    });

    test('baseArea fixture is created', function() {
      assert.isTrue(baseArea !== null);
    });

    test('baseArea areaPath created', function() {
      assert.equal(areaPath.node().tagName,'path');
    });

    test('baseArea area series ID', function() {
      assert.equal(areaPath.attr('series-id'),'area_mySeries');
    });

    test('baseArea area series has the right color', function() {
      assert.equal(areaPath.attr('fill').split(' ').join(''),colorSet[0]);
    });

    test('baseArea area d', function() {
      assert.equal(areaPath.attr('d').split(/[\s,]+/).join(''),'M0243L120108L2400L360162L480108L480270L360270L240270L120270L0270Z');
    });
  }); //suite

  suite('px-vis-area-svg with two series works', function() {
    var multiScale,
        multiSVG,
        multiArea

    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var areaPath1,areaPath2,areaPath3;

    suiteSetup(function(done){
      multiScale = document.getElementById('multiScale');
      multiSVG = document.getElementById('multiSVG');
      multiArea = document.getElementById('multiArea');
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            "y1": 5
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            "y1": 8
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            "y1": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            "y1": 5
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 25,
            "y1": 1
          }
        ],
        completeSeriesConfig = {
          "mySeries":{
            "type":"area",
            "name":"mySeries",
            "x":"x",
            "y":"y",
            "color": colorSet[0]
          },
          "mySeries2":{
            "type":"area",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": colorSet[1]
          },
          "mySeries3":{
            "type":"area",
            "name":"mySeries3",
            "x":"x",
            "y":"y1",
            "color": colorSet[2]
          }
        },
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,30]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        stack = Px.d3.stack(),
        counter = 0;

      stack.keys(["y","y1","y2"]);
      var stackData = stack(d);


      var rendered = function() {
        counter++;

        if(counter === 1) {
          areaPath1 = multiArea.areaGroup.select('[series-id="area_mySeries"]');
          areaPath2 = multiArea.areaGroup.select('[series-id="area_mySeries2"]')
          areaPath3 = multiArea.areaGroup.select('[series-id="area_mySeries3"]');
          multiArea.removeEventListener('px-vis-area-svg-rendering-ended', rendered);
          done();
        }
      };

      multiArea.addEventListener('px-vis-area-svg-rendering-ended', rendered);

      multiSVG.set('width',w);
      multiSVG.set('height',h);
      multiSVG.set('margin',m);

      multiScale.set('width',w);
      multiScale.set('height',h);
      multiScale.set('margin',m);
      multiScale.set('completeSeriesConfig',completeSeriesConfig);
      multiScale.set('chartExtents',chartExtents);
      multiScale.set('dataExtents',chartExtents);
      multiScale.set('chartData',d);

      multiArea.set('completeSeriesConfig',completeSeriesConfig);
      multiArea.set('seriesId',"mySeries");
      multiArea.set('chartData',stackData);
    });

    test('multiArea fixture is created', function() {
      assert.isTrue(multiArea !== null);
    });

    test('multiArea areaPath created', function() {
      assert.equal(areaPath1.node().tagName,'path');
    });
    test('multiArea area series has the right color', function() {
      assert.equal(areaPath1.attr('fill').split(' ').join(''),colorSet[0]);
    });
    test('multiArea area d', function() {
      assert.equal(areaPath1.attr('d').split(/[\s,]+/).join(''),'M0261L120216L240180L360234L480216L480270L360270L240270L120270L0270Z');
    });

    test('multiArea2 areaPath created', function() {
      assert.equal(areaPath2.node().tagName,'path');
    });
    test('multiArea2 area series has the right color', function() {
      assert.equal(areaPath2.attr('fill').split(' ').join(''),colorSet[1]);
    });
    test('multiArea2 area d', function() {
      assert.equal(areaPath2.attr('d').split(/[\s,]+/).join(''),'M0207L120-45L240126L36099L480-18L480207L360189L240153L120144L0216Z');
    });

    test('multiArea3 areaPath created', function() {
      assert.equal(areaPath3.node().tagName,'path');
    });
    test('multiArea3 area series has the right color', function() {
      assert.equal(areaPath3.attr('fill').split(' ').join(''),colorSet[2]);
    });
    test('multiArea3 area d', function() {
      assert.equal(areaPath3.attr('d').split(/[\s,]+/).join(''),"M0216L120144L240153L360189L480207L480216L360234L240180L120216L0261Z"
);
    });
  }); //suite

} //runTests
