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

'use strict';
/**
 *
 * TO RUN:
 * You need node 7.6+
 * If you're on 7.x run with the flag node --harmony-async-await
 * If you're on 8.x no flag
 *
 */

const fs = require('fs');
const path = require('path');
const argv = require('yargs')
              .usage('Usage: --path [path_to_folder] --write [bool] -v[v]\n v is verbose mode: 0 v is less verbose and 2 most verbose')
              .demandOption(['path'])
              .count('verbose')
              .alias('v', 'verbose')
              .argv;



let VERBOSE_LEVEL = argv.verbose,
    allObservers = {},
    allFunctions = {},
    hasLog = false,
    shouldWrite = false,
    currentFileName;


function checkHasLog() {
  if(!hasLog) {
    console.log('\n');
    console.log('Process ' + folderNameFromPath(currentFileName));
    console.log('============================');
    hasLog = true;
  }
}

function WARN()  {
  if(VERBOSE_LEVEL >= 0) {
    checkHasLog();
    console.log.apply(console, arguments);
  }
}
function INFO()  {

  if(VERBOSE_LEVEL >= 1) {
    checkHasLog();
    console.log.apply(console, arguments);
  }
}
function DEBUG() {
  if(VERBOSE_LEVEL >= 2) {
    checkHasLog();
    console.log.apply(console, arguments);
  }
}

function hybridize() {
  console.log('Starting hybridization\n\n');

  if(!Array.isArray(argv.path)) {
    argv.path = [argv.path];
  }
  let files = findElementsFile(argv.path);

  if(argv.write) {
    shouldWrite = argv.write;
  }

  let data = [];

  for(let folder of argv.path) {
    for (let file of files[folderNameFromPath(folder)]) {
      currentFileName = folder + '/' + file;
      hasLog = false;
      processFile();
    }
  }
};

