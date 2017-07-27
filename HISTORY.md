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
