'use strict';


module.exports = function (grunt) {

    var importOnce = require('node-sass-import-once');
    // Project configuration.
    grunt.initConfig({

        clean: {
            css: ['css'],
            bower: ['bower_components'],
            reports: ['reports']
        },

        sass: {
            options: {
                importer: importOnce,
                importOnce: {
                  index: true,
                  bower: true
                }
            },
            pxVis: {
                files: {
                  'css/noprefix/px-vis-sketch.css': 'sass/px-vis-sketch.scss',
                  'css/noprefix/px-vis.css': 'sass/px-vis-predix.scss',
                }
            },
            pxDemo: {
                files: {
                  'css/noprefix/px-vis-demo-sketch.css': 'sass/px-vis-demo-sketch.scss',
                  'css/noprefix/px-vis-demo.css': 'sass/px-vis-demo-predix.scss',
                }
            },
            pxPie: {
                files: {
                  'css/noprefix/px-vis-pie-sketch.css': 'sass/px-vis-pie-sketch.scss',
                  'css/noprefix/px-vis-pie.css': 'sass/px-vis-pie-predix.scss',
                }
            },
            pxRegister: {
                files: {
                  'css/noprefix/px-vis-register-sketch.css': 'sass/px-vis-register-sketch.scss',
                  'css/noprefix/px-vis-register.css': 'sass/px-vis-register-predix.scss',
                }
            },
            pxTooltip: {
                files: {
                  'css/noprefix/px-vis-tooltip-sketch.css': 'sass/px-vis-tooltip-sketch.scss',
                  'css/noprefix/px-vis-tooltip.css': 'sass/px-vis-tooltip-predix.scss',
                }
            },
            pxZoom: {
                files: {
                  'css/noprefix/px-vis-zoom-sketch.css': 'sass/px-vis-zoom-sketch.scss',
                  'css/noprefix/px-vis-zoom.css': 'sass/px-vis-zoom-predix.scss',
                }
            }

        },

        autoprefixer: {
          options: {
            browsers: ['last 2 version', 'Safari 8.0']
          },
          multiple_files: {
            expand: true,
            flatten: true,
            src: 'css/noprefix/*.css',
            dest: 'css'
          }
        },

        shell: {
            options: {
                stdout: true,
                stderr: true
            },
            bower: {
                command: 'bower install'
            }
        },

        jshint: {
            all: [
                'Gruntfile.js',
                'js/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        watch: {
            sass: {
                files: ['sass/**/*.scss'],
                tasks: ['sass', 'autoprefixer'],
                options: {
                    interrupt: true,
                    livereload: false
                }
            },
            htmljs: {
                files: ['*.html', '*.js'],
                options: {
                    interrupt: true,
                    livereload: false
                }
            },
        },

        depserve: {
            options: {
                open: '<%= depserveOpenUrl %>'
            }
        },
        webdriver: {
            options: {
                specFiles: ['test/*spec.js']
            },
            local: {
                webdrivers: ['chrome']
            }
        },
        concurrent: {
            devmode: {
                tasks: ['watch', 'depserve'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        fa: {
          files: {
            src: 'bower_components/font-awesome/css/font-awesome.css',
            dest: 'fa_codes.html',
          }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-dep-serve');
    grunt.loadNpmTasks('webdriver-support');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-fa');

    // Default task.
    grunt.registerTask('default', 'Basic build', [
        'sass',
        'autoprefixer',
        'grunt-fa'
    ]);

    grunt.registerTask('devmode', 'Development Mode', [
        'concurrent:devmode'
    ]);

    grunt.registerTask( 'grunt-fa', [
        'fa'
    ]);

    // First run task.
    grunt.registerTask('firstrun', 'Basic first run', function() {
        grunt.config.set('depserveOpenUrl', '/index.html');
        grunt.task.run('default');
        grunt.task.run('depserve');
    });

    // Default task.
    grunt.registerTask('test', 'Test', [
        'jshint',
        'webdriver'
    ]);

    grunt.registerTask('release', 'Release', [
        'clean',
        'shell:bower',
        'default',
        'test'
    ]);

};
