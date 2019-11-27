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
/**

### Usage

    <px-vis-svg-canvas
        svg="{{svg}}"
        canvas-context="{{canvasContext}}"
        svg-lower="{{svgLower}}"
        width="[[width]]"
        height="[[height]]"
        margin="[[margin]]">
    </px-vis-svg-canvas>

@element px-vis-svg
@blurb Element which creates 2 SVG elements, and a canvas element between the two svg elements.
@homepage index.html
@demo demo.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './px-vis-behavior-common.js';
import './px-vis-behavior-d3.js';
import './px-vis-svg.js';
import './px-vis-canvas.js';
import './css/px-vis-svg-canvas-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="px-vis-svg-canvas-styles"></style>
    <style>
      .noPointer {
        pointer-events: none;
      }
    </style>

    <div class="rel-container" style\$="height:[[height]]px; width:[[width]]px">
      <slot name="0"></slot>
      <px-vis-svg class="abs-elem inline--flex" svg="{{svgLower}}" px-svg-elem="{{pxSvgElemLower}}" width="[[width]]" height="[[height]]" margin="[[margin]]" offset="[[offset]]">
      </px-vis-svg>
      <slot name="1"></slot>
      <px-vis-canvas class="abs-elem inline--flex" canvas-context="{{canvasContext}}" width="[[width]]" height="[[height]]" margin="[[margin]]" offset="[[offset]]">
      </px-vis-canvas>

      <slot name="2"></slot>
      <template id="canvasTemplate" is="dom-repeat" items="[[_returnKeys(canvasLayersConfig.*, width, height, margin.*, offset.*)]]">
        <px-vis-canvas class="abs-elem inline--flex" style="[[_returnPointerEvents(item, canvasLayersConfig.*)]]" width="[[_returnProp(item, 'width', canvasLayersConfig.*, width)]]" height="[[_returnProp(item, 'height', canvasLayersConfig.*, height)]]" margin="[[_returnProp(item, 'margin', canvasLayersConfig.*, margin)]]" offset="[[_returnProp(item, 'offset', canvasLayersConfig.*, offset)]]">
        </px-vis-canvas>
      </template>

      <slot name="3"></slot>
      <px-vis-svg class="abs-elem inline--flex noPointer" svg="{{svg}}" px-svg-elem="{{pxSvgElem}}" width="[[width]]" height="[[height]]" margin="[[margin]]" offset="[[offset]]">
      </px-vis-svg>
      <slot name="4"></slot>
    </div>
`,

  is: 'px-vis-svg-canvas',

  behaviors: [
    PxVisBehavior.sizing,
    PxVisBehaviorD3.canvasContext,
    PxVisBehaviorD3.svg,
    PxVisBehaviorD3.svgLower
  ],

  /**
   * Properties block, expose attribute values to the DOM via 'reflect'
   *
   * @property properties
   * @type Object
   */
  properties: {

  },

  listeners: {
    'px-vis-canvas-context-updated': '_assignCanvas',
  },

  _assignCanvas: function(evt) {
    var normalized = dom(evt),
        key = this.$.canvasTemplate.itemForElement(normalized.rootTarget);

    if(key) {
      this.set('canvasLayers.' + key, evt.detail.data);
    }
  },

  _returnKeys: function() {
    return Object.keys(this.canvasLayersConfig)
  },

  _returnProp: function(item, prop) {
    if(this.canvasLayersConfig[item][prop]) {
      return this.canvasLayersConfig[item][prop];
    }
    return this[prop];
  },

  _returnPointerEvents: function(item, confs) {
    return this.canvasLayersConfig[item]['mouseevents'] ? 'pointer-events: all;': 'pointer-events: none;';
  }
});
