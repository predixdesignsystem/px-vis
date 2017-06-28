var myScript = {};

myScript.dataLength = function(data, chartId) {
  return this.dataMapping[chartId].length;
};

myScript.returnData = function(data, chartId) {
  return this.dataMapping[chartId];
}
