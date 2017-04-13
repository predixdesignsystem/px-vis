

var dataMapping = {},
    bucketedDataMapping = {};

function reply(data, time) {

  var time2 = this.performance.now();
  if(data) {
    postMessage({'data': data, 'timeIn': time, 'timeOut': time2});
  } else {
    postMessage({'timeIn': time, 'timeOut': time2});
  }
}

function updateData(eventData, time) {

  dataMapping[eventData.chartId] = eventData.data.chartData;
  reply(null, time);
}

onmessage = function(e) {

  var time = this.performance.now();
  switch(e.data.action) {
    case 'dummy':
      reply(e.data, time);
      break;
    case 'updateData':
      updateData(e.data, time);
      break;
    default:
      reply(null, time);
  }
}
