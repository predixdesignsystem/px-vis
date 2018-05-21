v5.1.2
===================
* More strict mode fixes

v5.1.1
===================
* Ensure vis respects strict mode

v5.1.0
===================
* Add options to timeseries lasso for y and freeform lasso types

v5.0.4
===================
* Fix for https://github.com/predixdesignsystem/px-vis-timeseries/issues/84
* Fix for register alignment

v5.0.3
===================
* Ensure gradient values are normalized when using a custom gradient function

v5.0.2
===================
* Delete reference to file "px-vis-markers-tooltip-content.html" that no longer exists

v5.0.1
===================
* Make register config name setter more robust in some specific timing situations

v5.0.0
===================
* Added tooltipData.seriesObj property
* Register Changes:
  * item: Simplified register data construction into a single string instead of multiple props
  * item: Replaces number formatter with the no display version
  * Changed scrollBarsPresent observer so it only fires on a renderedItemCount change instead of dom-change
  * Unified pie and regular to both use scrollBarsPresent
  * Now uses tooltipData.seriesObj and completeSeriesConfig keys to construct register
    * completeSeriesConfig now has a `hideInRegister` option to prevent a series from showing in the register
    * pagnation to view additionalPoints
  * Sorting of register is now supported
    * Functionally similar to toolbar; app dev should provide `sortConfig` property on the register
    * `sortConfig` specifies desired sort types and provides a button/menu for users to change the sort order
    * Built in sort types, `default`, `muted`, and `name` can be specified with a boolean
    * Custom sort types can be specifed with an object
    * Sorting can be specified without the button via `sortType` property
  * Added pagnation display and interaction properties
  * Added reverseDisplayOrder property so the register can be instructed to display `y / x` instead of `x / y`
  * Added `displayXValuesOnly` & `displayYValuesOnly` to only display x or y data from tooltipData
  * Added two tone option for series icon to also display `negativeColor` when applicable
* Misc fixes and refactoring:
  * cursor
* Dyanmic Menu changes:
  * Normalized sizing of icons in dynamic menu
  * Allow customization of menu icon in dynamic menu
  * Removed neon animation from dynamic menu.
  * Removed fadeIn and fadeOut methods and classes
  * Created classes on register and refactored listeners to handle showing/hiding dynamic menu
    * Relies on CSS transitions now instead of animations
* Changed the way tooltipData is created throughout to accomodate new seriesObj
* Changed the way charts handle tooltipData to allow for pagination
* Added general method for checking for ordinal and time types.
  * Upgraded various ordinal checks to also check for scaleBand.
* Ordinal type scale changes in scale-behavior:
  * Added startFromZero option to scale
  * Added invert function to ordinal scales
  * Added scalePadding property on scale behavior to allow you to set the padding for ordinal type scales
* Refactored time search in interaction space to optimize perf
* New grouped bar component to provide grouped bars for a bar and column chart
  * seriesConfig can now have a `negativeColor` property to specify a different color for negative bar values. `color` will still be used for positive values
* Thresholds now have a `type` property and can be shown on the x-axis
* Added a reference curve component which accepts `referenceData` and `referenceConfig` to create a reference curve with a colored line and text
* Added `titleOffset` to px-vis-axis to allow you to offset the title from the default position
* Prefix all behaviors and window objects with `window`
* Upgrade to d3 v5
* Changed names for outerTickSize to tickSizeOuter to match d3.
* Added tickSizeInner to change tickSize on axis
* Added tickPadding on axis
* Added PxVisBehaviorChart.searchToolbar to PxVisBehaviorChart.chartCommon, adding a `getToolbar` method for all charts
* Toolbar changes:
  * Any toolbar item can now have a `hidden` property to show/hide the item
  * Any toolbar item can now have a `disabled` property
  * added a `onSelect` handler for items. `onClick` now won't be called when the item is programmatically selected (as opposed to being selected by a click). `onSelect` will be called in both cases (like `onClick` used to behave).
  * Not a toolbar change per say but any custom event handler defined in `actionConfig` can access the toolbar by calling `getToolbar` on the chart (which is usually `this` in the handler).
  * In a similar way handlers for `onClick`, `onSelect` and `onDeselect` have direct access to the toolbar through `e.toolbar`.
  * when using preconfigured toolbar options keys with a value of `false` will be ignored, e.g : {zoom: true, pan: false} will only show zoom button
  * Adding a `switchConfigItems` convenience function for switching two toolbar items
* Added `px-vis-cell-canvas`
* Event changes (BREAKING):
  * Event now draws all events in the supplied data, not just one
  * Removed `xKey` property and instead rely on `dataKey` supplied in the config
  * Made defaul `dataKey` = 'time' instead of 'x' which was the default for `xKey`
  * Event no longer directly displays a tooltip. Instead, it fires an event up and will rely on the chart to display the tooltip with the supplied information
* Marker changes (BREAKING):
  * Marker no longer directly displays a tooltip. Instead, it fires an event up and will rely on the chart to display the tooltip with the supplied information
* Register changes (BREAKING):
  * No longer directly displays a tooltip. Instead, it fires an event up and will rely on the chart to display the tooltip with the supplied information
* Axis changes (BREAKING):
  * No longer directly displays a tooltip. Instead, it fires an event up and will rely on the chart to display the tooltip with the supplied information
* Toolbar changes (BREAKING):
  * `onClick` definition in the config has been replaced by `onSelect`
  * Config definitions now have a 'click' defined by default. Custom configurations must now nullify this 'click' handler (if you dont use click).
  * No longer directly displays a tooltip. Instead, it fires an event up and will rely on the chart to display the tooltip with the supplied information
* px-vis-marker-tooltip-content changes (BREAKING):
  * Renamed to px-vis-central-tooltip-content
  * Drastically modifed to generalize component and better disconnection from markers
