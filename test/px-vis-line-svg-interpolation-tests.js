function runInterpolationTests(){
  suite('px-vis-line-svg interpolationFunction', function() {
    var interpolationScale,
        interpolationSVG,
        interpolationLine1,
        interpolationLine2,
        interpolationLine3;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath1,linePath2,linePath3;

    suiteSetup(function(done) {
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "mySeries":{
            "type":"line",
            "name":"mySeries",
            "x":"x",
            "y":"y",
            "color": colorSet[0]
          },
          "mySeries2":{
            "type":"line",
            "name":"mySeries2",
            "x":"x",
            "y":"y2",
            "color": colorSet[1],
            "interpolationFunction": Px.d3.curveBasis
          }
        },
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,27]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        iFnc = Px.d3.curveStep,
        counter = 0;

      interpolationScale = document.getElementById('interpolationScale'),
      interpolationSVG = document.getElementById('interpolationSVG'),
      interpolationLine1 = document.getElementById('interpolationLine1'),
      interpolationLine2 = document.getElementById('interpolationLine2'),
      interpolationLine3 = document.getElementById('interpolationLine3');


      var rendered = function() {

        counter++;

        if(counter === 2) {
          linePath1 = interpolationLine1.lineGroup.select('path.series-line');
          linePath2 = interpolationLine2.lineGroup.select('path.series-line');

          interpolationLine1.removeEventListener('px-vis-line-svg-rendering-ended', rendered);
          interpolationLine2.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

          done();
        }
      };

      interpolationLine1.addEventListener('px-vis-line-svg-rendering-ended', rendered);
      interpolationLine2.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      interpolationSVG.set('width',w);
      interpolationSVG.set('height',h);
      interpolationSVG.set('margin',m);

      interpolationScale.set('width',w);
      interpolationScale.set('height',h);
      interpolationScale.set('margin',m);
      interpolationScale.set('completeSeriesConfig',completeSeriesConfig);
      interpolationScale.set('chartExtents',chartExtents);
      interpolationScale.set('dataExtents',chartExtents);
      interpolationScale.set('chartData',d);

      interpolationLine1.set('interpolationFunction', iFnc);
      interpolationLine1.set('completeSeriesConfig',completeSeriesConfig);
      interpolationLine1.set('seriesId',"mySeries");
      interpolationLine1.set('chartData',d);

      interpolationLine2.set('interpolationFunction', iFnc);
      interpolationLine2.set('completeSeriesConfig',completeSeriesConfig);
      interpolationLine2.set('seriesId',"mySeries2");
      interpolationLine2.set('chartData',d);
    });

    test('interpolationLine1 fixture is created', function() {
      assert.isTrue(interpolationLine1 !== null);
    });
    test('interpolationLine2 fixture is created', function() {
      assert.isTrue(interpolationLine2 !== null);
    });

    test('interpolationLine1 linePath created', function() {
      assert.equal(linePath1.node().tagName,'path');
    });
    test('interpolationLine1 line series ID is set', function() {
      assert.equal(linePath1.attr('series-id'),'line_mySeries');
    });
    test('interpolationLine1 line series has the right stroke opacity', function() {
      assert.equal(linePath1.attr('stroke-opacity'),1);
    });
    test('interpolationLine1 line series has the right color', function() {
      assert.equal(linePath1.attr('stroke').split(' ').join(''),colorSet[0]);
    });
    test('interpolationLine1 line d', function() {

      assert.equal(linePath1.attr('d').split(/[\s,]+/).join(''),'M0260L60260L60210L180210L180170L300170L300230L420230L420210L480210');
    });

    test('interpolationLine2 linePath created', function() {
      assert.equal(linePath2.node().tagName,'path');
    });
    test('interpolationLine2 line series ID is set', function() {
      assert.equal(linePath2.attr('series-id'),'line_mySeries2');
    });
    test('interpolationLine2 line series has the right stroke opacity', function() {
      assert.equal(linePath2.attr('stroke-opacity'),1);
    });
    test('interpolationLine2 line series has the right color', function() {
      assert.equal(linePath2.attr('stroke').split(' ').join(''),colorSet[1]);
    });
    test('interpolationLine2 line d', function() {
      var re =  new RegExp ([
        "M\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "L\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "C\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?",
        "L\\s?(\\d+\\.?\\d*)[\\s,]?(\\d+\\.?\\d*)\\s?"
      ].join(''));
      var m = re.exec(linePath2.attr('d'));
      assert.closeTo(Number(m[1]), 0, 2);
      assert.closeTo(Number(m[2]), 260, 2);
      assert.closeTo(Number(m[3]), 20, 2);
      assert.closeTo(Number(m[4]), 226, 2);
      assert.closeTo(Number(m[5]), 40, 2);
      assert.closeTo(Number(m[6]), 193, 2);
      assert.closeTo(Number(m[7]), 80, 2);
      assert.closeTo(Number(m[8]), 126, 2);
      assert.closeTo(Number(m[9]), 120, 2);
      assert.closeTo(Number(m[10]), 123, 2);
      assert.closeTo(Number(m[11]), 160, 2);
      assert.closeTo(Number(m[12]), 120, 2);
      assert.closeTo(Number(m[13]), 200, 2);
      assert.closeTo(Number(m[14]), 180, 2);
      assert.closeTo(Number(m[15]), 240, 2);
      assert.closeTo(Number(m[16]), 198, 2);
      assert.closeTo(Number(m[17]), 280, 2);
      assert.closeTo(Number(m[18]), 216, 2);
      assert.closeTo(Number(m[19]), 320, 2);
      assert.closeTo(Number(m[20]), 193, 2);
      assert.closeTo(Number(m[21]), 360, 2);
      assert.closeTo(Number(m[22]), 153, 2);
      assert.closeTo(Number(m[23]), 400, 2);
      assert.closeTo(Number(m[24]), 113, 2);
      assert.closeTo(Number(m[25]), 440, 2);
      assert.closeTo(Number(m[26]), 56, 2);
      assert.closeTo(Number(m[27]), 460, 2);
      assert.closeTo(Number(m[28]), 28, 2);
      assert.closeTo(Number(m[29]), 480, 2);
      assert.closeTo(Number(m[30]), 0, 2);
    });
  }); //suite
} //runTests
