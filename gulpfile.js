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
const path = require('path');
const gulp = require('gulp');
const pkg = require('./package.json');
const $ = require('gulp-load-plugins')();
const gulpSequence = require('gulp-sequence');
const importOnce = require('node-sass-import-once');
const stylemod = require('gulp-style-modules');
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');
const combiner = require('stream-combiner2');
const bump = require('gulp-bump');
const argv = require('yargs').argv;
const fs = require("fs");
const uglifyJS = require("uglify-js");
const rename = require("gulp-rename");
const through = require('through2');
const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const exec = require('child_process').exec;
const { ensureLicense } = require('ensure-px-license');

const sassOptions = {
  importer: importOnce,
  importOnce: {
    index: true,
    bower: true
  }
};

gulp.task('clean', function() {
  return gulp.src(['.tmp', 'css'], {
    read: false
  }).pipe($.clean());
});

gulp.task('generate-api', function (cb) {
  exec(`node_modules/.bin/polymer analyze px-*.html > ${pkg.name}-api.json`, function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

function handleError(err){
  console.log(err.toString());
  this.emit('end');
}

function buildCSS(){
  return combiner.obj([
    $.sass(sassOptions),
    $.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false,
      flexbox: false
    }),
    gulpif(!argv.debug, $.cssmin())
  ]).on('error', handleError);
}

gulp.task('sass', function() {
  return gulp.src(['./sass/*.scss'])
    .pipe(buildCSS())
    .pipe(stylemod({
      moduleId: function(file) {
        return path.basename(file.path, path.extname(file.path)) + '-styles';
      }
    }))
    .pipe(ensureLicense())
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream({match: 'css/*.html'}));
});

gulp.task('watch', function() {
  gulp.watch(['sass/*.scss'], ['sass']);
  gulp.watch(['./px-vis-worker.js', './px-vis-worker-scale.js'], ['blobfish']);
});

gulp.task('serve', function() {
  browserSync.init({
    port: 8080,
    notify: false,
    reloadOnRestart: true,
    logPrefix: `${pkg.name}`,
    https: false,
    server: ['./', 'bower_components'],
  });

  gulp.watch(['css/*-styles.html', 'css/*-demo.css', '*.html', 'demo/*.html','*.js']).on('change', browserSync.reload);
  gulp.watch(['sass/*.scss'], ['sass']);
});

gulp.task('bump:patch', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('license', function() {
  return gulp.src(['./**/*.{html,js,css,scss}', '!./node_modules/**/*', '!./bower_components?(-1.x)/**/*'])
    .pipe(ensureLicense())
    .pipe(gulp.dest('.'));
});

gulp.task('default', function(callback) {
  gulpSequence('clean', 'sass', 'generate-api', 'license')(callback);
});

/*
Takes our worker files and concatenates them into a single variable to be inserted into our scheduler. It also creates a custom, minimal build of d3.

With these files, we can just use a blob to create our workers instead of requiring outside files.
*/
gulp.task('blobfish', async () => {
  // Builds our custom d3 bundle
  async function buildD3Bundle(debug) {
    /*
      adding `external: ['d3-color']` to inputOptions to prevent it from importing. This potentially could break should something rely on it in the future. In rollupmodules, we are directly importing our scales for this reason. If something breaks, go back to the normal default imports and remove this external option.
    */
    const inputOptions = {
      input: 'rollupmodules.js',
      plugins: [ resolve()],
      external: ['d3-color']
    };
    let outputOptions = {
      name: "d3",
      format: "umd"
    };

    // for easier debugging of the created d3 bundle
    if(debug) {
      outputOptions.file = 'd3-debug.js';
    }

    const bundle = await rollup.rollup(inputOptions);
    const { code, map } = await bundle.generate(outputOptions);

    if(debug) {
      await bundle.write(outputOptions);
    }

    return uglifyJS.minify(code).code;
  }

  function minifyWorkers(arg, f1, f2) {
    // minify does a full minification
    if(arg.minify) {
      return uglifyJS.minify({"f1": f1, "f2": f2}).code;
    }
    // dev does nothing; just returns files as is
    if(arg.dev) {
      return f1 + f2;
    }
    /*
      default is to do a "light" minification, leaving vars alone but striping out:
      * comments
      * line breaks
      * debugger statements

      docs: https://www.npmjs.com/package/uglify-js
    */
    const options = {
      compress: false,
      mangle: false
    };

    return uglifyJS.minify({"f1": f1, "f2": f2}, options).code;
  }

  // our custom gulp "package" to run our regex on the stream. :vsign: stupid gulp regex packages
  function replace(newStr) {
    return through.obj(function(file, enc, callback) {
      if(('contents' in file) && !file.isNull() && !file.isStream() &&file.isBuffer()) {
        const contents = String(file.contents);;
        const re = /(\/\/start\sof\sblob\s+var\sblob\s=\s)[\s\S]*(\n\s+\/\/end\sof\sblob)/g;

        /*
          d3 has regex code including `$&` :facepalm:
          if we just replace the string normally, that `$&` gets interpreted and our whole match gets inserted in the middle of the d3 code
          Instead, return the code-string with a callback to avoid this recursion
        */
        const newContent = contents.replace(re, (m, m1, m2) => {
          return `${m1} ${newStr}; ${m2}`;
        });

        file.contents = new Buffer(newContent);
        this.push(file);
        return callback();

      } else {
        throw "something went wrong while regexing"
      }
    });
  }

  const d3 = await buildD3Bundle(argv.debug);
  const scale = fs.readFileSync("px-vis-worker-scale.js", "utf8");
  const worker = fs.readFileSync("px-vis-worker.js", "utf8");

  // choose if we should minify worker files (d3 is already minified)
  const workerfiles = minifyWorkers(argv, scale, worker);

  // concatenate blob files into one
  const concatenated = d3 + workerfiles;

  // store as json to force the output to be a string when inserted into the scheduler.
  const json = { script: concatenated };
  const str = JSON.stringify(json);

  return gulp.src('./px-vis-scheduler.html')
    .pipe(replace(str))
    .pipe(gulp.dest('./'));

});