* Misc BREAKING:
  * `range` property has been removed from px-vis-chart-navigator. use `chartExtents.x` to control the timespan. The chart navigator does not support being used without data anymore
  * horizontal registers do not support custom alignment anymore and will use all available width
  * domainChanged is now a Number with initial value of 0. This toggling and checking if it hasnt been toggled easier.
  * PxVisBehaviorD3.domainUpdateNotify has been removed. PxVisBehaviorD3.domainUpdate once again has `notify: true`.
  * remove `_checkColorType` from PxVisBehavior.commonMethods
  * changed `PxVisBehaviorD3.icons._getIcon` to `PxVisBehaviorD3.icons._getPxIcon`
  * changed `PxVisBehaviorD3.icons._getPxIcon` to return an object with the icon, size, and scale instead of returning an icon and setting two props for size and scale
  * `px-vis-brush` and `px-vis-chart-navigator` don't use opacity for gradients but colors instead. As such the `gradientOverlay` property has been replaced byt the `gradientColors` property which can be:
    * A single color (string)
    * An array of colors (creating a linear gradient from those colors)
    * A custom function defining a gradient by returning a color for an input between 0 and 1.
* Added PxVisBehaviorChart.searchToolbar to PxVisBehaviorChart.chartCommon, adding a `getToolbar` method for all charts

v4.7.11
=================
* Ensure binary search compares by number

v4.7.10
=================
* Fix wrong d3-import version

v4.7.9
=================
* Use Math.floor instead of ~~ for flooring pixel values to avoid problems for big values

v4.7.8
=================
* Remove number formatter default culture to avoid overriding of culture on element creation

v4.7.7
=================
* Fixed bug where tooltip search on timeseries with prevent web worker would not return the timestamp

v4.7.6
=================
* Fix bug in canvas line rendering with show gaps on


v4.7.5
=================
* Fix bug in events where default config gets no color (and also draw fn may never get called)
* Fixed issue in scheduler where an error in the webworker could prevent further scheduling

v4.7.4
=================
* Fix bug where position of tooltip for parallel coordinates and radar were causing exceptions

v4.7.3
=================
* handle undefined value for log in Px.vis.debug.getInfo
* By default exclude render info when logging in Px.vis.debug.getInfo but still include it in returning object

v4.7.2
=================
* Avoid circular dependency in log object in Px.vis.debug.getInfo to be able to stringify it

v4.7.1
=================
* Added logging option for scheduler (boolean Px.vis.debug.log.scheduler)
* Logging for renderer is now optional (boolean Px.vis.debug.log.renderer)

v4.7.0
=================
* Added log scale and many associated changes to support log type scale

v4.6.5
=================
* `dimensions` now notify and improved documentation for `dimensions` and `axes`
* fixed a rare timing issue with the web worker scheduler when unregistering charts
* mitigated renderer slowness on screens with display rate between 30Hz and 60Hz
* Added Px.vis.debug.logLevel: 0 (no log), 1 (critical), 2 (warning), 3 (info). Currently only logs renderer level 3 info.
* Hang Px.vis.debug explicitely on the window

v4.6.4
=================
* add missing `function` keyword for IE

v4.6.3
=================
* ensure canvas to clear are defined when rendering no targets

v4.6.2
=================
* ensure changing commonAxis dynamically updates axis ticks visibility.
* added `priority` to `seriesConfig` to control order of drawing. priority 0 => smaller priority. 2 draws over 1, which itself draws over 0, etc..
* `priority` can now be changed dynamically in `markerConfig`
* Added a vis "debugger": Px.vis.debug. This object can:
  * verify the config of a chart is correct by using the `Px.vis.debug.checkConfig(chart)` method. The checks are minimal at the moment but will be enhanced in the future.
  * give debug info for a specific chart by using the `Px.vis.debug.getInfo(chart, log)` method. If log is true the returned object will be printed and indented in the console. useful for passing information back to the team when reporting a bug.
* Clear canvases when renderer has no target and was about to render (helps with muting edge case scenarios)
* The default 'crosshairLasso' configuration for the toolbar does not reset the searchType to 'none' when deselected
* Toolbar items that have an `onDeselect` function will only have their function run when actually deselected (used to fire every time another button was selected)
* Fixed a bug where webworker tooltip search for 'pointPerSeries' would return no results

v4.6.1
=================
* Removed px-vis-workerUrl check
* changed workerUrl to blobUrl to prevent possible race conditions

v4.6.0
=================
* Fix polar cursor handling of negative data
* Added ability to the web worker to return all datapoints at a particular point
* Added single point search option
* Changed the way tooltipData is reported for // and radar: now always ignores data hidden by brush instead of just with hardMute on.
* Changed // & radar hardMute: register doesnt show muted axes data with hard mute on
* Moved tooltip positioning for // and radar out of axis interaction space to the chart
* Added a chart behavior tooltipSizing, which gets necessary sizing and position data for tooltip on // and radar.
  * provides listeners to update when needed
  * only active when showTooltip is true
  * axis interaction space fires event on mouseenter
* Changes to interaction space so timeseries can have web worker point search too
* Changes to toolbar providing different tooltipData search options
* Changed the way tooltipData is reported for // and radar: now always ignores data hidden by brush instead of just with hardMute on.
* Fix for multiple cursors being drawn
* Added lasso functionality for multi-axis charts
* Made axis interaction-space brushes capable of dynamic extents updates
* Some changes to how previous lasso functionality worked so it is more standalone
* Added annotations component allowing users to add an annotation icon to charts with a tooltip with data
* Each handler in `actionConfig` in the toolbar can now be an array, allowing to run several handlers for one interaction (e.g click or hover). This allows to mix internal handlers of the chart (say run the tooltip search on hover) and custom ones (do something with the result of that tooltip search on hover for example)

v4.5.4
=================
* Added listeners to recall icon loading methods if the iconset has not been loaded yet.

v4.5.3
=================
* Ensure webworker URL can be found in Polymer 2 with polyfills

v4.5.2
=================
* Ensure dynamic menus always get the right target on click

v4.5.1
=================
* Added check to area-svg for Polymer 2

v4.5.0
=================
* Hybrid support: Polymer 1.X and 2.X

v4.4.9
=================
* Fix for hard mute series disappearing from list with crosshair defaultData
* Added check for quadtree before running search

