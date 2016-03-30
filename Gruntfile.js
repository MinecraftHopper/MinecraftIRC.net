module.exports = function (grunt) {
    //var moduleImporter = require('sass-module-importer');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                includePaths: [
                    'node_modules/support-for/sass',
                    'node_modules/normalize-scss/sass',
                    'node_modules/foundation-sites/scss',
                    'node_modules/okaynav/dist/css'
                ]
            },
            dist: {
                files: {
                    'css/main.css': 'scss/app.scss'
                }
            }
        },
        jekyll: {
            options: {                          // Universal options
                bundleExec: true,
                src: './'
            },
            dist: {                             // Target
                options: {                        // Target options
                    dest: '_site',
                    config: '_config.yml'
                }
            },
            serve: {
                options: {
                    serve: true,
                    dest: '.jekyll',
                    drafts: true,
                    future: true
                }
            }
        },
        watch: {
            options: {
                interrupt: true,
                atBegin: true,
                spawn: false,
                livereload: true,
                debounceDelay: 2000
            },
            dist: {
                files: ['scss/*.scss', '_layouts/*.html', '_config.yml'],
                tasks: ['sass'],// 'jekyll:serve']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['sass', 'jekyll:serve']);
};