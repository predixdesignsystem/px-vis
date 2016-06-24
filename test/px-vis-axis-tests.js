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
        "series": [
          [1397102460000, 1],
          [1397131620000, 6],
          [1397160780000, 10],
          [1397189940000, 4],
          [1397219100000, 6]
        ]
        }],
        seriesConfig = {"0":{"type":"line","name":"mySeries"}},
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
      baseScale.set('seriesConfig',seriesConfig);
      baseScale.set('chartData',d);

      baseXAxis.set('margin',m);

      baseYAxis.set('margin',m);
      baseYAxis.set('chartData',d);
      // setTimeout(function(){done()},5000);
      done();
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

    test('baseXAxis _axis orientation', function() {
      assert.equal(baseXAxis._axis.orient(),'bottom');
    });
    test('baseXAxis _axis outerTickSize', function() {
      assert.equal(baseXAxis._axis.outerTickSize(),0);
    });
    test('baseXAxis _axis innerTickSize', function() {
      assert.equal(baseXAxis._axis.innerTickSize(),6);
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
        assert.equal(path[0].length,1);
      });

      test('path has correct fill', function() {
        assert.equal(path.attr('fill'),'none');
      });
      test('path has correct stroke', function() {
        assert.equal(path.attr('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line0 has correct fill', function() {
        assert.equal(lines[0][0].getAttribute('fill'),'none');
      });
      test('line0 has correct stroke', function() {
        assert.equal(lines[0][0].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line3 has correct fill', function() {
        assert.equal(lines[0][3].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines[0][3].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line9 has correct fill', function() {
        assert.equal(lines[0][9].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines[0][9].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });
    });

    test('Title _titleGroup transform', function() {
      var attr = baseXAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),222.5,6);
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

    test('baseYAxis _axis orientation', function() {
      assert.equal(baseYAxis._axis.orient(),'left');
    });
    test('baseYAxis _axis outerTickSize', function() {
      assert.equal(baseYAxis._axis.outerTickSize(),0);
    });
    test('baseYAxis _axis innerTickSize', function() {
      assert.equal(baseYAxis._axis.outerTickSize(),0);
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
        assert.equal(lines[0].length,11);
      });
      test('correct number of paths', function() {
        assert.equal(path[0].length,1);
      });

      test('path has correct fill', function() {
        assert.equal(path.attr('fill'),'none');
      });
      test('path has correct stroke', function() {
        assert.equal(path.attr('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line0 has correct fill', function() {
        assert.equal(lines[0][0].getAttribute('fill'),'none');
      });
      test('line0 has correct stroke', function() {
        assert.equal(lines[0][0].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line3 has correct fill', function() {
        assert.equal(lines[0][3].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines[0][3].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });

      test('line9 has correct fill', function() {
        assert.equal(lines[0][9].getAttribute('fill'),'none');
      });
      test('line3 has correct stroke', function() {
        assert.equal(lines[0][9].getAttribute('stroke').split(' ').join(''),colors['grey9']);
      });
    });

    test('Title _titleGroup transform', function() {
      var attr = baseYAxis._titleGroup.attr('transform'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          arr = re.exec(attr);
      assert.equal(arr[1],'translate');
      assert.closeTo(parseFloat(arr[2]),-33,3);
      assert.closeTo(parseFloat(arr[3]),126,3);
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
      assert.equal(bar[0].length,1);
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
      assert.equal(bar.attr('series-bar-id'),'bar_0');
    });
    test('Title series bars translate', function() {
      var bar = baseYAxis._titleGroup.select('rect'),
          re = new RegExp(/(\w+)\((-?\d+\.?\d*)[,\s](-?\d+\.?\d*)\)/),
          s = bar.attr('transform'),
          arr = re.exec(s);
      assert.equal(arr[1],'translate');
      assert.equal(parseFloat(arr[2]),-12);
      assert.closeTo(parseFloat(arr[3]),-55,6);
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
        "0":true
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
        "0":false
      };
      baseYAxis.set('mutedSeries',mutedSeries);
      setTimeout(function(){done()},100)
    });

    test('baseYAxis series box mutes', function() {
      var bar = baseYAxis._titleGroup.select('rect');
      assert.equal(bar.attr('opacity'),1);
    });
  });

} //runTests
