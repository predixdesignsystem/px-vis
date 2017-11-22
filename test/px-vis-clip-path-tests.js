document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-clip-path does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-clip-path basic setup works', function() {
    var baseScale,
        baseSVG,
        baseLine,
        baseClip;
    var eventObj;

    suiteSetup(function(done){
      baseScale = document.getElementById('baseScale');
      baseSVG = document.getElementById('baseSVG');
      baseLine = document.getElementById('baseLine');
      baseClip = document.getElementById('baseClip');
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
          "bottom": 20,
          "left": 15
        };

      document.addEventListener('px-vis-clip-path-updated',function(evt){
        eventObj = evt.detail;
      });

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('completeSeriesConfig',completeSeriesConfig);
      baseScale.set('chartExtents',chartExtents);
      baseScale.set('chartData',d);

      baseLine.set('seriesId',"mySeries");
      baseLine.set('completeSeriesConfig',completeSeriesConfig);
      baseLine.set('chartData',d);

      baseClip.set('margin',m);
      baseClip.set('width',w/2);
      baseClip.set('height',h/2);

      window.setTimeout(function(){done()},100);
      // done();
    });

    test('baseClip fixture is created', function() {
      assert.isTrue(baseClip !== null);
    });
    test('event fired', function() {
      assert.isTrue(eventObj !== null);
    });
    test('event dataVar', function() {
      assert.equal(eventObj.dataVar, 'clipPath');
    });
    test('event method', function() {
      assert.equal(eventObj.method, 'set');
    });
    test('event data', function() {
      assert.equal(eventObj.data.length, 13);
      assert.equal(eventObj.data.split('_')[0], 'cp');
    });
  });

  suite('px-vis-clip-path baseClip works', function() {
    var baseSVG,
        baseClip;
    var clipPath, clipPath2, rect, rectSeries;

    suiteSetup(function(done){
      baseSVG = document.getElementById('baseSVG');
      baseClip = document.getElementById('baseClip');
      clipPath = Px.d3.select(baseClip.svg.selectAll('clipPath').nodes()[0]);
      clipPath2 = Px.d3.select(baseClip.svg.selectAll('clipPath').nodes()[1]);

      rect = baseClip._clipPathSvg;
      rectSeries = baseClip._seriesClipPathSvg;

      // Safari 8 is being weird
      if(clipPath.node() === null) {
        clipPath = Px.d3.select(document.getElementsByTagName('clipPath')[0]);
        clipPath2 = Px.d3.select(document.getElementsByTagName('clipPath')[1]);

        rect = Px.d3.select(document.getElementsByTagName('clipPath')[0].getElementsByTagName("rect")[0]);
        rectSeries = Px.d3.select(document.getElementsByTagName('clipPath')[1].getElementsByTagName("rect")[0]);
      }

      window.setTimeout(function(){done()},500);

    });

    test('baseClip ID is set', function() {
      assert.equal(clipPath.attr('id'),baseClip.clipPath);
    });
    test('baseClip y', function() {
      assert.equal(rect.attr('y'),-10);
    });
    test('baseClip width', function() {
      assert.equal(rect.attr('width'),230);
    });
    test('baseClip height', function() {
      assert.equal(rect.attr('height'),130);
    });

    test('baseClip Series ID is set', function() {
      assert.equal(clipPath2.attr('id'),baseClip.seriesClipPath);
    });
    test('baseClip Series y', function() {
      assert.equal(rectSeries.attr('y'),-0);
    });
    test('baseClip Series width', function() {
      assert.equal(rectSeries.attr('width'),230);
    });
    test('baseClip Series height', function() {
      assert.equal(rectSeries.attr('height'),120);
    });

    test('visual mask', function() {
      baseSVG.svg.append('rect')
      .attr('x', -500)
      .attr('y', -300)
      .attr('width', 1000)
      .attr('height', 600)
      .attr('fill', '#000');

      baseSVG.svg.append('rect')
      .attr('x', -500)
      .attr('y', -300)
      .attr('width', 1000)
      .attr('height', 600)
      .attr('fill', '#ccc')
      .attr("clip-path", 'url(#' + clipPath.attr('id') + ')');

      baseSVG.svg.append('rect')
      .attr('x', -500)
      .attr('y', -300)
      .attr('width', 1000)
      .attr('height', 600)
      .attr('fill', '#999')
      .attr("clip-path", 'url(#' + clipPath2.attr('id') + ')');

      assert.isTrue(true);
    });
  }); //suite
} //runTests
