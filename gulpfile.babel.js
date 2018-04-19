import child from 'child_process';
import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();

import gulp from 'gulp';
import PluginError from 'plugin-error';
import log from 'fancy-log';
import runSeq from 'run-sequence';
import sass from 'gulp-sass';
import webpack from 'webpack';
import yargs from 'yargs';
import uglifycss from 'gulp-uglifycss';

const siteRoot = '_site';
const cssFiles = 'scss/app.scss';

gulp.task('css', () => {
    let pipe = gulp.src(cssFiles)
        .pipe(sass({
            "includePaths": [
                './node_modules/foundation-sites/scss',
                './node_modules/normalize-scss/sass'
            ]
        }));

    if (yargs.argv.production) {
        pipe = pipe.pipe(uglifycss({
            "uglyComments": true
        }));
    }

    return pipe.pipe(gulp.dest('css'));
});

gulp.task("webpack", (cb) => {
    return webpack(require("./webpack.config.js")).run((err, stats) => {
        if (err) { throw new PluginError('webpack-build', err); }
        log('[webpack-build]', stats.toString({
            colors: true
        }));
        cb();
    });
});

gulp.task('jekyll', () => {
    const jekyll = child.spawn('bundler', ['exec', 'jekyll', 'build', '--incremental', '--watch']);

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('jekyll-build', () => {
    let jekyll;
    if (yargs.argv.production) {
        log("Hello!");
        jekyll = child.spawn('jekyll', ['build']);
    } else {
        jekyll = child.spawn('bundler', ['exec', 'jekyll', 'build']);
    }

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);

    return jekyll;
});

gulp.task('serve', () => {
    browserSync.init({
        files: [siteRoot + '/**'],
        port: 4000,
        server: {
            baseDir: siteRoot
        }
    });

    gulp.watch('scss/*.scss', ['css']);
    gulp.watch('js-src/*.*', ['webpack']);
});

gulp.task('default', ['css', 'webpack', 'jekyll', 'serve']);
gulp.task('build', (cb) => {
    runSeq(
        ['css', 'webpack'],
        'jekyll-build',
        cb
    );
});