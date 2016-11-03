document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-axis-brush does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-axis-brush basic setup works', function() {
    var multiScale = document.getElementById('multiScale'),
        multiSVG = document.getElementById('multiSVG'),
        multiBrush = document.getElementById('multiBrush');
    var colors = commonColors.properties.colors.value;

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

        var g = multiSVG.svg.selectAll('g.dimension')
            .data(dim);
        g.enter()
          .append("g")
          .attr("class", "dimension")
          .attr("dimension", function(d) { return d })
          .attr("transform", function(d,i) {
            return "translate(" + (50 * i) + ",0)";
          });

        multiBrush.set('margin',m);
        multiBrush.set('height',h);
        multiBrush.set('seriesKey',"x");
        multiBrush.set('dimensions',dim);
        multiBrush.set('chartData',d);
        multiBrush.set('svg',multiSVG.svg.selectAll('g.dimension'));

      setTimeout(function(){done()},500);
      // done();
    });

    test('multiBrush fixture is created', function() {
      assert.isTrue(multiBrush !== null);
    });

    test('multiBrush._brushes are created', function() {
      assert.equal(multiBrush._brushes.nodes().length, 3);
    });
    test('multiBrush._brushes is not selected', function() {
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[0]),null);
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[1]),null);
      assert.equal(Px.d3.brushSelection(multiBrush._brushes.nodes()[2]),null);
    });
  });

  suite('px-vis-axis-brush brush resizes to the inputed domain', function() {
    var multiBrush = document.getElementById('multiBrush');
    var d = [9,16];
    suiteSetup(function(done) {
      Px.d3.select(multiBrush._brushes.nodes()[1]).call(multiBrush._brush.move,d);
       setTimeout(function(){done()},100);
      //done();
    });

    test('multiBrush._brush extents match', function() {
      assert.deepEqual(Px.d3.brushSelection(multiBrush._brushes.nodes()[1]),d);
    });
    // test('multiBrush._brushGroup.rect attr x', function() {
    //   assert.equal(multiBrush._brushGroup.select('rect.selection').attr('x'), 120);
    // });
    // test('multiBrush._brushGroup.rect attr width', function() {
    //   assert.closeTo(Number(multiBrush._brushGroup.select('rect.selection').attr('width')), 240,1);
    // });
  });

  // suite('px-vis-axis-brush click on navigator and the extent box should move to that point', function() {
  //   var multiBrush = document.getElementById('multiBrush');
  //   suiteSetup(function(done){
  //     var rect = multiBrush._brushGroup.select('rect.overlay').node(),
  //         box = rect.getBoundingClientRect();
  //
  //     var e = document.createEvent("MouseEvent");
  //     e.initMouseEvent("mousedown",true,true,window,0,0,0,box.left,box.top + box.height/2,false,false,false,false,0,null);
  //
  //     rect.dispatchEvent(e);
  //
  //     setTimeout(function(){done()},1000);
  //   });
  //
  //   test('multiBrush._brush extents match', function() {
  //     var ext = Px.d3.brushSelection(multiBrush._brushGroup.node()),
  //         x1 = baseScale.x(1397102460000),
  //         x2 = baseScale.x(1397160780000);
  //
  //     assert.closeTo(ext[0],x1,5);
  //     assert.closeTo(ext[1],x2,5);
  //   });
  //   test('multiBrush._brushGroup.rect attr x', function() {
  //     assert.closeTo(parseInt(multiBrush._brushGroup.select('rect.selection').attr('x')), 0, 6);
  //   });
  //   test('multiBrush._brushGroup.rect attr width', function() {
  //
  //     assert.closeTo(parseInt(multiBrush._brushGroup.select('rect.selection').attr('width')), 240,1);
  //   });
  // });
  //
  // suite('px-vis-axis-brush brush reset inputed domain', function() {
  //   var multiBrush = document.getElementById('multiBrush');
  //
  //   suiteSetup(function(done){
  //     var d = [1397102460000,1397219100000];
  //
  //     multiBrush.set('chartDomain',d);
  //     setTimeout(function(){done()},500);
  //     // flush(function() {
  //     //   done();
  //     // });
  //
  //   });
  //
  //   test('multiBrush._brush extents are full', function() {
  //     var x1 = baseScale.x(1397102460000),
  //         x2 = baseScale.x(1397219100000);
  //     assert.deepEqual(Px.d3.brushSelection(multiBrush._brushGroup.node()),[x1,x2]);
  //   });
  //   test('multiBrush._brushGroup.rect attr x', function() {
  //     assert.closeTo(Number(multiBrush._brushGroup.select('rect.selection').attr('x')), 0, 5);
  //   });
  //   test('multiBrush._brushGroup.rect attr width', function() {
  //     assert.equal(multiBrush._brushGroup.select('rect.selection').attr('width'), 480);
  //   });
  // });
  //
  // suite('px-vis-axis-brush handle mouseover ', function() {
  //   var colors = commonColors.properties.colors.value;
  //
  //   suiteSetup(function(done){
  //     var box = multiBrush._handleGroup.node().getBoundingClientRect();
  //
  //     var e = document.createEvent("MouseEvent");
  //     e.initMouseEvent("mouseenter",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
  //     // For stupid MS Edge
  //     var e2 = document.createEvent("MouseEvent");
  //     e2.initMouseEvent("mouseover",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
  //
  //     multiBrush._handleGroup.node().dispatchEvent(e);
  //     multiBrush._handleGroup.node().dispatchEvent(e2);
  //
  //     setTimeout(function(){done()},10);
  //   });
  //
  //   test('multiBrush._handleGroup rect stroke changes', function() {
  //     assert.equal(multiBrush._handleGroup.attr('stroke').split(' ').join(''), colors.gray6);
  //   });
  //   test('multiBrush._handleGroup rect fill changes', function() {
  //     assert.equal(multiBrush._handleGroup.attr('fill').split(' ').join(''), colors.gray5);
  //   });
  //   // test('multiBrush._handleGroup lines stroke changes', function() {
  //   //   assert.equal(multiBrush._handleGroup.select('line.handleLine').attr('stroke').split(' ').join(''), colors.gray6);
  //   // });
  // });
} //runTests
