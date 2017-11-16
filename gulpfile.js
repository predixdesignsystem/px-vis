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
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream({match: 'css/*.html'}));
});

gulp.task('watch', function() {
  gulp.watch(['sass/*.scss'], ['sass']);
  gulp.watch(['./px-vis-worker.js', './px-vis-worker-scale.js', 'scheduler-dev.html'], ['blobfish']);
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

gulp.task('default', function(callback) {
  gulpSequence('clean', 'sass')(callback);
});

/*
Takes our worker files and concatenates them into a single variable to be inserted into our scheduler. That way, we can just use a blob to create our workers instead of requiring outside files.
*/
gulp.task('blobfish', function() {
  // files to blobify
  const scale = fs.readFileSync("px-vis-worker-scale.js", "utf8");
  const worker = fs.readFileSync("px-vis-worker.js", "utf8");
  const d3 = fs.readFileSync("bower_components/pxd3/d3.min.js", "utf8");

  // choose if we should minify said files (d3 is already minified)
  const fugly = argv.dev ? (scale + worker) : uglifyJS.minify({"f1": scale, "f2": worker}).code;

  // concatenate blob files into one
  const concatenated = d3 + fugly;

  // store as json to force the output to be a string when inserted into the scheduler.
  const json = { script: concatenated };
  const str = JSON.stringify(json);

  // our custom gulp "package" to run our regex on the stream. :vsign: stupid gulp regex packages
  function replace(newStr) {
    return through.obj(function(file, enc, callback) {
      if(('contents' in file) && !file.isNull() && !file.isStream() &&file.isBuffer()) {
        const contents = String(file.contents);
        const re = /blobyblobblobblob/;
        const matches = contents.replace(re, newStr);

        file.contents = new Buffer(matches);
        this.push(file);
        return callback();

      } else {
        throw "something went wrong while regexing"
      }
    });
  }

  return gulp.src('./scheduler-dev.html')
    .pipe(replace(str))
    .pipe(rename('px-vis-scheduler.html'))
    .pipe(gulp.dest('./'));

});
