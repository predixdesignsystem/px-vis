var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var path = require('path');
var File = gutil.File;

// Consts
const PLUGIN_NAME = 'gulp-srcToVariable';

/**
* varName - the name of the string variable
* asMap - this is a special case for babylonjs that will add each file to a map of strings and not to a single string.
* namingCallback - connected to the asMap variable - how to name the keys in the map.
*/
var srcToVariable = function srcToVariable(varName, asMap, namingCallback) {

    var content;
    var firstFile;

    namingCallback = namingCallback || function(filename) { return filename; };

    function bufferContents(file, enc, cb) {
    // ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // no stream support, only files.
    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-concat',  'Streaming not supported'));
      cb();
      return;
    }

    // set first file if not already set
    if (!firstFile) {
      firstFile = file;
    }

    // construct content instance
    if (!content) {
      content = asMap ? {} : "";
    }
    // add file to content instance
    if(asMap) {
        var name = namingCallback(file.relative);
        //add the file's content as a string to the map
        content[name] = file.contents.toString();
    } else {
        //add the file's content as a string to the files that were added so far.
        content += file.contents.toString();
    }
    cb();
  }

  function endStream(cb) {
    if (!firstFile || !content) {
      cb();
      return;
    }


    var joinedPath = path.join(firstFile.base, varName);
    //The content of the file sent back to gulp is varName = stringify(content).
    var joinedFile = new File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: joinedPath,
      contents: new Buffer(varName + '=' + JSON.stringify(content) + ';')
    });

    this.push(joinedFile);
    cb();
  }
  return through.obj(bufferContents, endStream);
}

module.exports = srcToVariable;
