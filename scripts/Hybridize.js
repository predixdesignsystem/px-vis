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
let allObservers = {},
    allFunctions = {};


function read(path) {
  return new Promise(resolve => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) throw err;
      return resolve(data);
    });
  });
};

function write(path, string) {
  return new Promise(resolve => {
    fs.writeFile(path, string, 'utf8', err => {
      if (err) throw err;
      return resolve(path);
    });
  });
};

function hybridize() {
  console.log('Starting hybridization\n\n');

  let args = process.argv.splice(2),
      files = findElementsFile(args);

  let data = [];

  for(let folder of args) {
    for (let file of files[folderNameFromPath(folder)]) {
      processFile(folder + '/' + file);

    }
  }


 // await write(outpath, JSON.stringify(data));
  console.log(`\n\ndata/icons.json created successfully`);
};

function processFile(fileName) {

  console.log('Process ' + folderNameFromPath(fileName));
  console.log('============================');

  let src = fs.readFileSync(fileName, 'utf8'),
      observers = findObservers(src, fileName),
      functions = findFunctions(src, fileName),
      functionsNames = Object.keys(functions),
      adjustedIndex = 0,
      currentFunction,
      functionsToProcess = triageFunctionsToProcess(observers, functions, fileName),
      injection;

  allObservers[fileName] = observers;

  for(let i=0; i<functionsToProcess.length; i++) {

    injection = '\r\n' + generateSpaces(functionsToProcess[i].spaceLength + 2);
    injection += 'if(this.hasUndefinedArguments(arguments)) {\r\n';
    injection += generateSpaces(functionsToProcess[i].spaceLength + 4) + 'return;\r\n';
    injection += generateSpaces(functionsToProcess[i].spaceLength + 2) + '}\r\n';
    src = src.slice(0, functionsToProcess[i].index) + injection + src.slice(functionsToProcess[i].index);
  }

  if(functionsToProcess.length) {
    //inject behavior
    injectBehavior(src, fileName);
  }

  console.log('\r\n');
}

function generateSpaces(number) {
  var str = '';
  for(let i=0; i<number; i++) {
    str = ' ' + str;
  }

  return str;
}

function injectBehavior(src, fileName) {

}

function triageFunctionsToProcess(observers, functions, fileName) {

  let functionsNames = Object.keys(functions),
      result = [];

  for(let i=0; i<observers.observers.length; i++) {

    if(functionsNames.indexOf(observers.observers[i]) !== -1) {

      result.push(functions[observers.observers[i]]);
    } else {
      console.warn('observer ' + observers.observers[i] + ' is declared in ' + folderNameFromPath(fileName) + ' in its observers array but couldn\'t be found in the file. Manually update it where it is defined');
    }
  }

  for(let i=0; i<observers.singleObservers.length; i++) {

    if(functionsNames.indexOf(observers.singleObservers[i]) !== -1) {

      result.push(functions[observers.singleObservers[i]]);
    } else {
      console.warn('observer ' + observers.singleObservers[i] + ' is declared in ' + folderNameFromPath(fileName) + ' as a single property observer but couldn\'t be found in the file. Manually update it where it is defined');
    }
  }

  for(let i=0; i<observers.computed.length; i++) {

    if(functionsNames.indexOf(observers.computed[i]) !== -1) {

      result.push(functions[observers.computed[i]]);
    } else {
      console.warn('computed function ' + observers.computed[i] + ' is declared in ' + folderNameFromPath(fileName) + ' but couldn\'t be found in the file. Manually update it where it is defined');
    }
  }

  //sort functions so that we will process them starting at the end of the file
  //and going up. This is to make sure that our indexes are not going to be
  //changed by injecting strings in src
  return result.sort(function(a,b) {
    return b.index - a.index;
  });
}

function findObservers(src, fileName) {
  let singleObsRegExp = /observer\s*:\s*['"](.*)['"]/g,
      observersRegExp = /observers\s*:\s*\[((?:\s*['"].*\(.*\)['"],?\s*)*)\]/g,
      computedRegExo = /computed\s*:\s*['"](.*)['"]/g,
      functionRegEXp = /.*\(.*\),?/g,
      result = {
        'singleObservers': [],
        'observers': [],
        'computed': []
      },
      tmpArray,
      tmpMatch,
      tmpStr;

  //find all 'observer' lines and get the function name
  while ((tmpArray = singleObsRegExp.exec(src)) !== null) {
    result.singleObservers.push(tmpArray[1]);
  }
  if(!result.singleObservers.length) {
  //  console.log('no observer in ' + folderNameFromPath(fileName));
  }

  //find all 'computed' lines and get the function name
  while ((tmpArray = computedRegExo.exec(src)) !== null) {
    result.computed.push(tmpArray[1].trim().match(/['"]?(.*)\(.*\)['"]?/)[1]);
  }
  if(!result.computed.length) {
 //   console.log('no computed in ' + folderNameFromPath(fileName));
  }

  //find "observers" array
  tmpMatch = observersRegExp.exec(src);
  if(tmpMatch) {
    tmpStr = tmpMatch[1];
    //find every function
    while ((tmpArray = functionRegEXp.exec(tmpStr)) !== null) {
      //find function name
      result.observers.push(tmpArray[0].trim().match(/['"]?(.*)\(.*\)['"]?/)[1]);
    }
  } else {
   // console.log('no observers array in ' + folderNameFromPath(fileName));
  }

  return result;
}

/**
 * Finds all functions for a polymer element
 * @param {*} src
 * @param {*} fileName
 */
function findFunctions(src, fileName) {
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

exports = module.exports = {
  read,
  write
};