v4.4.8
=================
* Don't use strip whitespace in dynamic menu for IE measuring
* various bug fixes and guards

v4.4.7
=================
* Fix for multiaxis scale checking if dimensions are empty
* Fix for cursor to return null instead of empty string
* Ensure dynamic menu on IE won't show random scrollbars

v4.4.6
=================
* Fix axis titles bug in multi-axis for ts / xy charts
* Fix for console errors for cursor
* Ensure dynamic menus items labels don't get truncated on IE
* ensure no errors are thrown when setting markerData to empty

v4.4.5
=================
* Fix framework demo page

v4.4.4
=================
* Cleaning up seriesKeys code in highlighters

v4.4.3
=================
* Ensure multi lines can draw 0 values (and that those can be searched by tooltip)

v4.4.2
=================
* Ensure multi axis scale returns some extents when no data

v4.4.1
=================
* Exposed clipPath for canvas highlighters
* Fixed sync issue in the scheduler
* Ensure px-vis-events can get mouse events

v4.4.0
=================
* fix some racing conditions with muted series
* guard the scheduler more
* use new version of px-tooltip for positioning

v4.3.6
=================
* Ensure marker tooltip handles row with no data at all

v4.3.5
=================
* Ensure marker tooltips handles rows with a type that has no data

v4.3.4
=================
* Ensure markers tooltip can find last point in dataset

v4.3.3
=================
* Ensure canvas context is saved and restored for each canvas line draw to avoid clippath update problems

v4.3.2
================
* Ensure axis register always get the right number of axes

v4.3.1
================
* Added px-vis-crosshair-data-generated event when crosshair data has finished generating

v4.3.0
================
* Added tooltip support for px-vis-markers as well as priority based drawing. Tooltip can handle custom information as well as several markers at the same timestamp.

v4.2.2
================
* Fix radial scale extents when negative values are absolutely bigger than positive ones
* Fix highlight point canvas to work with degrees in polar
* Ensure svg and canvas highlighters (line + point) can be used at "creation time", i.e use crosshairData directly when creating a chart rather than at runtime
* Ensure brings on top feature works for filtered chart datasets on canvas (polar + xy)

v4.2.1
================
* Ensure canvas renderer clears series when no data

v4.2.0
================
* Added "lasso" selection for crosshair mode, available by default with "crosshairLasso" in toolbar

v4.1.1
================
* Fix issue where change in x axis scale wouldn't notify

v4.1.0
================
* provide "hard muting", allowing a muted series to be ignored for tooltip search as well as recalculating extents when muting a serie. A "hard muted" series won't show up in the tooltip, but will in the register (so it can be unmuted). Values won't be provided for a "hard muted" series
* added --px-vis-toolbar-submenu-z-index for customizing toolbar sub menu z index
* extent calculation will now add a buffer of 0.5 if a series only has 1 value across all its points, so that the series is displayued in the middle of the chart instead of on the top/bottom

v4.0.2
================
* guards against null/undefined chartData in _combineMutes
* changed tooltip label "reset zoom" and "reset panning" in the toolbar to "reset"

v4.0.1
================
* Guards against flushing when render to canvas/svg changes and we are not attached

v4.0.0
================
* Implemented Zooming capabilities for:
  * Polar charts
  * Radar charts
  * Parallel Coordinates charts
* BREAKING CHANGE: Changed Axis Interaction Space, interactive axis, and multi axis
  * None of these now calculate muted series
  * Generalized the axis interation space brush to fire an event with the brush extents
  * The event is expected to be caught at a "chart" level and processed by the PxVisBehaviorChart.extentsDataRouter
  * Added two properties to axis interaction space which must be set with new toolbar types:
    * specialActionsList: list of special actions that use brush or drag
    * brushActions: object of actions which use a brush. Value is a string which is also used to store brushDomains
  * Added an "unselected" brush box shown when you switch off of a toolbar brush action such as muting which shows a brush box that is not interactive
    * Can be styled via CSS vars - type = brushActions value:
      * --px-vis-axis-brush-fill-color-unselected-[[type]]
      * --px-vis-axis-brush-fill-opacity-unselected-[[type]]
      * --px-vis-axis-brush-outline-color-unselected-[[type]]
* BREAKING CHANGE: removed multi-axis-scale
  * Replaced with multi-axis-scale behavior
* BREAKING CHANGE: removed radial-scale
  * Replaced with radial-scale behavior
* Added scale behavior for radar type charts
* Added PxVisBehaviorChart.extentsDataRouter to handle all extentsData changes at the chart level
  * Routes to the appropriate callback for the extentsAction via the _extentsDataRoutes property
* Fixed polar gridlines angle
* Broke up zoom behavior to provide a more common import group
* Fixed cursor for polar
* Implemented radial panning
* Added checks to correct zoomStack on resize
* Fix for cursor console error in FF when hovering over polar chart at 0
* Fix for renderer to be dynamic:
  * clone the targets array so it cant be changed mid debounce
* Fix for switching between svg and canvas at runtime
* BREAKING CHANGE: default orientation in orientation definition is now `left` instead of `bottom`

v3.1.23
================
* delete empty line above some behaviors definition that would prevent them from showing up in the API

v3.1.22
================
* small update to demo catalog

v3.1.21
================
* add stricter conditions for drawing cursor to avoid errors on edge case scenarios

v3.1.20
================
* hide codepens for all demos

v3.1.19
================
* Striping supports a single timestamp entry, drawing a line instead of an area.
* Line dash style is configurable via the stripeConfig obj

v3.1.18
================
* Fix for striping and the data returned by interaction space extentsData.
  * Now when on a time scale, will return epoch time rather than date obj.

v3.1.17
================
* Remove some line breaks to make sure all behaviors are included in the docs

v3.1.16
================
* clean up docs/comments

v3.1.15
================
* updated px-vis-chart-navigator svg-canvas import

v3.1.14
================
* Added capability for the sub toolbar to be displayed above the chart rather than on top (set `subToolbarAlignment` to 'above')
* Can now close the subtoolbar by reclicking on its related main toolbar item

