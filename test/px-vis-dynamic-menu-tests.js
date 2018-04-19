/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

document.addEventListener("WebComponentsReady", function() {
  runTests();
});

function runTests() {

  suite('px-vis-dynamic-menu config', function() {
    var menu,
        conf,
        deleteCounter = 0,
        deleteCounterEvent = 0,
        bringToFrontCounter = 0,
        someContext = {'isContext': true};

    suiteSetup(function() {
      menu = document.getElementById('dynamicMenu');

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


    test('menu not opened', function() {

      assert.isFalse(menu._opened);
      assert.equal(Polymer.dom(menu.root).querySelector('iron-dropdown').getComputedStyleValue('display'), 'none');
    });

    test('open menu by click', function() {

      var button = Polymer.dom(menu.root).querySelector('button#button');
      button.click();

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
