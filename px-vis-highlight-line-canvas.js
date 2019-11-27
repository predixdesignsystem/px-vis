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

    <px-vis-svg
        ...
        svg="{{svg}}">
    </px-vis-svg>
    <px-vis-scale
        ...
        x="{{x}}"
        y="{{y}}"
        domain-changed="{{domainChanged}}">
    </px-vis-scale>
    <px-vis-interaction-space
        ...
        generating-crosshair-data="{{generatingCrosshairData}}"
        crosshair-data="{{crosshairData}}">
    </px-vis-interaction-space>

    <px-vis-highlight-line
        svg="[[svg]]"
        x="[[x]]"
        y="[[y]]"
        domain-changed="[[domainChanged]]"
        time-data="[[key]]"
        complete-series-config="[[completeSeriesConfig]]"
        chart-data="[[chartData]]"
        generating-crosshair-data="[[generatingCrosshairData]]"
        crosshair-data="[[crosshairData]]">
    </px-vis-highlight-line>

@element px-vis-highlight-line
@blurb Element which highlight specific line datasets.
@homepage index.html
@demo demo/index.html


*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import './px-vis-behavior-common.js';
import './px-vis-behavior-d3.js';
import './px-vis-line-canvas.js';
import './css/px-vis-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
Polymer({
  _template: html`
      <style include="px-vis-styles"></style>

      <px-vis-line-canvas id="myHighlighter" width="[[width]]" height="[[height]]" margin="[[margin]]" canvas-context="[[canvasContext]]" parallel-coordinates="[[parallelCoordinates]]" radial-line="[[radialLine]]" renderer-type="highlightData" multi-path="" clip-path="[[clipPath]]" disable-pointer-events="" series-id="[[seriesId]]" category-key="[[categoryKey]]" categories="[[categories]]" chart-data="[[_highlightData]]" complete-series-config="[[completeSeriesConfig]]" stroke-width="2" x="[[x]]" y="[[y]]" domain-changed="[[domainChanged]]" interpolation-function="[[interpolationFunction]]">
      </px-vis-line-canvas>
`,

  is: 'px-vis-highlight-line-canvas',

  behaviors: [
    PxVisBehavior.sizing,
    PxVisBehaviorD3.canvasContext,
    PxVisBehaviorD3.axes,
    PxVisBehavior.dataset,
    PxVisBehavior.commonMethods,
    PxVisBehavior.crosshairData,
    PxVisBehavior.completeSeriesConfig,
    PxVisBehavior.seriesId,
    PxVisBehavior.categories,
    PxVisBehaviorD3.clipPathBoolean,
    PxVisBehavior.mutedSeries,
    PxVisBehavior.dimensions,
    PxVisBehaviorD3.domainUpdate,
    PxVisBehavior.dynamicConfigProperties,
    PxVisBehavior.highlightCanvasShared,
    PxVisBehavior.highlightLineShared, //core functionality
    PxVisBehavior.tooltipData,
    PxVisBehaviorD3.interpolationFunction
  ]
});
