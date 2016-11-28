document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-cursor does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });
  suite('px-vis-cursor setup SVG', function() {
    var baseSVG = document.getElementById('baseSVG');
    var baseScale = document.getElementById('baseScale');

    suiteSetup(function(){
      var w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        completeSeriesConfig = {"mySeries":{
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        },
        "mySeries2":{
          "type":"line",
          "name":"mySeries2",
          "x":"x",
          "y":"y2",
          "color": "rgb(250,164,58)"
        }};

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('completeSeriesConfig',completeSeriesConfig);

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);
    });

    test('baseCursor fixture is created', function() {
      assert.isTrue(baseSVG !== null);
    });
  });

  baseTests('baseCursor','full','full','yes',[0,500],[0,300]);
  addTooltipTests('baseCursor',true,true,true,500,[170,240],['translate(260,0)','translate(260)'],[['240','170'],['240','240']]);
  removeTooltipTests('baseCursor');

  baseTests('hLineLeftCursor','left','full','yes',[0,500],[0,300]);
  addTooltipTests('hLineLeftCursor',true,true,true,240,[170,240],['translate(260,0)','translate(260)'],[['240','170'],['240','240']]);
  removeTooltipTests('hLineLeftCursor');

  baseTests('hLineRightCursor','right','full','yes',[0,500],[0,300]);
  addTooltipTests('hLineRightCursor',true,true,true,500,[170,240],['translate(260,0)','translate(260)'],[['240','170'],['240','240']]);
  removeTooltipTests('hLineRightCursor');

  baseTests('hLineNoneCursor','none','full','yes',[0,500],[0,300]);
  addTooltipTests('hLineNoneCursor',false,true,true,500,[170,240],['translate(260,0)','translate(260)'],[['240','170'],['240','240']]);
  removeTooltipTests('hLineNoneCursor');

  baseTests('vLineTopCursor','full','top','yes',[0,500],[0,300]);
  addTooltipTests('vLineTopCursor',true,true,true,500,[170,240],'translate(240,170)',[['240','170'],['240','240']]);
  removeTooltipTests('vLineTopCursor');

  baseTests('vLineBottomCursor','full','bottom','yes',[0,500],[0,300]);
  addTooltipTests('vLineBottomCursor',true,true,true,500,[170,240],'translate(240,240)',[['240','170'],['240','240']]);
  removeTooltipTests('vLineBottomCursor');

  baseTests('vLineNoneCursor','full','none','yes',[0,500],[0,300]);
  addTooltipTests('vLineNoneCursor',true,false,true,500,[170,240],['translate(260,0)','translate(260)'],[['240','170'],['240','240']]);
  removeTooltipTests('vLineNoneCursor');

  baseTests('circleNoCursor','full','full','no',[0,500],[0,300]);
  addTooltipTests('circleNoCursor',true,true,false,500,[170,240],['translate(260,0)','translate(260)'],[['240','170'],['240','240']]);
  removeTooltipTests('circleNoCursor');
} //runTests

function baseTests(elem,hLine,vLine,circle,hArr,yArr){
  suite('px-vis-cursor ' + elem + ' setup works', function() {
    var baseScale = document.getElementById('baseScale');
    var cursor = document.getElementById(elem),
        colorOrder = commonColors.properties.seriesColorOrder.value,
        colorSet = commonColors.properties.dataVisColors.value;

    suiteSetup(function(done){
      var d = [{
            "x": 1397102460000,
            "y": 1,
            "y2": 3
          },{
            "x": 1397131620000,
            "y": 6,
            "y2": 4
          },{
            "x": 1397160780000,
            "y": 10,
            "y2": 3
          },{
            "x": 1397189940000,
            "y": 4,
            "y2": 3
          },{
            "x": 1397219100000,
            "y": 6,
            "y2": 3
          }
        ],
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        };

      baseScale.set('chartData',d);
      baseScale.set('chartExtents',chartExtents);

      cursor.set('width',w);
      cursor.set('height',h);
      cursor.set('margin',m);
      cursor.set('chartData',d);
      // setTimeout(function(){ done(); },500);
      done();
    });

    test(elem + ' fixture is created', function() {
      assert.isTrue(cursor !== null);
    });
    test(elem + ' fixture horizontalLine is ' + hLine, function() {
      assert.equal(cursor.horizontalLine, hLine);
    });
    test(elem + ' fixture verticalLine is vLine' + vLine, function() {
      assert.equal(cursor.verticalLine, vLine);
    });
    test(elem + ' fixture circlePoint is ' + circle, function() {
      assert.equal(cursor.circlePoint, circle);
    });

    test(elem + ' _cursor is a g elem', function() {
      assert.equal(cursor._cursor.node().tagName,'g');
    });
    test(elem + ' _cursor is hidden', function() {
      assert.equal(cursor._cursor.attr('display'),'none');
    });

    if(hLine === 'none'){
      test(elem + ' no horizontal lines are created', function() {
        assert.isUndefined(cursor._hLines);
      });
    } else {
      test(elem + ' correct number of _hLines are created', function() {
        assert.equal(cursor._hLines.nodes().length,2);
      });
      test(elem + ' _hLines tag', function() {
        assert.equal(cursor._hLines.node().tagName,'line');
      });
      test(elem + ' _hLines x1', function() {
        assert.equal(cursor._hLines.attr('x1'),hArr[0]);
      });
      test(elem + ' _hLines x2', function() {
        assert.equal(cursor._hLines.attr('x2'),hArr[1]);
      });
    }
    if(vLine === 'none'){
    } else {
      test(elem + ' _vLines tag', function() {
        assert.equal(cursor._vLine.node().tagName,'line');
      });
      test(elem + ' _vLine y1', function() {
        assert.equal(cursor._vLine.attr('y1'),yArr[0]);
      });
      test(elem + ' _vLine y2', function() {
        assert.equal(cursor._vLine.attr('y2'),yArr[1]);
      });
    }

    if(circle === 'no'){

    } else {
      test(elem + ' correct number of _circles are created', function() {
        assert.equal(cursor._circles.nodes().length,2);
      });
      test(elem + ' _circles tag', function() {
        assert.equal(cursor._circles.node().tagName,'circle');
      });
      test(elem + ' _circles[0] fill', function() {
        assert.equal(cursor._circles.nodes()[0].getAttribute('fill').split(' ').join(''),colorSet[colorOrder[0]]);
      });
      test(elem + ' _circles[0] stroke', function() {
        assert.equal(cursor._circles.nodes()[0].getAttribute('stroke').split(' ').join(''),colorSet[colorOrder[0]]);
      });
      test(elem + ' _circles[1] fill', function() {
        assert.equal(cursor._circles.nodes()[1].getAttribute('fill').split(' ').join(''),colorSet[colorOrder[1]]);
      });
      test(elem + ' _circles[0] stroke', function() {
        assert.equal(cursor._circles.nodes()[1].getAttribute('stroke').split(' ').join(''),colorSet[colorOrder[1]]);
      });
    }
  }); //suite
}

