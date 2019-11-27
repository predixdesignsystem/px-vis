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

    <px-vis-canvas
        canvas-context="{{canvasContext}}"
        width="[[width]]"
        height="[[height]]"
        margin="[[margin]]"
        offset="[[offset]]">
    </px-vis-canvas>

@element px-vis-canvas
@blurb Element which creates a canvas element
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
import './css/px-vis-styles.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

Polymer({
  _template: html`
      <style include="px-vis-styles"></style>

      <canvas id="chartCanvas" width="[[width]]" height="[[height]]">
      </canvas>
`,

  is: 'px-vis-canvas',

  /****** EVENTS ******/
  /**
   * Fired once d3 canvas context has been configured.
   *
   * Uses the px-vis-behavior-chart behavior, for listening and setting property, locally or globally.
   * Detail includes:
   *
   * ```
   * { 'data': canvasContext }
   * ```
   *
   * @event px-vis-canvas-context-updated
   */

  behaviors: [
    PxVisBehavior.observerCheck,
    PxVisBehavior.sizing,
    PxVisBehavior.commonMethods,
    PxVisBehaviorD3.canvasContext
  ],

  /**
   * Properties block, expose attribute values to the DOM via 'reflect'
   *
   * @property properties
   * @type Object
   */
  properties: {
    /**
     * The canvas element
     *
     *
     */
    _canvas:{
      type:Object
    }
  },

  observers: [
    '_setCanvas(width,height,margin,offset.*)'
  ],

  /**
  * when attached, re-fire set properties for precipitation pattern, as well as the svg element that's inside px-svg.
  *
  * @method attached
  */
  attached: function(){
    if(this._doesObjHaveValues(this.canvasContext)){
      this.fire('px-vis-canvas-context-updated',{ 'data': this.canvasContext, 'dataVar': 'canvasContext', 'method': 'set' });
    }
  },

  detached: function() {
    if(this.canvasContext) {
      this.canvasContext.pxClearCanvas();
    }
  },

  /**
   * Configures the canvas and context
   *
   */
  _setCanvas: function(){
   if(this.hasUndefinedArguments(arguments)) {
     return;
   }

    if(this.width && this.height && this._doesObjHaveValues(this.margin)) {
      if(this.canvasContext) {
        this._reCenterCanvas();
      } else {
        this._createCanvaContext();
      }
    }
  },

  _reCenterCanvas: function() {
    this.canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    this.canvasContext.translate(this.margin.left + this.offset[0], this.margin.top + this.offset[1]);
    this.canvasContext._translation = [this.margin.left + this.offset[0], this.margin.top + this.offset[1]];

    this.fire('px-vis-canvas-context-updated',{ 'data': this.canvasContext, 'dataVar': 'canvasContext', 'method': 'set' });
  },

  _createCanvaContext: function() {
    var context;

    this._canvas = this.$.chartCanvas;

    context = this._canvas.getContext("2d");

    //reset translation so subsequent calls do not keep shifting canvas drawings
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(this.margin.left + this.offset[0], this.margin.top + this.offset[1]);

    context._translation = [this.margin.left + this.offset[0], this.margin.top + this.offset[1]];

    context.pxClearCanvas = function() {
      this.save()
      this.setTransform(1, 0, 0, 1, 0, 0);
      this.clearRect(0,0, this.canvas.width, this.canvas.height);
      this.restore();
    }.bind(context);

    this.set('canvasContext',context);
    this.fire('px-vis-canvas-context-updated',{ 'data': context, 'dataVar': 'canvasContext', 'method': 'set' });
  }
});
