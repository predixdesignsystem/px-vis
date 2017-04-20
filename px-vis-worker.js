importScripts("../pxd3/d3.min.js");

// Global storage vars
var dataMapping = {},
    quadtrees = {},
    voronois = {};

function reply(data, time) {

  //var time2 = this.performance.now();
  var time2 = null;
  if(data) {
    postMessage({'data': data, 'timeIn': time, 'timeOut': time2});
  } else {
    postMessage({'timeIn': time, 'timeOut': time2});
  }
}

/**
 * Updates the local data with new data
 *
 * @method updateData
 */
function updateData(eventData, time) {

  dataMapping[eventData.chartId] = eventData.data.chartData;
  reply(null, time);
}

/**
 * Creates the d3 scales based on passed in type, range, and domain
 *
 * This method must be kept in sync with the types available to the rest of the framework...
 *
 * @method recreateD3Scale
 */
function recreateD3Scale(scaleObj) {
  var result;
  if(scaleObj.type === 'time') {
    result = d3.scaleUtc().nice().range(scaleObj.range).domain(scaleObj.domain);
  } else if(scaleObj.type === 'timeLocal') {
    result = d3.scaleTime().nice().range(scaleObj.range).domain(scaleObj.domain);
  } else if(scaleObj.type === 'linear') {
    result = d3.scaleLinear().nice().range(scaleObj.range).domain(scaleObj.domain);
  } else if(scaleObj.type === 'scaleBand') {
    result = d3.scaleBand().range(scaleObj.range).domain(scaleObj.domain).round(true).paddingInner(0.5);
  } else { //ordinal
    result = d3.scalePoint().range(scaleObj.range).domain(scaleObj.domain).padding(0.5);
  }
  return result;
}

/**
 * Creates a multiscale for y. Needed for proper interpretation within the quadtree
 *
 * @method getMultiScale
 */
function getMultiScale(visData) {
  var o = {},
      k,
      axis;
  for(var i = 0; i < visData.keys.length; i++) {
    k = visData.keys[i];
    axis = visData.isMultiY ? visData.completeSeriesConfig[k]['axis']['id'] : "defaultAxis";

    if(!o[axis]) {
      o[axis] = recreateD3Scale(visData.y[axis]);
    }
  }

  return o;
}

/**
 * Basic empty data obj
 *
 * @method createDataStub
 */
function createDataStub() {
  return {
    "series" : [],
    "rawData" : [],
    "timeStamps" : [],
    "timeStampsTracker" : {}
  }
}


/**
 * Flattens a single data set into individual data obj so the quadtree can properly create build itself
 *
 * @method flattenData
 */
function flattenData(visData, d) {
  var arr = [];
  for(var i = 0; i < visData.keys.length; i++) {
    var o = {},
        k = visData.keys[i];

    o["data"] = d;
    o["key"] = k;
    o["time"] = visData.timeData ? d[visData.timeData] : null;
    o["x"] = d[visData.completeSeriesConfig[k]['x']];
    o["y"] = d[visData.completeSeriesConfig[k]['y']];
    o["axis"] = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : "default";

    arr.push(o);
  }

  return arr;
}

/**
 * Builds an object for binding to the quadtree scales
 *
 * @method buildQuadtreeHelperObj
 */
function buildQuadtreeHelperObj(visData, k, index) {
  var obj = {};

  obj.xKey = visData.completeSeriesConfig[k]['x'];
  obj.yKey = visData.completeSeriesConfig[k]['y'];
  axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : null;
  //TODO: check if same scale
  obj.yScale = recreateD3Scale(visData.y[axis]);
  obj.yScale.index = index;

  return obj;
}


/**
 * adjusts the angle for the polar chart, taking counterClockwise into account
 * and returning it in the asked unit (degrees if toDegrees is true)
 */
