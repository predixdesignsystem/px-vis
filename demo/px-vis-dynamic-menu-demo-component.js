/*
Copyright (c) 2018, General Electric

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '../px-vis-dynamic-menu.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <px-vis-dynamic-menu dynamic-menu-config="[[dynamicMenuConfig]]"></px-vis-dynamic-menu>
`,

  is: 'px-vis-dynamic-menu-demo-component',

  properties: {
    description: {
      type: String,
      value: "Element providing a menu dynamically built depending on options."
    },
    dynamicMenuConfig: {
      type: Array,
      value: function() {
        return [{
          "name": "Delete",
          "action": "function(data) { console.log('delete');}",
          "eventName": "delete",
          "icon": "px-vis:trash-series"
        },{
          "name": "Bring To Front",
          "action": "function(data) { console.log('bring to front');}",
          "eventName": "bring-to-front",
          "icon": "px-vis:bring-to-front"
        }]
      }
    }
  }
});
