document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-axis does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-axis basic setup works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseXAxis = document.getElementById('baseXAxis'),
        baseYAxis = document.getElementById('baseYAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        };
      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('completeSeriesConfig',completeSeriesConfig);
      baseScale.set('chartExtents',chartExtents);
      baseScale.set('chartData',d);

      baseXAxis.set('margin',m);
      baseXAxis.set('height',h);
      baseXAxis.set('completeSeriesConfig',completeSeriesConfig);

      baseYAxis.set('margin',m);
      baseYAxis.set('height',h);
      baseYAxis.set('completeSeriesConfig',completeSeriesConfig);
      baseYAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('baseXAxis fixture is created', function() {
      assert.isTrue(baseXAxis !== null);
    });
    test('baseYAxis fixture is created', function() {
      assert.isTrue(baseYAxis !== null);
    });
  });

  suite('px-vis-axis basicXAxis works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseXAxis = document.getElementById('baseXAxis');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;
    var colors = commonColors.properties.colors.value;

    test('baseXAxis ID is random', function() {
      assert.equal(baseXAxis.axisId.length,15);
      assert.equal(baseXAxis.axisId.split('_')[0],'axis');
    });

    // test('baseXAxis _axis orientation', function() {
    //   assert.equal(baseXAxis._axis.orient(),'bottom');
    // });
    test('baseXAxis _axis tickSizeOuter', function() {
      assert.equal(baseXAxis._axis.tickSizeOuter(),0);
    });
    test('baseXAxis _axis tickSizeInner', function() {
      assert.equal(baseXAxis._axis.tickSizeInner(),6);
    });

    test('baseXAxis translateAmt', function() {
      assert.equal(JSON.stringify(baseXAxis.translateAmt),'[0,240]');
    });

    test('baseXAxis _axisGroup created', function() {
      assert.equal(baseXAxis._axisGroup.node().tagName,'g');
    });
    test('baseXAxis _axisGroup translation', function() {
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          s = baseXAxis._axisGroup.attr('transform'),
          arr = re.exec(s);
      assert.equal(arr[1],'translate');
      assert.equal(parseFloat(arr[2]),0);
      assert.equal(parseFloat(arr[3]),240);
    });

    suite('_axisGroup lines and path styles', function() {
      var lines,path;
      suiteSetup(function(){
        lines = baseXAxis._axisGroup.selectAll('line');
        path = baseXAxis._axisGroup.selectAll('path');
      })

      // test('correct number of lines', function() {
      //   assert.equal(lines[0].length,11);
      // });
      test('correct number of paths', function() {
        assert.equal(path.nodes().length,1);
      });

      test('path has correct fill', function() {
        assert.equal(path.attr('fill'),'none');
      });
      test('path has correct stroke', function() {
        assert.equal(path.attr('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line0 has correct fill', function() {
        assert.equal(lines.nodes()[0].getAttribute('fill'),'none');
      });
      test('line0 has correct stroke', function() {
        assert.equal(lines.nodes()[0].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line3 has correct fill', function() {
        assert.equal(lines.nodes()[3].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[3].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line9 has correct fill', function() {
        assert.equal(lines.nodes()[9].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[9].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });
    });

    test('Title _titleGroup transform', function() {
      var attr = baseXAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),222.5,7);
      assert.closeTo(parseFloat(arr[3]),278,2);
    });

    test('Title _titleGroup text font-size', function() {
      var text = baseXAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('font-size'),'15px');
    });
    test('Title _titleGroup text rotate', function() {
      var text = baseXAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('transform'),'rotate(0)');
    });
    test('Title _titleGroup text text', function() {
      var text = baseXAxis._titleGroup.select('text.axis-title');
      assert.equal(text.text(),'myXTitle');
    });

  }); //suite

  suite('px-vis-axis basicYAxis works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseYAxis = document.getElementById('baseYAxis');

    var colorOrder = commonColors.properties.seriesColorOrder.value;
    var colorSet = commonColors.properties.dataVisColors.value;
    var colors = commonColors.properties.colors.value;

    test('baseYAxis ID is random', function() {
      assert.equal(baseYAxis.axisId.length,15);
      assert.equal(baseYAxis.axisId.split('_')[0],'axis');
    });

    // test('baseYAxis _axis orientation', function() {
    //   assert.equal(baseYAxis._axis.orient(),'left');
    // });
    test('baseYAxis _axis tickSizeOuter', function() {
      assert.equal(baseYAxis._axis.tickSizeOuter(),0);
    });
    test('baseYAxis _axis tickSizeInner', function() {
      assert.equal(baseYAxis._axis.tickSizeInner(),6);
    });

    test('baseYAxis translateAmt', function() {
      assert.equal(JSON.stringify(baseYAxis.translateAmt),'[0,0]');
    });

    test('baseYAxis _axisGroup created', function() {
      assert.equal(baseYAxis._axisGroup.node().tagName,'g');
    });
    test('baseYAxis _axisGroup translation', function() {
      assert.isTrue(baseYAxis._axisGroup.attr('transform') === 'translate(0,0)' || baseYAxis._axisGroup.attr('transform') === 'translate(0)');
    });

    suite('_axisGroup lines and path styles', function() {
      var lines,path;
      suiteSetup(function(){
        lines = baseYAxis._axisGroup.selectAll('line');
        path = baseYAxis._axisGroup.selectAll('path');
      })

      test('correct number of lines', function() {
        assert.equal(lines.nodes().length,11);
      });
      test('correct number of paths', function() {
        assert.equal(path.nodes().length,1);
      });

      test('path has correct fill', function() {
        assert.equal(path.attr('fill'),'none');
      });
      test('path has correct stroke', function() {
        assert.equal(path.attr('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line0 has correct fill', function() {
        assert.equal(lines.nodes()[0].getAttribute('fill'),'none');
      });
      test('line0 has correct stroke', function() {
        assert.equal(lines.nodes()[0].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line3 has correct fill', function() {
        assert.equal(lines.nodes()[3].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[3].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line9 has correct fill', function() {
        assert.equal(lines.nodes()[9].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines.nodes()[9].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });
    });

    test('Title _titleGroup transform', function() {
      var attr = baseYAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),-33,4.5);
      assert.closeTo(parseFloat(arr[3]),126,4.5);
    });

    test('Title _titleGroup text font-size', function() {
      var text = baseYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('font-size'),'15px');
    });
    test('Title _titleGroup text rotate', function() {
      var text = baseYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('transform'),'rotate(-90)');
    });
    test('Title _titleGroup text text', function() {
      var text = baseYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.text(),'myYTitle');
    });

    test('Title series bars draw', function() {
      var bar = baseYAxis._titleGroup.select('rect');
      assert.equal(bar.nodes().length,1);
    });
    test('Title series bars fill', function() {
      var bar = baseYAxis._titleGroup.select('rect');
      assert.equal(bar.attr('fill').split(' ').join(''),colorSet[colorOrder[0]]);
    });
    test('Title series bars opacity', function() {
      var bar = baseYAxis._titleGroup.select('rect');
      assert.equal(bar.attr('opacity'),null);
    });
    test('Title series bars id', function() {
      var bar = baseYAxis._titleGroup.select('rect');
      assert.equal(bar.attr('series-bar-id'),'bar_mySeries');
    });
    test('Title series bars translate', function() {
      var bar = baseYAxis._titleGroup.select('rect'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          s = bar.attr('transform'),
          arr = re.exec(s);
      assert.equal(arr[1],'translate');
      assert.equal(parseFloat(arr[2]),-12);
      assert.closeTo(parseFloat(arr[3]),-55,12);
    });
  }); //suite

  suite('px-vis-axis setLabelDims func works', function() {
    var baseXAxis = document.getElementById('baseXAxis');
    suite('bottom & after', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'bottom';
        baseXAxis.labelPosition = 'after';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, 3);
      });
      test('label y', function() {
        assert.equal(label.y, 3);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'start');
      });
    }); //suite

    suite('bottom & center', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'bottom';
        baseXAxis.labelPosition = 'center';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, 3);
      });
      test('label y', function() {
        assert.equal(label.y, 3);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'end');
      });
    }); //suite

    suite('top & after', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'top';
        baseXAxis.labelPosition = 'after';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, -3);
      });
      test('label y', function() {
        assert.equal(label.y, -3);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'start');
      });
    }); //suite

    suite('top & center', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'top';
        baseXAxis.labelPosition = 'center';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, -3);
      });
      test('label y', function() {
        assert.equal(label.y, -3);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'end');
      });
    }); //suite

    suite('left & after', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'left';
        baseXAxis.labelPosition = 'after';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, -8);
      });
      test('label y', function() {
        assert.equal(label.y, -8);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'end');
      });
    }); //suite

    suite('left & center', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'left';
        baseXAxis.labelPosition = 'center';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, -8);
      });
      test('label y', function() {
        assert.equal(label.y, 8);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'end');
      });
    }); //suite

    suite('right & after', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'right';
        baseXAxis.labelPosition = 'after';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, 8);
      });
      test('label y', function() {
        assert.equal(label.y, -8);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'start');
      });
    }); //suite

    suite('right & center', function() {
      var label;
      suiteSetup(function(){
        baseXAxis.orientation = 'right';
        baseXAxis.labelPosition = 'center';
        label = baseXAxis.setLabelDims();
      });
      test('label x', function() {
        assert.equal(label.x, 8);
      });
      test('label y', function() {
        assert.equal(label.y, 8);
      });
      test('label anchor', function() {
        assert.equal(label.anchor, 'start');
      });
    }); //suite
  }); //suite

  suite('px-vis-axis baseYAxis with mutedSeries', function() {
    var baseYAxis = document.getElementById('baseYAxis');

    suiteSetup(function(){
      var mutedSeries = {
        "mySeries":true
      };
      baseYAxis.set('mutedSeries',mutedSeries);
    });

    test('baseYAxis series box mutes', function() {
      var bar = baseYAxis._titleGroup.select('rect');
      assert.equal(bar.attr('opacity'),0.5);
    });
  });

  suite('px-vis-axis baseYAxis with mutedSeries', function() {
    var baseYAxis = document.getElementById('baseYAxis');

    suiteSetup(function(done){
      var mutedSeries = {
        "mySeries":false
      };
      baseYAxis.set('mutedSeries',mutedSeries);
      setTimeout(function(){done()},500)
    });

    test('baseYAxis series box mutes', function() {
      var bar = baseYAxis._titleGroup.select('rect');
      assert.equal(bar.attr('opacity'),1);
    });
  });


  suite('px-vis-axis parallel coordinates axis works', function() {
    var pcAxisSVG = document.getElementById('pcAxisSVG'),
        pcAxisScale = document.getElementById('pcAxisScale'),
        pcYAxis = document.getElementById('pcYAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)",
          "yAxisUnit": "BoF"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        };
      pcAxisSVG.set('width',w);
      pcAxisSVG.set('height',h);
      pcAxisSVG.set('margin',m);

      pcAxisScale.set('width',w);
      pcAxisScale.set('height',h);
      pcAxisScale.set('margin',m);
      pcAxisScale.set('completeSeriesConfig',completeSeriesConfig);
      pcAxisScale.set('chartExtents',chartExtents);
      pcAxisScale.set('chartData',d);

      pcYAxis.set('margin',m);
      pcYAxis.set('height',h);
      pcYAxis.set('completeSeriesConfig',completeSeriesConfig);
      pcYAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('pcYAxis fixture is created', function() {
      assert.isTrue(pcYAxis !== null);
    });

    test('Title _titleGroup transform', function() {
      var attr = pcYAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),0,7);
      assert.closeTo(parseFloat(arr[3]),260,2);
    });

    test('Title _titleGroup text font-size', function() {
      var text = pcYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('font-size'),'12px');
    });
    test('Title _titleGroup text rotate', function() {
      var text = pcYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('transform'),'rotate(0)');
    });
    test('Title _titleGroup text text', function() {
      var text = pcYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.text(),'myTitle');
    });
  });

  suite('px-vis-axis axis with units works', function() {
    var pcUnitAxisSVG = document.getElementById('pcUnitAxisSVG'),
        pcUnitAxisScale = document.getElementById('pcUnitAxisScale'),
        pcUnitYAxis = document.getElementById('pcUnitYAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)",
          "yAxisUnit": "BoF"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        };
      pcUnitAxisSVG.set('width',w);
      pcUnitAxisSVG.set('height',h);
      pcUnitAxisSVG.set('margin',m);

      pcUnitAxisScale.set('width',w);
      pcUnitAxisScale.set('height',h);
      pcUnitAxisScale.set('margin',m);
      pcUnitAxisScale.set('completeSeriesConfig',completeSeriesConfig);
      pcUnitAxisScale.set('chartExtents',chartExtents);
      pcUnitAxisScale.set('chartData',d);

      pcUnitYAxis.set('margin',m);
      pcUnitYAxis.set('height',h);
      pcUnitYAxis.set('completeSeriesConfig',completeSeriesConfig);
      pcUnitYAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('pcUnitYAxis fixture is created', function() {
      assert.isTrue(pcUnitYAxis !== null);
    });

    test('Title _titleGroup transform', function() {
      var attr = pcUnitYAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),0,7);
      assert.closeTo(parseFloat(arr[3]),260,2);
    });

    test('Title _titleGroup text font-size', function() {
      var text = pcUnitYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('font-size'),'12px');
    });
    test('Title _titleGroup text rotate', function() {
      var text = pcUnitYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('transform'),'rotate(0)');
    });
    test('Title _titleGroup text text', function() {
      var text = pcUnitYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.text(),'myTitle [BoF]');
    });
  });

  suite('px-vis-axis title truncation works', function() {
    var pcTruncAxisSVG = document.getElementById('pcTruncAxisSVG'),
        pcTruncAxisScale = document.getElementById('pcTruncAxisScale'),
        pcTruncYAxis = document.getElementById('pcTruncYAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)",
          "yAxisUnit": "BoF"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        };
      pcTruncAxisSVG.set('width',w);
      pcTruncAxisSVG.set('height',h);
      pcTruncAxisSVG.set('margin',m);

      pcTruncAxisScale.set('width',w);
      pcTruncAxisScale.set('height',h);
      pcTruncAxisScale.set('margin',m);
      pcTruncAxisScale.set('completeSeriesConfig',completeSeriesConfig);
      pcTruncAxisScale.set('chartExtents',chartExtents);
      pcTruncAxisScale.set('chartData',d);

      pcTruncYAxis.set('margin',m);
      pcTruncYAxis.set('height',h);
      pcTruncYAxis.set('completeSeriesConfig',completeSeriesConfig);
      pcTruncYAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('pcTruncYAxis fixture is created', function() {
      assert.isTrue(pcTruncYAxis !== null);
    });

    test('Title _titleGroup transform', function() {
      var attr = pcTruncYAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),0,7);
      assert.closeTo(parseFloat(arr[3]),260,2);
    });

    test('Title _titleGroup text font-size', function() {
      var text = pcTruncYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('font-size'),'12px');
    });
    test('Title _titleGroup text rotate', function() {
      var text = pcTruncYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('transform'),'rotate(0)');
    });
    test('Title _titleGroup text text', function() {
      var text = pcTruncYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.text(),'my...le');
    });
  });

  suite('px-vis-axis title truncation with units works', function() {
    var pcTruncUnitAxisSVG = document.getElementById('pcTruncUnitAxisSVG'),
        pcTruncUnitAxisScale = document.getElementById('pcTruncUnitAxisScale'),
        pcTruncUnitYAxis = document.getElementById('pcTruncUnitYAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)",
          "yAxisUnit": "BoF"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        };

      //make sure we found the elements, cause IE...
      pcTruncUnitAxisSVG = document.getElementById('pcTruncUnitAxisSVG');
      pcTruncUnitAxisScale = document.getElementById('pcTruncUnitAxisScale');
      pcTruncUnitYAxis = document.getElementById('pcTruncUnitYAxis');

      pcTruncUnitAxisSVG.set('width',w);
      pcTruncUnitAxisSVG.set('height',h);
      pcTruncUnitAxisSVG.set('margin',m);

      pcTruncUnitAxisScale.set('width',w);
      pcTruncUnitAxisScale.set('height',h);
      pcTruncUnitAxisScale.set('margin',m);
      pcTruncUnitAxisScale.set('completeSeriesConfig',completeSeriesConfig);
      pcTruncUnitAxisScale.set('chartExtents',chartExtents);
      pcTruncUnitAxisScale.set('chartData',d);

      pcTruncUnitYAxis.set('margin',m);
      pcTruncUnitYAxis.set('height',h);
      pcTruncUnitYAxis.set('completeSeriesConfig',completeSeriesConfig);
      pcTruncUnitYAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('pcTruncUnitYAxis fixture is created', function() {
      assert.isTrue(pcTruncUnitYAxis !== null);
    });

    test('Title _titleGroup transform', function() {
      var attr = pcTruncUnitYAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),0,7);
      assert.closeTo(parseFloat(arr[3]),260,2);
    });

    test('Title _titleGroup text font-size', function() {
      var text = pcTruncUnitYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('font-size'),'12px');
    });
    test('Title _titleGroup text rotate', function() {
      var text = pcTruncUnitYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('transform'),'rotate(0)');
    });
    test('Title _titleGroup text text', function() {
      var text = pcTruncUnitYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.text(),'my...le [BoF]');
    });
  });

  suite('px-vis-axis title rotation works', function() {
    var pcRotateAxisSVG = document.getElementById('pcRotateAxisSVG'),
        pcRotateAxisScale = document.getElementById('pcRotateAxisScale'),
        pcRotateYAxis = document.getElementById('pcRotateYAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)",
          "yAxisUnit": "BoF"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 110,
          "left": 50
        };

      //make sure we found the elements, cause IE...
      pcRotateAxisSVG = document.getElementById('pcRotateAxisSVG');
      pcRotateAxisScale = document.getElementById('pcRotateAxisScale');
      pcRotateYAxis = document.getElementById('pcRotateYAxis');

      pcRotateAxisSVG.set('width',w);
      pcRotateAxisSVG.set('height',h);
      pcRotateAxisSVG.set('margin',m);

      pcRotateAxisScale.set('width',w);
      pcRotateAxisScale.set('height',h);
      pcRotateAxisScale.set('margin',m);
      pcRotateAxisScale.set('completeSeriesConfig',completeSeriesConfig);
      pcRotateAxisScale.set('chartExtents',chartExtents);
      pcRotateAxisScale.set('chartData',d);

      pcRotateYAxis.set('margin',m);
      pcRotateYAxis.set('height',h);
      pcRotateYAxis.set('completeSeriesConfig',completeSeriesConfig);
      pcRotateYAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('pcRotateYAxis fixture is created', function() {
      assert.isTrue(pcRotateYAxis !== null);
    });

    test('Title _titleGroup transform', function() {
      var attr = pcRotateYAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),0,7);
      assert.closeTo(parseFloat(arr[3]),200,2);
    });

    test('Title _titleGroup text font-size', function() {
      var text = pcRotateYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('font-size'),'12px');
    });
    test('Title _titleGroup text rotate', function() {
      var text = pcRotateYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.attr('transform'),'rotate(-90)');
    });
    test('Title _titleGroup text text', function() {
      var text = pcRotateYAxis._titleGroup.select('text.axis-title');
      assert.equal(text.text(),'my...le [BoF]');
    });
  });

  suite('px-vis-axis tick values works', function() {
    var tickScale = document.getElementById('tickScale'),
        tickSVG = document.getElementById('tickSVG'),
        tickAxis = document.getElementById('tickAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        },
        tickValues = [2,4,6,8,10];

      //make sure we found the elements, cause IE...
      tickScale = document.getElementById('tickScale');
      tickSVG = document.getElementById('tickSVG');
      tickAxis = document.getElementById('tickAxis');

      tickSVG.set('width',w);
      tickSVG.set('height',h);
      tickSVG.set('margin',m);

      tickScale.set('width',w);
      tickScale.set('height',h);
      tickScale.set('margin',m);
      tickScale.set('completeSeriesConfig',completeSeriesConfig);
      tickScale.set('chartExtents',chartExtents);
      tickScale.set('chartData',d);

      tickAxis.set('tickValues',tickValues);
      tickAxis.set('margin',m);
      tickAxis.set('height',h);
      tickAxis.set('completeSeriesConfig',completeSeriesConfig);
      tickAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('tickAxis fixture is created', function() {
      assert.isTrue(tickAxis !== null);
    });

    suite('_axisGroup has correct number of ticks', function() {
      var lines,path;
      suiteSetup(function(){
        lines = tickAxis._axisGroup.selectAll('line');
        path = tickAxis._axisGroup.selectAll('path');
      })

      test('correct number of paths', function() {
        assert.equal(path.nodes().length,1);
      });

      test('correct number of lines', function() {
        assert.equal(lines.nodes().length,5);
      });
    });
  });

  suite('px-vis-axis tick format works', function() {
    var tickFormatScale = document.getElementById('tickFormatScale'),
        tickFormatSVG = document.getElementById('tickFormatSVG'),
        tickFormatXAxis = document.getElementById('tickFormatXAxis'),
        tickFormatYAxis = document.getElementById('tickFormatYAxis');

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 50,
          "left": 50
        },
        tickValues = [2,4,6,8,10];

      //make sure we found the elements, cause IE...
      tickFormatScale = document.getElementById('tickFormatScale');
      tickFormatSVG = document.getElementById('tickFormatSVG');
      tickFormatXAxis = document.getElementById('tickFormatXAxis');
      tickFormatYAxis = document.getElementById('tickFormatYAxis');

      tickFormatSVG.set('width',w);
      tickFormatSVG.set('height',h);
      tickFormatSVG.set('margin',m);

      tickFormatScale.set('width',w);
      tickFormatScale.set('height',h);
      tickFormatScale.set('margin',m);
      tickFormatScale.set('completeSeriesConfig',completeSeriesConfig);
      tickFormatScale.set('chartExtents',chartExtents);
      tickFormatScale.set('chartData',d);

      tickFormatXAxis.set('margin',m);
      tickFormatXAxis.set('height',h);
      tickFormatXAxis.set('completeSeriesConfig',completeSeriesConfig);

      tickFormatYAxis.set('margin',m);
      tickFormatYAxis.set('height',h);
      tickFormatYAxis.set('completeSeriesConfig',completeSeriesConfig);
      tickFormatYAxis.set('chartData',d);
      setTimeout(function(){done()},500);
     // done();
    });

    test('tickFormatXAxis fixture is created', function() {
      assert.isTrue(tickFormatXAxis !== null);
    });
    test('tickFormatYAxis fixture is created', function() {
      assert.isTrue(tickFormatYAxis !== null);
    });

    suite('_axisGroup has correct number of ticks', function() {
      var lines,path;
      suiteSetup(function(){
        xLabels = tickFormatXAxis._axisGroup.selectAll('text');
        yLabels = tickFormatYAxis._axisGroup.selectAll('text');
      })

      // test('xAxis labels correct format ', function() {
      //   assert.equal(xLabels.nodes()[3].textContent,"09 AM");
      // });

      test('yAxis labels correct format', function() {
        assert.equal(yLabels.nodes()[3].textContent,"3.0");
      });
    });
  });

  suite('px-vis-axis inline labels works', function() {
    var inlineScale,
        inlineSVG,
        inlineXAxis,
        inlineYAxis,
        xLabels, yLabels, xRects, yRects;
    var colors = commonColors.properties.colors.value;

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 75,
          "left": 50
        };
      // beats me why I cant declare above. Stupid IE
      inlineScale = document.getElementById('inlineScale');
      inlineSVG = document.getElementById('inlineSVG');
      inlineXAxis = document.getElementById('inlineXAxis');
      inlineYAxis = document.getElementById('inlineYAxis');

      inlineSVG.set('width',w);
      inlineSVG.set('height',h);
      inlineSVG.set('margin',m);

      inlineScale.set('width',w);
      inlineScale.set('height',h);
      inlineScale.set('margin',m);
      inlineScale.set('completeSeriesConfig',completeSeriesConfig);
      inlineScale.set('chartExtents',chartExtents);
      inlineScale.set('chartData',d);

      inlineXAxis.set('margin',m);
      inlineXAxis.set('height',h);
      inlineXAxis.set('completeSeriesConfig',completeSeriesConfig);

      inlineYAxis.set('margin',m);
      inlineYAxis.set('height',h);
      inlineYAxis.set('completeSeriesConfig',completeSeriesConfig);
      inlineYAxis.set('chartData',d);
      setTimeout(function(){
        xLabels = inlineXAxis._axisGroup.selectAll('text').nodes();
        yLabels = inlineYAxis._axisGroup.selectAll('text').nodes();
        xRects = inlineXAxis._axisGroup.selectAll('rect').nodes();
        yRects = inlineYAxis._axisGroup.selectAll('rect').nodes();

        done();
      },500);
    });

    test('inlineXAxis fixture is created', function() {
      assert.isTrue(inlineXAxis !== null);
    });
    test('inlineYAxis fixture is created', function() {
      assert.isTrue(inlineYAxis !== null);
    });

    test('X label count is correct', function() {
      assert.oneOf(xLabels.length, [10,11]);
    });

    test('X label positions are correct', function() {
      assert.equal(xLabels[0].attributes.x.value, 0);
      assert.equal(xLabels[0].attributes.y.value, -5);
      assert.equal(xLabels[0].attributes['text-anchor'].value, 'middle');
    });

    test('X label size is correct', function() {
      assert.equal(xLabels[0].attributes['font-size'].value, '15px');
    });

    test('X label color is correct', function() {
      var c = xLabels[0].attributes.fill.value.split(' ').join('');
      assert.equal(c, 'rgb(255,255,255)');
    });

    test('Y label count is correct', function() {
      assert.equal(yLabels.length, 4);
    });

    test('Y label positions are correct', function() {
      assert.equal(yLabels[0].attributes.x.value, 0);
      assert.equal(yLabels[0].attributes.y.value, 0);
      assert.equal(yLabels[0].attributes['text-anchor'].value, 'middle');
    });

    test('Y label size is correct', function() {
      assert.equal(yLabels[0].attributes['font-size'].value, '15px');
    });

    test('Y label color is correct', function() {
      var c = yLabels[0].attributes.fill.value.split(' ').join('');
      assert.equal(c, 'rgb(255,255,255)');
    });

    test('x rect count is correct', function() {
      assert.oneOf(xRects.length, [10,11]);
    });

    test('x rect sizing is correct', function() {
      assert.closeTo(Number(xRects[0].attributes.width.value), xLabels[0].getBoundingClientRect().width + 6,1);
      assert.equal(xRects[0].attributes.height.value, '19');
      assert.closeTo(Number(xRects[0].attributes.x.value), xLabels[0].getBoundingClientRect().width / -2 - 3,1);
      assert.equal(xRects[0].attributes.y.value, '-9.5');
    });

    test('x rect color is correct', function() {
      assert.equal(xRects[0].attributes.fill.value.split(' ').join(''), colors['grey4']);
    });

    test('y rect count is correct', function() {
      assert.equal(yRects.length, 4);
    });

    test('y rect sizing is correct', function() {
      assert.closeTo(Number(yRects[0].attributes.width.value), yLabels[0].getBoundingClientRect().width + 6,1);
      assert.equal(yRects[0].attributes.height.value, '19');
      assert.closeTo(Number(yRects[0].attributes.x.value), yLabels[0].getBoundingClientRect().width / -2 - 3,1);
      assert.equal(yRects[0].attributes.y.value, '-9.5');
    });

    test('y rect color is correct', function() {
      assert.equal(yRects[0].attributes.fill.value.split(' ').join(''), colors['grey4']);
    });
  });


  suite('px-vis-axis disable ticks works', function() {
    var noTicksScale,
        noTicksSVG,
        noTicksAxis;

    suiteSetup(function(done){
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
          "type":"line",
          "name":"mySeries",
          "x":"x",
          "y":"y",
          "color": "rgb(93,165,218)"
        }},
        chartExtents = {"x":[1397102460000,1397219100000],"y":[0,10]},
        w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 75,
          "left": 50
        };

      noTicksScale = document.getElementById('noTicksScale');
      noTicksSVG = document.getElementById('noTicksSVG');
      noTicksAxis = document.getElementById('noTicksAxis');

      noTicksSVG.set('width',w);
      noTicksSVG.set('height',h);
      noTicksSVG.set('margin',m);

      noTicksScale.set('width',w);
      noTicksScale.set('height',h);
      noTicksScale.set('margin',m);
      noTicksScale.set('completeSeriesConfig',completeSeriesConfig);
      noTicksScale.set('chartExtents',chartExtents);
      noTicksScale.set('chartData',d);

      noTicksAxis.set('margin',m);
      noTicksAxis.set('height',h);
      noTicksAxis.set('completeSeriesConfig',completeSeriesConfig);
      noTicksAxis.set('chartData',d);
      setTimeout(function(){ done(); },500);
    });

    test('noTicksAxis fixture is created', function() {
      assert.isTrue(noTicksAxis !== null);
    });

    test('noTicksAxis doesnt have ticks or labels', function() {
      var ticks = noTicksAxis._axisGroup.selectAll('text').nodes();
      assert.equal(ticks.length,0);
    });
  });

} //runTests
