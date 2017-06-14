
//obj to be used for running determineExtents. Set it up through properties:
// xAxisType,
// yAxisType,
// completeSeriesConfig,
// chartData,
// chartExtents,
// dataExtents,
// axes,
// seriesToAxes
// isYAxisObject
// and run the function
var extentCalc = {};

extentCalc._defaultScaleValue = {
          "x": [Infinity, -Infinity],
          "y": [Infinity, -Infinity]
        };

/**
 * Calculates the extents based on chartExtents, dataExtents, and the data.
 *
 */
extentCalc.determineExtents = function determineExtents(data) {
  //check our axis types so we know if we are doing ordinal
  var xOrd = (this.xAxisType === 'ordinal' || this.xAxisType === 'scaleBand'),
      yOrd = (this.yAxisType === 'ordinal' || this.yAxisType === 'scaleBand'),
      // are we doing time?
      xTime = this.xAxisType === 'time' || this.xAxisType === 'timeLocal',
      //doX if we are not doing time
      doX = xTime ? false : true,
      doY = true,
      keys = Object.keys(this.completeSeriesConfig),
      //our extents starter
      extents = {
        'x': [],
        'y': []
      };

  // look at our chartExtents and dataExtents for values
  extents.x = this._checkForExtents(xOrd, this.chartExtents, this.dataExtents, "x");
  extents.y =  this.axes && this.axes.length ? this._calcMultiAxisExtents(data) : this._checkForExtents(yOrd, this.chartExtents, this.dataExtents, "y");

  //if our chart data has not changed, then dont go through all the data. Just use the extents we have
  if(extents.x.length > 0 && extents.x[0] !== Infinity && extents.x[1] !== -Infinity) {
    xTime = false;
    doX = false;
  }
  // if multiAxis, we calced in a different way, so dont calc again.
  if(!Array.isArray(extents.y) || (extents.y.length > 0 && extents.y[0] !== Infinity && extents.y[1] !== -Infinity)) {
    doY = false;
  }

  //if we have no chartData, dont look for new extents
  if(data.length === 0) {
    xTime = false;
    doX = false;
    doY = false;
  }

  //if we need, Chug through the data to max and min
  if(doX || doY || xTime) {
    this._findMinMax(data, doX, doY, xOrd, yOrd, xTime, extents, keys);
  }

  // check that we found something for x
  if(extents.x[0] === Infinity) {
    extents.x[0] = 0;
  }
  if(extents.x[1] === -Infinity) {
    extents.x[1] = 1;
  }

  // check that we found something for y
  if(Array.isArray(extents.y) && extents.y[0] === Infinity) {
    extents.y[0] = 0;
  }
  if(Array.isArray(extents.y) && extents.y[1] === -Infinity) {
    extents.y[1] = 1;
  }

  //if min and max are the same add 1 so we still get a range
  if(extents.x[1] === extents.x[0]) {
    extents.x[1] += 1;
  }
  if(Array.isArray(extents.y) && extents.y[1] === extents.y[0]) {
    extents.y[1] += 1;
  }
  return extents;
}.bind(extentCalc);

/**
 * Looks at chartExtents and dataExtents for extents values per axis
 *
 */
extentCalc._checkForExtents = function _checkForExtents(isOrd, chartExtents, dataExtents, axis) {
  var exts = [];

  // if we are dealing with ordinal data
  if(isOrd) {
    // copy from dataExtents
    if(dataExtents && dataExtents[axis]) {
      //copy what was passed in
      exts = JSON.parse(JSON.stringify(dataExtents[axis]));
    }

    // overwrite with chartData if present
    if(chartExtents && chartExtents[axis]) {
      //copy what was passed in
      exts = JSON.parse(JSON.stringify(chartExtents[axis]));
    }

  //if we are dealing with time or linear
  } else {
    var fromChartExtents = false;
    exts = this._checkChartExtents(chartExtents, axis);

    //did we get extents from chartExtents?
    fromChartExtents = exts.length === 2 ? true : false;

    exts = this._checkDataExtents(dataExtents, chartExtents, axis, fromChartExtents, exts);

    // if nothing gets assigned, then stick in defaults
    if(exts.length < 2){
      //copy the default values
      exts = [ this._defaultScaleValue[axis][0], this._defaultScaleValue[axis][1] ];
    }
  }

  return exts;
}.bind(extentCalc);

/**
 * Looks at chartExtents for extents values per axis
 *
 */