function adjustAngleForPolarChart(angle, toDegrees, visData) {

  //add 180 deg to offset chart 0 being on top
  var offset = toDegrees ? 180 : Math.PI;

  if((!visData.counterClockwise && !toDegrees) ||
      (visData.counterClockwise && toDegrees)) {
    angle *= -1;
  }

  //convert to appropriate unit and
  if(visData.useDegrees) {
    if(toDegrees) {
      return angle + offset;
    } else {
      return angle / 360 * 2 * Math.PI + offset;
    }
  } else {
    if(toDegrees) {
      return angle / (2 * Math.PI) * 360 + offset;
    } else {
      return angle + offset;
    }
  }
}

function calcPixelCoordForRadial(angle, amp, yRange, yDomain, visData, whichVal) {
  var yDomainTot = yDomain[1] - yDomain[0],
      pixelAmplitude = yRange * (amp - yDomain[0])/yDomainTot;

  angle = adjustAngleForPolarChart(angle, false, visData);

  //sin * pixel range * percentage of data range
  if(whichVal === 'x') {
    return Math.sin(angle) * pixelAmplitude;
  }
  // else
  return Math.cos(angle) * pixelAmplitude;
}

function getPixelCoordForRadialData(d, visData, whichVal, xKey, yKey) {
  //process angle and amplitude in pixel
  var angle = d[xKey],
      amp = d[yKey],
      yRange = visData.y[d.axis]['range'][1] - visData.y[d.axis]['range'][0],
      yDomain = visData.y[d.axis]['domain'];
  return calcPixelCoordForRadial(angle, amp, yRange, yDomain, visData, whichVal);
}

// /**
//  * Sets the x & y props on the quadtree
//  *
//  * @method addXYToQuadtree
//  */
// function addXYToQuadtree(quadtree, visData) {
//   if(visData.radial) {
//     quadtree.x(function(d) { return getPixelCoordForRadialData(d, visData, 'x'); });
//     quadtree.y(function(d) { return getPixelCoordForRadialData(d, visData, 'y'); });
//   } else {
//     var xScale = recreateD3Scale(visData.x),
//         yScale = getMultiScale(visData);

//     quadtree.x(function(d) { return xScale(d.x); });
//     quadtree.y(function(d) { return yScale[d.axis](d.y); });
//   }
// }

function getRadialScale(visData, axis, xKey, yKey) {
  return function(d) { return getPixelCoordForRadialData(d, visData, axis, this.xKey, this.yKey); }.bind({'xKey': xKey, 'yKey': yKey });
}

function calcXScale(visData) {
  if(visData.radial) {
    return getRadialScale(visData, 'x', 'x', 'y');
  } else {
    var x = recreateD3Scale(visData.x);
    return function(d) { return x(d.x) };
  }
}

function calcYScale(visData) {
  if(visData.radial) {
    return getRadialScale(visData, 'y', 'x', 'y');
  } else {
    var y = getMultiScale(visData);
    return function(d) { return y[d.axis](d.y) };
  }
}

/**
 * Creates a single quadtree for combining all data series into one for retreving the single, closest point
 *
 * @method createSingleQuadtree
 */
function createSingleQuadtree(data) {
  var visData = data.data,
      chartData = dataMapping[data.chartId],
      flatData,
      xScale = calcXScale(visData),
      yScale = calcYScale(visData),
      quadtree = d3.quadtree()
        .extent(visData.extents)
        .x(xScale)
        .y(yScale);

    // Set the x & y props on the quadtree
    // addXYToQuadtree(quadtree, visData);

    // To add all datapoints to our quadtree, we need to break each dataset up.
    // Iterate though all data, flatten our datasets, and add them to the quadtree
    for(var i = 0; i < chartData.length; i++) {
      flatData = flattenData(visData, chartData[i]);
      quadtree.addAll(flatData);
    }

    return quadtree;
}

/**
 * Creates a multi-series quadtree for retreving the closest point for each series
 *
 * @method createSeriesQuadtree
 */
