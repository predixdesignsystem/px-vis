document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {
  suite('px-vis-toolbar does Polymer exist?', function() {
    suiteSetup(function(done) {   window.setTimeout(function() {done();}, 1000); });
    test('Polymer exists', function() {
      assert.isTrue(Polymer !== null);
    });
  });

  suite('px-vis-toolbar basic setup works', function() {
    var toolbar,
        mainItems;

    suiteSetup(function(done) {
      toolbar = document.getElementById('toolbar');
      var margin = {
            top: '10px',
            bottom: '10px',
            left: '10px',
            right: '10px'
          },
          config = {
            advancedZoom: true,
            pan: true,
            tooltip: true,
            stripe: true
          };

      toolbar.set('withinChart', true);
      toolbar.set('chartMargin', margin);
      toolbar.set('config', config);

      setTimeout(function() {
        mainItems = toolbar.$.mainRow.querySelectorAll('span.main-item');
        done();
      }, 100)
    });


    test('toolbar fixture is created', function() {
      assert.isTrue(toolbar !== null);
    });

    test('toolbar main row has correct flex class', function() {
      assert.isTrue(toolbar.$.mainRow.classList.contains('flex--row--rev'));
      assert.isTrue(toolbar.$.mainRow.classList.contains('right'));
    });

    test('toolbar main row has correct number of items', function() {
      assert.equal(mainItems.length, 4);
    });

    test('toolbar items have correct class', function() {
      assert.isFalse(mainItems[0].classList.contains('selected'));
      assert.isTrue(mainItems[1].classList.contains('selected'));
      assert.isFalse(mainItems[2].classList.contains('selected'));
      assert.isFalse(mainItems[3].classList.contains('selected'));
    });

    test('toolbar items got correct icons', function() {
      assert.equal(mainItems[0].querySelector('px-icon').icon, 'px-vis:draw-stripe');
      assert.equal(mainItems[1].querySelector('px-icon').icon, 'px-vis:show-tooltip');
      assert.equal(mainItems[2].querySelector('px-icon').icon, 'px-vis:pan');
      assert.equal(mainItems[3].querySelector('px-icon').icon, 'px-vis:zoom-toolbar');
    });

    test('toolbar items got tooltips', function() {
      assert.isDefined(mainItems[0].querySelector('px-tooltip'));
      assert.isDefined(mainItems[1].querySelector('px-tooltip'));
      assert.isDefined(mainItems[2].querySelector('px-tooltip'));
      assert.isDefined(mainItems[3].querySelector('px-tooltip'));
    });

    test('toolbar items got expected values', function() {
      assert.equal(mainItems[0].value, 0);
      assert.equal(mainItems[1].value, 1);
      assert.equal(mainItems[2].value, 2);
      assert.equal(mainItems[3].value, 3);
    });

    test('toolbar sub row doesnt have any items', function() {
      assert.equal(toolbar.currentSubConfig.length, 0);
      assert.equal(toolbar.$$('#subRow').querySelectorAll('span.main-item').length, 0);
    });

    test('toolbar actionConfig', function() {
      assert.deepEqual(toolbar.actionConfig, {
        mouseout: "resetTooltip",
        mousemove: "calcTooltipData",
        click: null,
        mousedown: null,
        mouseup: null
      });
    });
  });

  suite('px-vis-toolbar click on main item', function() {
    var toolbar,
        mainItems,
        subItems;

    suiteSetup(function(done) {
      toolbar = document.getElementById('toolbar');
      mainItems = toolbar.$.mainRow.querySelectorAll('span.main-item');

      var rendered = function() {
        toolbar.removeEventListener('px-vis-toolbar-secondary-toggled', rendered);
        subItems = toolbar.$$('#subRow').querySelectorAll('span.main-item');
        done();
      };

      toolbar.addEventListener('px-vis-toolbar-secondary-toggled', rendered);

      mainItems[3].click();
    });

    test('toolbar main item got selected class', function() {

      assert.isFalse(mainItems[0].classList.contains('selected'));
      assert.isFalse(mainItems[1].classList.contains('selected'));
      assert.isFalse(mainItems[2].classList.contains('selected'));
      assert.isTrue(mainItems[3].classList.contains('selected'));
    });

    test('toolbar sub row has correct classes', function() {
      assert.isTrue(toolbar.$$('#subRow').classList.contains('flex--row--rev'));
      assert.isTrue(toolbar.$$('#subRow').classList.contains('right'));
      assert.isTrue(toolbar.$$('#subRow').classList.contains('subrow--chart'));
      assert.isTrue(toolbar.$$('#subRow').classList.contains('flex--row'));
    });

    test('toolbar sub row has correct number of items', function() {
      assert.equal(subItems.length, 7);
      assert.equal(subItems.length, toolbar.currentSubConfig.length);
    });

    test('toolbar sub items got correct icons', function() {
      assert.equal(subItems[0].querySelector('px-icon').icon, toolbar.currentSubConfig[0].icon);
      assert.equal(subItems[1].querySelector('px-icon').icon, toolbar.currentSubConfig[1].icon);
      assert.equal(subItems[2].querySelector('px-icon').icon, toolbar.currentSubConfig[2].icon);
      assert.equal(subItems[3].querySelector('px-icon').icon, toolbar.currentSubConfig[3].icon);
      assert.equal(subItems[4].querySelector('px-icon').icon, toolbar.currentSubConfig[4].icon);
      assert.equal(subItems[5].querySelector('px-icon').icon, toolbar.currentSubConfig[5].icon);
      assert.equal(subItems[6].querySelector('px-icon').icon, toolbar.currentSubConfig[6].icon);
    });

    test('toolbar sub items got tooltips', function() {
      assert.isDefined(subItems[0].querySelector('px-tooltip'));
      assert.isDefined(subItems[1].querySelector('px-tooltip'));
      assert.isDefined(subItems[2].querySelector('px-tooltip'));
      assert.isDefined(subItems[3].querySelector('px-tooltip'));
      assert.isDefined(subItems[4].querySelector('px-tooltip'));
      assert.isDefined(subItems[5].querySelector('px-tooltip'));
      assert.isDefined(subItems[6].querySelector('px-tooltip'));
    });

    test('toolbar sub items are not selected', function() {
      assert.isFalse(subItems[0].classList.contains('selected'));
      assert.isFalse(subItems[1].classList.contains('selected'));
      assert.isFalse(subItems[2].classList.contains('selected'));
      assert.isFalse(subItems[3].classList.contains('selected'));
      assert.isFalse(subItems[4].classList.contains('selected'));
      assert.isFalse(subItems[5].classList.contains('selected'));
      assert.isFalse(subItems[6].classList.contains('selected'));
    });

    test('toolbar actionConfig', function() {
      assert.deepEqual(toolbar.actionConfig, {
        mousedown: 'startZooming',
        mouseup: 'stopZooming',
        click: null,
        mousemove: null,
        mouseout: null
      });
    });
  });



  suite('px-vis-toolbar click on sub selectable item', function() {
    var toolbar,
        template,
        mainItems,
        subItems;

    suiteSetup(function(done) {
      toolbar = document.getElementById('toolbar');
      template = Polymer.Element ? document.getElementById('template2') : document.getElementById('template');
      mainItems = toolbar.$.mainRow.querySelectorAll('span.main-item');
      subItems = toolbar.$$('#subRow').querySelectorAll('span.main-item');

      var rendered = function(evt) {
        toolbar.removeEventListener('px-vis-action-request', rendered);
        //mock run the fn from the chart
        evt.detail.function.bind(template)();
        done();
      };

      toolbar.addEventListener('px-vis-action-request', rendered);

      subItems[5].click();
    });

    test('toolbar sub items are correctly selected', function() {
      assert.isFalse(subItems[0].classList.contains('selected'));
      assert.isFalse(subItems[1].classList.contains('selected'));
      assert.isFalse(subItems[2].classList.contains('selected'));
      assert.isFalse(subItems[3].classList.contains('selected'));
      assert.isFalse(subItems[4].classList.contains('selected'));
      assert.isTrue(subItems[5].classList.contains('selected'));
      assert.isFalse(subItems[6].classList.contains('selected'));
    });

    test('toolbar selectionType', function() {
      assert.equal(template.selectionType, 'yAxis');
    });
  });

  suite('px-vis-toolbar click on sub non selectable item', function() {
    var toolbar,
        template,
        mainItems,
        subItems,
        event;

    suiteSetup(function(done) {
      toolbar = document.getElementById('toolbar');
      template = document.getElementById('template');
      mainItems = toolbar.$.mainRow.querySelectorAll('span.main-item');
      subItems = toolbar.$$('#subRow').querySelectorAll('span.main-item');

      var rendered = function(evt) {
        toolbar.removeEventListener('px-vis-event-request', rendered);
        event = evt.detail.eventName;
        done();
      };

      toolbar.addEventListener('px-vis-event-request', rendered);

      subItems[3].click();
    });

    test('toolbar sub items are correctly selected', function() {
      assert.isFalse(subItems[0].classList.contains('selected'));
      assert.isFalse(subItems[1].classList.contains('selected'));
      assert.isFalse(subItems[2].classList.contains('selected'));
      assert.isFalse(subItems[3].classList.contains('selected'));
      assert.isFalse(subItems[4].classList.contains('selected'));
      assert.isTrue(subItems[5].classList.contains('selected'));
      assert.isFalse(subItems[6].classList.contains('selected'));
    });

    test('toolbar returned event name is correct', function() {
      assert.equal(event, 'px-vis-toolbar-zoom-in');
    });
  });

  suite('px-vis-toolbar click on new main item', function() {
    var toolbar,
        mainItems,
        subItems;

    suiteSetup(function(done) {
      toolbar = document.getElementById('toolbar');
      mainItems = toolbar.$.mainRow.querySelectorAll('span.main-item');

      mainItems[0].click();

      setTimeout(function() {
        subItems = toolbar.$$('#subRow').querySelectorAll('span.main-item');
        done();
      },100);
    });

    test('toolbar main item got selected class', function() {
      assert.isTrue(mainItems[0].classList.contains('selected'));
      assert.isFalse(mainItems[1].classList.contains('selected'));
      assert.isFalse(mainItems[2].classList.contains('selected'));
      assert.isFalse(mainItems[3].classList.contains('selected'));
    });

    test('toolbar sub row has correct number of items', function() {
      assert.equal(subItems.length, 4);
      assert.equal(subItems.length, toolbar.currentSubConfig.length);
    });

    test('toolbar sub items got correct icons', function() {

      assert.equal(subItems[0].querySelector('px-icon').icon, toolbar.currentSubConfig[0].icon);
      assert.equal(subItems[1].querySelector('px-icon').icon, toolbar.currentSubConfig[1].icon);
      assert.equal(subItems[2].querySelector('px-icon').style['display'], 'none');
      assert.equal(subItems[3].querySelector('px-icon').style['display'], 'none');
    });

    test('toolbar sub items are not selected', function() {
      assert.isFalse(subItems[0].classList.contains('selected'));
      assert.isTrue(subItems[1].classList.contains('selected'));
      assert.isFalse(subItems[2].classList.contains('selected'));
      assert.isTrue(subItems[3].classList.contains('selected'));
    });

    test('toolbar actionConfig', function() {
      assert.deepEqual(toolbar.actionConfig, {
        'mousedown': 'startStriping',
        'mouseup': 'stopStriping',
        'mouseout': 'resetTooltip',
        'mousemove': 'calcTooltipData',
        'click': null
      });
    });
  });

  suite('px-vis-toolbar click to close item', function() {
    var toolbar,
        mainItems,
        subItems;

    suiteSetup(function(done) {
      toolbar = document.getElementById('toolbar');
      mainItems = toolbar.$.mainRow.querySelectorAll('span.main-item');

      mainItems[0].click();

      setTimeout(function() {
        subItems = toolbar.$$('#subRow').querySelectorAll('span.main-item');
        done();
      },100);
    });

    test('toolbar main item got selected class', function() {
      assert.isTrue(mainItems[0].classList.contains('selected'));
      assert.isFalse(mainItems[1].classList.contains('selected'));
      assert.isFalse(mainItems[2].classList.contains('selected'));
      assert.isFalse(mainItems[3].classList.contains('selected'));
    });

    test('toolbar subConfig is empty', function() {
      assert.deepEqual(toolbar.currentSubConfig, []);
    });

    test('toolbar sub row has correct number of items', function() {
      assert.equal(subItems.length, 0);
    });

    test('toolbar actionConfig', function() {
      assert.deepEqual(toolbar.actionConfig, {
        'mousedown': 'startStriping',
        'mouseup': 'stopStriping',
        'mouseout': 'resetTooltip',
        'mousemove': 'calcTooltipData',
        'click': null
      });
    });
  });
}
