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

import '../px-vis-radial-gridlines.js';
import '../px-vis-behavior-d3.js';
import '../px-vis-behavior-scale-radial.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <px-vis-radial-gridlines svg="[[svg]]" axis="[[y]]" margin="[[margin]]" domain-changed="[[domainChanged]]">
    </px-vis-radial-gridlines>
    <px-vis-svg id="svg" svg="{{svg}}" width="[[width]]" height="[[height]]" offset="[[offset]]">
    </px-vis-svg>
`,

  is: 'px-vis-radial-gridlines-demo-component',

  behaviors: [
    PxVisBehaviorD3.axes,
    PxVisBehaviorD3.domainUpdate,
    PxVisBehaviorScale.radial
  ],

  properties: {
    description: {
      type: String,
      value: "An element which draws polygonal grid lines."
    },
    radius:{
      type: Number,
      observer: 'setRadius'
    },
    _radius:{
      type: Number,
      value: 150
    },
    width:{
      type: Number,
      value: 400
    },
    height: {
      type: Number,
      value: 400
    },
    margin: {
      type: Object,
      value: function() { return {top: 0, bottom: 0, right: 0, left: 0} }
    },
    offset: {
      type: Array,
      value: function() {
        return [200,200]
      }
    },
    description: {
      type: String,
      value: "An element which draws polar grid lines."
    },
    centerOffset: {
      type: Number,
      value: 0
    },
    amplitudeExtents: {
      type: Array,
      value: function() {
        return [0,50]
      }
    }
  },

  observers: [
    '_setYScale(_radius,centerOffset)',
    '_generateChartExtents(amplitudeExtents)',
    '_setDomain(y, _calculatedExtents)',
  ],

  setRadius: function() {
    this.set('_radius', this.radius);
  }
});
