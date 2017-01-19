document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {

  suite('px-vis-dynamic-menu config', function() {
    var menu = document.getElementById('menu'),
        conf,
        deleteCounter = 0,
        deleteCounterEvent = 0,
        bringToFrontCounter = 0,
        someContext = {'isContext': true};

    suiteSetup(function() {

      conf = [
          {
            'name': 'Delete',
            'action': function(data) {
              deleteCounter++;
              assert.deepEqual(this, someContext);
              assert.deepEqual(data.menuItem, conf[0]);
              assert.equal(data.additionalDetail.test, 'aString');
            },
            'actionContext': someContext,
            'eventName': 'delete',
            'icon': 'fa-trash',
          },
          {
            'name': 'Bring To Front',
            'action': function(data) {
              bringToFrontCounter++;
              assert.deepEqual(data.menuItem, conf[1]);
              assert.equal(data.additionalDetail.test, 'aString');
            },
            'icon': 'fa-arrow-up'
          }
        ];
        
        menu.set('dynamicMenuConfig', conf);

      document.addEventListener('px-vis-event-request', function(evt) {
        assert.equal(evt.detail.eventName, 'delete');
        deleteCounterEvent++;
      });

      //because bring to front has no context it's trying to reach the chart
      document.addEventListener('px-vis-action-request',function(evt) {
        evt.detail.function(evt.detail.data);
        assert.deepEqual(evt.detail.data.menuItem, conf[1]);
        assert.equal(evt.detail.data.additionalDetail.test, 'aString');
      });
    });

    test('menu fixture is created', function() {
      assert.isTrue(menu !== null);
    });

    test('menu fixture is shown', function() {
      assert.notEqual(menu.getComputedStyleValue('display'), 'none');
    });

    test('menu fadeOut hides', function() {
      menu.fadeOut();

      setTimeout('fadeout', function() {
        assert.equal(menu.getComputedStyleValue('display'), 'none');
      }, menu.animationConfig.fadeOut.timing.duration);
    });

    test('menu fadeIn shows', function() {
      menu.fadeOut();

      setTimeout('fadeIn', function() {
        assert.equal(menu.getComputedStyleValue('display'), menu.displayClass);
      }, menu.animationConfig.fadeOut.timing.duration);
    });

    test('menu not opened', function() {
      
      assert.isFalse(menu._opened);
      assert.equal(Polymer.dom(menu.root).querySelector('iron-dropdown').getComputedStyleValue('display'), 'none');
    });

    test('open menu by click', function() {
      
      var span = Polymer.dom(menu.root).querySelector('span');
      span.click();

      assert.isTrue(menu._opened);
      flush(function() {
        assert.equal(Polymer.dom(menu.root).querySelector('iron-dropdown').getComputedStyleValue('display'), 'block');
      })
    });

    test('click on delete', function() {
      var deleteItem = Polymer.dom(menu.root).querySelectorAll('.menu-wrapper--item')[0];
      deleteItem.click();

      assert.equal(deleteCounter, 1);
      assert.equal(deleteCounterEvent, 1);
    });

    test('click on bring to front', function() {
      
      var bringToFront = Polymer.dom(menu.root).querySelectorAll('.menu-wrapper--item')[1];
      bringToFront.click();

      assert.equal(bringToFrontCounter, 1);
    });
  });

} //runTests
