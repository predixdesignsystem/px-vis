document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-brush does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-brush basic setup works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        baseBrush = document.getElementById('baseBrush');
    var colors = commonColors.properties.colors.value;

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
          "right": 10,
          "bottom": 10,
          "left": 10
        };

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('seriesConfig',seriesConfig);
      baseScale.set('chartData',d);

      baseBrush.set('height',h);

      // setTimeout(function(){done()},5000);
      done();
    });

    test('baseBrush fixture is created', function() {
      assert.isTrue(baseBrush !== null);
    });

    test('baseBrush._brush fixture is created', function() {
      assert.isTrue(baseBrush._brush !== null);
    });
    test('baseBrush._brush extents are full', function() {
      assert.deepEqual(baseBrush._brush.extent(),baseScale.currentDomainX);
    });
    test('baseBrush._brush x is correct', function() {
      assert.deepEqual(baseBrush._brush.x(),baseScale.x);
    });

    test('baseBrush._brushGroup fixture is created', function() {
      assert.equal(baseBrush._brushGroup.node().tagName, 'g');
    });

    test('baseBrush._brushGroup.rect fixture is created', function() {
      assert.equal(baseBrush._brushGroup.select('rect').node().tagName, 'rect');
    });
    test('baseBrush._brushGroup.rect attr y', function() {
      assert.equal(baseBrush._brushGroup.select('rect').attr('y'), 0);
    });
    test('baseBrush._brushGroup.rect attr height', function() {
      assert.equal(baseBrush._brushGroup.select('rect').attr('height'), 294);
    });
    test('baseBrush._brushGroup.rect attr stroke', function() {
      assert.equal(baseBrush._brushGroup.select('rect').attr('stroke').split(" ").join(''), colors.gray5);
    });
    test('baseBrush._brushGroup.rect attr fill', function() {
      assert.equal(baseBrush._brushGroup.select('rect').attr('fill').split(" ").join(''), colors.black);
    });
    test('baseBrush._brushGroup.rect attr fill-opacity', function() {
      assert.equal(baseBrush._brushGroup.select('rect').attr('fill-opacity'), 0.1);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.equal(baseBrush._brushGroup.select('rect').attr('x'), 0);
    });
    test('baseBrush._brushGroup.rect attr width', function() {
      assert.equal(baseBrush._brushGroup.select('rect').attr('width'), 480);
    });

    test('baseBrush._handleGroup is created', function() {
      assert.equal(baseBrush._handleGroup.node().tagName,'g');
    });
    test('baseBrush._handleGroup has correct number of handles', function() {
      assert.equal(baseBrush._handleGroup[0].length,2);
    });

    test('baseBrush._handleGroup.rect is created', function() {
      assert.equal(baseBrush._handleGroup.select('rect').node().tagName,'rect');
    });
    test('baseBrush._handleGroup.rect has correct x', function() {
      assert.equal(baseBrush._handleGroup.select('rect').attr('x'),-4.5);
    });
    test('baseBrush._handleGroup.rect has correct y', function() {
      assert.equal(baseBrush._handleGroup.select('rect').attr('y'),128);
    });
    test('baseBrush._handleGroup.rect has correct height', function() {
      assert.equal(baseBrush._handleGroup.select('rect').attr('height'),32);
    });
    test('baseBrush._handleGroup.rect has correct width', function() {
      assert.equal(baseBrush._handleGroup.select('rect').attr('width'),9);
    });
    test('baseBrush._handleGroup.rect has correct stroke', function() {
      assert.equal(baseBrush._handleGroup.select('rect').attr('stroke').split(" ").join(''),colors.gray5);
    });
    test('baseBrush._handleGroup.rect has correct fill', function() {
      assert.equal(baseBrush._handleGroup.select('rect').attr('fill').split(" ").join(''),colors.white);
    });

    test('baseBrush._handleGroup.lines are created', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0].length,2);
    });
    test('baseBrush._handleGroup.lines[0] have correct x vals', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('x1'),1.5);
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('x2'),1.5);
    });
    test('baseBrush._handleGroup.lines[0] have correct y1 val', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('y1'),137);
    });
    test('baseBrush._handleGroup.lines[0] have correct y2 val', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('y2'),151);
    });
    test('baseBrush._handleGroup.lines[0] fill', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('fill'),'none');
    });
    test('baseBrush._handleGroup.lines[0] stroke', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][0].getAttribute('stroke').split(' ').join(''),colors.gray5);
    });
    test('baseBrush._handleGroup.lines[1] have correct x vals', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('x1'),-1.5);
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('x2'),-1.5);
    });
    test('baseBrush._handleGroup.lines[1] have correct y1 val', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('y1'),137);
    });
    test('baseBrush._handleGroup.lines[1] have correct y2 val', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('y2'),151);
    });
    test('baseBrush._handleGroup.lines[1] fill', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('fill'),'none');
    });
    test('baseBrush._handleGroup.lines[1] stroke', function() {
      assert.equal(baseBrush._handleGroup.selectAll('line')[0][1].getAttribute('stroke').split(' ').join(''),colors.gray5);
    });
  });

  suite('px-vis-brush brush resizes to the inputed domain', function() {
    var baseBrush = document.getElementById('baseBrush');

    suiteSetup(function(done){
      var d = [1397131620000,1397189940000];

      baseBrush.set('chartDomain',d);
      // setTimeout(function(){done()},5000);
      done();
    });

    test('baseBrush._brush extents match', function() {
      assert.deepEqual(baseBrush._brush.extent(),[1397131620000,1397189940000]);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.equal(baseBrush._brushGroup.select('rect.extent').attr('x'), 120);
    });
    test('baseBrush._brushGroup.rect attr width', function() {
      assert.equal(baseBrush._brushGroup.select('rect.extent').attr('width'), 240);
    });
  });

  suite('px-vis-brush click on navigator and the extent box should move to that point', function() {
    var baseBrush = document.getElementById('baseBrush');
    suiteSetup(function(done){
      var rect = baseBrush._brushGroup.select('rect.background').node(),
          box = rect.getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mousedown",true,true,window,0,0,0,box.left,box.top + box.height/2,false,false,false,false,0,null);

      rect.dispatchEvent(e);

      setTimeout(function(){done()},500);
    });

    test('baseBrush._brush extents match', function() {
      var ext = baseBrush._brush.extent();
      // giving it roughly 16.5 min margin or error
      assert.closeTo(ext[0],1397102460000,1000000);
      assert.closeTo(ext[1],1397160780000,1000000);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.closeTo(parseInt(baseBrush._brushGroup.select('rect.extent').attr('x')), 0, 5);
    });
    test('baseBrush._brushGroup.rect attr width', function() {
      assert.equal(parseInt(baseBrush._brushGroup.select('rect.extent').attr('width')), 240);
    });
  });

  suite('px-vis-brush brush reset inputed domain', function() {
    var baseBrush = document.getElementById('baseBrush');

    suiteSetup(function(done){
      var d = [1397102460000,1397219100000];

      baseBrush.set('chartDomain',d);
      // setTimeout(function(){done()},5000);
      done();
    });

    test('baseBrush._brush extents are full', function() {
      assert.deepEqual(baseBrush._brush.extent(),[1397102460000,1397219100000]);
    });
    test('baseBrush._brushGroup.rect attr x', function() {
      assert.equal(baseBrush._brushGroup.select('rect.extent').attr('x'), 0);
    });
    test('baseBrush._brushGroup.rect attr width', function() {
      assert.equal(baseBrush._brushGroup.select('rect.extent').attr('width'), 480);
    });
  });

  suite('px-vis-brush handle mouseover ', function() {
    var colors = commonColors.properties.colors.value;

    suiteSetup(function(done){
      var box = baseBrush._handleGroup.node().getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseenter",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
      // For stupid MS Edge
      var e2 = document.createEvent("MouseEvent");
      e2.initMouseEvent("mouseover",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      baseBrush._handleGroup.node().dispatchEvent(e);
      baseBrush._handleGroup.node().dispatchEvent(e2);

      setTimeout(function(){done()},10);
    });

    test('baseBrush._handleGroup rect stroke changes', function() {
      assert.equal(baseBrush._handleGroup.select('rect.base').attr('stroke').split(' ').join(''), colors.gray6);
    });
    test('baseBrush._handleGroup rect fill changes', function() {
      assert.equal(baseBrush._handleGroup.select('rect.base').attr('fill').split(' ').join(''), colors.gray5);
    });
    test('baseBrush._handleGroup lines stroke changes', function() {
      assert.equal(baseBrush._handleGroup.select('line.handleLine').attr('stroke').split(' ').join(''), colors.gray6);
    });
  });

  suite('px-vis-brush handle mouseleave ', function() {
    var colors = commonColors.properties.colors.value;


    suiteSetup(function(done){
      var box = baseBrush._handleGroup.node().getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseleave",true,true,window,0,0,0,0,0,false,false,false,false,0,null);
      // For stupid MS Edge
      var e2 = document.createEvent("MouseEvent");
      e2.initMouseEvent("mouseout",true,true,window,0,0,0,0,0,false,false,false,false,0,null);

      baseBrush._handleGroup.node().dispatchEvent(e);
      baseBrush._handleGroup.node().dispatchEvent(e2);

      setTimeout(function(){done()},10);
      // done();
    });

    test('baseBrush. handle rect stroke changes', function() {
      assert.equal(baseBrush._handleGroup.select('rect.base').attr('stroke').split(' ').join(''), colors.gray5);
    });
    test('baseBrush. handle rect fill changes', function() {
      assert.equal(baseBrush._handleGroup.select('rect.base').attr('fill').split(' ').join(''), colors.white);
    });
    test('baseBrush. handle lines stroke changes', function() {
      assert.equal(baseBrush._handleGroup.select('line.handleLine').attr('stroke').split(' ').join(''), colors.gray5);
    });
  });

  suite('px-vis-brush handle press ', function() {
    var colors = commonColors.properties.colors.value;

    suiteSetup(function(done){
      var box = baseBrush._handleGroup.node().getBoundingClientRect();

      var e = document.createEvent("MouseEvent");
      e.initMouseEvent("mouseenter",true,true,window,0,0,0,box.left + box.width/2,box.top + box.height/2,false,false,false,false,0,null);
      // For stupid MS Edge
      var e2 = document.createEvent("MouseEvent");
      e2.initMouseEvent("mousedown",true,true,window,0,0,0,box.left + box.width/2,box.top + box.height/2,false,false,false,false,0,null);

      baseBrush._handleGroup.node().dispatchEvent(e);

      setTimeout(function(){
        baseBrush._handleGroup.node().dispatchEvent(e2);
      },10);

      setTimeout(function(){done()},10);
    });

    test('baseBrush._handleGroup rect stroke changes', function() {
      assert.equal(baseBrush._handleGroup.select('rect.base').attr('stroke').split(' ').join(''), colors.gray7);
    });
    test('baseBrush._handleGroup rect fill changes', function() {
      assert.equal(baseBrush._handleGroup.select('rect.base').attr('fill').split(' ').join(''), colors.gray6);
    });
    test('baseBrush._handleGroup lines stroke changes', function() {
      assert.equal(baseBrush._handleGroup.select('line.handleLine').attr('stroke').split(' ').join(''), colors.gray7);
    });
  });
// TODO figure out how to test the brush events...
  // suite('px-vis-brush handle move ', function() {
  //   suiteSetup(function(done){
  //     var box = baseBrush._handleGroup.node().getBoundingClientRect();
  //     var boxBg = baseBrush._brushGroup.select("rect.background").node().getBoundingClientRect();
  //
  //     var e = new MouseEvent('mousedown',{
  //       "clientX": box.left + box.width/2,
  //       "clientY": box.top + box.height/2,
  //     });
  //     var e2 = new MouseEvent('mousemove',{
  //       "clientX": boxBg.left + boxBg.width/4,
  //       "clientY": boxBg.top + boxBg.height/2,
  //     });
  //
  //     baseBrush._brushGroup.node().dispatchEvent(e);
  //
  //     setTimeout(function(){
  //       baseBrush._brushGroup.node().dispatchEvent(e2);
  //     },10);
  //
  //     setTimeout(function(){done()},3000);
  //     // done();
  //   });
  //
  //   test('baseBrush._brush extents match', function() {
  //     assert.deepEqual(baseBrush._brush.extent(),[1397131620000,1397189940000]);
  //   });
  //   test('baseBrush._brushGroup.rect attr x', function() {
  //     assert.equal(baseBrush._brushGroup.select('rect.extent').attr('x'), 240);
  //   });
  //   test('baseBrush._brushGroup.rect attr width', function() {
  //     assert.equal(baseBrush._brushGroup.select('rect.extent').attr('width'), 240);
  //   });
  // });
} //runTests
