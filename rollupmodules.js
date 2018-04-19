/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If something breaks in the future go back to this safer import (and change gulp file)
// export {
//   scaleUtc,
//   scaleTime,
//   scaleLinear,
//   scaleBand,
//   scaleLog,
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
  default as scaleLog
} from "d3-scale/src/log";

export {
  extent
} from "d3-array";

export {
  polygonContains
} from "d3-polygon";

export * from "d3-quadtree";