extentCalc._checkChartExtents = function _checkChartExtents(cExts, axis) {
  var exts = [];
  //if the dev specified extents, use them
  if(cExts && cExts[axis] && cExts[axis].length === 2) {
    exts[0] = (cExts[axis][0] === 'dynamic') ? Infinity : cExts[axis][0];
    exts[1] = (cExts[axis][1] === 'dynamic') ? -Infinity : cExts[axis][1];
  }
  return exts;
}.bind(extentCalc);

/**
 * Looks at dataExtents for extents values per axis; resolves chartExtents
 *
 */
extentCalc._checkDataExtents = function _checkDataExtents(dExts, cExts, axis, bool, exts) {
  var exts = exts || [];

  //if there are dataExtents, use them if they dont overwrite the chartExtents
  if(dExts && dExts[axis] && dExts[axis].length === 2) {
    // if we have chartExtents aready, figure out which to use
    if(bool) {
      exts[0] = (cExts[axis][0] === 'dynamic') ? dExts[axis][0] : cExts[axis][0];
      exts[1] = (cExts[axis][1] === 'dynamic') ? dExts[axis][1] : cExts[axis][1];

    } else {
      exts[0] = Math.min(dExts[axis][0], this._defaultScaleValue[axis][0]);
      exts[1] = Math.max(dExts[axis][1], this._defaultScaleValue[axis][1]);
    }
  }

  return exts;
}.bind(extentCalc);

/**
 *
 * Find the min and max values or ordinal values in data, for X and/or Y axis
 *
 */
extentCalc._findMinMax = function _findMinMax(data, doX, doY, ordX, ordY, timeX, result, keys) {
  var xVal, yVal,
      dLen = data.length,
      x = this.completeSeriesConfig[keys[0]].x,
      y = this.completeSeriesConfig[keys[0]].y, //only used if ordinal
      //check which individual parts need calculation
      doX0 = (!ordX && result.x[0] === Infinity) ? true : false,
      doX1 = (!ordX && result.x[1] === -Infinity) ? true : false,
      doY0 = (!ordY && result.y[0] === Infinity) ? true : false,
      doY1 = (!ordY && result.y[1] === -Infinity) ? true : false;

  if(timeX) {
    this._findTimeMM(result,data,dLen,x,doX0,doX1);
  }
  if(doX || doY) {
    for(var i = 0; i < dLen; i++) {
      //make sure we're dealing with numbers
      // TODO xKeys and use _getDataExtents to support multi x keys on XY
      xVal = (typeof(data[i][x]) === 'string') ? parseFloat(data[i][x]) : data[i][x];
      yVal = this._getDataExtents(data[i], keys);

      if(doX) {
        this._processDataValues(ordX, result, data, 'x', x, i, doX0, doX1, xVal, xVal);
      }
      if(doY) {
        this._processDataValues(ordY, result, data, 'y', y, i, doY0, doY1, yVal[0], yVal[1]);
      }
    }
  }
}.bind(extentCalc);

/**
 * Goes through the data and extracts min and max values
 *
 */
extentCalc._getDataExtents = function _getDataExtents(d,yKeysArr) {
  var a = [];
  for(var i = 0; i < yKeysArr.length; i++) {
    var key = yKeysArr[i],
        val = d[this.completeSeriesConfig[key]['y']];

    if(val || val === 0) {
      a.push(val);
    }
  }
  return [ Math.min.apply(null,a), Math.max.apply(null,a) ];
}.bind(extentCalc);

/**
 * Finds time based Max and Min
 *
 */
extentCalc._findTimeMM = function _findTimeMM(result,d,l,x,doMin,doMax) {
  if(doMin) {
    this._setMin(result.x,d[0][x]);
  }
  if(doMax) {
    this._setMax(result.x,d[l-1][x]);
  }
}.bind(extentCalc);

/**
 * Compares existing min and new data for min
 *
 */
extentCalc._setMin = function _setMin(r,d) {
  if(d === null) { return; }

  if(isNaN(r[0]) || r[0] > d) {
    r[0] = d;
  }
}.bind(extentCalc);

/**
 * Compares existing max and new data for max
 *
 */
extentCalc._setMax = function _setMax(r,d) {
  if(d === null) { return; }

  if(isNaN(r[1]) || r[1] < d) {
    r[1] = d;
  }
}.bind(extentCalc);

/**
 * Goes through the values from the data and calcs the extents
 *
 */
