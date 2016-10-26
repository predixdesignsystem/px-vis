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
    var multiScale = document.getElementById('multiScale'),
        multiSVG = document.getElementById('multiSVG'),
        multiAxis = document.getElementById('multiAxis');

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
            "color": "rgb(93,165,218)"
          },
          "y": {
            "title": "First Title"
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
      multiScale.set('axes',dim);
      multiScale.set('completeSeriesConfig',completeSeriesConfig);
      multiScale.set('chartExtents',ext);
      multiScale.set('chartData',d);

      multiAxis.set('margin',m);
      multiAxis.set('width',w);
      multiAxis.set('height',h);
      multiAxis.set('seriesKey','x');
      multiAxis.set('completeSeriesConfig',completeSeriesConfig);
      multiAxis.set('dimensions',dim);
      multiAxis.set('axes',dim);
      multiAxis.set('chartData',d);

      setTimeout(function(){done()},300);
     // done();
    });

    test('multiAxis fixture is created', function() {
      assert.isTrue(multiAxis !== null);
    });

    test('multiAxis heightOrLen is height', function() {
      assert.equal(multiAxis._heightOrLen, 500);
    });

    test('multiAxis created three groups', function() {
      assert.equal(multiAxis.axisGroups.nodes().length, 3);
    });

    test('multiAxis each group is transformed correctly', function() {
      var re = /translate\((\d+)\s?,?\d*\)/,
          gs = multiAxis.axisGroups.nodes(),
          g0 = re.exec(Px.d3.select(gs[0]).attr('transform')),
          g1 = re.exec(Px.d3.select(gs[1]).attr('transform')),
          g2 = re.exec(Px.d3.select(gs[2]).attr('transform'));

      assert.equal(g0[1], "80");
      assert.equal(g1[1], "240");
      assert.equal(g2[1], "400");
    });

    test('multiAxis axis gets correct calculated attrs', function() {
      var axes = multiAxis.getElementsByTagName('px-vis-axis');

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "First Title");
      assert.equal(JSON.stringify(axes[0].tickValues), '[0,1,2,3,4,5,6,7,8,9,10]');
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(JSON.stringify(axes[1].tickValues), '[0,2,4,6,8,10,12,14,16,18,20]');
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(JSON.stringify(axes[2].tickValues), '[0,3,6,9,12,15,18,21,24,27,30]');
      assert.equal(axes[2].disableTicks, false);
    });

    test('multiAxis gridTicks', function() {
      assert.equal(JSON.stringify(multiAxis.gridTicks), '[0,1,2,3,4,5,6,7,8,9,10]');
    });

    test('multiAxis displayedValues', function() {
      assert.equal(multiAxis.displayedValues.y, 'First...Title');
      assert.equal(multiAxis.displayedValues.y1, '2nd Title');
      assert.equal(multiAxis.displayedValues.y2, 'Third...Title [bofs]');
    });
  });


  suite('px-vis-multi-axis add a dimension', function() {
    var multiScale = document.getElementById('multiScale'),
        multiSVG = document.getElementById('multiSVG'),
        multiAxis = document.getElementById('multiAxis');

    suiteSetup(function(done){
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
          "y": {
            "title": "First Title"
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
        ext = {'x': dim, 'y':{'y':[1,10], 'y1':[1,20], 'y2':[1,27], 'y3':[5,75] }},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      multiScale.set('axes',dim);
      multiAxis.set('dimensions',dim);
      multiAxis.set('axes',dim);

      multiScale.set('completeSeriesConfig',completeSeriesConfig);
      multiScale.set('chartExtents',ext);
      multiScale.set('chartData',d);

      multiAxis.set('completeSeriesConfig',completeSeriesConfig);

      multiAxis.set('chartData',d);

      setTimeout(function(){
        console.log(multiAxis.domainChanged);
        done()},300);
     // done();
    });

    test('multiAxis fixture is created', function() {
      assert.isTrue(multiAxis !== null);
    });

    test('multiAxis created three groups', function() {
      assert.equal(multiAxis.axisGroups.nodes().length, 4);
    });

    test('multiAxis each group is transformed correctly', function() {
      var re = /translate\((\d+)\s?,?\d*\)/,
          gs = multiAxis.axisGroups.nodes(),
          g0 = re.exec(Px.d3.select(gs[0]).attr('transform')),
          g1 = re.exec(Px.d3.select(gs[1]).attr('transform')),
          g2 = re.exec(Px.d3.select(gs[2]).attr('transform')),
          g3 = re.exec(Px.d3.select(gs[3]).attr('transform'));

      assert.equal(g0[1], "60");
      assert.equal(g1[1], "180");
      assert.equal(g2[1], "300");
      assert.equal(g3[1], "420");
    });


    test('multiAxis axis gets correct calculated attrs', function() {
      var axes = multiAxis.getElementsByTagName('px-vis-axis');

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "First Title");
      assert.equal(JSON.stringify(axes[0].tickValues), '[0,1,2,3,4,5,6,7,8,9,10]');
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(JSON.stringify(axes[1].tickValues), '[0,2,4,6,8,10,12,14,16,18,20]');
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(JSON.stringify(axes[2].tickValues), '[0,3,6,9,12,15,18,21,24,27,30]');
      assert.equal(axes[2].disableTicks, false);

      assert.equal(axes[3].seriesId, "y3");
      assert.equal(axes[3].title, "New Title");
      assert.equal(JSON.stringify(axes[3].tickValues), '[0,8,16,24,32,40,48,56,64,72,80]');
      assert.equal(axes[3].disableTicks, false);
    });

    test('multiAxis displayedValues', function() {
      assert.equal(multiAxis.displayedValues.y, 'First...Title');
      assert.equal(multiAxis.displayedValues.y1, '2nd Title');
      assert.equal(multiAxis.displayedValues.y2, 'Third...Title [bofs]');
      assert.equal(multiAxis.displayedValues.y3, 'New Title [bofs]');
    });
  });

  suite('px-vis-multi-axis delete a dimension', function() {
    var multiScale = document.getElementById('multiScale'),
        multiSVG = document.getElementById('multiSVG'),
        multiAxis = document.getElementById('multiAxis');

    suiteSetup(function(done){
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
        ext = {'x': dim, 'y':{'y1':[1,20], 'y2':[1,27], 'y3':[5,75] }},
        m = {
          "top": 10,
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      multiScale.set('axes',dim);
      multiAxis.set('dimensions',dim);
      multiAxis.set('axes',dim);

      multiScale.set('completeSeriesConfig',completeSeriesConfig);
      multiScale.set('chartExtents',ext);
      multiScale.set('chartData',d);

      multiAxis.set('completeSeriesConfig',completeSeriesConfig);

      multiAxis.set('chartData',d);

      setTimeout(function(){
        done()},500);
     // done();
    });

    test('multiAxis fixture is created', function() {
      assert.isTrue(multiAxis !== null);
    });

    test('multiAxis created three groups', function() {
      assert.equal(multiAxis.axisGroups.nodes().length, 3);
    });

    test('multiAxis each group is transformed correctly', function() {
      var re = /translate\((\d+)\s?,?\d*\)/,
          gs = multiAxis.axisGroups.nodes(),
          g0 = re.exec(Px.d3.select(gs[0]).attr('transform')),
          g1 = re.exec(Px.d3.select(gs[1]).attr('transform')),
          g2 = re.exec(Px.d3.select(gs[2]).attr('transform'));

      assert.equal(g0[1], "80");
      assert.equal(g1[1], "240");
      assert.equal(g2[1], "400");
    });


    test('multiAxis axis gets correct calculated attrs', function() {
      var axes = multiAxis.getElementsByTagName('px-vis-axis');

      assert.equal(axes[0].seriesId, "y1");
      assert.equal(axes[0].title, "2nd Title");
      assert.equal(JSON.stringify(axes[0].tickValues), '[0,2,4,6,8,10,12,14,16,18,20]');
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y2");
      assert.equal(axes[1].title, "Third Title");
      assert.equal(JSON.stringify(axes[1].tickValues), '[0,3,6,9,12,15,18,21,24,27,30]');
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y3");
      assert.equal(axes[2].title, "New Title");
      assert.equal(JSON.stringify(axes[2].tickValues), '[0,8,16,24,32,40,48,56,64,72,80]');
      assert.equal(axes[2].disableTicks, false);
    });

    test('multiAxis displayedValues', function() {
      assert.equal(multiAxis.displayedValues.y1, '2nd Title');
      assert.equal(multiAxis.displayedValues.y2, 'Third...Title [bofs]');
      assert.equal(multiAxis.displayedValues.y3, 'New Title [bofs]');
    });
  });


  suite('px-vis-multi-axis common axis setup works', function() {
    var multiScaleCommon = document.getElementById('multiScaleCommon'),
        multiSVGCommon = document.getElementById('multiSVGCommon'),
        multiAxisCommon = document.getElementById('multiAxisCommon');

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
            "color": "rgb(93,165,218)"
          },
          "y": {
            "title": "First Title"
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
        ext = {'x': dim, 'y':{'y':[1,27], 'y1':[1,27], 'y2':[1,27]}},
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
      multiScaleCommon.set('axes',dim);
      multiScaleCommon.set('completeSeriesConfig',completeSeriesConfig);
      multiScaleCommon.set('chartExtents',ext);
      multiScaleCommon.set('chartData',d);

      multiAxisCommon.set('margin',m);
      multiAxisCommon.set('width',w);
      multiAxisCommon.set('height',h);
      multiAxisCommon.set('seriesKey','x');
      multiAxisCommon.set('completeSeriesConfig',completeSeriesConfig);
      multiAxisCommon.set('dimensions',dim);
      multiAxisCommon.set('axes',dim);
      multiAxisCommon.set('chartData',d);

      setTimeout(function(){done()},300);
     // done();
    });

    test('multiAxisCommon fixture is created', function() {
      assert.isTrue(multiAxisCommon !== null);
    });

    test('multiAxisCommon heightOrLen is height', function() {
      assert.equal(multiAxisCommon._heightOrLen, 500);
    });

    test('multiAxisCommon created three groups', function() {
      assert.equal(multiAxisCommon.axisGroups.nodes().length, 3);
    });

    test('multiAxisCommon each group is transformed correctly', function() {
      var re = /translate\((\d+)\s?,?\d*\)/,
          gs = multiAxisCommon.axisGroups.nodes(),
          g0 = re.exec(Px.d3.select(gs[0]).attr('transform')),
          g1 = re.exec(Px.d3.select(gs[1]).attr('transform')),
          g2 = re.exec(Px.d3.select(gs[2]).attr('transform'));

      assert.equal(g0[1], "80");
      assert.equal(g1[1], "240");
      assert.equal(g2[1], "400");
    });


    test('multiAxisCommon axis gets correct calculated attrs', function() {
      var axes = multiAxisCommon.getElementsByTagName('px-vis-axis');

      assert.equal(axes[0].seriesId, "y");
      assert.equal(axes[0].title, "First Title");
      assert.equal(axes[0].disableTicks, false);

      assert.equal(axes[1].seriesId, "y1");
      assert.equal(axes[1].title, "2nd Title");
      assert.equal(axes[1].disableTicks, false);

      assert.equal(axes[2].seriesId, "y2");
      assert.equal(axes[2].title, "Third Title");
      assert.equal(axes[2].disableTicks, false);
    });

    test('multiAxisCommon creates the correct number of ticks', function() {
      var ticks0 = Px.d3.select(multiAxisCommon.axisGroups.nodes()[0]).selectAll('g.tick').nodes(),
          ticks1 = Px.d3.select(multiAxisCommon.axisGroups.nodes()[1]).selectAll('g.tick').nodes(),
          ticks2 = Px.d3.select(multiAxisCommon.axisGroups.nodes()[2]).selectAll('g.tick').nodes();

      assert.equal(ticks0.length, 13);
      assert.equal(ticks1.length, 13);
      assert.equal(ticks2.length, 13);
    });

    test('multiAxisCommon first axis ticks are correct', function() {
      var ticks = Px.d3.select(multiAxisCommon.axisGroups.nodes()[0]).selectAll('g.tick').nodes();

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

    test('multiAxisCommon second axis matches correct', function() {
      var ticks = Px.d3.select(multiAxisCommon.axisGroups.nodes()[1]).selectAll('g.tick').nodes();

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

    test('multiAxisCommon third axis matches correct', function() {
      var ticks = Px.d3.select(multiAxisCommon.axisGroups.nodes()[2]).selectAll('g.tick').nodes();

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
      var ticks0 = Px.d3.select(multiAxisCommon.axisGroups.nodes()[0]).selectAll('g.tick text').nodes(),
          ticks1 = Px.d3.select(multiAxisCommon.axisGroups.nodes()[1]).selectAll('g.tick text').nodes(),
          ticks2 = Px.d3.select(multiAxisCommon.axisGroups.nodes()[2]).selectAll('g.tick text').nodes();
      
      assert.equal(ticks0[0].className.baseVal, "");
      assert.equal(ticks1[0].className.baseVal, "hideCommon");
      assert.equal(ticks2[0].className.baseVal, "hideCommon");

    });


    test('multiAxisCommon displayedValues', function() {
      assert.equal(multiAxisCommon.displayedValues.y, 'First...Title');
      assert.equal(multiAxisCommon.displayedValues.y1, '2nd Title');
      assert.equal(multiAxisCommon.displayedValues.y2, 'Third...Title [bofs]');
    });
  });


  // suite('px-vis-axis basic setup works', function() {
  //   var multiScale = document.getElementById('multiScale'),
  //       multiSVG = document.getElementById('multiSVG'),
  //       multiAxis = document.getElementById('multiAxis');
  //
  //   suiteSetup(function(done){
  //     var d = [{
  //           "x": 1397102460000,
  //           "y": 1,
  //           "y1": 1,
  //           "y2": 1
  //         },{
  //           "x": 1397131620000,
  //           "y": 6,
  //           "y1": 15,
  //           "y2": 21
  //         },{
  //           "x": 1397160780000,
  //           "y": 10,
  //           "y1": 8,
  //           "y2": 3
  //         },{
  //           "x": 1397189940000,
  //           "y": 4,
  //           "y1": 10,
  //           "y2": 10
  //         },{
  //           "x": 1397219100000,
  //           "y": 6,
  //           "y1": 20,
  //           "y2": 27
  //         }
  //       ],
  //       completeSeriesConfig = {
  //         "x":{
  //           "type":"line",
  //           "name":"mySeries",
  //           "x":['y','y1','y2'],
  //           "y":['y','y1','y2'],
  //           "color": "rgb(93,165,218)"
  //         }
  //       },
  //       dim = ['y','y1','y2'],
  //       w = 500,
  //       h = 300,
  //       min = 480/2,
  //       offset = [250,250],
  //       ext = {'x': dim, 'y':{'y':[1,10], 'y1':[1,20], 'y2':[1,27]}},
  //       m = {
  //         "top": 10,
  //         "right": 10,
  //         "bottom": 10,
  //         "left": 10
  //       };
  //
  //     multiSVG.set('width',w);
  //     multiSVG.set('height',h);
  //     multiSVG.set('margin',m);
  //
  //     multiScale.set('width',w);
  //     multiScale.set('height',h);
  //     multiScale.set('margin',m);
  //     multiScale.set('axes',dim);
  //     multiScale.set('completeSeriesConfig',completeSeriesConfig);
  //     multiScale.set('chartExtents',ext);
  //     multiScale.set('chartData',d);
  //
  //     multiAxis.set('margin',m);
  //     multiAxis.set('width',w);
  //     multiAxis.set('height',h);
  //     multiAxis.set('seriesKey','x');
  //     multiAxis.set('completeSeriesConfig',completeSeriesConfig);
  //     multiAxis.set('dimensions',dim);
  //     multiAxis.set('axes',dim);
  //     multiAxis.set('chartData',d);
  //
  //     setTimeout(function(){done()},100);
  //    // done();
  //   });
  //
  //   test('multiAxis fixture is created', function() {
  //     debugger
  //     assert.isTrue(multiAxis !== null);
  //   });
  //
  //   test('multiAxis created three groups', function() {
  //
  //     assert.isTrue(multiAxis !== null);
  //   });
  //
  //   test('multiAxis heightOrLen is height', function() {
  //     assert.isTrue(multiAxis._heightOrLen, 500);
  //   });
  // });

} //runTests