function createSeriesQuadtree(data) {
  var visData = data.data,
      chartData = dataMapping[data.chartId],
      k,
      quadtree = {},
      // we can't pass d3 scales around so we need to recretate them
      xScale = recreateD3Scale(visData.x),
      yScale;
// FIXME Make work for POLAR
  for(var i = 0; i < visData.keys.length; i++) {
    k = visData.keys[i];

    //create an object and bind it to the x and y accessors so that the scales
    //won't be overriden by the next iteration of the loop
    var obj = buildQuadtreeHelperObj(visData, k, i);

    // if we are just doing closestPoint, then do not reset the quadtree
    quadtree[k] = d3.quadtree()
      .extent(visData.extents)
      .x(function(d) { return xScale(d[this.xKey]); }.bind(obj))
      .y(function(d) { return this.yScale(d[this.yKey]); }.bind(obj))
      .addAll(chartData);
  }

  return quadtree;
}

/**
 * Creates the quadtree data structure which we will use to search later
 *
 * @method createQuadtree
 */
function createQuadtree(data, time) {
  quadtrees[data.chartId] = data.data.searchType === 'pointPerSeries' ?
    createSeriesQuadtree(data) :
    createSingleQuadtree(data);

  reply(null, time);
}

/**
 * Returns the pixel space value for a datapoint
 *
 * @method _getPixelSpaceVal
 */
function _getPixelSpaceVal(d, chartScale, key, axis) {
  return axis ? chartScale[axis](d[key]) : chartScale(d[key]);
}

/**
 * Calcs and returns the tooltipData.series value
 *
 * @method calcValueQuadtree
 */
function calcValueQuadtree(d, x, y) {
  var o = {};

  o[x] = d[x];
  o[y] = d[y];

  return o;
}

/**
 * Calcs and returns the tooltipData.series.coord
 *
 * @method calcCoordQuadtree
 */
function calcCoordQuadtree(d, x, y, xScale, yScale, visData, axis) {
  var a = [];

  if(visData.radial) {
    var yRange = visData.y[axis]['range'][1] - visData.y[axis]['range'][0],
        yDomain = visData.y[axis]['domain'];
    a[0] = calcPixelCoordForRadial(d[x], d[y], yRange, yDomain, visData, 'x');
    a[1] = calcPixelCoordForRadial(d[x], d[y], yRange, yDomain, visData, 'y');
  } else {
    a[0] = xScale(d[x]);
    a[1] = yScale(d[y]);
  }

  return a;
}

/**
 * Calcs and returns the tooltipData.series obj
 *
 * @method calcDataSeriesQuadtree
 */
function calcDataSeriesQuadtree(d, k, xScale, yScale, visData, axis) {
  var x = visData.completeSeriesConfig[k]['x'],
      y = visData.completeSeriesConfig[k]['y'];

  return {
    "coord": calcCoordQuadtree(d, x, y, xScale, yScale, visData, axis),
    "name": k,
    "value": calcValueQuadtree(d, x, y)
  }
}

/**
 * Calcs and returns the crosshair data objs
 *
 * @method addCrosshairDataQuadtree
 */
function addCrosshairDataQuadtree(dataObj, d, timeData) {
  // FIXME we can dedupe datasets with timeData this way. Need to make a way to do it for non-timedata datasets...
  if((timeData && !dataObj.timeStampsTracker[d[timeData]])) {
    dataObj.rawData.push(d);
    dataObj.timeStamps.push(d[timeData]);
    dataObj.timeStampsTracker[d[timeData]] = true;

    dataObj.rawData.push(d);
  } else if(!timeData) {
    dataObj.rawData.push(d);
  }

  return dataObj;
}