extentCalc._processDataValues = function _processDataValues(isOrd, r, d, axis, key, i, doMin, doMax, v0, v1) {
  // if it is ordinal, push unique keys in
  if(isOrd) {
    if(r[axis].indexOf(d[i][key]) === -1) {

      r[axis].push(d[i][key]);
    }
  } else {
    // get the min and max values
    if(doMin) {
      this._setMin(r[axis],v0);
    }
    if(doMax) {
      this._setMax(r[axis],v1);
    }
  }
}.bind(extentCalc);


/**
 * Loop through each series and see if it has mins and maxes in seriesConfig
 *
 */
extentCalc._checkInSeriesConfig = function _checkInSeriesConfig(exts, a) {
  for(var i = 0; i < this.seriesToAxes[a].length; i++) {
    var s = this.seriesToAxes[a][i];

    exts[a][0] = (this.completeSeriesConfig[s]['yMin'] || this.completeSeriesConfig[s]['yMin'] === 0) ?
        Math.min(this.completeSeriesConfig[s]['yMin'], exts[a][0]) : exts[a][0];

    exts[a][1] = (this.completeSeriesConfig[s]['yMax'] || this.completeSeriesConfig[s]['yMax'] === 0) ?
        Math.max(this.completeSeriesConfig[s]['yMax'], exts[a][1]) : exts[a][1];
  }
}.bind(extentCalc);

/**
 * Apply chart extents
 *
 */
extentCalc._applyChartExtents = function _applyChartExtents(exts, a) {
  // for backwards compatibility, if they dont specify an axis apply to all
  var k = this.chartExtents[a] ? a : 'y';

  if(this.chartExtents[k]) {

    if(this.chartExtents[k][0] === 'dynamic') {
      //if we got a value from seriesConfig, use it, otherwise Infinity
      exts[a][0] = exts[a][0] || exts[a][0] === 0 ? exts[a][0] : Infinity;
    } else {
      exts[a][0] = this.chartExtents[k][0];
    }


    if(this.chartExtents[k][1] === 'dynamic') {
      exts[a][1] = exts[a][1] || exts[a][1] === 0 ? exts[a][1] : -Infinity;
    } else {
      exts[a][1] = this.chartExtents[k][1];
    }

  }
}.bind(extentCalc);

/**
 * Seach for multi axis extents
 *
 */
extentCalc._searchForExtents = function _searchForExtents(exts, seriesToSearch, data) {
  var seriesList = Object.keys(seriesToSearch);
  for(var i = 0; i < data.length; i++) {
    for(var j = 0; j < seriesList.length; j++) {
      var s = seriesList[j],
          sY = this.completeSeriesConfig[s]['y'],
          series = seriesToSearch[s],
          axis = series['axis'];
      if(series.min && (data[i][sY] || data[i][sY] === 0)) {
        exts[axis][0] = Math.min(data[i][sY], exts[axis][0]);
      }
      if(series.max && (data[i][sY] || data[i][sY] === 0)) {
        exts[axis][1] = Math.max(data[i][sY], exts[axis][1]);
      }
    }
  }
}.bind(extentCalc);

/**
 * Seach for multi axis extents
 *
 */
extentCalc._calcSeriesToSearch = function _calcSeriesToSearch(exts, a, seriesToSearch) {
  for(var i = 0; i < this.seriesToAxes[a].length; i++) {
    var s = this.seriesToAxes[a][i];
    seriesToSearch[s] = {
      "axis": a,
      "min": exts[a][0] === Infinity ? true : false,
      "max": exts[a][1] === -Infinity ? true : false
    };
  }
}.bind(extentCalc);

/**
 * calculates chart extents for multi axis
 *
 */
extentCalc._calcMultiAxisExtents = function _calcMultiAxisExtents(data) {
  // TODO integrate this into the other calcs
  var search = false,
      exts = {},
      seriesToSearch = {},
      a;

  for(var i = 0; i < this.axes.length; i++) {
    a = this.axes[i];
    exts[a] = [];
    exts[a][0] = this._defaultScaleValue.y[0];
    exts[a][1] = this._defaultScaleValue.y[1];

    // does it exist in the seriesConfig
    // need to look at each series instead of each axis
    this._checkInSeriesConfig(exts, a);

    // does it exist in chartExtents, if so, overwrite
    if(this.chartExtents) {
      this._applyChartExtents(exts, a);
    }

    // check if we need to search chartData for extents
    if(exts[a][0] === Infinity || exts[a][1] === -Infinity) {
      search = true;
      this._calcSeriesToSearch(exts, a, seriesToSearch);
    }
  }

  // if we indicated we need to search for extent values
  if(search) {
    this._searchForExtents(exts, seriesToSearch, data);
  }

  return exts;
}.bind(extentCalc);
