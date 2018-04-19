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

function fixTests() {
  console.log('Starting fixing tests\n\n');

  if(!Array.isArray(argv.path)) {
    argv.path = [argv.path];
  }
  let files = findTestFiles(argv.path);

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

  let info = findDeclarations(src, currentFileName);

  INFO('process ' + currentFileName);
  INFO('==============================')
  for(let work of info) {

    if(work.insertSetup) {
      DEBUG('insert setup');
      src = src.slice(0, work.insertionIndex) + '    });\r' + src.slice(work.insertionIndex);
    }

    //insert
    for(let insertInfo of work.insert) {
      DEBUG('insert ' + insertInfo.string);
      src = src.slice(0, work.insertionIndex) + '      ' + insertInfo.string + src.slice(work.insertionIndex);
    }

    if(work.insertSetup) {
      src = src.slice(0, work.insertionIndex) + 'suiteSetup(function() {\r' + src.slice(work.insertionIndex);
    }

    //delete
    for(let deleteInfo of work.delete) {
      DEBUG('delete ' + deleteInfo.value);
      src = src.substr(0, deleteInfo.index) + src.substr(deleteInfo.index + deleteInfo.length);
    }
  }

  if(shouldWrite) {
    fs.writeFileSync(currentFileName, src, 'utf8');
  }
}

/**
 * Finds all functions for a polymer element
 * @param {*} src
 * @param {*} fileName
 */
function findDeclarations(src) {
  let suiteRegExp = /^((\s*)suite\(['"].*['"],\s?function\s?\(\)\s?{\s*)var[^]*?((suiteSetup|test)\(['"]?.*['"]?\s*function\s?\((done)?\)\s?{\s?)/gm,
      defRegExp = /((\w*)(\s?=\s?document\.getElementById\(.*\)))[\s,;]*/gm,
      tmpArray,
      result = [];

      while ((tmpArray = suiteRegExp.exec(src)) !== null) {

      let funcNameRegExp = /(?:\[{2}|\{{2})([\w_]*)\([\w ,_]*\)(?:\]{2}|\}{2})/g,
          funcArray,
          varDeclarations = tmpArray[0],
          matchStart = tmpArray.index,
          tmpResult = {
            'insertionIndex': tmpArray[4] === 'test' ? tmpArray.index + tmpArray[0].length - tmpArray[3].length : tmpArray.index + tmpArray[0].length,
            'delete': [],
            'insert': [],
            'insertSetup': tmpArray[4] === 'test'
          };

        //find every function within binding
        while ((funcArray = defRegExp.exec(varDeclarations)) !== null) {

          tmpResult.delete.unshift({
            'index': matchStart + funcArray.index + funcArray[2].length,
            'length': funcArray[3].length,
            'value': funcArray[3]
          });
          tmpResult.insert.unshift({
            'string': funcArray[1] + ';\n'
          });
      }

      result.unshift(tmpResult);
    }

    return result;
}

function findTestFiles(folders) {
  let filesFound = {},
      fileRegExp = /.*\.js$/,
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

fixTests();
