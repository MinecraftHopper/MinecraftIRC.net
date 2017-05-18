import child from 'child_process';
import {create as bsCreate} from 'browser-sync';
const browserSync = bsCreate();

import gulp from 'gulp';
import gutil from 'gulp-util';
import sass from 'gulp-sass';
import webpack from 'webpack';

const siteRoot = '_site';
const cssFiles = 'scss/app.scss';

gulp.task('css', () => {
    gulp.src(cssFiles)
        .pipe(sass({
            "includePaths": [
                './node_modules/foundation-sites/scss',
                './node_modules/normalize-scss/sass'
            ]
        }))
        .pipe(gulp.dest('css'));
});

gulp.task("webpack", (cb) => {
    webpack(require("./webpack.config.js")).run((err, stats) => {
        if (err) { throw new gutil.PluginError('webpack-build', err); }
        gutil.log('[webpack-build]', stats.toString({
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
            .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('jekyll-build', () => {
    const jekyll = child.spawn('bundler', ['exec', 'jekyll', 'build']);

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
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
gulp.task('build', ['css', 'webpack', 'jekyll-build']);