function constructDataObj(result, dataObj, k, visData, xScale, visData) {
  var yScale,
      axis,
      xKey,
      yKey;

  if(!result) {
    dataObj.series.push(emptySeries(k));

  } else {
    axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : null;
    xKey = visData.completeSeriesConfig[k]['x'],
    yKey = visData.completeSeriesConfig[k]['y'],
    yScale = visData.radial ? null : recreateD3Scale(visData.y[axis]);

// TODO Add time
    dataObj.series.push(calcDataSeriesQuadtree(result, k, xScale, yScale, visData, axis));

    if(visData.calcCrosshair) {
      dataObj = addCrosshairDataQuadtree(dataObj, result, visData.timeData);
    }
  }

  return dataObj;
}

function searchQuadtreeSingle(visData, dataObj, quadtreeData, xScale, visData) {
  var result = quadtreeData.find(visData.mousePos[0], visData.mousePos[1], visData.radius),
      k;

  result = result && result.data ? result.data : result;

  for(var i = 0; i < visData.keys.length; i++) {
    k = visData.keys[i];

    dataObj = constructDataObj(result, dataObj, k, visData, xScale, visData);
  }

  return dataObj;
}

function searchQuadtreeSeries(visData, dataObj, quadtreeData, xScale, visData) {
  var result,
      k;
// FIXME make work with multi series polar
  for(var i = 0; i < visData.keys.length; i++) {
    k = visData.keys[i];

    result = quadtreeData[k].find(visData.mousePos[0], visData.mousePos[1], visData.radius);

    dataObj = constructDataObj(result, dataObj, k, visData, xScale, visData);
  }

  return dataObj;
}

/**
 * Finds the closest Quadtree nodes to the mouse. Returns fully constructed tooltip/crosshair data obj
 *
 * @method returnClosestsQuadtreePoints
 */
function returnClosestsQuadtreePoints(eventData, time) {
  var visData = eventData.data,
      dataObj = createDataStub(),
      quadtreeData = quadtrees[eventData.chartId],
      xScale = visData.radial ? null : recreateD3Scale(visData.x);

  dataObj = visData.searchType === 'pointPerSeries' ?
    searchQuadtreeSeries(visData, dataObj, quadtreeData, xScale, visData) :
    searchQuadtreeSingle(visData, dataObj, quadtreeData, xScale, visData);

  delete dataObj.timeStampsTracker;
  reply(dataObj, time);
}

/**
 * Performs the tree search for nodes within an area.
 *
 * @method searchAreaQuadtree
 */
function searchAreaQuadtree(quadtree, x0, y0, x3, y3, t) {
  var result = {
    'rawData': [],
    'timeStamps': [],
    'timeStampsTracker': {}
  };

// FIXME This is not checked yet. Need to implement on IS before I can see if it works

  quadtree.visit(function(node, x1, y1, x2, y2) {
    if (!node.length) {
      do {
        var d = node.data;
        // if our point is inside our box, save it if not a copy
        if((d[0] >= x0) && (d[0] < x3) && (d[1] >= y0) && (d[1] < y3))  {
          if(t && result.timeStampsTracker.hasOwnProperty(d[t])) {
            result.timeStampsTracker[d[t]] = true;
            result.timeStamps.push(d[t]);
            result.rawData.push(d.data);
          } else if(!t) {
            result.rawData.push(d.data);
          }
        }
      } while (node = node.next);
    }
    //return true  ==> skip the children nodes so we dont search unnessary bits of the tree
    return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
  });

  return result;
}

/**
 * Finds all the Quadtree nodes in an area. Returns fully constructed tooltip/crosshair data obj
 *
 * @method returnQuadtreePointsInArea
 */
function returnQuadtreePointsInArea(eventData, time) {
  var visData = eventData.data,
      ext = visData.extents,
      quadtreeData = quadtrees[eventData.chartId],
      dataObj = searchAreaQuadtree(quadtreeData, ext[0][0], ext[0][1], ext[1][0], ext[1][1], visData.timeData);

  reply(dataObj, time);
}

/**
 * Creates the voronoi data structure which we will use to search later
 *
 * @method createVoronoi
 */
