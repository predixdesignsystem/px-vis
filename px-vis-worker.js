importScripts("px-vis-worker-scale.js");

/*
  VISDATA Example:
  {
    "completeSeriesConfig": completeSeriesConfig from chart,
    "keys": Obj.keys(completeSeriesConfig),
    "timeData" = chart.timeData;

    "radial": if a radial chart  (IE Polar),
    "counterClockwise": polar.counterClockwise,
    "useDegrees": polar.useDegrees,

    "isMultiY": chart._isMultiY

    "x": {
      "range": x.range(),
      "domain": x.domain(),
      "type": x._scaleType
    },

    "y": {
      "defaultAxis": {
        "range": y.defaultAxis.range(),
        "domain": y.defaultAxis.domain(),
        "type": y.defaultAxis._scaleType
      }
    },

    // On hover
    "mousePos": mousePos,
    "calcCrosshair": chart._calcCrosshair;
    "radius" = chart.searchRadius;
    "searchType" = chart.searchType;
  }
*/


// Global storage vars
var dataMapping = {},
    quadtrees = {};

function reply(data, time) {

  //var time2 = this.performance.now();
  var time2 = null;
  if(data || data === false || data === 0) {
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


function deleteData(eventData, time) {

  delete dataMapping[eventData.chartId];
  delete quadtrees[eventData.chartId];

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
    'time': null,
    'timeSeriesKey': null,
    "series" : [],
    "rawData" : [],
    "timeStamps" : [],
    "timeStampsTracker" : {}
  }
}


/**
 * Flattens a single data set into individual data obj so the quadtree can properly create build itself
 * Example:
 * ```
 *  {
 *    "i": index of the data in chartData
 *    "k": "y0",
 *    "px": pixel val,
 *    "py": pixel val,
 *  }
 *```
 * @method flattenData
 */
function flattenData(visData, d, xScale, yScale, index, arr) {

  for(var i = 0; i < visData.keys.length; i++) {
    var o = {},
        k = visData.keys[i],
        axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : "default";

    o['i'] = index;
    o['k'] = k;

    //get pixel value: pass (X or Y) value and axis to the scale
    if(visData.radial) {

      var pix = calcPixelCoordForRadial(d[visData.completeSeriesConfig[k]['x']], d[visData.completeSeriesConfig[k]['y']], axis, visData);
      o['px'] = ~~pix[0];
      o['py'] = ~~pix[1];
    } else {
      o['px'] = ~~xScale(d[visData.completeSeriesConfig[k]['x']], axis);
      o['py'] = ~~yScale(d[visData.completeSeriesConfig[k]['y']], axis);
    }

    arr.push(o);
  }

  return arr;
}

/**
 * Builds an object for binding to the quadtree scales
 *
 * @method buildQuadtreeHelperObj
 */
function buildQuadtreeHelperObj(visData, k, index, xScale) {
  var obj = {},
      axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : null;

  obj.xKey = visData.completeSeriesConfig[k]['x'];
  obj.yKey = visData.completeSeriesConfig[k]['y'];

  if(visData.radial) {

    var calcPx = function (d) {
      return calcPixelCoordForRadial(d[obj.xKey], d[obj.yKey] , axis, visData);
    };

    obj.xScale = function(d) {return calcPx(d)[0];};
    obj.yScale = function(d) {return calcPx(d)[1];};
    obj.yScale.index = index;
  } else {
    obj.yScale = recreateD3Scale(visData.y[axis]);
    obj.yScale.index = index;
    obj.xScale = recreateD3Scale(visData.x);
  }

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

function calcPixelCoordForRadial(angle, amp, axis, visData) {
  var yRange = visData.y[axis].range[1] - visData.y[axis].range[0],
      yDomainTot = visData.y[axis].domain[1] - visData.y[axis].domain[0],
      pixelAmplitude = yRange * (amp - visData.y[axis].domain[0])/yDomainTot;

  angle = adjustAngleForPolarChart(angle, false, visData);

  //sin * pixel range * percentage of data range
  return [Math.sin(angle) * pixelAmplitude, Math.cos(angle) * pixelAmplitude];
}

function calcXScale(visData) {
  if(!visData.radial) {
    var x = recreateD3Scale(visData.x);
    return function(d) { return x(d); };
  }
}

function calcYScale(visData) {
  if(!visData.radial) {
    var y = getMultiScale(visData);
    return function(d, axis) { return y[axis](d); };
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
      quadtree;

    if(chartData) {
        quadtree = d3.quadtree()
        .extent(visData.extents)
        .x(function(d) { return d.px; })
        .y(function(d) { return d.py; });

      // To add all datapoints to our quadtree, we need to break each dataset up.
      // Iterate though all data, flatten our datasets, and add them to the quadtree
      // var before = this.performance.now(),
        var  during, allFlat = [];
      for(var i = 0; i < chartData.length; i++) {

       flattenData(visData, chartData[i], xScale, yScale, i, allFlat);
      }

      quadtree.addAll(allFlat);

      return quadtree;
    } else {
      return null;
    }
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
      // we can't pass d3 scales around so we need to recretate them+
      //for radial we need both X and Y values to calculate either X or
      //Y in pix because we need to convert everyhting in a cartesian plan
      xScale = function(d) {
        return visData.radial ? this.xScale(d) : this.xScale(d[this.xKey]);
      },
      yScale = function(d) {
        return visData.radial ? this.yScale(d) : this.yScale(d[this.yKey]);
      };

  if(chartData) {
  // FIXME Make work for POLAR
    for(var i = 0; i < visData.keys.length; i++) {
      k = visData.keys[i];

      //create an object and bind it to the x and y accessors so that the scales
      //won't be overriden by the next iteration of the loop
      var obj = buildQuadtreeHelperObj(visData, k, i);

      // if we are just doing closestPoint, then do not reset the quadtree
      quadtree[k] = d3.quadtree()
        .extent(visData.extents)
        .x(xScale.bind(obj))
        .y(yScale.bind(obj))
        .addAll(chartData);
    }

    return quadtree;
  } else {
    return null;
  }
}

/**
 * Creates the quadtree data structure which we will use to search later
 *
 * @method createQuadtree
 */
function createQuadtree(data, time) {


  quadtrees[data.chartId] = data.data.searchType === 'pointPerSeries' ?
    createSeriesQuadtree(data) :
    // closestPoint & allInArea
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
    a = calcPixelCoordForRadial(d[x], d[y], axis, visData);
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

function calcClosestPoint(mousePos, foundPoint, series, time) {
  var pixelX = series.coord[0],
      pixelY = series.coord[1],
      currDist = (pixelX-=mousePos[0])*pixelX + (pixelY-=mousePos[1])*pixelY; //Pythagorean, but dont care about sqrt

  // if first time, our current point is our closest
  // is not first, then if currDist is closer
  if(!foundPoint || foundPoint.dist > currDist) {
    return {
      "dist": currDist,
      "time": time,
      "key": series.name
    }
  }

  return foundPoint;
}

/**
 * Calcs and returns the tooltipData.series obj
 *
 * @method calcDataSeriesQuadtree
 */
function calcDataSingleQuadtree(rawData, k, visData) {

  var x = visData.completeSeriesConfig[k]['x'],
      y = visData.completeSeriesConfig[k]['y'],
      axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : "default",
      value = calcValueQuadtree(rawData, x, y);

  //for each point calc its coords
  return {
    "coord": visData.radial ? calcPixelCoordForRadial(value[x], value[y], axis, visData) : [ visData.xScale(value[x]), visData.yScale[axis](value[y]) ],
    "name": k,
    "value": value
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

function constructDataObj(result, dataObj, k, visData, isSingle, xScale) {

  if(!result) {
    dataObj.series.push(emptySeries(k));

  } else if(isSingle) {

    var rawData = this.dataMapping[visData.chartId][result.i];
    dataObj.series.push(calcDataSingleQuadtree(rawData, k, visData));

    // if we need to add crosshair data and are not doing all in area...
    // all in area gets calced else where rather than iteratively here
    if(visData.calcCrosshair && visData.searchType !== 'allInArea') {
      dataObj = addCrosshairDataQuadtree(dataObj, rawData, visData.timeData);
    }

  } else {
    var axis = visData.completeSeriesConfig[k]['axis']['id'],
        yScale = recreateD3Scale(visData.y[axis]),
        series = calcDataSeriesQuadtree(result, k, xScale, yScale, visData, axis);

    dataObj.series.push(series);

    if(visData.timeData) {
      dataObj.closest = calcClosestPoint(visData.mousePos, dataObj.closest, series, result[visData.timeData]);
    }

    if(visData.calcCrosshair) {
      dataObj = addCrosshairDataQuadtree(dataObj, result, visData.timeData);
    }

  }
// TODO Add time

  return dataObj;
}


function calcBoxSize(visData) {
  var x0 = visData.mousePos[0] - visData.radius,
      x1 = visData.mousePos[0] + visData.radius,
      y0 = visData.mousePos[1] - visData.radius,
      y1 = visData.mousePos[1] + visData.radius;

  return {
    "x0" : x0,
    "x1" : x1,
    "y0" : y0,
    "y1" : y1
  };
}

/**
 * Performs the tree search for nodes within an rectilinear area.
 *
 * @method searchAreaBoxQuadtree
 */
function searchAreaBoxQuadtree(quadtree, visData, dataObj) {
  var boxSize = calcBoxSize(visData);

  // via https://bl.ocks.org/mbostock/4343214
  quadtree.visit(function(node, nodeX0, nodeY0, nodeX1, nodeY1) {
    if(!node.length) {
      do {
        var d = node.data;
        // if our point is inside our box, save it if not a copy
        if((d.px >= boxSize.x0) && (d.px < boxSize.x1) && (d.py >= boxSize.y0) && (d.py < boxSize.y1)) {
          dataObj = addCrosshairDataQuadtree(dataObj, d.data, visData.timeData);
        }
      } while(node = node.next);
    }
    //return true  ==> skip the children nodes so we dont search unnessary bits of the tree
    return nodeX0 >= boxSize.x1 || nodeY0 >= boxSize.y1 || nodeX1 < boxSize.x0 || nodeY1 < boxSize.y0;
  });

  return dataObj;
}

/**
 * Performs the tree search for nodes within an circle area.
 *
 * @method searchAreaRadiusQuadtree
 */
function searchAreaRadiusQuadtree(quadtree, visData, dataObj) {
  var r2 = visData.radius * visData.radius,
      boxSize = calcBoxSize(visData);

  // via https://bl.ocks.org/mbostock/4343214
  quadtree.visit(function(node, nodeX0, nodeY0, nodeX1, nodeY1) {
    if(!node.length) {
      do {
        // Thank you Πυθαγόρας ὁ Σάμιος   :)
        if((Math.pow(node.data.px - visData.mousePos[0], 2) + Math.pow(node.data.py - visData.mousePos[1], 2)) <= r2 ) {
          dataObj = addCrosshairDataQuadtree(dataObj, this.dataMapping[visData.chartId][node.data.i], visData.timeData);
        }
      } while(node = node.next);
    }
    //return true  ==> skip the children nodes so we dont search unnessary bits of the tree
    return nodeX0 >= boxSize.x1 || nodeY0 >= boxSize.y1 || nodeX1 < boxSize.x0 || nodeY1 < boxSize.y0;
  });

  return dataObj;
}

/**
 * Performs the tree search for nodes within an area.
 *
 * @method searchAreaQuadtree
 */
function searchAreaQuadtree(quadtree, visData, dataObj) {
  return visData.radius ?
    searchAreaRadiusQuadtree(quadtree, visData, dataObj) :
    searchAreaBoxQuadtree(quadtree, visData, dataObj);
}

function searchQuadtreeSingle(visData, dataObj, quadtreeData) {
  var r = visData.radius ? visData.radius : Infinity,
      result = quadtreeData.find(visData.mousePos[0], visData.mousePos[1], r),
      k;

  //result will consist of one dataset
  // we want to iterate through our keys and get each series within that single dataset
  for(var i = 0; i < visData.keys.length; i++) {
    k = visData.keys[i];

    dataObj = constructDataObj(result, dataObj, k, visData, true, null);
  }

  // if we want to do all in area crosshair data, do it outside our loop
  if(visData.calcCrosshair && visData.searchType === 'allInArea') {
    dataObj = searchAreaRadiusQuadtree(quadtreeData, visData, dataObj);

  }

  // when we constructed our data objs, we saved this
  if(result) {

    dataObj.time = dataMapping[visData.chartId][result.i][visData.timeData];
    dataObj.timeSeriesKey = result.k;
  }

  return dataObj;
}

function searchQuadtreeSeries(visData, dataObj, quadtreeData) {
  var r = visData.radius ? visData.radius : Infinity,
      xScale = !visData.radial ? recreateD3Scale(visData.x) : null,
      result,
      k;

  for(var i = 0; i < visData.keys.length; i++) {
    k = visData.keys[i];

    result = quadtreeData[k].find(visData.mousePos[0], visData.mousePos[1], r);

    dataObj = constructDataObj(result, dataObj, k, visData, false, xScale);
  }

  if(dataObj.closest) {
    dataObj.time = dataObj.closest.time;
    dataObj.timeSeriesKey = dataObj.closest.key;

    delete dataObj.closest;
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
      quadtreeData = quadtrees[eventData.chartId];

  visData.chartId = eventData.chartId;
  visData.xScale = recreateD3Scale(visData.x);
  visData.yScale = getMultiScale(visData);

  if(quadtreeData) {
    if(visData.searchType === 'pointPerSeries') {
      dataObj = searchQuadtreeSeries(visData, dataObj, quadtreeData);

    } else {  //closestPoint && allInArea
      dataObj = searchQuadtreeSingle(visData, dataObj, quadtreeData);
    }
  }

  delete dataObj.timeStampsTracker;
  reply(dataObj, time);
}

/**
 * Finds all the Quadtree nodes in an area. Returns fully constructed tooltip/crosshair data obj
 *
 * @method returnQuadtreePointsInArea
 */
function returnQuadtreePointsInArea(eventData, time) {
  var visData = eventData.data,
      quadtreeData = quadtrees[eventData.chartId],
      dataObj = createDataStub();

      if(quadtreeData) {
        dataObj = searchAreaBoxQuadtree(quadtreeData, visData, dataObj);
      }

  reply(dataObj, time);
}

function emptySeries(k) {
  return {
    "coord": [],
    "name": k,
    "value": {}
  };
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

function determineExtents(eventData, time) {
  var visData = eventData.data,
      extents;

  extentCalc.xAxisType = visData.xAxisType;
  extentCalc.yAxisType = visData.yAxisType;
  extentCalc.completeSeriesConfig = visData.completeSeriesConfig;
  extentCalc.chartExtents = visData.chartExtents;
  extentCalc.dataExtents = visData.dataExtents;
  extentCalc.axes = visData.axes;
  extentCalc.seriesToAxes = visData.seriesToAxes;
  extentCalc.isYAxisObject = visData.isYAxisObject;

  extents = extentCalc.determineExtents(dataMapping[eventData.chartId]);

  reply(extents, time);

}

onmessage = function(e) {

  //var time = this.performance.now();
 var time = null;
  switch(e.data.action) {

    case 'init':
      if(e.data.d3Url) {
        importScripts(e.data.d3Url);
      } else {
        importScripts("../pxd3/d3.min.js");
      }

      reply(null, time);
      break;

    case 'registerCustomScript':

      if(e.data.data.url) {
        importScripts(e.data.data.url);
      }

      reply(null, time);
      break;

    case 'runCustomFunction':

      var obj = this[e.data.data.objectName],
          func,
          result;
      if(obj) {

        func = obj[e.data.data.functionName];
        if(func) {
          //.data.data.data.data.data
          result = func(e.data.data.data, e.data.chartId);
        } else {
          throw 'Couldn\'t run custom function ' + e.data.data.functionName + ' on custom Object ' + e.data.data.objectName + ' because the specified function doesn\'t exist on the specified Object.';
        }
      } else {
        throw 'Couldn\'t run custom function ' + e.data.data.functionName + ' on custom Object ' + e.data.data.objectName + ' because the specified Object doesn\'t exist. Make sure you have loaded your custom script defining the custom object.';
      }

      reply(result, time);
      break;

    case 'updateData':
      updateData(e.data, time);
      break;

    case 'createQuadtree':
   // reply(null, time);
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

    case 'determineExtents':
      determineExtents(e.data, time);
      break;

    case 'unregisterChart':
      deleteData(e.data, time);
      break;

    default:
      reply(null, time);
  }
}