v3.1.13
================
* fixed bug in multi-axis-demo-component

v3.1.12
================
* fix opcaity in layers when exporting images
* removed unused canvg import

v3.1.11
================
* removed ge_logo from events demo

v3.1.10
================
* updated demos positioning and sass

v3.1.9
================
* updated subcomponent links in demo

v3.1.8
================
* Fix for sub-component demos to refer to shared API docs

v3.1.7
================
* Created new landing page for vis demos
* removed dark theme links from demo pages

v3.1.6
================
* Fix for dynamic menu icon

v3.1.5
================
* Fix doc format for static analyzer

v3.1.4
================
* Fix horizontal reigister scrollbar check -- change setting width to max-width
* Wrapped scrollbar check in AnimationFrame

v3.1.3
================
* Moved returnStrokeWidth into different behavior

v3.1.2
================
* Fix radial grid dynamic theming

v3.1.1
================
* Remove stray logs

v3.1.0
================
* Added PxVisBehavior.updateStylesOverride behavior
* Added ability to dynamically update stuff drawn with css variable

v3.0.7
================
* Adding ability to pass strokeWidth down through seriesConfig to lines

v3.0.6
================
* Fix for many demos
* Fix buttons 404 for demos

v3.0.5
================
* fixed behavior name

v3.0.4
================
* move sass partial out of sass folder

v3.0.3
================
* Update hidden class so we dont have to use helpers dseign
* Add sass partial for charts for common classes

v3.0.2
================
* Ensure axis intercation space won't draw on empty svg

v3.0.1
================
* Patching issue if highlight canvas is not created yet/ever.

v3.0.0
================
* Design refresh
* all components load with default colors unless a theme is loaded
* removed dataVisColors and seriesColorOrder
  * replaced with seriesColorList which is just an array of colors rather than names and needed a lookup as before
* Upgrade to hybrid polymerelements
* moved colors behavior from colors repo to vis repo
* new internal renderer for canvas:
  * renderer automatically adjust the number of points per frame rendered. This number will be adjusted every frame based on how long previous frame took, which should make the rendering smooth on different browsers and different hardware
  * It will now render "series per series" rather than a batch of several series for each frame, i.e it won't move to rendering the second series until the first series has been completely rendered
  * a few properties are available to adjust renderer behavior, see API for more info
* removed properties for controlling number of points rendered in progressive rendering:
  * noCanvasProgressiveRendering
  * progressiveRenderingPointsPerFrame
  * progressiveRenderingMinimumFrames
* removed progressive rendering events for line scatter and canvas scatter:
  * px-vis-scatter-progressive-rendering-started
  * px-vis-scatter-canvas-progressive-batch
  * px-vis-scatter-progressive-rendering-ended
  * px-vis-scatter-canvas-rendering-ended
  * px-vis-line-progressive-rendering-started
  * px-vis-line-canvas-progressive-batch
  * px-vis-line-progressive-rendering-ended
  * px-vis-line-canvas-rendering-ended
* new events for canvas rendering: px-vis-chart-canvas-rendering-started and px-vis-chart-canvas-rendering-ended
* removed redrawElement function from highlightPoint and highlightLine
* Changed inert property on register to inertRegister so as to not conflict with w3c spec
* Changed over to px-icon-set for px-vis-events, px-vis-toolbar, and px-vis-dynamic-menu
  * Events:
    * Images still supported
    * Font Awesome icons no longer supported.
    * Unicode values no longer supported
    * Icons can only be loaded icon-icon-sets which use SVG.
    * Icon name must include the set prefix
  * Dynamic menu and Toolbar:
    * Must be icons use px-icon, which wraps iron-icon.
    * Must be value icon types for px-icon or iron-icon.
    * Icon name must include the set prefix
* Removed canvasContextTop
  * changed to dynamic canvas creation
  * non-data series canvases can be created in a canvasLayers property via a canvasLayersConfig property

v2.1.9
==================
* Ensure properties of a predefined toolbar config can be overriden
* Fix getImage() width for radar

v2.1.8
==================
* various fixes to markers

