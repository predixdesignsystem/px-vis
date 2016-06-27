document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-tooltip does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-tooltip baseTooltip setup works', function() {
    var baseSVG = document.getElementById('baseSVG'),
        baseTooltip = document.getElementById('baseTooltip');

    suiteSetup(function(){
      var w = 500,
        h = 300,
        m = {
          "top": 10,
          "right": 5,
          "bottom": 20,
          "left": 15
        },
        d = [{
          "series": [
            [1397102460000, 1],
            [1397131620000, 6],
            [1397160780000, 10],
            [1397189940000, 4],
            [1397219100000, 6]
          ],
          "seriesNumber":0,
          "name":"mySeries1"
        },{
          "series": [
            [1397102460000, 1],
            [1397131620000, 21],
            [1397160780000, 3],
            [1397189940000, 10],
            [1397219100000, 27]
          ],
          "seriesNumber":1,
          "name":"mySeries2"
        }];

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseTooltip.set('margin',m);
      baseTooltip.set('chartData',d);
    });

    test('baseTooltip fixture is created', function() {
      assert.isTrue(baseTooltip !== null);
    });

    test('baseTooltip is hidden', function() {
      assert.isTrue(baseTooltip.$.tooltip.classList.contains('hidden'));
    });

    test('baseTooltip _rect is set', function() {
      var rect = baseSVG.pxSvgElem.getBoundingClientRect();
      assert.equal(JSON.stringify(baseTooltip._rect),JSON.stringify(rect));
    });
  }); //suite

  suite('px-vis-tooltip baseTooltip tooltipData is added', function() {
    var baseSVG = document.getElementById('baseSVG'),
        baseTooltip = document.getElementById('baseTooltip');

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

      baseTooltip.set('tooltipData',d);
      // setTimeout(function(){ done(); },1000);
      done();
    });

    test('baseTooltip is show', function() {
      assert.isFalse(baseTooltip.$.tooltip.classList.contains('hidden'));
    });
    test('baseTooltip style left', function() {
      var num = parseInt(baseTooltip.$.tooltip.style.left);
      assert.equal(num,328);
    });
    test('baseTooltip style top', function() {
      var num = parseInt(baseTooltip.$.tooltip.style.top);
      assert.closeTo(num,245,1);
    });
  }); //suite

  suite('px-vis-tooltip baseTooltip tooltipData is removed', function() {
    var baseSVG = document.getElementById('baseSVG'),
        baseTooltip = document.getElementById('baseTooltip');

    suiteSetup(function(done){
      var d = {
        'time': null,
        'series': [
          {'name':0,'coord': null },
          {'name':1,'coord': null },
        ],
        'mouse': null,
        'xArr': null,
        'yArr': null
      };
debugger
      baseTooltip.set('tooltipData',d);
      baseTooltip.set('seriesConfig', {
        "0":{
          name:'mySeries1',
          color: 'red'
        },
        "1":{
          name:'mySeries2',
          color: 'red'
        }}
      );
      // setTimeout(function(){ done(); },1000);
      done();
    });

    test('baseTooltip is hidden', function() {
      assert.isTrue(baseTooltip.$.tooltip.classList.contains('hidden'));
    });
  }); //suite
} //runTests
