// If something breaks in the future go back to this safer import (and change gulp file)
// export {
//   scaleUtc,
//   scaleTime,
//   scaleLinear,
//   scaleBand,
//   scalePoint
// } from "d3-scale";
export {
  default as scaleBand,
  point as scalePoint
} from "d3-scale/src/band";
export {
  default as scaleTime
} from "d3-scale/src/time";
export {
  default as scaleUtc
} from "d3-scale/src/utcTime";
export {
  default as scaleLinear
} from "d3-scale/src/linear";

export {
  extent
} from "d3-array";

export {
  polygonContains
} from "d3-polygon";

export * from "d3-quadtree";