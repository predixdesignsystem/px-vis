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

import '../px-vis-clip-path.js';
import '../px-vis-svg.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
    <p style="color: rgb(177,177,188)">Two full sized rects are drawn, a grey and a black. px-vis-clip-path is clipping the black rectangle. </p>
    <px-vis-svg width="[[width]]" height="[[height]]" margin="{
        &quot;top&quot;: 0,
        &quot;right&quot;: 0,
        &quot;bottom&quot;: 0,
        &quot;left&quot;: 0
      }" svg="{{svg}}">
    </px-vis-svg>
    <px-vis-clip-path svg="[[svg]]" width="[[cpWidth]]" height="[[cpHeight]]" margin="{
        &quot;top&quot;: 0,
        &quot;right&quot;: 0,
        &quot;bottom&quot;: 0,
        &quot;left&quot;: 0
      }" clip-path="{{clipPath}}" series-clip-path="{{seriesClipPath}}">
    </px-vis-clip-path>
`,

  is: 'px-vis-clip-path-demo-component',

  properties: {
    description: {
      type: String,
      value: "\"The clipping path restricts the region to which paint can be applied. Conceptually, any parts of the drawing that lie outside of the region bounded by the currently active clipping path are not drawn.\" (MDN) Ostensibly, the clipping path gets applied to drawing components to prevent them from drawing on certain parts of the chart, such stopping a line series drawing where the axis is drawn. To use, specfify the sizing, svg, and interpreters as specified in the example. It will return an ID for the clipping path which can be passed to other drawing objects. This component returns TWO different clip path IDs. clipPath includes the margin on top and seriesClipPath excludes it."
    },
    width: {
      type: Number,
      value: 500
    },
    height: {
      type: Number,
      value: 250
    },
    cpWidth: {
      type: Number,
      computed: 'computeWidth(width)'
    },
    cpHeight: {
      type: Number,
      computed: 'computeHeight(height)'
    },
    clipPath: {
      type: String,
      observer: 'drawBox'
    }
  },

  computeWidth: function(width) {
    return width - 100;
  },

  computeHeight: function(height) {
    return height - 100;
  },

  drawBox: function() {
    this.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'grey');
    this.svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'black')
      .attr("clip-path", 'url(#' + this.clipPath + ')');
  }
});