function processFile() {

  let src = fs.readFileSync(currentFileName, 'utf8');

  if(src.match(/\s*Polymer\s*\(\s*{\s*is/)) {
    DEBUG('processing element file...');
    processElement(src);
  } else {
    DEBUG('processing non-element (assuming behavior) file...');
    processBehavior(src);
  }
}

function processElement(src) {

  let observers = findObservers(src, currentFileName),
      functions = findFunctions(src, currentFileName),
      functionsNames = Object.keys(functions),
      functionsToProcess = triageFunctionsToProcess(observers, functions),
      injection,
      injected = false;

  allObservers[currentFileName] = observers;

  for(let i=0; i<functionsToProcess.length; i++) {

    if(!src.slice(functionsToProcess[i].index, functionsToProcess[i].index + 100).match(/if\(this.hasUndefinedArguments\(arguments\)\)/)) {

      INFO('injecting ' + functionsToProcess[i].name);
      injection = '\n' + generateSpaces(functionsToProcess[i].spaceLength + 2);
      injection += 'if(this.hasUndefinedArguments(arguments)) {\n';
      injection += generateSpaces(functionsToProcess[i].spaceLength + 4) + 'return;\n';
      injection += generateSpaces(functionsToProcess[i].spaceLength + 2) + '}\n';
      src = src.slice(0, functionsToProcess[i].index) + injection + src.slice(functionsToProcess[i].index);
      injected = true;
    } else {
      DEBUG(functionsToProcess[i].name + ' already injected');
    }
  }

  if(functionsToProcess.length) {
    //inject behavior
    src = injectBehaviorElement(src);
    if(shouldWrite && injected) {
      INFO('writing ' + currentFileName);
      fs.writeFileSync(currentFileName, src, 'utf8');
    }
  } else {
    DEBUG('no functions required change');
  }
}

function processBehavior(src) {

  let behaviors = searchBehaviors(src),
      hasChange = false;

  for(let behavior of behaviors) {

    let currentSrc = src.slice(behavior.start, behavior.stop),
        observers = findObservers(currentSrc, currentFileName),
        functions = findFunctions(currentSrc, currentFileName),
        functionsNames = Object.keys(functions),
        functionsToProcess = triageFunctionsToProcess(observers, functions),
        injection,
        injected = false;

    for(let i=0; i<functionsToProcess.length; i++) {

      if(!currentSrc.slice(functionsToProcess[i].index, functionsToProcess[i].index + 100).match(/if\(this.hasUndefinedArguments\(arguments\)\)/)) {

        INFO('injecting ' + functionsToProcess[i].name);
        injection = '\n' + generateSpaces(functionsToProcess[i].spaceLength + 2);
        injection += 'if(this.hasUndefinedArguments(arguments)) {\n';
        injection += generateSpaces(functionsToProcess[i].spaceLength + 4) + 'return;\n';
        injection += generateSpaces(functionsToProcess[i].spaceLength + 2) + '}\n';
        currentSrc = currentSrc.slice(0, functionsToProcess[i].index) + injection + currentSrc.slice(functionsToProcess[i].index);
        hasChange = true;
      } else {
        DEBUG(functionsToProcess[i].name + ' already injected');
      }
    }

    if(functionsToProcess.length) {
      currentSrc = injectBehaviorBehavior(currentSrc, behavior);
      src = src.slice(0, behavior.start) + currentSrc + src.slice(behavior.stop);
    } else {
      DEBUG('no functions required change');
    }
  }

  if(shouldWrite && hasChange) {
    INFO('writing ' + currentFileName);
    fs.writeFileSync(currentFileName, src, 'utf8');
  }
}

function searchBehaviors(src) {
  let behaviorRegExp = /^\s?(\w*\.?\w*)\s*=\s*(\[)?\s*{/gm,
      regExpResult,
      behaviors = [],
      stop,
      i,
      count,
      ignoreDueToComment = false,
      ignoreType,
      keepCounting,
      isArray;

  while((regExpResult = behaviorRegExp.exec(src)) !== null) {

    //count '{' and '}' to find end of behavior
    i = regExpResult.index + regExpResult[0].length;
    isArray = !!regExpResult[2];
    count = 1;
    keepCounting = true;
    while(count !== 0) {

      if(!ignoreDueToComment) {

        //detect comments so we can ignore counts in them
        if(src[i] === '/' && src[i+1] === '*' && src[i+2] === '*') {
          ignoreDueToComment = true;
          ignoreType = 'multiline';
        } else if(src[i] === '//' && src[i+1] === '//') {
          ignoreDueToComment = true;
          ignoreType = 'singleline';
        }
        //count
        else if(src[i] === '{') {
          count++;
        } else if(src[i] === '}') {
          count--;
        }
      } else if(ignoreType === 'multiline' && src[i] === '*' && src[i+1] === '/') {
        ignoreDueToComment = false;
      } else if(ignoreType === 'singleline' && (src[i] === '' || src[i] === '\n')) {
        ignoreDueToComment = false;
      }
      i++;
    }

    //keep counting until ']' so that we have all behaviors if this is an array and wecan rerun the script without writing the new behavior twice
    while(isArray && keepCounting) {
      if(src[i] === ']') {
        keepCounting = false;
      }
      i++;
    }

    //push at the beginning so that we process the file from end to start
    behaviors.unshift({
      'start': regExpResult.index,
      'stop': i,
      'name': regExpResult[1],
      'isArray': isArray
    });
  }

  return behaviors;
}

function generateSpaces(number) {
  var str = '';
  for(let i=0; i<number; i++) {
    str = ' ' + str;
  }

  return str;
}

function injectBehaviorElement(src) {

  //search for behaviors first
  var behaviorsRegExp = / *behaviors\s*:\s*\[([^]*?)\]/g,
      tmpArray;

  if((tmpArray = behaviorsRegExp.exec(src)) !== null) {

    //ensure it's not already been added
    if(!tmpArray[1].match(/PxVisBehavior\.observerCheck/)) {

      //inject new behavior
      INFO('injecting behavior');
      var behaviorStart = /( *)behaviors\s*:\s*\[/.exec(tmpArray[0]);
      src = src.slice(0, tmpArray.index + behaviorStart[0].length) + '\n' + generateSpaces(behaviorStart[1].length + 2) + 'PxVisBehavior.observerCheck,' + src.slice(tmpArray.index + behaviorStart[0].length);
    } else {
      DEBUG('behavior PxVisBehavior.observerCheck already defined in behavior array');
    }
  } else {
    INFO('tried to inject behavior but couldn\'t find behavior array');
  }
  return src;
}

function injectBehaviorBehavior(src, behavior) {

  //make sure it's not already injected (or the behavior we are injecting)
  if(!src.match(/PxVisBehavior\.observerCheck/)) {

    //find last '}'
    let index = src.lastIndexOf('}'),
        injection = behavior.isArray ? ', PxVisBehavior.observerCheck' : ', PxVisBehavior.observerCheck]';

    INFO('injecting behavior for ' + behavior.name);
    src = src.slice(0, index + 1) + injection + src.slice(index + 1);

    if(!behavior.isArray) {

      //inject first '[' next to first '{'
      let result = /{/.exec(src);

      src = src.slice(0, result.index) + '[' + src.slice(result.index);
    }
  } else {
    DEBUG('behavior PxVisBehavior.observerCheck already included in ' + behavior.name);
  }

  return src;
}

function triageFunctionsToProcess(observers, functions) {

  let functionsNames = Object.keys(functions),
      result = [];

  for(let i=0; i<observers.bindings.length; i++) {

    if(functionsNames.indexOf(observers.bindings[i]) !== -1) {

      result.push({
        'name': observers.bindings[i],
        'index': functions[observers.bindings[i]].index,
        'spaceLength': functions[observers.bindings[i]].spaceLength
      });
    } else {
      WARN('binding function ' + observers.bindings[i] + ' is declared in ' + folderNameFromPath(currentFileName) + ' but couldn\'t be found in the file. Manually update it where it is defined');
    }
  }

  for(let i=0; i<observers.observers.length; i++) {

    if(functionsNames.indexOf(observers.observers[i]) !== -1) {

      result.push({
        'name': observers.observers[i],
        'index': functions[observers.observers[i]].index,
        'spaceLength': functions[observers.observers[i]].spaceLength
      });
    } else {
      WARN('observer ' + observers.observers[i] + ' is declared in ' + folderNameFromPath(currentFileName) + ' in its observers array but couldn\'t be found in the file. Manually update it where it is defined');
    }
  }

  for(let i=0; i<observers.singleObservers.length; i++) {

    if(functionsNames.indexOf(observers.singleObservers[i]) !== -1) {

      result.push({
        'name': observers.singleObservers[i],
        'index': functions[observers.singleObservers[i]].index,
        'spaceLength': functions[observers.singleObservers[i]].spaceLength
      });
    } else {
      WARN('observer ' + observers.singleObservers[i] + ' is declared in ' + folderNameFromPath(currentFileName) + ' as a single property observer but couldn\'t be found in the file. Manually update it where it is defined');
    }
  }

  for(let i=0; i<observers.computed.length; i++) {

    if(functionsNames.indexOf(observers.computed[i]) !== -1) {

      result.push({
        'name': observers.computed[i],
        'index': functions[observers.computed[i]].index,
        'spaceLength': functions[observers.computed[i]].spaceLength
      });
    } else {
      WARN('computed function ' + observers.computed[i] + ' is declared in ' + folderNameFromPath(currentFileName) + ' but couldn\'t be found in the file. Manually update it where it is defined');
    }
  }

  //sort functions so that we will process them starting at the end of the file
  //and going up. This is to make sure that our indexes are not going to be
  //changed by injecting strings in src
  return result.sort(function(a,b) {
    return b.index - a.index;
  });
}

function findObservers(src) {
  let singleObsRegExp = /observer\s*:\s*['"](.*)['"]/g,
      observersRegExp = /observers\s*:\s*\[(((?:\s*['"].*\(.*\)['"],?\s*)|(?:\s*\/\/\w*\s*))*)\]/g,
      computedRegExo = /computed\s*:\s*['"](.*)['"]/g,
      bindingRegExp = /=['"][\w _]*(?:\[{2}|\{{2})(([\w_]*)\([\w_ ,]*\))(?:\]{2}|\}{2})[^'"]*['"]/g,
      functionRegEXp = /.*\(.*\),?/g,
      result = {
        'singleObservers': [],
        'bindings': [],
        'observers': [],
        'computed': []
      },
      tmpArray,
      tmpMatch,
      tmpStr;

  //find all 'bindings' lines and get the function name
  while ((tmpArray = bindingRegExp.exec(src)) !== null) {

    let funcNameRegExp = /(?:\[{2}|\{{2})([\w_]*)\([\w ,_]*\)(?:\]{2}|\}{2})/g,
        funcArray,
        bindingString = tmpArray[0];

     //find every function within binding
     while ((funcArray = funcNameRegExp.exec(bindingString)) !== null) {

      if(result.bindings.indexOf(funcArray[1]) === -1) {
        result.bindings.push(funcArray[1]);
      }
    }
  }
  if(!result.singleObservers.length) {
    DEBUG('no function bindings in ' + folderNameFromPath(currentFileName));
  }

  //find all 'observer' lines
  while ((tmpArray = singleObsRegExp.exec(src)) !== null) {

    if(result.singleObservers.indexOf(tmpArray[1]) === -1) {
      result.singleObservers.push(tmpArray[1]);
    }
  }
  if(!result.singleObservers.length) {
   DEBUG('no observer in ' + folderNameFromPath(currentFileName));
  }

  //find all 'computed' lines and get the function name
  while ((tmpArray = computedRegExo.exec(src)) !== null) {

    var tmpp = tmpArray[1].trim().match(/['"]?(.*)\(.*\)['"]?/)[1];
    if(result.computed.indexOf(tmpp) === -1) {
      result.computed.push(tmpp);
    }
  }
  if(!result.computed.length) {
   DEBUG('no computed in ' + folderNameFromPath(currentFileName));
  }

  //find "observers" array
  tmpMatch = observersRegExp.exec(src);
  if(tmpMatch) {
    tmpStr = tmpMatch[1];
    //find every function
    while ((tmpArray = functionRegEXp.exec(tmpStr)) !== null) {
      //find function name
      var tmpp = tmpArray[0].trim().match(/['"]?(.*)\(.*\)['"]?/)[1];
      if(result.observers.indexOf(tmpp) === -1) {
        result.observers.push(tmpp);
      }
    }
  } else {
   DEBUG('no observers array in ' + folderNameFromPath(currentFileName));
  }

  return result;
}

/**
 * Finds all functions for a polymer element
 * @param {*} src
 * @param {*} fileName
 */
function findFunctions(src) {
  let functionRegExp = /^(\s*)(.*)\s*:\s*function.*/gm,
      tmpArray,
      result = [];

    while ((tmpArray = functionRegExp.exec(src)) !== null) {
      //find function name
      result[tmpArray[2].trim()] = {
        'index': tmpArray.index + tmpArray[0].length,
        'spaceLength': tmpArray[1].length - 1
      };
    }

    return result;
}

function findElementsFile(folders) {
  let filesFound = {},
      fileRegExp = /px-.*\.html$/,
      files;

  //read all files and find the one we might be interested in
  for(let folder of folders) {
    files = fs.readdirSync(folder);
    filesFound[folderNameFromPath(folder)] = [];
    files.forEach(file => {
      if(file.match(fileRegExp)) {
        filesFound[folderNameFromPath(folder)].push(file);
      }
    });
  }

  return filesFound;
}

function folderNameFromPath(path) {
  return path.substring(path.lastIndexOf('/')+1);
}

hybridize();
