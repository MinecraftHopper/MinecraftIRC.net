const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');

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

gulp.task('jekyll', () => {
    const jekyll = child.spawn('bundler', ['exec', 'jekyll', 'build',
        '--incremental-rebuild'
    ]);

    const jekyllLogger = (buffer) => {
        buffer.toString()
            .split(/\n/)
            .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('jekyll', () => {
    const jekyll = child.spawn('jekyll', ['build']);

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

    gulp.watch(cssFiles, ['css']);
});

gulp.task('default', ['css', 'jekyll', 'serve']);
gulp.task('build', ['css', 'jekyll-build']);