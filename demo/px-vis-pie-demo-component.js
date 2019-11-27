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

import '../px-vis-pie.js';
import '../px-vis-svg.js';
import '../px-vis-behavior-common.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <px-vis-svg svg="{{svg}}" width="[[width]]" height="[[height]]" offset="[[offset]]" margin="[[margin]]" px-svg-elem="{{pxSvgElem}}">
    </px-vis-svg>
    <px-vis-pie id="baseLine" svg="[[svg]]" width="[[width]]" height="[[height]]" radius="[[radius]]" chart-data="[[chartData]]" margin="[[margin]]" complete-series-config="[[completeSeriesConfig]]" series-id="[[seriesId]]" px-svg-elem="[[pxSvgElem]]"></px-vis-pie>
`,

  is: 'px-vis-pie-demo-component',

  behaviors: [
    PxColorsBehavior.dataVisColors,
    PxColorsBehavior.dataVisColorTheming,
    PxColorsBehavior.getSeriesColors
  ],

  properties: {
    description: {
      type: String,
      value: "Creates an interactive pie or donut chart."
    },
    margin: {
      type: Object,
      value: function() {
        return {
          "top": 0,
          "right": 0,
          "bottom": 0,
          "left": 0
        }
      }
    },
    width: {
      type: Number,
      value: 500
    },
    height: {
      type: Number,
      value: 500
    },
    radius: {
      type: Number,
      value: 250
    },
    offset: {
      type: Array,
      value: function(){ return [250,250]}
    },
    chartData: {
      type: Array
    },
    completeSeriesConfig: {
      type: Object,
      value: function() {
        return {
          "y":{
            "y": "y",
            "x": "x",
            "name":"mySeries",
            "xAxisUnit":"pint"
          }
        }
      }
    },
    seriesId: {
      value: 'y',
      type: String
    }
  },

  listeners: {
    "px-data-vis-colors-applied" : '_returnChartData'
  },

  _returnChartData: function() {
    this.set('chartData', [
      {
        "x":15,
        "y":"IPA",
        "colorIndex":0,
        "percentage":"26"
      },{
        "x":1,
        "y":"Pils",
        "colorIndex":1,
        "percentage":"2"
      },{
        "x":1,
        "y":"Lager",
        "colorIndex":2,
        "percentage":"2"
      },{
        "x":8,
        "y":"Lambic",
        "colorIndex":3,
        "percentage":"14"
      },{
        "x":12,
        "y":"Stout",
        "colorIndex":4,
        "percentage":"21"
      },{
        "x":7,
        "y":"Pale Ale",
        "colorIndex":5,
        "percentage":"12"
      },{
        "x":9,
        "y":"Porter",
        "colorIndex":6,
        "percentage":"16"
      },{
        "x":4,
        "y":"Heffeweisse",
        "colorIndex":7,
        "percentage":"7"
      }
    ]);
  }
});