v2.1.7
==================
* Fix for axis interaction space position on right and bottom axis (effectively fixing problem where right positioned axis couldn't be dragged in multi Y)
* Ensure multi axis can handle changing all its axes to the same number of new axis

v2.1.6
==================
* fix semantic error preventing IE from  loading PxVisBehaviorChart

v2.1.5
==================
* Ensure + and - zooming button set the appropriate extentsAction

v2.1.4
==================
* Ensure axis get redrawn when moving a chart around the dom

v2.1.3
* Ensure striping component won't try to draw on empty data

v2.1.2
==================
* Fix for markers on the bottom
* fix for parallel and radar register color bug

v2.1.1
==================
* Add ability to dynamically add canvases.
* Fixed behavor imports on several components

v2.1.0
==================
* Add striping component
* Add marker component
* Edits to toolbar and interaction space for striping
* Added to highlight, striping, and line-cursor to overview and demos
* Moved data converter methods into behavior
* Added muting capabilities for categories registers
* ensure fuzz factor for crosshair is always coerced to a number
* Ensure scales are not recreated when not needed (solving a reset zoom problem on resize)
* fixed bugs with brushes and axis interaction space
* fixed zoom resetting on resize bug
* fixed zoom toolbar bug/inconsistency
* added ability to register custom scripts to the web workers
  * scheduler will run said custom functions and they have access to the chartData

v2.0.8
==================
* Ensure markeScale is only applied to the marker size itself rather than the whole canvas

v2.0.7
==================
* Reset uniqueIds array to empty on detached instead of null

v2.0.6
==================
* Fixes to binary search in crosshair

v2.0.5
==================
* Improved performance of scatter canvas rendering
* removed debugging values from line canvas

v2.0.4
==================
* Fixed line drawing issue on canvas with undefined values while doing progressive rendering with no showGaps
* Fixed single radial line for canvas (polar)

v2.0.3
==================
* Permenant fix for scale bug - changes default extents to all dynamic
* fixed scale fallback to be in sync with ww scale

v2.0.2
==================
* Fix for scale bug

v2.0.1
==================
* ensure getImage() doesn't throw error when trying to render registers and no completeSeriesConfig is defined

v2.0.0
==================
* created a point highlighter and line highlighter for crosshair
* created ability to generate crosshair data in interaction-space
* major refactoring of interaction-space
* crosshair highlighters have ability to highlight same point or fuzzy search around that point
* Converted axis-brush to axis-interaction-space
* Moved axis drag into axis-interaction-space
* Moved tooltip calcs from parallel and radar into axis-interaction-space
* Set up action config and action mapping to enable toolbar configuration for axis-interaction-space
* fixed canvas clearing issue when using scatter and line at the same time
* added canvas support for radial line and radial scatter
* Merge PR removing clearfix
* Merge PR adding dash line options
* style changes for dash line to match spec
* added --px-register-series-marker-width so devs can control thickness of register markers

v1.2.1
==================
* bumping version for date-time-common

v1.1.14
==================
* ensure x Axis unit is still displayed in register when value is 0

v1.1.13
==================
* ensure spaces in register item are always consistent

v1.1.12
==================
* fix check for properties on object to check for array before checking all keys
* refactor progressive rendering
* fix missing space in register item after vulcanization

v1.1.11
==================
* ensure tooltip can still be shown in events
* added more config to `eventsConfig`:
      - `firstDateTimeFormat`: moment.js format string for the first part of the timestamp if the x Axis is time based
      - `separator`: the separator character between the two datetime strings
      - `secondDateTimeFormat`: moment.js format string for the second part of the timestamp if the x Axis is time based
      - `tooltipOrientation`: orientation of the tooltip
      - `timezone`: the moment.js timezone to be used for the timestamp

v1.1.10
==================
* added 'enableTooltip' (on by default) to eventConfig

v1.1.9
==================
* Ensure zoom in and zoom out features take the selection type into account

v1.1.8
==================
* Allows data converter to have a interpolator passed in.
* Changes to completeSeriesConfig computation so it does a proper deep clone of seriesConfig to allow functions and special values to be passed in.

v1.1.7
==================
* make sure radial gridline radius can't be negative

v1.1.6
==================
* fixed scale searching for extents. Added check so 0 values passes the filter.

v1.1.5
==================
* removed cleanOnDetached property and mae all elements always clean on detached. This has proven to be a necessary change to avoid unforeseen consequences of notc cleaning up with the config and/or data changing
* bug fix for line with seriesID

v1.1.4
==================
* fixed issue with tooltip on common axis

v1.1.3
==================
* fixed theming issue on dark tooltip
* fixed sizing for circle charts
* added font to measureText

v1.1.2
==================
* Added check to scatter checkign scatterDots defined before running isIdInMuted.
* Fixed typo in scatter props

v1.1.1
==================
* Fixed axis unit empty string doesnt clear previous unit

v1.1.0
==================
* Fixed line drawing from 0,0 if start of data is empty. Now leaves a break until first valid data
* Updated to use px-d3-imports
* Fixed gridline demo
* Made thresholds dynamic
* Performance improvements on thresholds
* Added area component
* Added disableClick for register
* fixed bug where deleted axis still draws
* Added isAttached behavior to track if we are attached to detached from dom
* Updates to demo dark theme
* added px-vis-scatter-canvas for supporting scatter on canvas rather than svg. dramatically faster on IE (always), faster on other browsers for big dataset, similar for other browsers for small datasets (<5k points)
* px-vis-chart-navigator now supports canvas rendering
* progressive rendering now can be customized through progressiveRenderingPointsPerFrame (16000 by default for lines, 2000 byy default for scatter) and progressiveRenderingMinimumFrames. Increase progressiveRenderingPointsPerFrame for better performance and decrease for smoother drawing. When at the right value no performance cost incurs and drawing is smooth but if value is too small can incur a performance cost (i.e the drawing will take longer, but will always start at the same time, also the UI won't be frozen)
* fix issue where progressive rendering could miss 1 point per frame, potentially a lot for big dataset
* added cleanOnDetached to allow reuse of the chart after detaching it from the dom. This is aimed at applications creating charts dynamically so that they can keep a pool of charts (simple array of charts) when removing them from the dom and reusing them later on with new data and config, improving performance . Turning cleanOnDetached on will make sure the chart will clear everything needed so that it draws properly with any new config. If using this strategy one thing to keep in mind is making sure the chart is re-appended in the dom *before* changing its properties to their new values. In most cases it would work even if appending it after, but some edge cases scenarios might fail to clean some visual artifact (for example switching from canvas to svg while deleting a few series at the same time). When moving the chart around the dom do not turn it on for performance boost and making sure you don't need the chart to force redrawing. This can be changed dynamically
* ensure canvas and svg clean themselves up on detached (they will redraw on attached if needed)
* ensure gridlines will redraw when moving/removing a chart in/from the dom
* added px-vis-line-svg-rendering-ended and px-vis-scatter-rendering-ended events
* made auto resize debounce timing 250ms by default for every chart (from 50 or 100). Exposed the timing through debounceResizeTiming
* ensure that dynamically switching between svg and canvas rendering cleans the previous drawing
* Fixed demos to support dark theme
* Added bar / column component.
* Fix to behavior scale to work with chartExtents but improper dataExtents
* Fix to behavior scale for dataExtents with ordinal values

v1.0.1
==================
* Fixed multi axis dragging position on Safari and IE 11
* Fixed axis demo
* Update px-number-formatter version

v1.0.0
==================
* Upgrade to d3 4.4.x.
* Scale and axis changes:
  * Changed time scale to UTC by default.
  * Added timeLocal option for local time
  * Moved Scale into a behavior
  * scale now a simple wrapper around behavior
* Greatly improved and simplified how chart extents are calculated:
  * chartExtents are now only dev set
  * max and mins from the seriesConfig and range pickers go to dataExtents
  * scale will use chartExtents directly and fallback on dataExtents if not present. If neither, then looks through data.
  * defaultSeriesConfig no longer has default min and maxes
  * defaultSeriesConfig now updates \_defaultSeriesConfig so defaultSeriesConfig doesnt have to have all defaults
* Threshold changes:
  * Added new threshold configuration similar to events
  * Changed threshold data property from chartData to thresholdData
  * Simplified threshold component removing the need for the x scale
* Added improved resize methods to chart behavior
* Added mechanism for redrawing an SVG series on top of others
* Layers
  * Added layer generation to chart behavior
  * Added ability to generate layers for any svg element dynamically
  * modified interaction space so it doesnt clone svg
  * modified thresholds so it doesnt clone svg
  * Added an additional svg element below the canvas element on svg-canvas
* Changed px-vis-line to px-vis-line-svg for consistency
  * Line now spans data undefined gaps by default
  * Line will always gap "null" data
  * Added showGaps to force it to show gaps for undefined data
* Demo Updates:
  * updated demos with v1 changes
  * all subcomponents have an API Documentation page
* Added navigatorConfig and ability to configure chart navigator with it
* most px-vis components now only loads basic colors as opposed to basic colors + dataVis colors
* Register Changes:
  * Added margin to register height calculation
* Tooltip Changes:
  * Added auto-calculated groupings to tooltip based on number of series. Can be overwritten by devs
* Added checks to gridline to ensure it gets the svg height and number-izes margins
* completeSeriesConfig function will now complete and create an empty completeSeriesConfig if an empty seriesConfig is passed in. Allows the deletion of all series from the chart.
* Ensure tooltip calculation are done based on pixel coordinates rather than values for non-time based charts
* Added px-vis-dynamic-menu in register, allowing developers to pass in custom features/function available in a menu in the register through dynamicMenuConfig
* Added actionConfig to px-vis-interaction-space, allowing to define custom interaction on chart hover or click for example
* Added panning capability to px-vis-interaction-space. Please note that when panning a chart with ordinal axes it is not possible to pan past those axes.
* Added panning capability to px-vis-interaction-space
* Enabled top and right axes
* Events
  * Fixed event clip path to respect a right axis
  * Simplified event component removing the need for the y scale
  * Enabled configuration of the line
* Multi Axis:
  * added support for multi axes via multiAxes behavior
  * Many changes to components for support
  * Modifications to px-vis-multi-axis for more flexibility
* Added px-vis-toolbar
  * Toolbar items are configurable and each item can have:
    * a tooltip label
    * a title
    * an event name (fired on click)
    * a function run on click
    * an actionConfig used by px-vis-interaction space, allowing interactions on chart hover and click for example
    * an icon
    * a set of sub items which will be displayed in the "secondary" toolbar below when the item is clicked
  * Default actions of "zoom", "pan" and "tooltip" can be passed directly in the config
  * Custom defined functions can also be used in the actionConfig
* Removed px-vis-zoom and provide the PxVisBehaviorChart.zooming behavior for charts instead
* Added 'zoom in' and 'zoom out' buttons in zoom controls
* changing ghp.sh to account for Alpha releases
After BETA
=======================
* post beta fixes
  * cancel tooltip calculation when mouse leaves the chart, avoiding scenarios where the tooltip would appear after the mouse left
  * ensure zomming in/out works with 'timeLocal' axis
  * tickFormat on axis now causes axis to redraw
  * fixed various typos in interaction space
  * implemented px-number-formatter for register
  * separated labelTypeSize from axisConfig
  * changed event config - made line config part of it
  * made axis size and number properties public
  * added "reset" flag to px-vis-zoomed event
  * fix console error when clicking on interaction space with zooming on
  * fix chart navigator brush bug and make it redraw properly on size change
  * Moved showThresholdBox and displayTitle to thresholdConfig
  * improve axis drawing time
  * improve scale updating
  * improve multi axis drawing time
After BETA2
==========================
  * don't fire zoom on pure mouseup in interaction space
  * add panning flag to zoom event
  * ensure uniqued IDs are cleaned up when a chart is removed
  * wait for colors to have finished initializing before processing seriesConfig
After BETA3
==========================
  * performance improvements on drawing axis, multi axis, axis title, axis brushes
  * take units into account when truncating an axis title
  * only initialize tooltips on axis when needed
  * allow to prevent initial drawing for several elements, allowing charts to have more control over initialization
  * added horizontalAlignment to registers (only useful when register type is 'horizontal')
  * fix pie registers
  * fix scatter error drawing without valid x values
  * fix error with adding axes dynamically
  * added scale type to scale
  * fixed scale type not being dynamic
  * fixed canvas clip path issues
  * Separated much multi-axis code into a separate interactive axis component. Reworked axis drag and axis brush as a result.

v0.8.4
==================
* Bump color design

v0.8.3
==================
* Ensure pie doesn't fail on racing condition

v0.8.2
==================
* Cleaned up colors across the board
* updated tests

v0.8.1
==================
* Update missed design depndencies

v0.8.0
==================
* Updated dependencies
* Theming!

v0.7.5
==================
* protect running zoom too early

v0.7.4
==================
* fix zoom resize on timeseries

v0.7.3
==================
* fix behavior declaration order

v0.7.2
==================
* ensure current zoom is preserved when resizing a chart
* re-position the "reset zoom" button on resizing
* ensure scale manages cases where all the data is 0

v0.7.1
==================
* Fixed register scroll for FF and IE

v0.7.0
==================
* ensure timeseries rendering to canvas with multiple lines are not cut off
* added PxVisBehaviorChart.chartCommonMethods
* made includeAllSeries loop over all data
* added clip path to cursor
* added cursor config to chart behavior
* modified how cursor lines are calculated
* Added scrollbars and styling to registers when there are too many series to fit
* Added ability to specify multiple columns to register
* Added ability to use multi column register in tooltip
* Added ability to draw a legend in the image exporter
* added preserveDataOrder for px-vis-pie
* fixed issues with px-vis-pie updates/addition/deletion

v0.6.46
==================
* adding check that canvasContext exists in line detach

v0.6.45
==================
* updating slider dependency

v0.6.44
==================
* changing all devDeps to ^

v0.6.43
==================
* Update dependency versions

v0.6.42
==================
* Update px-theme to 2.0.1 and update test fixtures
* added xlink namespace to svg

v0.6.41
==================
* updated link inside px-vis to correct link (was missing path)

v0.6.40
==================
* changed radial scale to use infinity instead of max and min number
* added if statement for line canvas to check if chartData and axes are present
* updated px-vis html with all components

v0.6.39
==================
* fixed bug in IE when starting an svg line with mutedSeries

v0.6.38
==================
* fixed axis tickFormat check so it looks for function, not object

v0.6.37
==================
* fixed for event icons and clip path; changed how redrawing event icons works
* added check to ensure that dates from currentDomain is valid for brush
* fixed isObjEmpty check so it also checks for null

v0.6.36
==================
* fixed axis ticks setting when it is only an object
* added ability for axis tickFormat to be an object

v0.6.35
==================
* removing px-theme style call

v0.6.34
==================
* changing Gruntfile.js to gulpfile.js

v0.6.33
==================
* added additional check to brush zoomBrush
* fixed attrs in tooltip being passed down to register
* created chart behaviors for axisConfigs and registerConfigs
* doc fixes

v0.6.32
==================
* added more checks to event and axis mutedSeries bars
* fix to scale extents where chart data ys do not share an x
* added more math.max checks for sizing
* fix to navigator brush so it cannot disappear when fully collapsed
* added more checks on zoomBrush for onload
* added check on axis bar draw to see if it is in mutedSeries
* check mutedSeries observer in axis to only run if titles exist.
* added check to make sure the register elem clicked on has a name, otherwise transverses path to find it
* Added check for currentDomainX & currentDomainY for event draw
* Enable event deletion
* Fix in interaction space to ensure removal of mousemove event
* Fix to allow axes to delete from radar chart

v0.6.31
==================
* bower updating px-demo-snippet

v0.6.30
==================
* Fix intermittent bug in IE when drawing an image on a canvas withing an image load
* Added timeData to px-vis-interaction-space so that non time based charts can use forceDateTimeDisplay on their register/tooltip

v0.6.29
==================
* IE min-height + flex bug fix for register / tooltip

v0.6.28
==================
* increased register height for scrollbars

v0.6.27
==================
* fix for large number of series in register
* fix series bars on chart navigator axis
* fix bug where deleting a series does not update mutedSeries and register

v0.6.26
==================
* added check that actionArea box has a selection
* fixed empty seriesKeys with backwards compatibility
* set chartExtents on range change to fix resize
* included radial definition in axis brush

v0.6.25
==================
* removed extra {

v0.6.24
==================
* fixed merge conflict

v0.6.23
==================
* added check for chartData being undefined in chartCommon

v0.6.22
==================
* fixed completeSeriesConfig generation for mins and maxes
* added checks for d3 selection existance
* changed clip path declaration
* better fixed linePath/lineGroup not being defined on detach

v0.6.21
==================
* Added PxVisBehaviorChart.registerPositioning behavior to avoid code duplication
* Allow interaction space action box to be drawn with mouse outside of interaction space
* prevent errors when releasing mouse button on interaction space when the click had started outside of it
* Call notifyResize when preventResize becomes false

v0.6.20
==================
* fixed chartExtents running prematurely
* fixed linePath not being defined on detach

v0.6.19
==================
* fixed bug with range moment conversion
* added check to scale for x and y before selectedDomain

v0.6.18
==================
* moved polyfills into its own file
* fixed on-hover when chart all data is removed
* set extents to range when available to avoid race condition on selectedDomain and chartExtents
* pass seriesKeys to interaction space to remove registers on all data removed
* added 0 check to width and height in interaction space
* changed data converter to return empty dataset if originalData is empty

v0.6.17
==================
* make sure progressive rendering doesn't "break" the line between batches
* ensure datasets with 5 or less points still render when progressive rendering is on

v0.6.16
==================
* included includes polyfill for IE11

v0.6.15
==================
* bug fix for radial scale
* fixed useDegrees for line
* misc other bug fixes
* fixed register with 0 value
* changes to README
* bug fixes for brush to prevent negative values
* added various truthy tests for 0 values throughout
* fix for register with value = 0

v0.6.14
==================
* fix registers for pie
* moved forcedatetimedisplay to behavior
* general bug fixes for register

v0.6.13
==================
* added delaying chart draw until attached

v0.6.12
==================
* added additional check to radial scale

v0.6.11
==================
* changes for demo

v0.6.10
==================
* make sure scatter removes on detached

v0.6.9
==================
* ensure forceDateTimeDisplay works with new registers

v0.6.8
==================
* fix typo that would break the navigator series drawing

v0.6.7
==================
* make sure addition/removal of series to seriesConfig are correctly processed

v0.6.6
==================
* Added datetime imports to tooltip and passed down to register

v0.6.5
==================
* Made tooltip detach px-tooltip

v0.6.4
==================
* Updated docs across all components

v0.6.3
==================
* ensure brushing works when resizing

v0.6.2
==================
* added rect clip path for canvas
* update docs

v0.6.1
==================
* ensure brush initializes
* ensure multi axis passes the font size down

v0.6.0
==================
* exposed number formatting in register and tooltip
* changed opacity on hover in scatter-radial
* fixed axis series bar opacity on drawing
* fixed muting a series with a '.' in the id when clicking register
* fixed d3 console errors
* refactored navigator initialization
* exclude 'null' data point from line and scatter
* added clip path to canvas
* fixed bugs with the new register
* fixed area clip path to work with iron resize

v0.5.13
==================
* Merged reigster refactor

v0.5.12
==================
* Fixed vis demo
* all demos and demo snippets are up to date and working
* added codepen links

v0.5.11
==================
* draw max value in radial gridlines

v0.5.10
==================
* redraw axis on tick change

v0.5.9
==================
* make sure we observe seriesId for dynamic properties

v0.5.8
==================
* added ability to set domain with radial scale
* added limit radius to radial line
* fixed brushing with raidal axes
* added behavior for dynamically watching properties tied to completeSeriesConfig
* fixed how we expose some properties in completeSeriesConfig
* bug fixing

v0.5.7
==================
* scale now notifies on x axis creation
* move polarData behavior to common
* fix demo

v0.5.6
==================
* Adding offset in series clippath
* Fix padding on axis series bar title
* Fix axis title not redrawn on resize

v0.5.5
==================
* Fix register mutedSeries when ID has a '.'
* Changed series config in chart behavior so it doesnt require x and y

v0.5.4
==================
* Fix for reordering axes on radial with 3 axes

v0.5.3
==================
* exposed mutedOpacity in seriesConfig and ensure muting wors in all scenarios (canvas, svg, progressive rendering...)

v0.5.2
==================
* fixed ordinal data parsing

v0.5.1
==================
* Fixed navigator line

v0.5.0
==================
* Added support for radial charts (polar chart and radar chart)
* Separated line into svg and canvas lines
* Various bug fixes
* Various new features
* Improved demos

v0.4.8
==================
* fixed vulcanized spelling mistake in ghp

v0.4.7
==================
* removed extra demo link in the ghp script

v0.4.6
==================
* adding polygit imports for codepen

v0.4.5
==================
* adding check for Px.d3

v0.4.3
==================
* fixing px-d3 issue

v0.4.2
==================
* added check to parse JSON for configuration objects

v0.4.0
==================
* Converted to Gulp

v0.3.15
==================
* fixed errors when muting all axes

v0.3.14
==================
* add check for data in line

v0.3.13
==================
* added notify true to mouseRect in interaction space

v0.3.12
==================
* added deleteAllBrushes method to axis brush

v0.3.11
==================
* added check in axis brush for chartData

v0.3.10
==================
* added units to data converter series config

v0.3.9
==================
* fixed tests

v0.3.8
==================
* tooltip design fixes
* fixed brushes with muting and unmuting

v0.3.7
==================
* changed default date format to 24hour clock

v0.3.6
==================
* fixed axis label format so it can accept linear or time
* added am/pm to default time format
* update axis tests

v0.3.5
==================
* fixed margin in multi axis

v0.3.4
==================
* fixing NaN on axis issue

v0.3.2
==================
* fixed data converter with empty datasets

v0.3.1
==================
* changed tooltip targets in multi axis

v0.3.0
==================
* tooltip now uses px-tooltip
* associated changes to support that

v0.2.7
==================
* modified grid so it can remove itself on detach

v0.2.6
==================
* added to data converter so it outputs a set of empty datasets

v0.2.5
==================
* fixed maintaining axis brushes on data change

v0.2.4
==================
* fixed title rotation when id has a .

v0.2.3
==================
* added axis brush update on domainchange

v0.2.2
==================
* fixed tests for safari 8

v0.2.1
==================
* fixed tests

v0.2.0
==================
* Large refactor to deal with many timing issues and other bug fixes

v0.1.33
==================
* Fix 'contains' issue on IE for label tooltip

v0.1.32
==================
* multiaxis mouse listeners
* update tests

v0.1.31
==================
* clears an axis brush if that axis is removed

v0.1.30
==================
* mute / unmute issues
* changed the axis id
* enabled redraw of chart through removing data
* events fire on progressive rendering
* added px-tooltip on axis label
* enabled min size to axis brush
* fixed font issues
* fixed axis brush color

v0.1.29
==================
* fixed bug with axes brush and new axes
* fixed grid alignment issues
* enabled axis name in series config

v0.1.28
==================
* documentation updates

v0.1.27
==================
* Fixing multi scale issue on adding axes through chart data

v0.1.26
==================
* Many changes associated with enabling mute / unmute on parallel coords

v0.1.25
==================
* Added support for units in axis labels

v0.1.24
==================
* Fixed bug in axis brush where the array declaration is wrong

v0.1.23
==================
* Adding truncation to axis labels

v0.1.22
==================
* Make sure progressive rendering is cancelled on new drawing request

v0.1.21
==================
* Added preventResize option for chart auto resize.
* Added option to prevent progressive rendering for canvas (preventCanvasProgressiveRendering)
* Make export to png dynamically choose between native and canvg (hence fixing it on edge)

v0.1.20
==================
* Fix bug in empty navigator

v0.1.19
==================
* Fixing color issue in pie

v0.1.18
==================
* Adding support to export chart components to images

v0.1.17
==================
* Fix missing type in px-vis-pie _arcs

v0.1.16
==================
* Allow chart navigator to be used without data and/or driven by a "range" attribute

v0.1.15
==================
* Fix racing conditions with rangepicker

v0.1.14
==================
* Make sure rangepicker can be used in combination with time based charts

v0.1.13
==================
* Fix brush and axis-brush for dynamic sizing

v0.1.12
==================
* auto resize on chart navigator

v0.1.11
==================
* bug fixes, progressive rendering for canvas

v0.1.10
==================
* bug fix

v0.1.9
==================
* Improving tests and bug fixes

v0.1.8
==================
* Make auto resize work for multi axis/scale/brush

v0.1.7
==================
* Added demo link to README

v0.1.6
==================
* Improve data handling by pie slices, allow empty data as well

v0.1.5
==================
* Added vulcanize index and demo

v0.1.4
==================
* fixed navSeriesLimit in navigator

v0.1.3
==================
* improve pie transitioning

v0.1.2
==================
* Fixed line seriesID bug

v0.1.1
==================
* Upgraded navigator to add precipitationPattern behavior

v0.1.0
==================
* Added canvas support: canvas element and ability to render lines to canvas.
* Added ability to gives lines a gradient opacity.

v0.0.7
==================
* Fix tooltip positioning

v0.0.6
==================
* fix positioning for pies

v0.0.5
==================
* behavior documentation fixes

v0.0.4
==================
* Fixed tooltip demo

v0.0.1
==================
* Initial release
