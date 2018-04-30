/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function runRadarTests(){
  suite('px-vis-line-svg renders radar to SVG', function() {
    var radarScale,
        radarSVG,
        radarLine;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": colorSet[0]
          }
        },
        dim = ['y','y1','y2'],
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

      radarScale = document.getElementById('radarScale'),
      radarSVG = document.getElementById('radarSVG'),
      radarLine = document.getElementById('radarLine');

      var rendered = function() {

        linePath = radarLine.lineGroup.selectAll('path.series-line');

        radarLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      radarLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      radarSVG.set('width',w);
      radarSVG.set('height',h);
      radarSVG.set('margin',m);
      radarSVG.set('offset',offset);

      radarScale.set('_radius',min);
      radarScale.set('dimensions',dim);
      radarScale.set('centerOffset',50);
      radarScale.set('chartData',d);

      radarLine.set('completeSeriesConfig',completeSeriesConfig);
      radarLine.set('seriesId',"x");
      radarLine.set('chartData',d);
    });

    test('radarLine fixture is created', function() {
      assert.isTrue(radarLine !== null);
    });

    test('radarLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('radarLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('radarLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('radarLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('radarLine line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = [];
      for(var i = 0; i < 5; i++){
        matches.push(re.exec(Px.d3.select(linePath.nodes()[i]).attr('d')));
      }

      assert.closeTo(Number(matches[0][1]),0,1);
      assert.closeTo(Number(matches[0][2]),-50,1);
      assert.closeTo(Number(matches[0][3]),43,1);
      assert.closeTo(Number(matches[0][4]),24,1);
      assert.closeTo(Number(matches[0][5]),-43,1);
      assert.closeTo(Number(matches[0][6]),25,1);
      assert.closeTo(Number(matches[0][7]),0,1);
      assert.closeTo(Number(matches[0][8]),-50,1);

      assert.closeTo(Number(matches[1][1]),0,1);
      assert.closeTo(Number(matches[1][2]),-86,1);
      assert.closeTo(Number(matches[1][3]),131,1);
      assert.closeTo(Number(matches[1][4]),75,1);
      assert.closeTo(Number(matches[1][5]),-169,1);
      assert.closeTo(Number(matches[1][6]),98,1);
      assert.closeTo(Number(matches[1][7]),0,1);
      assert.closeTo(Number(matches[1][8]),-86,1);

      assert.closeTo(Number(matches[2][1]),0,1);
      assert.closeTo(Number(matches[2][2]),-115,1);
      assert.closeTo(Number(matches[2][3]),87,1);
      assert.closeTo(Number(matches[2][4]),50,1);
      assert.closeTo(Number(matches[2][5]),-55,1);
      assert.closeTo(Number(matches[2][6]),32,1);
      assert.closeTo(Number(matches[2][7]),0,1);
      assert.closeTo(Number(matches[2][8]),-115,1);

      assert.closeTo(Number(matches[3][1]),0,1);
      assert.closeTo(Number(matches[3][2]),-71,1);
      assert.closeTo(Number(matches[3][3]),99,1);
      assert.closeTo(Number(matches[3][4]),57,1);
      assert.closeTo(Number(matches[3][5]),-99,1);
      assert.closeTo(Number(matches[3][6]),57,1);
      assert.closeTo(Number(matches[3][7]),0,1);
      assert.closeTo(Number(matches[3][8]),-71,1);

      assert.closeTo(Number(matches[4][1]),0,1);
      assert.closeTo(Number(matches[4][2]),-86,1);
      assert.closeTo(Number(matches[4][3]),162,1);
      assert.closeTo(Number(matches[4][4]),93,1);
      assert.closeTo(Number(matches[4][5]),-207,1);
      assert.closeTo(Number(matches[4][6]),120,1);
      assert.closeTo(Number(matches[4][7]),0,1);
      assert.closeTo(Number(matches[4][8]),-86,1);
    });

  }); //suite

  suite('px-vis-line-svg radar small lines stop at 25', function() {
    var radarScale,
        chartExtents = {"x":["y","y1","y2"],"y":[15,20] },
        linePath;

    suiteSetup(function(done) {
      radarScale = document.getElementById('radarScale'),
      radarScale.set('chartExtents',chartExtents);

      window.setTimeout(function(){
        linePath = radarLine.lineGroup.selectAll('path.series-line');
        done();
      },500);;
    });

    test('radarLine line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = [];
      for(var i = 0; i < 5; i++){
        matches.push(re.exec(Px.d3.select(linePath.nodes()[i]).attr('d')));
      }

      assert.closeTo(Number(matches[0][1]),0,1);
      assert.closeTo(Number(matches[0][2]),-25,1);
      assert.closeTo(Number(matches[0][3]),21,1);
      assert.closeTo(Number(matches[0][4]),12,1);
      assert.closeTo(Number(matches[0][5]),-21,1);
      assert.closeTo(Number(matches[0][6]),12,1);
      assert.closeTo(Number(matches[0][7]),0,1);
      assert.closeTo(Number(matches[0][8]),-25,1);

      assert.closeTo(Number(matches[1][1]),0,1);
      assert.closeTo(Number(matches[1][2]),-25,1);
      assert.closeTo(Number(matches[1][3]),43,1);
      assert.closeTo(Number(matches[1][4]),24,1);
      assert.closeTo(Number(matches[1][5]),-240,1);
      assert.closeTo(Number(matches[1][6]),139,1);
      assert.closeTo(Number(matches[1][7]),0,1);
      assert.closeTo(Number(matches[1][8]),-25,1);

      assert.closeTo(Number(matches[2][1]),0,1);
      assert.closeTo(Number(matches[2][2]),-25,1);
      assert.closeTo(Number(matches[2][3]),21,1);
      assert.closeTo(Number(matches[2][4]),12,1);
      assert.closeTo(Number(matches[2][5]),-21,1);
      assert.closeTo(Number(matches[2][6]),12,1);
      assert.closeTo(Number(matches[2][7]),0,1);
      assert.closeTo(Number(matches[2][8]),-25,1);

      assert.closeTo(Number(matches[3][1]),0,1);
      assert.closeTo(Number(matches[3][2]),-25,1);
      assert.closeTo(Number(matches[3][3]),21,1);
      assert.closeTo(Number(matches[3][4]),12,1);
      assert.closeTo(Number(matches[3][5]),-21,1);
      assert.closeTo(Number(matches[3][6]),12,1);
      assert.closeTo(Number(matches[3][7]),0,1);
      assert.closeTo(Number(matches[3][8]),-25,1);

      assert.closeTo(Number(matches[4][1]),0,1);
      assert.closeTo(Number(matches[4][2]),-25,1);
      assert.closeTo(Number(matches[4][3]),207,1);
      assert.closeTo(Number(matches[4][4]),119,1);
      assert.closeTo(Number(matches[4][5]),-438,1);
      assert.closeTo(Number(matches[4][6]),253,1);
      assert.closeTo(Number(matches[4][7]),0,1);
      assert.closeTo(Number(matches[4][8]),-25,1);
    });

  }); //suite

  suite('px-vis-line-svg radar with missing data', function() {
    var radarMissingScale,
        radarMissingSVG,
        radarMissingLine;


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": null,
            "y2": 1
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10
          },{
            "x": 1397219100000,
            "y1": 20,
            "y2": 27
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2'],
            "y":['y','y1','y2'],
            "color": colorSet[0]
          }
        },
        dim = ['y','y1','y2'],
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

      radarMissingScale = document.getElementById('radarMissingScale'),
      radarMissingSVG = document.getElementById('radarMissingSVG'),
      radarMissingLine = document.getElementById('radarMissingLine');

      var rendered = function() {

        linePath = radarMissingLine.lineGroup.selectAll('path.series-line');

        radarMissingLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      radarMissingLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      radarMissingSVG.set('width',w);
      radarMissingSVG.set('height',h);
      radarMissingSVG.set('margin',m);
      radarMissingSVG.set('offset',offset);

      radarMissingScale.set('_radius',min);
      radarMissingScale.set('dimensions',dim);
      radarMissingScale.set('centerOffset',50);
      radarMissingScale.set('chartData',d);

      radarMissingLine.set('completeSeriesConfig',completeSeriesConfig);
      radarMissingLine.set('seriesId',"x");
      radarMissingLine.set('chartData',d);
    });

    test('radarMissingLine fixture is created', function() {
      assert.isTrue(radarMissingLine !== null);
    });

    test('radarMissingLine linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('radarMissingLine linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('radarMissingLine lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('radarMissingLine line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('radarMissingLine full lines d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = [];
      matches.push(re.exec(Px.d3.select(linePath.nodes()[2]).attr('d')));
      matches.push(re.exec(Px.d3.select(linePath.nodes()[3]).attr('d')));

      assert.closeTo(Number(matches[0][1]),0,1);
      assert.closeTo(Number(matches[0][2]),-115,1);
      assert.closeTo(Number(matches[0][3]),87,1);
      assert.closeTo(Number(matches[0][4]),50,1);
      assert.closeTo(Number(matches[0][5]),-55,1);
      assert.closeTo(Number(matches[0][6]),32,1);
      assert.closeTo(Number(matches[0][7]),0,1);
      assert.closeTo(Number(matches[0][8]),-115,1);

      assert.closeTo(Number(matches[1][1]),0,1);
      assert.closeTo(Number(matches[1][2]),-71,1);
      assert.closeTo(Number(matches[1][3]),99,1);
      assert.closeTo(Number(matches[1][4]),57,1);
      assert.closeTo(Number(matches[1][5]),-99,1);
      assert.closeTo(Number(matches[1][6]),57,1);
      assert.closeTo(Number(matches[1][7]),0,1);
      assert.closeTo(Number(matches[1][8]),-71,1);
    });

    test('radarMissingLine missing first point line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(Px.d3.select(linePath.nodes()[4]).attr('d'));

      assert.closeTo(Number(matches[1]),162,1);
      assert.closeTo(Number(matches[2]),93,1);
      assert.closeTo(Number(matches[3]),-207,1);
      assert.closeTo(Number(matches[4]),120,1);
    });

    test('radarMissingLine missing second point line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?Z\\s?',
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?'
      ].join(''));

      var matches = re.exec(Px.d3.select(linePath.nodes()[0]).attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),-50,1);
      assert.closeTo(Number(matches[3]),-43,1);
      assert.closeTo(Number(matches[4]),25,1);
      assert.closeTo(Number(matches[5]),0,1);
      assert.closeTo(Number(matches[6]),-50,1);
    });

    test('radarMissingLine missing third point line d', function() {
      var re = new RegExp([
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'L\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
        'M\\s?(-?\\d+)\\.?\\d*e?-?\\d*,?\\s?(-?\\d+)\\.?\\d*e?-?\\d*\\s?',
      ].join(''));

      var matches = re.exec(Px.d3.select(linePath.nodes()[1]).attr('d'));

      assert.closeTo(Number(matches[1]),0,1);
      assert.closeTo(Number(matches[2]),-86,1);
      assert.closeTo(Number(matches[3]),131,1);
      assert.closeTo(Number(matches[4]),75,1);
      assert.closeTo(Number(matches[5]),0,1);
      assert.closeTo(Number(matches[6]),-86,1);
    });

  }); //suite
} //runTests