function createVoronoi(data, time) {
  var visData = data.data,
      chartData = dataMapping[data.chartId],
      result = {},
      k,
      xKey,
      yKey,
      axis,
      //we can't pass d3 scales around so we need to recretate them
      xScale = recreateD3Scale(visData.x),
      yScale;
      voronoi = d3.voronoi()
        .extent(ext)
        .x(function(d) { return this._getPixelSpaceVal(d, 'x', xKey) }.bind(this))
        .y(function(d) { return this._getPixelSpaceVal(d, 'y', yKey, axis); }.bind(this)),
        data = {};

  for(var i = 0; i < keys.length; i++) {
    k = keys[i];
    xKey = this.completeSeriesConfig[k]['x'];
    yKey = this.completeSeriesConfig[k]['y'];
    axis = this.completeSeriesConfig[k]['axis'] ? this.completeSeriesConfig[k]['axis']['id'] : null;

    data[k] = voronoi(this.chartData);
  }

  this.voronoiData = data;
}

function returnClosestsVoronoiPoints(mousePos, dataObj) {
  var keys = this.seriesKeys ? this.seriesKeys : Object.keys(this.completeSeriesConfig),
      result,
      k;

  for(var i = 0; i < keys.length; i++) {
    k = keys[i];

    // search through the voronoi for each series
    result = this.voronoiData[k].find(mousePos[0],mousePos[1], this.searchRadius);

    // if we dont find anything for that series, we need to stick in an empty to maintain our register
    if(result === null) {
      dataObj.series.push(this._emptySeries(k));

    // if we find stuff, process the data and stick it in our object
    } else {
      dataObj.time;
      dataObj.series.push(this._calcDataSeries(result, k));

      if(this._calcCrosshair) {
        dataObj = this._addCrosshairData(dataObj, result.data);
      }
    }  //else result null
  }  //for
}

function emptySeries(k) {
  return {
    "coord": [],
    "name": k,
    "value": {}
  };
}

function calcDataSeries(d, k) {
  return {
    "coord": [ d[0], d[1] ],
    "name": k,
    "value": calcVoronoiValue(d, k)
  };
}


function calcVoronoiValue(d, k) {
  var x = this.completeSeriesConfig[k]['x'],
      y = this.completeSeriesConfig[k]['y'],
      o = {};

  o[x] = d.data[x];
  o[y] = d.data[y];

  return o;
}

function addCrosshairData(dataObj, d) {
  // FIXME we can dedupe datasets with timeData this way. Need to make a way to do it for non-timedata datasets...
  if((this.timeData && !dataObj.timeStampsTracker[d[this.timeData]])) {
    dataObj.rawData.push(d);
    dataObj.timeStamps.push(d[this.timeData]);
    dataObj.timeStampsTracker[d[this.timeData]] = true;

  } else if(!this.timeData) {
    dataObj.rawData.push(d);

  }

  return dataObj;
}

onmessage = function(e) {

 // var time = this.performance.now();
 var time = null;
  switch(e.data.action) {

    case 'init':
      reply(null, time);
      break;

    case 'updateData':
      updateData(e.data, time);
      break;

    case 'createQuadtree':
      createQuadtree(e.data, time);
      break;

    case 'findQuadtreePoints':
      returnClosestsQuadtreePoints(e.data, time);
      break;

    case 'findQuadtreePointsInArea':
      returnQuadtreePointsInArea(e.data, time);
      break;

    case 'returnQuadtreeData':
      reply(quadtrees[e.data.chartId], time);
      break;

    case 'createVoronoi':
      createVoronoi(e.data, time);
      break;

    case 'findVoronoiPoints':
      returnClosestsVoronoiPoints(e.data, time);
      break;

    case 'returnVoronoiData':
      reply(voronois[e.data.chartId], time);
      break;

    default:
      reply(null, time);
  }
}
