document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests(){
  suite('px-vis-scatter does Polymer exist?', function() {
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-event is instantiated', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        defaultEvent = document.getElementById('defaultEvent'),
        faEvent = document.getElementById('faEvent'),
        uniEvent = document.getElementById('uniEvent'),
        imgEvent = document.getElementById('imgEvent'),
        noLabelEvent = document.getElementById('noLabelEvent'),
        offsetEvent = document.getElementById('offsetEvent');

    suiteSetup(function(done){
      var w = 500,
        h = 300,
        m = {
          "top": 25,
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
        ]}],
        dE = [{
          "id": "123",
          "time": 1397131620000,
          "label": "image"
        },{
          "id": "456",
          "time": 1397102460000,
          "label": "unicode"
        },{
          "id": "789",
          "time": 1397189940000,
          "label": "font awesome"
        },{
          "id": "333",
          "time": 1397160780000,
          "label": "Default"
        },{
          "id": "42",
          "time": 1397111451000
        },{
          "id": "444",
          "time": 1397170014000,
          "label": "offset"
        }]
        eventConfig =  {
          "font awesome":{
            "color": "blue",
            "icon": "fa-camera",
            "type": "fa",
            "offset":[0,0]
          },
          "unicode":{
            "color": "green",
            "icon": "\uf015",
            "type": "unicode",
            "offset":[1,0]
          },
          "image":{
            "icon": "../ge_logo.png",
            "type": "image",
            "offset":[0,-20],
            "size":"20"
          },
          "offset":{
            "icon": "fa-asterisk",
            "color":"red",
            "type": "fa",
            "offset":[10,20]
          }
        };

      baseSVG.set('width',w);
      baseSVG.set('height',h);
      baseSVG.set('margin',m);

      baseScale.set('width',w);
      baseScale.set('height',h);
      baseScale.set('margin',m);
      baseScale.set('chartData',d);

      defaultEvent.set('eventConfig',eventConfig);
      faEvent.set('eventConfig',eventConfig);
      uniEvent.set('eventConfig',eventConfig);
      imgEvent.set('eventConfig',eventConfig);
      noLabelEvent.set('eventConfig',eventConfig);
      noLabelEvent.set('eventConfig',eventConfig);
      offsetEvent.set('eventConfig',eventConfig);

      defaultEvent.set('chartData',dE[3]);
      faEvent.set('chartData',dE[2]);
      uniEvent.set('chartData',dE[1]);
      imgEvent.set('chartData',dE[0]);
      noLabelEvent.set('chartData',dE[4]);
      offsetEvent.set('chartData',dE[5]);

      // setTimeout(function(){ done() }.bind(this),5000);
      done();
    });

    test('defaultEvent fixture is created', function() {
      assert.isTrue(defaultEvent !== null);
    });
    test('faEvent fixture is created', function() {
      assert.isTrue(faEvent !== null);
    });
    test('uniEvent fixture is created', function() {
      assert.isTrue(uniEvent !== null);
    });
    test('imgEvent fixture is created', function() {
      assert.isTrue(imgEvent !== null);
    });
    test('noLabelEvent fixture is created', function() {
      assert.isTrue(noLabelEvent !== null);
    });
  }); //suite

  suite('px-vis-event defaultEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        defaultEvent = document.getElementById('defaultEvent');

    var colors = commonColors.properties.colors.value;

    test('defaultEvent eventGroup created', function() {
      assert.equal(defaultEvent.eventGroup.node().tagName,'g');
    });
    test('defaultEvent eventGroup has class', function() {
      assert.equal(defaultEvent.eventGroup.attr('class'),'event');
    });
    test('defaultEvent has random event-id', function() {
      assert.equal(defaultEvent.eventId.length,16);
    });
    test('defaultEvent has random event-id', function() {
      assert.equal(defaultEvent.eventId.split('_')[0],'event');
    });
    test('defaultEvent eventGroup set event-id', function() {
      assert.equal(defaultEvent.eventGroup.attr('event-id'),defaultEvent.eventId);
    });
    test('defaultEvent eventGroup set id', function() {
      assert.equal(defaultEvent.eventGroup.attr('id'),'event_' + defaultEvent.eventId);
    });

    test('defaultEvent eventIcon created', function() {
      assert.equal(defaultEvent.eventIcon.node().tagName,'text');
    });
    test('defaultEvent eventIcon font-family', function() {
      assert.equal(defaultEvent.eventIcon.attr('font-family'),'FontAwesome');
    });
    test('defaultEvent eventIcon font-size', function() {
      assert.equal(defaultEvent.eventIcon.attr('font-size'),'16px');
    });
    test('defaultEvent eventIcon fill color', function() {
      assert.equal(defaultEvent.eventIcon.attr('fill').split(' ').join(''),colors['grey7']);
    });
    test('defaultEvent eventIcon icon', function() {
      // This is weird. the  is the icon, but doesnt render in the text editor since it doesnt have the font file. so pulling the unicode from http://fontawesome.io/cheatsheet/ to test.
      assert.equal(defaultEvent.eventIcon.text(),'\uf05a');
    });
    test('defaultEvent eventIcon x', function() {
      assert.equal(defaultEvent.eventIcon.attr('x'),232);
    });
    test('defaultEvent eventIcon y', function() {
      assert.equal(defaultEvent.eventIcon.attr('y'),-5);
    });

    test('defaultEvent eventLine created', function() {
      assert.equal(defaultEvent.eventLine.node().tagName,'line');
    });
    test('defaultEvent eventLine stroke color', function() {
      assert.equal(defaultEvent.eventLine.attr('stroke').split(' ').join(''),colors['grey9']);
    });
    test('defaultEvent eventLine stroke width', function() {
      assert.equal(defaultEvent.eventLine.attr('stroke-width'),1);
    });
    test('defaultEvent eventLine x1', function() {
      assert.equal(defaultEvent.eventLine.attr('x1'),240);
    });
    test('defaultEvent eventLine x2', function() {
      assert.equal(defaultEvent.eventLine.attr('x2'),240);
    });
    test('defaultEvent eventLine y1', function() {
      assert.equal(defaultEvent.eventLine.attr('y1'),255);
    });
    test('defaultEvent eventLine y2', function() {
      assert.equal(defaultEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(defaultEvent.$.eventTooltip !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(defaultEvent.$.eventTooltip.$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: DefaultID: 333Timestamp: 08:13:00 +0000 | 10 Apr 2014');
    });
  }); //suite

  suite('px-vis-event faEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        faEvent = document.getElementById('faEvent');

    var colors = commonColors.properties.colors.value;

    test('faEvent eventGroup created', function() {
      assert.equal(faEvent.eventGroup.node().tagName,'g');
    });
    test('faEvent eventGroup has class', function() {
      assert.equal(faEvent.eventGroup.attr('class'),'event');
    });
    test('faEvent has random event-id', function() {
      assert.equal(faEvent.eventId,'faEvent');
    });
    test('faEvent eventGroup set event-id', function() {
      assert.equal(faEvent.eventGroup.attr('event-id'),'faEvent');
    });
    test('faEvent eventGroup set id', function() {
      assert.equal(faEvent.eventGroup.attr('id'),'event_faEvent');
    });

    test('faEvent eventIcon created', function() {
      assert.equal(faEvent.eventIcon.node().tagName,'text');
    });
    test('faEvent eventIcon font-family', function() {
      assert.equal(faEvent.eventIcon.attr('font-family'),'FontAwesome');
    });
    test('faEvent eventIcon font-size', function() {
      assert.equal(faEvent.eventIcon.attr('font-size'),'16px');
    });
    test('faEvent eventIcon fill color', function() {
      assert.equal(faEvent.eventIcon.attr('fill').split(' ').join(''),colors['blue']);
    });
    test('faEvent eventIcon icon', function() {
      // This is weird. the  is the icon, but doesnt render in the text editor since it doesnt have the font file. so pulling the unicode from http://fontawesome.io/cheatsheet/ to test.
      assert.equal(faEvent.eventIcon.text(),'\uf030');
    });
    test('faEvent eventIcon x', function() {
      assert.equal(faEvent.eventIcon.attr('x'),352);
    });
    test('faEvent eventIcon y', function() {
      assert.equal(faEvent.eventIcon.attr('y'),-5);
    });

    test('faEvent eventLine created', function() {
      assert.equal(faEvent.eventLine.node().tagName,'line');
    });
    test('faEvent eventLine stroke color', function() {
      assert.equal(faEvent.eventLine.attr('stroke').split(' ').join(''),colors['grey9']);
    });
    test('faEvent eventLine stroke width', function() {
      assert.equal(faEvent.eventLine.attr('stroke-width'),1);
    });
    test('faEvent eventLine x1', function() {
      assert.equal(faEvent.eventLine.attr('x1'),360);
    });
    test('faEvent eventLine x2', function() {
      assert.equal(faEvent.eventLine.attr('x2'),360);
    });
    test('faEvent eventLine y1', function() {
      assert.equal(faEvent.eventLine.attr('y1'),255);
    });
    test('faEvent eventLine y2', function() {
      assert.equal(faEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(faEvent.$.eventTooltip !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(faEvent.$.eventTooltip.$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: font awesomeID: 789Timestamp: 04:19:00 +0000 | 11 Apr 2014');
    });
  }); //suite

  suite('px-vis-event uniEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        uniEvent = document.getElementById('uniEvent');

    var colors = commonColors.properties.colors.value;

    test('uniEvent eventGroup created', function() {
      assert.equal(uniEvent.eventGroup.node().tagName,'g');
    });
    test('uniEvent eventGroup has class', function() {
      assert.equal(uniEvent.eventGroup.attr('class'),'event');
    });
    test('uniEvent has random event-id', function() {
      assert.equal(uniEvent.eventId,'uniEvent');
    });
    test('uniEvent eventGroup set event-id', function() {
      assert.equal(uniEvent.eventGroup.attr('event-id'),'uniEvent');
    });
    test('uniEvent eventGroup set id', function() {
      assert.equal(uniEvent.eventGroup.attr('id'),'event_uniEvent');
    });

    test('uniEvent eventIcon created', function() {
      assert.equal(uniEvent.eventIcon.node().tagName,'text');
    });
    test('uniEvent eventIcon font-family', function() {
      assert.equal(uniEvent.eventIcon.attr('font-family'),'FontAwesome');
    });
    test('uniEvent eventIcon font-size', function() {
      assert.equal(uniEvent.eventIcon.attr('font-size'),'16px');
    });
    test('uniEvent eventIcon fill color', function() {
      assert.equal(uniEvent.eventIcon.attr('fill').split(' ').join(''),colors['green']);
    });
    test('uniEvent eventIcon icon', function() {
      // This is weird. the  is the icon, but doesnt render in the text editor since it doesnt have the font file. so pulling the unicode from http://fontawesome.io/cheatsheet/ to test.
      assert.equal(uniEvent.eventIcon.text(),'\uf015');
    });
    test('uniEvent eventIcon x', function() {
      assert.equal(uniEvent.eventIcon.attr('x'),-7);
    });
    test('uniEvent eventIcon y', function() {
      assert.equal(uniEvent.eventIcon.attr('y'),-5);
    });

    test('uniEvent eventLine created', function() {
      assert.equal(uniEvent.eventLine.node().tagName,'line');
    });
    test('uniEvent eventLine stroke color', function() {
      assert.equal(uniEvent.eventLine.attr('stroke').split(' ').join(''),colors['grey9']);
    });
    test('uniEvent eventLine stroke width', function() {
      assert.equal(uniEvent.eventLine.attr('stroke-width'),1);
    });
    test('uniEvent eventLine x1', function() {
      assert.equal(uniEvent.eventLine.attr('x1'),0);
    });
    test('uniEvent eventLine x2', function() {
      assert.equal(uniEvent.eventLine.attr('x2'),0);
    });
    test('uniEvent eventLine y1', function() {
      assert.equal(uniEvent.eventLine.attr('y1'),255);
    });
    test('uniEvent eventLine y2', function() {
      assert.equal(uniEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(uniEvent.$.eventTooltip !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(uniEvent.$.eventTooltip.$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: unicodeID: 456Timestamp: 04:01:00 +0000 | 10 Apr 2014');
    });
  }); //suite

  suite('px-vis-event imgEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        imgEvent = document.getElementById('imgEvent');

    var colors = commonColors.properties.colors.value;

    test('imgEvent eventGroup created', function() {
      assert.equal(imgEvent.eventGroup.node().tagName,'g');
    });
    test('imgEvent eventGroup has class', function() {
      assert.equal(imgEvent.eventGroup.attr('class'),'event');
    });
    test('imgEvent has random event-id', function() {
      assert.equal(imgEvent.eventId,'imgEvent');
    });
    test('imgEvent eventGroup set event-id', function() {
      assert.equal(imgEvent.eventGroup.attr('event-id'),'imgEvent');
    });
    test('imgEvent eventGroup set id', function() {
      assert.equal(imgEvent.eventGroup.attr('id'),'event_imgEvent');
    });


    test('imgEvent eventIcon created', function() {
      assert.equal(imgEvent.eventIcon.node().tagName,'image');
    });
    test('imgEvent eventIcon xlink', function() {
      assert.equal(imgEvent.eventIcon.attr('xlink:href'),'../ge_logo.png');
    });
    test('imgEvent eventIcon width', function() {
      assert.equal(imgEvent.eventIcon.attr('width'),'20px');
    });
    test('imgEvent eventIcon height', function() {
      assert.equal(imgEvent.eventIcon.attr('height'),'20px');
    });
    test('imgEvent eventIcon x', function() {
      assert.equal(imgEvent.eventIcon.attr('x'),110);
    });
    test('imgEvent eventIcon y', function() {
      assert.equal(imgEvent.eventIcon.attr('y'),-25);
    });

    test('imgEvent eventLine created', function() {
      assert.equal(imgEvent.eventLine.node().tagName,'line');
    });
    test('imgEvent eventLine stroke color', function() {
      assert.equal(imgEvent.eventLine.attr('stroke').split(' ').join(''),colors['grey9']);
    });
    test('imgEvent eventLine stroke width', function() {
      assert.equal(imgEvent.eventLine.attr('stroke-width'),1);
    });
    test('imgEvent eventLine x1', function() {
      assert.equal(imgEvent.eventLine.attr('x1'),120);
    });
    test('imgEvent eventLine x2', function() {
      assert.equal(imgEvent.eventLine.attr('x2'),120);
    });
    test('imgEvent eventLine y1', function() {
      assert.equal(imgEvent.eventLine.attr('y1'),255);
    });
    test('imgEvent eventLine y2', function() {
      assert.equal(imgEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(imgEvent.$.eventTooltip !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(imgEvent.$.eventTooltip.$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: imageID: 123Timestamp: 12:07:00 +0000 | 10 Apr 2014');
    });
  }); //suite

  suite('px-vis-event noLabelEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        noLabelEvent = document.getElementById('noLabelEvent');

    var colors = commonColors.properties.colors.value;

    test('noLabelEvent eventGroup created', function() {
      assert.equal(noLabelEvent.eventGroup.node().tagName,'g');
    });
    test('noLabelEvent eventGroup has class', function() {
      assert.equal(noLabelEvent.eventGroup.attr('class'),'event');
    });
    test('noLabelEvent has random event-id', function() {
      assert.equal(noLabelEvent.eventId.length,16);
    });
    test('noLabelEvent has random event-id', function() {
      assert.equal(noLabelEvent.eventId.split('_')[0],'event');
    });
    test('noLabelEvent eventGroup set event-id', function() {
      assert.equal(noLabelEvent.eventGroup.attr('event-id'),noLabelEvent.eventId);
    });
    test('noLabelEvent eventGroup set id', function() {
      assert.equal(noLabelEvent.eventGroup.attr('id'),'event_' + noLabelEvent.eventId);
    });

    test('noLabelEvent eventIcon created', function() {
      assert.equal(noLabelEvent.eventIcon.node().tagName,'text');
    });
    test('noLabelEvent eventIcon font-family', function() {
      assert.equal(noLabelEvent.eventIcon.attr('font-family'),'FontAwesome');
    });
    test('noLabelEvent eventIcon font-size', function() {
      assert.equal(noLabelEvent.eventIcon.attr('font-size'),'16px');
    });
    test('noLabelEvent eventIcon fill color', function() {
      assert.equal(noLabelEvent.eventIcon.attr('fill').split(' ').join(''),colors['grey7']);
    });
    test('noLabelEvent eventIcon icon', function() {
      // This is weird. the  is the icon, but doesnt render in the text editor since it doesnt have the font file. so pulling the unicode from http://fontawesome.io/cheatsheet/ to test.
      assert.equal(noLabelEvent.eventIcon.text(),'\uf05a');
    });
    test('noLabelEvent eventIcon x', function() {
      assert.equal(noLabelEvent.eventIcon.attr('x'),29);
    });
    test('noLabelEvent eventIcon y', function() {
      assert.equal(noLabelEvent.eventIcon.attr('y'),-5);
    });

    test('noLabelEvent eventLine created', function() {
      assert.equal(noLabelEvent.eventLine.node().tagName,'line');
    });
    test('noLabelEvent eventLine stroke color', function() {
      assert.equal(noLabelEvent.eventLine.attr('stroke').split(' ').join(''),colors['grey9']);
    });
    test('noLabelEvent eventLine stroke width', function() {
      assert.equal(noLabelEvent.eventLine.attr('stroke-width'),1);
    });
    test('noLabelEvent eventLine x1', function() {
      assert.equal(noLabelEvent.eventLine.attr('x1'),37);
    });
    test('noLabelEvent eventLine x2', function() {
      assert.equal(noLabelEvent.eventLine.attr('x2'),37);
    });
    test('noLabelEvent eventLine y1', function() {
      assert.equal(noLabelEvent.eventLine.attr('y1'),255);
    });
    test('noLabelEvent eventLine y2', function() {
      assert.equal(noLabelEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(noLabelEvent.$.eventTooltip !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(noLabelEvent.$.eventTooltip.$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event:ID: 42Timestamp: 06:30:51 +0000 | 10 Apr 2014');
    });
  }); //suite

  suite('px-vis-event offsetEvent works', function() {
    var baseScale = document.getElementById('baseScale'),
        baseSVG = document.getElementById('baseSVG'),
        offsetEvent = document.getElementById('offsetEvent');

    var colors = commonColors.properties.colors.value;

    test('offsetEvent eventGroup created', function() {
      assert.equal(offsetEvent.eventGroup.node().tagName,'g');
    });
    test('offsetEvent eventGroup has class', function() {
      assert.equal(offsetEvent.eventGroup.attr('class'),'event');
    });
    test('offsetEvent has random event-id', function() {
      assert.equal(offsetEvent.eventId.length,16);
    });
    test('offsetEvent has random event-id', function() {
      assert.equal(offsetEvent.eventId.split('_')[0],'event');
    });
    test('offsetEvent eventGroup set event-id', function() {
      assert.equal(offsetEvent.eventGroup.attr('event-id'),offsetEvent.eventId);
    });
    test('offsetEvent eventGroup set id', function() {
      assert.equal(offsetEvent.eventGroup.attr('id'),'event_' + offsetEvent.eventId);
    });

    test('offsetEvent eventIcon created', function() {
      assert.equal(offsetEvent.eventIcon.node().tagName,'text');
    });
    test('offsetEvent eventIcon font-family', function() {
      assert.equal(offsetEvent.eventIcon.attr('font-family'),'FontAwesome');
    });
    test('offsetEvent eventIcon font-size', function() {
      assert.equal(offsetEvent.eventIcon.attr('font-size'),'16px');
    });
    test('offsetEvent eventIcon fill color', function() {
      assert.equal(offsetEvent.eventIcon.attr('fill').split(' ').join(''),colors['red']);
    });
    test('offsetEvent eventIcon icon', function() {
      // This is weird. the  is the icon, but doesnt render in the text editor since it doesnt have the font file. so pulling the unicode from http://fontawesome.io/cheatsheet/ to test.
      assert.equal(offsetEvent.eventIcon.text(),'\uf069');
    });
    test('offsetEvent eventIcon x', function() {
      assert.equal(offsetEvent.eventIcon.attr('x'),280);
    });
    test('offsetEvent eventIcon y', function() {
      assert.equal(offsetEvent.eventIcon.attr('y'),15);
    });

    test('offsetEvent eventLine created', function() {
      assert.equal(offsetEvent.eventLine.node().tagName,'line');
    });
    test('offsetEvent eventLine stroke color', function() {
      assert.equal(offsetEvent.eventLine.attr('stroke').split(' ').join(''),colors['grey9']);
    });
    test('offsetEvent eventLine stroke width', function() {
      assert.equal(offsetEvent.eventLine.attr('stroke-width'),1);
    });
    test('offsetEvent eventLine x1', function() {
      assert.equal(offsetEvent.eventLine.attr('x1'),278);
    });
    test('offsetEvent eventLine x2', function() {
      assert.equal(offsetEvent.eventLine.attr('x2'),278);
    });
    test('offsetEvent eventLine y1', function() {
      assert.equal(offsetEvent.eventLine.attr('y1'),255);
    });
    test('offsetEvent eventLine y2', function() {
      assert.equal(offsetEvent.eventLine.attr('y2'),0);
    });

    test('tooltip exists', function() {
      assert.isTrue(offsetEvent.$.eventTooltip !== null);
    });
    test('tooltip content is correct', function() {
      assert.equal(offsetEvent.$.eventTooltip.$.tooltip.querySelector('span.style-scope.px-vis-event').textContent.replace(/\s\s+/g, ''),'Event: offsetID: 444Timestamp: 10:46:54 +0000 | 10 Apr 2014');
    });
  }); //suite
} //runTests
