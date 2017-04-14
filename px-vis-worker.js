importScripts("../pxd3/d3.min.js");

var dataMapping = {},
    quadtrees = {};

function reply(data, time) {

  var time2 = this.performance.now();
  if(data) {
    postMessage({'data': data, 'timeIn': time, 'timeOut': time2});
  } else {
    postMessage({'timeIn': time, 'timeOut': time2});
  }
}

function _getVoronoiVal(d, chartScale, key, axis) {
  return axis ? chartScale[axis](d[key]) : chartScale(d[key]);
}

function recreateD3Scale(scaleType, range, domain) {

  var result;
  if(scaleType === 'time') {
    result = Px.d3.scaleUtc().nice().range(range).domain(domain);
  } else if(scaleType === 'timeLocal') {
    result = Px.d3.scaleTime().nice().range(range).domain(domain);
  } else if(scaleType === 'linear') {
    result = Px.d3.scaleLinear().nice().range(range).domain(domain);
  } else if(scaleType === 'scaleBand') {
    result = Px.d3.scaleBand().range(range).domain(domain).round(true).paddingInner(0.5);
  } else { //ordinal
    result = Px.d3.scalePoint().range(range).domain(domain).padding(0.5);
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
      xScale = recreateD3Scale(visData.x.type, visData.x.range, visData.x.domain),
      yScale;

  for(var i = 0; i < visData.keys.length; i++) {

    k = visData.keys[i];
    xKey = visData.completeSeriesConfig[k]['x'];
    yKey = visData.completeSeriesConfig[k]['y'];
    axis = visData.completeSeriesConfig[k]['axis'] ? visData.completeSeriesConfig[k]['axis']['id'] : null;
    //TODO: check if same scale
    yScale = recreateD3Scale(visData.y[axis].type, visData.y[axis].range, visData.y[axis].domain);

    quadtree = d3.quadtree()
      .extent(visData.extents)
      .x(function(d) { return xScale(d[xKey]); })
      .y(function(d) { return yScale(d[xKey]); });

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

function findPoints(eventData, time) {

  var result = {
        'time': (this.xAxisType === 'time' || this.xAxisType === 'timeLocal') ? x1 : null,
        'hidden': false,
        'series': [],
        'mouse': [200,200],
        'xArr': [],
        'yArr': [],
        'rawData': [],
        'timeStamps': [],
        'timeStampsTracker': {}
      }

  reply(result, time);
}

onmessage = function(e) {

  var time = this.performance.now();
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
    case 'findPoints':
      findPoints(e.data, time);
      break;
    default:
      reply(null, time);
  }
}
