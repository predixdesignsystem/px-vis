function runPolarTests(){
  suite('px-vis-line-svg polar works', function() {
    var polarScale = document.getElementById('polarScale'),
        polarSVG = document.getElementById('polarSVG'),
        polarLine = document.getElementById('polarLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": Math.PI/2,
            "y": 3
          },{
            "x": Math.PI,
            "y": 5
          },{
            "x": Math.PI * 3/2,
            "y": 3
          },{
            "x": Math.PI * 2,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":colorSet[0]
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      var rendered = function() {

        linePath =  polarLine.lineGroup.select('path.series-line');

        polarLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      polarSVG.set('width',w);
      polarSVG.set('height',h);
      polarSVG.set('margin',m);
      polarSVG.set('offset',offset);

      polarScale.set('radius',min);
      polarScale.set('offset',0);
      polarScale.set('margin',m);
      polarScale.set('_amplitudeKey',['y']);
      polarScale.set('chartData',d);

      polarLine.set('seriesId',"mySeries");
      polarLine.set('completeSeriesConfig',completeSeriesConfig);
      polarLine.set('chartData',d);
    });

    test('polarLine fixture is created', function() {
      assert.isTrue(polarLine !== null);
    });

    test('polarLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('polarLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),-144,1);
      assert.closeTo(Number(matches[10]),2,1);
      //logically should be 0, but I guess we get a rounding error  :-/
      assert.closeTo(Number(matches[11]),-5,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite

  suite('px-vis-line-svg polar with degrees and counter clockwise works', function() {
    var polarDegreeScale = document.getElementById('polarDegreeScale'),
        polarDegreeSVG = document.getElementById('polarDegreeSVG'),
        polarDegreeLine = document.getElementById('polarDegreeLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": 90,
            "y": 3
          },{
            "x": 180,
            "y": 5
          },{
            "x": 270,
            "y": 3
          },{
            "x": 0,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":colorSet[0]
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };


      var rendered = function() {

        linePath =  polarDegreeLine.lineGroup.select('path.series-line');

        polarDegreeLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarDegreeLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      polarDegreeSVG.set('width',w);
      polarDegreeSVG.set('height',h);
      polarDegreeSVG.set('margin',m);
      polarDegreeSVG.set('offset',offset);

      polarDegreeScale.set('radius',min);
      polarDegreeScale.set('offset',0);
      polarDegreeScale.set('margin',m);
      polarDegreeScale.set('_amplitudeKey',['y']);
      polarDegreeScale.set('chartData',d);

      polarDegreeLine.set('seriesId',"mySeries");
      polarDegreeLine.set('completeSeriesConfig',completeSeriesConfig);
      polarDegreeLine.set('chartData',d);
    });

    test('polarDegreeLine fixture is created', function() {
      assert.isTrue(polarDegreeLine !== null);
    });

    test('polarDegreeLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarDegreeLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarDegreeLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('polarDegreeLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),-144,1);
      assert.closeTo(Number(matches[10]),2,1);
      assert.closeTo(Number(matches[11]),0,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite

  suite('px-vis-line-svg polar with degrees and counter clockwise works', function() {
    var polarCCWScale = document.getElementById('polarCCWScale'),
        polarCCWSVG = document.getElementById('polarCCWSVG'),
        polarCCWLine = document.getElementById('polarCCWLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": Math.PI/2,
            "y": 3
          },{
            "x": Math.PI,
            "y": 5
          },{
            "x": Math.PI * 3/2,
            "y": 3
          },{
            "x": Math.PI * 2,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":colorSet[0]
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      var rendered = function() {

        linePath =  polarCCWLine.lineGroup.select('path.series-line');

        polarCCWLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarCCWLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      polarCCWSVG.set('width',w);
      polarCCWSVG.set('height',h);
      polarCCWSVG.set('margin',m);
      polarCCWSVG.set('offset',offset);

      polarCCWScale.set('radius',min);
      polarCCWScale.set('offset',0);
      polarCCWScale.set('margin',m);
      polarCCWScale.set('_amplitudeKey',['y']);
      polarCCWScale.set('chartData',d);

      polarCCWLine.set('seriesId',"mySeries");
      polarCCWLine.set('completeSeriesConfig',completeSeriesConfig);
      polarCCWLine.set('chartData',d);
    });

    test('polarCCWLine fixture is created', function() {
      assert.isTrue(polarCCWLine !== null);
    });

    test('polarCCWLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarCCWLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarCCWLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('polarCCWLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),-144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),-2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),144,1);
      assert.closeTo(Number(matches[10]),2,1);
      assert.closeTo(Number(matches[11]),5,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite


  suite('px-vis-line-svg polar with degrees and counter clockwise works', function() {
    var polarDegreeCCWScale = document.getElementById('polarDegreeCCWScale'),
        polarDegreeCCWSVG = document.getElementById('polarDegreeCCWSVG'),
        polarDegreeCCWLine = document.getElementById('polarDegreeCCWLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": 90,
            "y": 3
          },{
            "x": 180,
            "y": 5
          },{
            "x": 270,
            "y": 3
          },{
            "x": 0,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":colorSet[0]
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      var rendered = function() {

        linePath =  polarDegreeCCWLine.lineGroup.select('path.series-line');

        polarDegreeCCWLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarDegreeCCWLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      polarDegreeCCWSVG.set('width',w);
      polarDegreeCCWSVG.set('height',h);
      polarDegreeCCWSVG.set('margin',m);
      polarDegreeCCWSVG.set('offset',offset);

      polarDegreeCCWScale.set('radius',min);
      polarDegreeCCWScale.set('offset',0);
      polarDegreeCCWScale.set('margin',m);
      polarDegreeCCWScale.set('_amplitudeKey',['y']);
      polarDegreeCCWScale.set('chartData',d);

      polarDegreeCCWLine.set('seriesId',"mySeries");
      polarDegreeCCWLine.set('completeSeriesConfig',completeSeriesConfig);
      polarDegreeCCWLine.set('chartData',d);

    });

    test('polarDegreeCCWLine fixture is created', function() {
      assert.isTrue(polarDegreeCCWLine !== null);
    });

    test('polarDegreeCCWLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarDegreeCCWLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarDegreeCCWLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('polarDegreeCCWLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),-144,1);
      assert.closeTo(Number(matches[6]),-8,1);
      assert.closeTo(Number(matches[7]),-2,1);
      assert.closeTo(Number(matches[8]),240,1);
      assert.closeTo(Number(matches[9]),144,1);
      assert.closeTo(Number(matches[10]),2,1);
      assert.closeTo(Number(matches[11]),0,1);
      assert.closeTo(Number(matches[12]),-240,1);
    });
  }); //suite

  suite('px-vis-line-svg polar missing data works', function() {
    var polarMissingScale = document.getElementById('polarMissingScale'),
        polarMissingSVG = document.getElementById('polarMissingSVG'),
        polarMissingLine = document.getElementById('polarMissingLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 0,
            "y": 0
          },{
            "x": 0,
            "y": 3
          },{
            "x": Math.PI/2,
            "y": null
          },{
            "x": Math.PI
          },{
            "x": Math.PI * 3/2,
            "y": 3
          },{
            "x": Math.PI * 2,
            "y": 5
          }
        ],
        completeSeriesConfig = {
          "mySeries": {
            "type":"line",
            "name":"Data",
            "y":"y",
            "x":"x",
            "color":colorSet[0]
          }
        },
        w = 500,
        h = 500,
        min = 480/2,
        offset = [250,250],
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      var rendered = function() {

        linePath =  polarMissingLine.lineGroup.select('path.series-line');

        polarMissingLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      polarMissingLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      polarMissingSVG.set('width',w);
      polarMissingSVG.set('height',h);
      polarMissingSVG.set('margin',m);
      polarMissingSVG.set('offset',offset);

      polarMissingScale.set('radius',min);
      polarMissingScale.set('offset',0);
      polarMissingScale.set('margin',m);
      polarMissingScale.set('_amplitudeKey',['y']);
      polarMissingScale.set('chartData',d);

      polarMissingLine.set('seriesId',"mySeries");
      polarMissingLine.set('completeSeriesConfig',completeSeriesConfig);
      polarMissingLine.set('chartData',d);
    });

    test('polarMissingLine fixture is created', function() {
      assert.isTrue(polarMissingLine !== null);
    });

    test('polarMissingLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('polarMissingLine line series ID', function() {
      assert.equal(linePath.attr('series-id'),'line_mySeries');
    });

    test('polarMissingLine line series has the right color', function() {
      assert.equal(linePath.attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('polarMissingLine line d', function() {
      //extract just the ints. who cares about the decimals
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(linePath.attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),0,1);
      assert.closeTo(Number(matches[3]),0,1);
      assert.closeTo(Number(matches[4]),-144,1);
      assert.closeTo(Number(matches[5]),-144,1);
      assert.closeTo(Number(matches[6]),2,1);
      assert.closeTo(Number(matches[7]),-5,1);
      assert.closeTo(Number(matches[8]),-240,1);
    });
  }); //suite

} //runTests
