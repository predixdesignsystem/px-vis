function runParallelTests() {
  suite('px-vis-line-svg renders parallel axis to SVG', function() {
    var parallelScale = document.getElementById('parallelScale'),
        parallelSVG = document.getElementById('parallelSVG'),
        parallelLine = document.getElementById('parallelLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
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
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[0]
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],'y':[0,27],'y2':[0,27]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };


      var rendered = function() {

        linePath = parallelLine.lineGroup.selectAll('path.series-line');

        parallelLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      parallelSVG.set('width',w);
      parallelSVG.set('height',h);
      parallelSVG.set('margin',m);

      parallelScale.set('width',w);
      parallelScale.set('height',h);
      parallelScale.set('margin',m);
      parallelScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelScale.set('chartData',d);
      parallelScale.set('chartExtents',chartExtents);
      parallelScale.set('axes',dim);
      parallelScale.set('dimensions',dim);

      parallelLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelLine.set('seriesId',"x");
      parallelLine.set('chartData',d);
    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelLine !== null);
    });

    test('// linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('// linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('// lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('// line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('// line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });
  }); //suite

  suite('px-vis-line-svg renders parallel axis with gradient lines to SVG', function() {
    var paralleGradientlScale = document.getElementById('parallelGradientScale'),
        parallelGradientSVG = document.getElementById('parallelGradientSVG'),
        parallelGradientLine = document.getElementById('parallelGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
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
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[0]
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],'y':[0,27],'y2':[0,27]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      var rendered = function() {

        linePath = parallelGradientLine.lineGroup.selectAll('path.series-line');

        parallelGradientLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelGradientLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      parallelGradientSVG.set('width',w);
      parallelGradientSVG.set('height',h);
      parallelGradientSVG.set('margin',m);

      parallelGradientScale.set('width',w);
      parallelGradientScale.set('height',h);
      parallelGradientScale.set('margin',m);
      parallelGradientScale.set('chartData',d);
      parallelGradientScale.set('chartExtents',chartExtents);
      parallelGradientScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelGradientScale.set('axes',dim);
      parallelGradientScale.set('dimensions',dim);

      parallelGradientLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelGradientLine.set('seriesId',"x");
      parallelGradientLine.set('chartData',d);
    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelGradientLine !== null);
    });

    test('// linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('// linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('// lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('// line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[0]);
    });

    test('// line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[0]).attr('stroke-opacity').split(' ').join('') * 10)/10,0.2);
      assert.equal(Math.round(d3.select(linePath.nodes()[1]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.4);
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.8);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('// line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });

  }); //suite

  suite('px-vis-line-svg renders parallel axis with multiple categories to SVG', function() {
    var parallelCategoryScale = document.getElementById('parallelCategoryScale'),
        parallelCategorySVG = document.getElementById('parallelCategorySVG'),
        parallelCategoryLine = document.getElementById('parallelCategoryLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[3]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],'y':[0,27],'y2':[0,27]},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      var rendered = function() {

        linePath = parallelCategoryLine.lineGroup.selectAll('path.series-line');

        parallelCategoryLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelCategoryLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      parallelCategorySVG.set('width',w);
      parallelCategorySVG.set('height',h);
      parallelCategorySVG.set('margin',m);

      parallelCategoryScale.set('width',w);
      parallelCategoryScale.set('height',h);
      parallelCategoryScale.set('margin',m);
      parallelCategoryScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryScale.set('chartExtents',chartExtents);
      parallelCategoryScale.set('chartData',d);
      parallelCategoryScale.set('axes',dim);
      parallelCategoryScale.set('dimensions',dim);

      parallelCategoryLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryLine.set('seriesId',"x");
      parallelCategoryLine.set('categoryKey',"cat");
      parallelCategoryLine.set('categories',categories);
      parallelCategoryLine.set('chartData',d);
    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelCategoryLine !== null);
    });

    test('// linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('// linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('// lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('// line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
    });

    test('// line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });
  }); //suite

  suite('px-vis-line-svg renders parallel axis with multiple categories and gradients to SVG', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 1,
            'cat': 'a'
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 21,
            'cat': 'a'
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3,
            'cat': 'b'
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 10,
            'cat': 'a'
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 27,
            'cat': 'b'
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[0]
          },
          "a":{
            "type":"line",
            "name":"a",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[0]
          },
          "b":{
            "type":"line",
            "name":"b",
            "x":['y','y2'],
            "y":['y','y2'],
            "color": colorSet[1]
          }
        },
        dim = ['y','y2'],
        chartExtents = {"x":['y','y2'],'y':[0,27],'y2':[0,27]},
        categories = ['a','b'],
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      var rendered = function() {

        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');

        parallelCategoryGradientLine.removeEventListener('px-vis-line-svg-rendering-ended', rendered);

        done();
      };

      parallelCategoryGradientLine.addEventListener('px-vis-line-svg-rendering-ended', rendered);

      parallelCategoryGradientSVG.set('width',w);
      parallelCategoryGradientSVG.set('height',h);
      parallelCategoryGradientSVG.set('margin',m);

      parallelCategoryGradientScale.set('width',w);
      parallelCategoryGradientScale.set('height',h);
      parallelCategoryGradientScale.set('margin',m);
      parallelCategoryGradientScale.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryGradientScale.set('chartExtents',chartExtents);
      parallelCategoryGradientScale.set('chartData',d);
      parallelCategoryGradientScale.set('axes',dim);
      parallelCategoryGradientScale.set('dimensions',dim);

      parallelCategoryGradientLine.set('completeSeriesConfig',completeSeriesConfig);
      parallelCategoryGradientLine.set('seriesId',"x");
      parallelCategoryGradientLine.set('categoryKey',"cat");
      parallelCategoryGradientLine.set('categories',categories);
      parallelCategoryGradientLine.set('chartData',d);

    });

    test('parallelLine fixture is created', function() {
      assert.isTrue(parallelCategoryGradientLine !== null);
    });

    test('// linePath created', function() {
      assert.equal(linePath.node().tagName,'path');
    });

    test('// linePath created 5 lines', function() {
      assert.equal(linePath.nodes().length,5);
    });

    test('// lines have a series ID', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('series-id'),'line_1397102460000');
      assert.equal(d3.select(linePath.nodes()[1]).attr('series-id'),'line_1397131620000');
      assert.equal(d3.select(linePath.nodes()[2]).attr('series-id'),'line_1397160780000');
      assert.equal(d3.select(linePath.nodes()[3]).attr('series-id'),'line_1397189940000');
      assert.equal(d3.select(linePath.nodes()[4]).attr('series-id'),'line_1397219100000');
    });

    test('// line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
    });

    test('// line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[0]).attr('stroke-opacity').split(' ').join('') * 10)/10,0.2);
      assert.equal(Math.round(d3.select(linePath.nodes()[1]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.4);
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.8);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('// line d', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('d').split(/[\s,]+/).join(''),'M120260L360260');
      assert.equal(d3.select(linePath.nodes()[1]).attr('d').split(/[\s,]+/).join(''),'M120210L36060');
      assert.equal(d3.select(linePath.nodes()[2]).attr('d').split(/[\s,]+/).join(''),'M120170L360240');
      assert.equal(d3.select(linePath.nodes()[3]).attr('d').split(/[\s,]+/).join(''),'M120230L360170');
      assert.equal(d3.select(linePath.nodes()[4]).attr('d').split(/[\s,]+/).join(''),'M120210L3600');
    });

  }); //suite

  suite('px-vis-line-svg mutes parallel axis on SVG and selectedDomain changes gradient', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var m = {
        "1397102460000":true,
        "1397131620000":true
      };
      var sd = {'x':[1397160780000,1397219100000]};

      parallelCategoryGradientLine.set('selectedDomain',sd);
      parallelCategoryGradientLine.set('mutedSeries',m);

      window.setTimeout(function(){
        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');
        done();
      },1000);
    });

    test('// line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
    });

    test('// line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.8);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('// line series has the right opacity', function() {
      assert.equal(linePath.nodes()[0].style.display, 'none');
      assert.equal(linePath.nodes()[1].style.display, 'none');
      assert.equal(linePath.nodes()[2].style.display, '');
      assert.equal(linePath.nodes()[3].style.display, '');
      assert.equal(linePath.nodes()[4].style.display, '');
    });
  }); //suite

  suite('px-vis-line-svg unmutes parallel axis on SVG and selectedDomain changes gradient', function() {
    var parallelCategoryGradientScale = document.getElementById('parallelCategoryGradientScale'),
        parallelCategoryGradientSVG = document.getElementById('parallelCategoryGradientSVG'),
        parallelCategoryGradientLine = document.getElementById('parallelCategoryGradientLine');


    var colorSet = PxColorsBehavior.dataVisColors.properties.seriesColorList.value;
    var linePath;

    suiteSetup(function(done){
      var m = {};
      var sd = {'x':[1397102460000,1397219100000]};

      parallelCategoryGradientLine.set('selectedDomain',sd);
      parallelCategoryGradientLine.set('mutedSeries',m);

      window.setTimeout(function(){
        linePath = parallelCategoryGradientLine.lineGroup.selectAll('path.series-line');
        done();
      }, 1000);
    });

    test('// line series has the right color', function() {
      assert.equal(d3.select(linePath.nodes()[0]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[1]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[2]).attr('stroke').split(' ').join(''),colorSet[1]);
      assert.equal(d3.select(linePath.nodes()[3]).attr('stroke').split(' ').join(''),colorSet[0]);
      assert.equal(d3.select(linePath.nodes()[4]).attr('stroke').split(' ').join(''),colorSet[1]);
    });

    test('// line series has the right opacity', function() {
      assert.equal(Math.round(d3.select(linePath.nodes()[0]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.2);
      assert.equal(Math.round(d3.select(linePath.nodes()[1]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.4);
      assert.equal(Math.round(d3.select(linePath.nodes()[2]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.6);
      assert.equal(Math.round(d3.select(linePath.nodes()[3]).attr('stroke-opacity').split(' ').join('')* 10)/10,0.8);
      assert.equal(Math.round(d3.select(linePath.nodes()[4]).attr('stroke-opacity').split(' ').join('')* 10)/10,1.0);
    });

    test('// line series has the right opacity', function() {
      assert.equal(linePath.nodes()[0].style.display, '');
      assert.equal(linePath.nodes()[1].style.display, '');
      assert.equal(linePath.nodes()[2].style.display, '');
      assert.equal(linePath.nodes()[3].style.display, '');
      assert.equal(linePath.nodes()[4].style.display, '');
    });
  }); //suite

} //runTests
