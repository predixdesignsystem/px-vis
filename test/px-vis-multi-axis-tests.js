document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-axis does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-multi-axis basic setup works', function() {
    var multiScale,
        multiSVG,
        multiAxis;

    suiteSetup(function(done){
      multiScale = document.getElementById('multiScale');
      multiSVG = document.getElementById('multiSVG');
      multiAxis = document.getElementById('multiAxis');
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
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y':{'y':[1,10], 'y1':[1,20], 'y2':[1,27]}},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      multiSVG.set('width',w);
      multiSVG.set('height',h);
      multiSVG.set('margin',m);

      multiScale.set('width',w);
      multiScale.set('height',h);
      multiScale.set('margin',m);
      multiScale.set('completeSeriesConfig',completeSeriesConfig);
      multiScale.set('dataExtents',ext);
      multiScale.set('chartData',d);
      multiScale.set('axes',dim);
      multiScale.set('dimensions',dim);

      multiAxis.set('margin',m);
      multiAxis.set('width',w);
      multiAxis.set('height',h);
      multiAxis.set('seriesKey','x');
      multiAxis.set('completeSeriesConfig',completeSeriesConfig);
      multiAxis.set('dimensions',dim);
      multiAxis.set('axes',dim);
      multiAxis.set('chartData',d);

      window.setTimeout(function(){done()}, 500);
    });

    test('multiAxis fixture is created', function() {
      assert.isTrue(multiAxis !== null);
    });

    test('multiAxis heightOrLen is height', function() {
      assert.equal(multiAxis._heightOrLen, 500);
    });

    test('multiAxis created three interactive axes', function() {

      var ia = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });

    test('multiAxis each IA group is transformed correctly', function() {
      var ia = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          re = /translate\((\d+)\s?,?\d*\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2);

      assert.equal(g0[1], "80");
      assert.equal(g1[1], "240");
      assert.equal(g2[1], "400");
    });

    test('multiAxis axis gets correct calculated attrs', function() {
      var iAxes = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "y");
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(axes[2].disableTicks, false);
    });

    test('multiAxis displayedValues', function() {
      assert.equal(multiAxis.displayedValues.y, 'y');
      assert.equal(multiAxis.displayedValues.y1, '2nd Title');
      assert.equal(multiAxis.displayedValues.y2, 'Third...Title [bofs]');
    });
  });


  suite('px-vis-multi-axis add a dimension', function() {
    var multiScale,
        multiSVG,
        multiAxis;

    suiteSetup(function(done) {
      multiScale = document.getElementById('multiScale');
      multiSVG = document.getElementById('multiSVG');
      multiAxis = document.getElementById('multiAxis');
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1,
            'y3': 5
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21,
            'y3': 10
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3,
            'y3': 15
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10,
            'y3': 55
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27,
            'y3': 75
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2','y3'],
            "y":['y','y1','y2','y3'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          },
          "y3": {
            "title": "New Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2','y3'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y':[1,10], 'y1':[1,20], 'y2':[1,27], 'y3':[5,75] },
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      multiScale.set('chartData',d);
      multiScale.set('axes',dim);
      multiScale.set('dataExtents',ext);
      multiScale.set('dimensions',dim);

      multiAxis.set('dimensions',dim);
      multiAxis.set('axes',dim);

      multiAxis.set('completeSeriesConfig',completeSeriesConfig);

      multiAxis.set('chartData',d);

      window.setTimeout(function() { done(); }, 1000);
    });

    test('multiAxis fixture is created', function() {
      assert.isTrue(multiAxis !== null);
    });

    test('multiAxis created four interactive axes', function() {
      var ia = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 4);
    });

    test('multiAxis each IA group is transformed correctly', function() {
      var ia = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          iag3 = ia[3]._interactiveGroup.attr('transform'),
          re = /translate\((\d+)\s?,?\d*\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2),
          g3 = re.exec(iag3);

      assert.equal(g0[1], "60");
      assert.equal(g1[1], "180");
      assert.equal(g2[1], "300");
      assert.equal(g3[1], "420");
    });


    test('multiAxis axis gets correct calculated attrs', function() {
      var iAxes = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "y");
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(axes[2].disableTicks, false);

      assert.equal(axes[3].seriesId, "y3");
      assert.equal(axes[3].title, "New Title");
      assert.equal(axes[3].disableTicks, false);
    });

    test('multiAxis displayedValues', function() {
      assert.equal(multiAxis.displayedValues.y, 'y');
      assert.equal(multiAxis.displayedValues.y1, '2nd Title');
      assert.equal(multiAxis.displayedValues.y2, 'Third...Title [bofs]');
      assert.equal(multiAxis.displayedValues.y3, 'New Title [bofs]');
    });
  });

  suite('px-vis-multi-axis deletes a dimension', function() {
    var multiScale,
        multiSVG,
        multiAxis;

    suiteSetup(function(done){
      multiScale = document.getElementById('multiScale');
      multiSVG = document.getElementById('multiSVG');
      multiAxis = document.getElementById('multiAxis');
      var d = [{
            "x": 1397102460000,
            "y1": 1,
            "y2": 1,
            'y3': 5
          },{
            "x": 1397131620000,
            "y1": 15,
            "y2": 21,
            'y3': 10
          },{
            "x": 1397160780000,
            "y1": 8,
            "y2": 3,
            'y3': 15
          },{
            "x": 1397189940000,
            "y1": 10,
            "y2": 10,
            'y3': 55
          },{
            "x": 1397219100000,
            "y1": 20,
            "y2": 27,
            'y3': 75
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y1','y2','y3'],
            "y":['y1','y2','y3'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          },
          "y3": {
            "title": "New Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y1','y2','y3'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y1':[1,20], 'y2':[1,27], 'y3':[5,75] },
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };


      multiScale.set('chartData',d);
      multiScale.set('axes',dim);
      multiScale.set('dataExtents',ext);
      multiScale.set('dimensions',dim);

      multiAxis.set('dimensions',dim);
      multiAxis.set('axes',dim);
      multiAxis.set('completeSeriesConfig',completeSeriesConfig);

      multiAxis.set('chartData',d);

      window.setTimeout(function() {
        done()}, 500);
    });

    test('multiAxis fixture is created', function() {
      assert.isTrue(multiAxis !== null);
    });

    test('multiAxis created three groups', function() {
      var ia = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });

    test('multiAxis each IA group is transformed correctly', function() {
      var ia = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          re = /translate\((\d+)\s?,?\d*\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2);

      assert.equal(g0[1], "80");
      assert.equal(g1[1], "240");
      assert.equal(g2[1], "400");
    });


    test('multiAxis axis gets correct calculated attrs', function() {
      var iAxes = Polymer.dom(multiAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y1");
      assert.equal(axes[0].title, "2nd Title");
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y2");
      assert.equal(axes[1].title, "Third Title");
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y3");
      assert.equal(axes[2].title, "New Title");
      assert.equal(axes[2].disableTicks, false);
    });

    test('multiAxis displayedValues', function() {
      assert.equal(multiAxis.displayedValues.y1, '2nd Title');
      assert.equal(multiAxis.displayedValues.y2, 'Third...Title [bofs]');
      assert.equal(multiAxis.displayedValues.y3, 'New Title [bofs]');
    });
  });


  suite('px-vis-multi-axis common axis setup works', function() {
    var multiScaleCommon,
        multiSVGCommon,
        multiAxisCommon;

    suiteSetup(function(done){
      multiScaleCommon = document.getElementById('multiScaleCommon');
      multiSVGCommon = document.getElementById('multiSVGCommon');
      multiAxisCommon = document.getElementById('multiAxisCommon');
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
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y':[1,27], 'y1':[1,27], 'y2':[1,27]},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      multiSVGCommon.set('width',w);
      multiSVGCommon.set('height',h);
      multiSVGCommon.set('margin',m);

      multiScaleCommon.set('width',w);
      multiScaleCommon.set('height',h);
      multiScaleCommon.set('margin',m);
      multiScaleCommon.set('completeSeriesConfig',completeSeriesConfig);
      multiScaleCommon.set('chartExtents',ext);
      multiScaleCommon.set('chartData',d);
      multiScaleCommon.set('axes',dim);
      multiScaleCommon.set('dimensions',dim);

      multiAxisCommon.set('margin',m);
      multiAxisCommon.set('width',w);
      multiAxisCommon.set('height',h);
      multiAxisCommon.set('seriesKey','x');
      multiAxisCommon.set('completeSeriesConfig',completeSeriesConfig);
      multiAxisCommon.set('dimensions',dim);
      multiAxisCommon.set('axes',dim);
      multiAxisCommon.set('chartData',d);

      window.setTimeout(function(){done()},300);
     // done();
    });

    test('multiAxisCommon fixture is created', function() {
      assert.isTrue(multiAxisCommon !== null);
    });

    test('multiAxisCommon heightOrLen is height', function() {
      assert.equal(multiAxisCommon._heightOrLen, 500);
    });

    test('multiAxisCommon created three groups', function() {
      var ia = Polymer.dom(multiAxisCommon.root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });

    test('multiAxis each IA group is transformed correctly', function() {
      var ia = Polymer.dom(multiAxisCommon.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          re = /translate\((\d+)\s?,?\d*\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2);

      assert.equal(g0[1], "80");
      assert.equal(g1[1], "240");
      assert.equal(g2[1], "400");
    });


    test('multiAxisCommon axis gets correct calculated attrs', function() {

      var iAxes = Polymer.dom(multiAxisCommon.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "y");
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(axes[2].disableTicks, false);
    });

    test('multiAxisCommon first axis ticks are correct', function() {
      var ia = Polymer.dom(multiAxisCommon.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[0].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.equal(ticks[0].textContent, "2");
      assert.equal(ticks[1].textContent, "4");
      assert.equal(ticks[2].textContent, "6");
      assert.equal(ticks[3].textContent, "8");
      assert.equal(ticks[4].textContent, "10");
      assert.equal(ticks[5].textContent, "12");
      assert.equal(ticks[6].textContent, "14");
      assert.equal(ticks[7].textContent, "16");
      assert.equal(ticks[8].textContent, "18");
      assert.equal(ticks[9].textContent, "20");
      assert.equal(ticks[10].textContent, "22");
      assert.equal(ticks[11].textContent, "24");
      assert.equal(ticks[12].textContent, "26");
    });

    test('multiAxisCommon second axis ticks correct', function() {
      var ia = Polymer.dom(multiAxisCommon.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[1].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.equal(ticks[0].textContent, "2");
      assert.equal(ticks[1].textContent, "4");
      assert.equal(ticks[2].textContent, "6");
      assert.equal(ticks[3].textContent, "8");
      assert.equal(ticks[4].textContent, "10");
      assert.equal(ticks[5].textContent, "12");
      assert.equal(ticks[6].textContent, "14");
      assert.equal(ticks[7].textContent, "16");
      assert.equal(ticks[8].textContent, "18");
      assert.equal(ticks[9].textContent, "20");
      assert.equal(ticks[10].textContent, "22");
      assert.equal(ticks[11].textContent, "24");
      assert.equal(ticks[12].textContent, "26");
    });

    test('multiAxisCommon third axis ticks correct', function() {
      var ia = Polymer.dom(multiAxisCommon.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[2].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.equal(ticks[0].textContent, "2");
      assert.equal(ticks[1].textContent, "4");
      assert.equal(ticks[2].textContent, "6");
      assert.equal(ticks[3].textContent, "8");
      assert.equal(ticks[4].textContent, "10");
      assert.equal(ticks[5].textContent, "12");
      assert.equal(ticks[6].textContent, "14");
      assert.equal(ticks[7].textContent, "16");
      assert.equal(ticks[8].textContent, "18");
      assert.equal(ticks[9].textContent, "20");
      assert.equal(ticks[10].textContent, "22");
      assert.equal(ticks[11].textContent, "24");
      assert.equal(ticks[12].textContent, "26");
    });

    test('multiAxisCommon ticks are correctly shown / hidden', function() {
      var ia = Polymer.dom(multiAxisCommon.root).querySelectorAll('px-vis-interactive-axis'),
          axis0 = Polymer.dom(ia[0].root).querySelectorAll('px-vis-axis')[0],
          axis1 = Polymer.dom(ia[1].root).querySelectorAll('px-vis-axis')[0],
          axis2 = Polymer.dom(ia[2].root).querySelectorAll('px-vis-axis')[0],
          ticks0 = axis0._axisGroup.selectAll('g.tick').selectAll('text').nodes(),
          ticks1 = axis1._axisGroup.selectAll('g.tick').selectAll('text').nodes(),
          ticks2 = axis2._axisGroup.selectAll('g.tick').selectAll('text').nodes();

      assert.equal(ticks0[0].className.baseVal, "");
      assert.equal(ticks1[0].className.baseVal, "hideCommon");
      assert.equal(ticks2[0].className.baseVal, "hideCommon");

    });


    test('multiAxisCommon displayedValues', function() {
      assert.equal(multiAxisCommon.displayedValues.y, 'y');
      assert.equal(multiAxisCommon.displayedValues.y1, '2nd Title');
      assert.equal(multiAxisCommon.displayedValues.y2, 'Third...Title [bofs]');
    });
  });


  suite('px-vis-multi-axis no match ticks setup works', function() {
    var noMatchScale,
        noMatchSVG,
        noMatchAxis;

    suiteSetup(function(done){
      noMatchScale = document.getElementById('noMatchScale');
      noMatchSVG = document.getElementById('noMatchSVG');
      noMatchAxis = document.getElementById('noMatchAxis');
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
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        ext = {'x': dim, 'y':[1,10], 'y1':[1,20], 'y2':[1,27]},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      noMatchSVG.set('width',w);
      noMatchSVG.set('height',h);
      noMatchSVG.set('margin',m);

      noMatchScale.set('width',w);
      noMatchScale.set('height',h);
      noMatchScale.set('margin',m);
      noMatchScale.set('chartData',d);
      noMatchScale.set('completeSeriesConfig',completeSeriesConfig);
      noMatchScale.set('dataExtents',ext);
      noMatchScale.set('axes',dim);
      noMatchScale.set('dimensions',dim);

      noMatchAxis.set('margin',m);
      noMatchAxis.set('width',w);
      noMatchAxis.set('height',h);
      noMatchAxis.set('seriesKey','x');
      noMatchAxis.set('completeSeriesConfig',completeSeriesConfig);
      noMatchAxis.set('dimensions',dim);
      noMatchAxis.set('axes',dim);
      noMatchAxis.set('chartData',d);

      window.setTimeout(function(){done()},300);
     // done();
    });

    test('noMatchAxis fixture is created', function() {
      assert.isTrue(noMatchAxis !== null);
    });

    test('noMatchAxis heightOrLen is height', function() {
      assert.equal(noMatchAxis._heightOrLen, 500);
    });

    test('noMatchAxis created three groups', function() {
      var ia = Polymer.dom(noMatchAxis.root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 3);
    });

    test('noMatchAxis each group is transformed correctly', function() {
      var ia = Polymer.dom(noMatchAxis.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          re = /translate\((\d+)\s?,?\d*\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2);

      assert.equal(g0[1], "80");
      assert.equal(g1[1], "240");
      assert.equal(g2[1], "400");
    });

    test('noMatchAxis axis gets correct calculated attrs', function() {
      var iAxes = Polymer.dom(noMatchAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "y");
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(axes[2].disableTicks, false);
    });

    test('noMatchAxis displayedValues', function() {
      assert.equal(noMatchAxis.displayedValues.y, 'y');
      assert.equal(noMatchAxis.displayedValues.y1, '2nd Title');
      assert.equal(noMatchAxis.displayedValues.y2, 'Third...Title [bofs]');
    });
  });


  suite('px-vis-multi-axis radial setup works', function() {
    var radialScale,
        radialSVG,
        radialAxis;

    suiteSetup(function(done){
      radialScale = document.getElementById('radialScale');
      radialSVG = document.getElementById('radialSVG');
      radialAxis = document.getElementById('radialAxis');
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
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2'],
        w = 500,
        h = 500,
        min = 460/2,
        offset = [220,240],
        ext = {'x': dim, 'y':[1,27]},
        m = {
          "top": 20,
          "right": 20,
          "bottom": 20,
          "left": 20
        };

      radialSVG.set('width',w);
      radialSVG.set('height',h);
      radialSVG.set('offset',offset);
      radialSVG.set('margin',m);

      radialScale.set('_radius',min);
      radialScale.set('centerOffset',20);
      radialScale.set('margin',m);
      radialScale.set('dimensions',dim);
      radialScale.set('completeSeriesConfig',completeSeriesConfig);
      radialScale.set('chartExtents',ext);
      radialScale.set('chartData',d);

      radialAxis.set('margin',m);
      radialAxis.set('width',w);
      radialAxis.set('height',h);
      radialAxis.set('offset',offset);
      radialAxis.set('length',min);
      radialAxis.set('centerOffset',20);
      radialAxis.set('seriesKey','x');
      radialAxis.set('completeSeriesConfig',completeSeriesConfig);
      radialAxis.set('dimensions',dim);
      radialAxis.set('axes',dim);
      radialAxis.set('chartData',d);

      window.setTimeout(function() { done(); }, 600);
    });

    test('radialAxis fixture is created', function() {
      assert.isTrue(radialAxis !== null);
    });

    test('radialAxis created three groups', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis');
      assert.lengthOf(ia, 3);
    });


    test('radialAxis heightOrLen is length', function() {
      assert.equal(radialAxis._heightOrLen, 230);
    });

    test('radialAxis each group is transformed correctly', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          re = /rotate\((\d+)\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2);

      assert.equal(g0[1], "180");
      assert.equal(g1[1], "300");
      assert.equal(g2[1], "420");
    });

    test('radialAxis axis gets correct calculated attrs', function() {
      var iAxes = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "y");
      assert.equal(axes[0].disableTicks, false);
      assert.equal(axes[0].titleLocation.anchor, 'middle');
      assert.closeTo(axes[0].titleLocation.x, 0,1);
      assert.equal(axes[0].titleLocation.y, 240);
      assert.equal(axes[0].titleLocation.r, -180);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(axes[1].disableTicks, true);
      assert.equal(axes[1].titleLocation.anchor, 'start');
      assert.closeTo(axes[1].titleLocation.x, -10,1);
      assert.closeTo(axes[1].titleLocation.y, 246,1);
      assert.equal(axes[1].titleLocation.r, -300);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(axes[2].disableTicks, true);
      assert.equal(axes[2].titleLocation.anchor, 'end');
      assert.closeTo(axes[2].titleLocation.x, 10,1);
      assert.closeTo(axes[2].titleLocation.y, 246,1);
      assert.equal(axes[2].titleLocation.r, -420);
    });

    test('radialAxis displayedValues', function() {
      assert.equal(radialAxis.displayedValues.y, 'y');
      assert.equal(radialAxis.displayedValues.y1, '2nd Title');
      assert.equal(radialAxis.displayedValues.y2, 'Third...Title [bofs]');
    });

    test('radialAxis drawnTickValues', function() {
      var iAxes = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }
      assert.equal(JSON.stringify(axes[0].drawnTickValues), '[2,4,6,8,10,12,14,16,18,20,22,24,26]');
    });

    test('radialAxis first axis ticks are correct', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[0].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.equal(ticks[0].textContent, "2");
      assert.equal(ticks[1].textContent, "4");
      assert.equal(ticks[2].textContent, "6");
      assert.equal(ticks[3].textContent, "8");
      assert.equal(ticks[4].textContent, "10");
      assert.equal(ticks[5].textContent, "12");
      assert.equal(ticks[6].textContent, "14");
      assert.equal(ticks[7].textContent, "16");
      assert.equal(ticks[8].textContent, "18");
      assert.equal(ticks[9].textContent, "20");
      assert.equal(ticks[10].textContent, "22");
      assert.equal(ticks[11].textContent, "24");
      assert.equal(ticks[12].textContent, "26");
    });

    test('radialAxis second axis ticks are removed', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[1].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.lengthOf(ticks,0);
    });

    test('radialAxis third axis ticks are removed', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[2].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.lengthOf(ticks,0);
    });
  });

  suite('px-vis-multi-axis radial add a dimension', function() {
    var radialScale,
        radialSVG,
        radialAxis;

    suiteSetup(function(done) {
      radialScale = document.getElementById('radialScale');
      radialSVG = document.getElementById('radialSVG');
      radialAxis = document.getElementById('radialAxis');
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y1": 1,
            "y2": 1,
            'y3': 5
          },{
            "x": 1397131620000,
            "y": 6,
            "y1": 15,
            "y2": 21,
            'y3': 10
          },{
            "x": 1397160780000,
            "y": 10,
            "y1": 8,
            "y2": 3,
            'y3': 15
          },{
            "x": 1397189940000,
            "y": 4,
            "y1": 10,
            "y2": 10,
            'y3': 55
          },{
            "x": 1397219100000,
            "y": 6,
            "y1": 20,
            "y2": 27,
            'y3': 75
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y','y1','y2','y3'],
            "y":['y','y1','y2','y3'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          },
          "y3": {
            "title": "New Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y','y1','y2','y3'],
        w = 500,
        h = 500,
        min = 460/2,
        offset = [220,240],
        ext = {'x': dim, 'y':[1,75]},
        m = {
          "top": 20,
          "right": 20,
          "bottom": 20,
          "left": 20
        };

      radialScale.set('amplitudeKeys',dim);
      radialAxis.set('axes',dim);
      radialAxis.set('dimensions',dim);

      radialScale.set('completeSeriesConfig',completeSeriesConfig);
      radialScale.set('chartExtents',ext);
      radialScale.set('chartData',d);

      radialAxis.set('completeSeriesConfig',completeSeriesConfig);

      radialAxis.set('chartData',d);

      window.setTimeout(function(){
        done()}, 300);
     // done();
    });

    test('radialAxis created four groups', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis');
      assert.equal(ia.length, 4);
    });

    test('radialAxis each group is transformed correctly', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          iag3 = ia[3]._interactiveGroup.attr('transform'),
          re = /rotate\((\d+)\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2),
          g3 = re.exec(iag3);

      assert.equal(g0[1], "180");
      assert.equal(g1[1], "270");
      assert.equal(g2[1], "360");
      assert.equal(g3[1], "450");
    });


    test('radialAxis axis gets correct calculated attrs', function() {
      var iAxes = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "y");
      assert.equal(axes[0].disableTicks, false);
      assert.equal(axes[0].titleLocation.anchor, 'middle');
      assert.closeTo(axes[0].titleLocation.x, 0,1);
      assert.equal(axes[0].titleLocation.y, 240);
      assert.equal(axes[0].titleLocation.r, -180);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(axes[1].disableTicks, true);
      assert.equal(axes[1].titleLocation.anchor, 'start');
      assert.closeTo(axes[1].titleLocation.x, 0,1);
      assert.closeTo(axes[1].titleLocation.y, 240,1);
      assert.equal(axes[1].titleLocation.r, -270);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(axes[2].disableTicks, true);
      assert.equal(axes[2].titleLocation.anchor, 'middle');
      assert.closeTo(axes[2].titleLocation.x, 0,1);
      assert.closeTo(axes[2].titleLocation.y, 252,1);
      assert.equal(axes[2].titleLocation.r, -360);

      assert.equal(axes[3].seriesId, "y3");
      assert.equal(axes[3].title, "New Title");
      assert.equal(axes[3].disableTicks, true);
      assert.equal(axes[3].titleLocation.anchor, 'end');
      assert.closeTo(axes[3].titleLocation.x, 0,1);
      assert.closeTo(axes[3].titleLocation.y, 240,1);
      assert.equal(axes[3].titleLocation.r, -450);
    });

    test('radialAxis displayedValues', function() {
      assert.equal(radialAxis.displayedValues.y, 'y');
      assert.equal(radialAxis.displayedValues.y1, '2nd Title');
      assert.equal(radialAxis.displayedValues.y2, 'Third...Title [bofs]');
      assert.equal(radialAxis.displayedValues.y3, 'New Title [bofs]');
    });

    test('radialAxis drawnTickValues', function() {
      var iAxes = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(JSON.stringify(axes[0].drawnTickValues), '[10,20,30,40,50,60,70]');
    });

    test('radialAxis first axis ticks are correct', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[0].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.equal(ticks[0].textContent, "10");
      assert.equal(ticks[1].textContent, "20");
      assert.equal(ticks[2].textContent, "30");
      assert.equal(ticks[3].textContent, "40");
      assert.equal(ticks[4].textContent, "50");
      assert.equal(ticks[5].textContent, "60");
      assert.equal(ticks[6].textContent, "70");
    });

    test('radialAxis second axis ticks are removed', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[1].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.lengthOf(ticks,0);
    });

    test('radialAxis third axis ticks are removed', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[2].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.lengthOf(ticks,0);
    });

    test('radialAxis fourth axis ticks are removed', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[3].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.lengthOf(ticks,0);
    });
  });

  suite('px-vis-multi-axis radial delete a dimension', function() {
    var radialScale,
        radialSVG,
        radialAxis;

    suiteSetup(function(done){
      radialScale = document.getElementById('radialScale');
      radialSVG = document.getElementById('radialSVG');
      radialAxis = document.getElementById('radialAxis');
      var d = [{
            "x": 1397102460000,
            "y1": 1,
            "y2": 1,
            'y3': 5
          },{
            "x": 1397131620000,
            "y1": 15,
            "y2": 21,
            'y3': 10
          },{
            "x": 1397160780000,
            "y1": 8,
            "y2": 3,
            'y3': 15
          },{
            "x": 1397189940000,
            "y1": 10,
            "y2": 10,
            'y3': 55
          },{
            "x": 1397219100000,
            "y1": 20,
            "y2": 27,
            'y3': 75
          }
        ],
        completeSeriesConfig = {
          "x":{
            "type":"line",
            "name":"mySeries",
            "x":['y1','y2','y3'],
            "y":['y1','y2','y3'],
            "color": "rgb(93,165,218)"
          },
          "y1": {
            "title": "2nd Title"
          },
          "y2": {
            "title": "Third Title",
            "yAxisUnit": "bofs"
          },
          "y3": {
            "title": "New Title",
            "yAxisUnit": "bofs"
          }
        },
        dim = ['y1','y2','y3'],
        w = 500,
        h = 500,
        min = 460/2,
        offset = [220,240],
        ext = {'x': dim, 'y':[1,75]},
        m = {
          "top": 20,
          "right": 20,
          "bottom": 20,
          "left": 20
        };

      radialScale.set('amplitudeKeys',dim);
      radialAxis.set('dimensions',dim);
      radialAxis.set('axes',dim);

      radialScale.set('completeSeriesConfig',completeSeriesConfig);
      radialScale.set('chartExtents',ext);
      radialScale.set('chartData',d);

      radialAxis.set('completeSeriesConfig',completeSeriesConfig);

      radialAxis.set('chartData',d);

      window.setTimeout(function(){done()},500);
    });

    test('radialAxis created three groups', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis');
      assert.lengthOf(ia, 3);
    });


    test('radialAxis heightOrLen is length', function() {
      assert.equal(radialAxis._heightOrLen, 230);
    });

    test('radialAxis each group is transformed correctly', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          iag0 = ia[0]._interactiveGroup.attr('transform'),
          iag1 = ia[1]._interactiveGroup.attr('transform'),
          iag2 = ia[2]._interactiveGroup.attr('transform'),
          re = /rotate\((\d+)\)/,
          g0 = re.exec(iag0),
          g1 = re.exec(iag1),
          g2 = re.exec(iag2);

      assert.equal(g0[1], "180");
      assert.equal(g1[1], "300");
      assert.equal(g2[1], "420");
    });

    test('radialAxis axis gets correct calculated attrs', function() {
      var iAxes = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(axes[0].seriesId, "y1");
      assert.equal(axes[0].title, "2nd Title");
      assert.equal(axes[0].disableTicks, false);
      assert.equal(axes[0].titleLocation.anchor, 'middle');
      assert.closeTo(axes[0].titleLocation.x, 0,1);
      assert.equal(axes[0].titleLocation.y, 240);
      assert.equal(axes[0].titleLocation.r, -180);

      assert.equal(axes[1].seriesId, "y2");
      assert.equal(axes[1].title, "Third Title");
      assert.equal(axes[1].disableTicks, true);
      assert.equal(axes[1].titleLocation.anchor, 'start');
      assert.closeTo(axes[1].titleLocation.x, -10,1);
      assert.closeTo(axes[1].titleLocation.y, 246,1);
      assert.equal(axes[1].titleLocation.r, -300);

      assert.equal(axes[2].seriesId, "y3");
      assert.equal(axes[2].title, "New Title");
      assert.equal(axes[2].disableTicks, true);
      assert.equal(axes[2].titleLocation.anchor, 'end');
      assert.closeTo(axes[2].titleLocation.x, 10,1);
      assert.closeTo(axes[2].titleLocation.y, 246,1);
      assert.equal(axes[2].titleLocation.r, -420);
    });

    test('radialAxis displayedValues', function() {
      assert.equal(radialAxis.displayedValues.y1, '2nd Title');
      assert.equal(radialAxis.displayedValues.y2, 'Third...Title [bofs]');
      assert.equal(radialAxis.displayedValues.y3, 'New Title [bofs]');
    });

    test('radialAxis drawnTickValues', function() {
      var iAxes = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axes = [];

      for(var i=0; i<iAxes.length; i++) {
        axes.push(Polymer.dom(iAxes[i].root).querySelector('px-vis-axis'));
      }

      assert.equal(JSON.stringify(axes[0].drawnTickValues), '[10,20,30,40,50,60,70]');
    });

    test('radialAxis first axis ticks are correct', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[0].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.equal(ticks[0].textContent, "10");
      assert.equal(ticks[1].textContent, "20");
      assert.equal(ticks[2].textContent, "30");
      assert.equal(ticks[3].textContent, "40");
      assert.equal(ticks[4].textContent, "50");
      assert.equal(ticks[5].textContent, "60");
      assert.equal(ticks[6].textContent, "70");
    });

    test('radialAxis second axis ticks are removed', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[1].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.lengthOf(ticks,0);
    });

    test('radialAxis third axis ticks are removed', function() {
      var ia = Polymer.dom(radialAxis.root).querySelectorAll('px-vis-interactive-axis'),
          axis = Polymer.dom(ia[1].root).querySelectorAll('px-vis-axis')[0],
          ticks = axis._axisGroup.selectAll('g.tick').nodes();

      assert.lengthOf(ticks,0);
    });
  });

} //runTests
