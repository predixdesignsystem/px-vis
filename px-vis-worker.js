importScripts("../pxd3/d3.min.js");

var dataMapping = {},
    quadtrees = {};

function reply(data, time) {

  //var time2 = this.performance.now();
  var time2 = null;
  if(data) {
    postMessage({'data': data, 'timeIn': time, 'timeOut': time2});
  } else {
    postMessage({'timeIn': time, 'timeOut': time2});
  }
}

function _getVoronoiVal(d, chartScale, key, axis) {
  return axis ? chartScale[axis](d[key]) : chartScale(d[key]);
}

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

function createQuadtree(data, time) {

  var visData = data.data,
      chartData = dataMapping[data.chartId],
      result = {},
      k,
      xKey,
      yKey,
      axis,
      quadtree,
      //we can't pass d3 scales around so we either need to recretate them
      xScale = recreateD3Scale(visData.x),
      yScale;

  for(var i = 0; i < visData.keys.length; i++) {

    //create an object and bind it to the x and y accessors so that the scales
    //won't be overriden by the next iteration of the loop
    var obj = {};
    k = visData.keys[i];
    obj.xKey = visData.completeSeriesConfig[k]['x'];
    obj.yKey = visData.completeSeriesConfig[k]['y'];
    axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : null;
    //TODO: check if same scale
    obj.yScale = recreateD3Scale(visData.y[axis]);
    obj.yScale.indexx = i;

    quadtree = d3.quadtree()
      .extent(visData.extents)
      .x(function(d) { return xScale(d[this.xKey]); }.bind(obj))
      .y(function(d) { return this.yScale(d[this.yKey]); }.bind(obj));

    quadtree.addAll(chartData);

    result[k] = quadtree;
  }

  quadtrees[data.chartId] = result;
  reply(null, time);
}

function updateData(eventData, time) {

  dataMapping[eventData.chartId] = eventData.data.chartData;
  reply(null, time);
}

function calcValueQuadtree(d, x, y) {
  var o = {};

  o[x] = d[x];
  o[y] = d[y];

  return o;
}

function calcCoordQuadtree(d, x, y, xScale, yScale) {
  var a = [];

  a[0] = xScale(d[x]);
  a[1] = yScale(d[y]);

  return a;
}

function calcDataSeriesQuadtree(d, k, xScale, yScale, completeSeriesConfig) {
  var x = completeSeriesConfig[k]['x'],
      y = completeSeriesConfig[k]['y'];

  return {
    "coord": this.calcCoordQuadtree(d, x, y, xScale, yScale),
    "name": k,
    "value": this.calcValueQuadtree(d, x, y, xScale, yScale)
  }
}

function addCrosshairDataQuadtree(dataObj, d, eventData) {
  // FIXME we can dedupe datasets with timeData this way. Need to make a way to do it for non-timedata datasets...
  if((eventData.timeData && !dataObj.timeStampsTracker[d[eventData.timeData]])) {
    dataObj.rawData.push(d);
    dataObj.timeStamps.push(d[eventData.timeData]);
    dataObj.timeStampsTracker[d[eventData.timeData]] = true;

    dataObj.rawData.push(d);
  } else if(!eventData.timeData) {
    dataObj.rawData.push(d);
  }

  return dataObj;
}

function returnClosestsQuadtreePoints(eventData, time) {
  var result,
      visData = eventData.data,
      k,
      dataObj = {},
      quadtreeData = quadtrees[eventData.chartId],
      xScale = recreateD3Scale(visData.x),
      yScale,
      seriesResult = [],
      axis;

  dataObj.timeStampsTracker = {};
  dataObj.series = [];

  for(var i = 0; i < visData.keys.length; i++) {
    k = visData.keys[i];

    result = quadtreeData[k].find(visData.mousePos[0], visData.mousePos[1]);
    axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : null;
    yScale = recreateD3Scale(visData.y[axis]);

    dataObj.series.push(calcDataSeriesQuadtree(result, k, xScale, yScale, visData.completeSeriesConfig));


    if(visData.calcCrosshair) {
      dataObj = addCrosshairDataQuadtree(dataObj, result, visData.timeData);
    }
  }

  delete dataObj.timeStampsTracker;
  reply(dataObj, time);
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
    case 'findQuadTreePoints':
      returnClosestsQuadtreePoints(e.data, time);
      break;
    default:
      reply(null, time);
  }
}
