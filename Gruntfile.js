module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                includePaths: [
                    'node_modules/support-for/sass',
                    'node_modules/normalize-scss/sass',
                    'node_modules/foundation-sites/scss',
                    'node_modules/okaynav/dist/css'
                ],
                sourceMap: false
            },
            dist: {
                files: {
                    'css/main.css': 'scss/app.scss'
                }
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [
                        ["riotify"],
                        ["babelify", { "presets": ["es2015"] }]
                    ]
                },
                files: {
                    // if the source file has an extension of es6 then
                    // we change the name of the source file accordingly.
                    // The result file's extension is always .js
                    "./js/app.js": ["./js-src/app.js"]
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
                files: ['scss/*.scss', '_layouts/*.html', '_config.yml', 'js-src/*'],
                tasks: ['sass:dist', 'browserify:dist']
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['sass:dist', 'browserify:dist']);
};