function addTooltipTests(elem,hLine,vLine,circle,hX2,hTransformArr,vTransform,cArr){
  suite('px-vis-cursor ' + elem + ' tooltipData added simulating chart mouseover', function() {
    var cursor = document.getElementById(elem);

    suiteSetup(function(done){
      var d = {
        'time': 1397160780000,
        'series': [
          {'name':'mySeries1','coord': [240,170] },
          {'name':'mySeries2','coord': [240,240] },
        ],
        'mouse': [260,150],
        'xArr': [240,240],
        'yArr': [170,240]
      };

      cursor.set('tooltipData',d);
      // setTimeout(function(){ done(); },1000);
      done();
    });

    test(elem + ' fixture is created', function() {
      assert.isTrue(cursor !== null);
    });

    test(elem + ' _cursor is shown', function() {
      assert.equal(cursor._cursor.attr('display'),null);
    });

    if(hLine) {
      test(elem + ' _hLines x2', function() {
        assert.equal(cursor._hLines.attr('x2'),hX2);
      });
      test(elem + ' _hLines0 y1', function() {
        assert.equal(d3.select(cursor._hLines.nodes()[0]).attr('y1'),hTransformArr[0]);
      });
      test(elem + ' _hLines0 y2', function() {
        assert.equal(d3.select(cursor._hLines.nodes()[0]).attr('y2'),hTransformArr[0]);
      });
      test(elem + ' _hLines1 y1', function() {
        assert.equal(d3.select(cursor._hLines.nodes()[1]).attr('y1'),hTransformArr[1]);
      });
      test(elem + ' _hLines1 y2', function() {
        assert.equal(d3.select(cursor._hLines.nodes()[1]).attr('y2'),hTransformArr[1]);
      });
    }

    if(vLine) {
      test(elem + ' _vLine transform', function() {
        if(typeof(vTransform)==='object'){
          // Stupid MS IE/Edge
          assert.isTrue(cursor._vLine.attr('transform').split(" ").join(',') === vTransform[0] || cursor._vLine.attr('transform').split(" ").join(',') === vTransform[1]);
        } else {
          assert.equal(cursor._vLine.attr('transform').split(" ").join(','),vTransform);
        }
      });
    }

    if(circle) {
      test(elem + ' _circles[0] cx', function() {
        assert.equal(cursor._circles.nodes()[0].getAttribute('cx'),cArr[0][0]);
      });
      test(elem + ' _circles[0] cy', function() {
        assert.equal(cursor._circles.nodes()[0].getAttribute('cy'),cArr[0][1]);
      });
      test(elem + ' _circles[1] cx', function() {
        assert.equal(cursor._circles.nodes()[1].getAttribute('cx'),cArr[1][0]);
      });
      test(elem + ' _circles[1] cy', function() {
        assert.equal(cursor._circles.nodes()[1].getAttribute('cy'),cArr[1][1]);
      });
    }
  }); //suite
}

function removeTooltipTests(elem){
  suite('px-vis-cursor ' + elem + ' tooltipData removed simulating chart mouseout', function() {
    var cursor = document.getElementById(elem);

    suiteSetup(function(done){
      var d = {
        'time': null,
        'series': [
          {'name':'mySeries1' },
          {'name':'mySeries2' },
        ],
        'mouse': null,
        'xArr': null,
        'yArr': null
      };

      cursor.set('tooltipData',d);
      // setTimeout(function(){ done(); },500);
      done();
    });

    test(elem + ' fixture is created', function() {
      assert.isTrue(cursor !== null);
    });

    test(elem + ' _cursor is hidden again', function() {
      assert.equal(cursor._cursor.attr('display'),'none');
    });
  }); //suite
}
