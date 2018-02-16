var gulp        = require('gulp');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var plumber     = require('gulp-plumber');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var gcmq        = require('gulp-group-css-media-queries');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

var config = {
    css: {
        asset_dir: 'assets/sass',
        index: 'assets/sass/main.scss',
        dest: 'dist/css',
        glob: [
            'assets/**/*.scss',
            'assets/**/*.sass'
        ]
    },
    js: {
        asset_dir: 'assets/js',
        index: 'assets/js/app.js',
        dest: 'dist/js',
        glob: [
            'assets/js/**/*.js',
            'assets/js/*.js',
        ]
    },
    content: {
        base_dir: '_site',
        glob: [
            '_includes/**/*.html',
            '_layouts/**/*.html',
            '_posts/**/*.md',
            '_posts/**/*.markdown',
            './*.md',
            './*.markdown',
            '_pages/**/*.md',
            '_pages/**/*.markdown',
            '_config.yml',
        ]
    }
};

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    browserSync.notify({ jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build' });
    return cp.spawn( jekyll , ['build'], {stdio: 'inherit'})
        .on('close', done);
});

/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['assets', 'jekyll-build'], function() {
    browserSync({ server: { baseDir: config.content.base_dir } });
});

/**
 * Group asset-based tasks into one task
 */
gulp.task('assets', ['sass', 'scripts']);

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */
gulp.task('sass', function () {
    return gulp.src(config.css.index)
        .pipe(plumber())
        .pipe(sass({
            includePaths: config.css.asset_dir,
            onError: browserSync.notify
        }))
        .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gcmq())
        .pipe(gulp.dest(config.content.base_dir + "/" + config.css.dest))
        .pipe(gulp.dest(config.css.dest))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function(){
    return browserify(config.js.index)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('_site/' + config.js.dest))
        .pipe(gulp.dest(config.js.dest))
        .pipe(browserSync.reload({ stream: true }));
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch(config.css.glob, ['sass']);
    gulp.watch(config.js.glob, ['scripts']);
    gulp.watch(config.content.glob, ['jekyll-rebuild']);
});

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);