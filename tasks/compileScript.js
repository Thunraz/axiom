const eslint = require('gulp-eslint');
const gulp   = require('gulp');
const ru     = require('rollup').rollup;
const pug    = require('rollup-plugin-pug');

let cache;

function copyDependencies(done) {
    const dependencies = [
        './node_modules/three/build/three.js',
        './node_modules/three/examples/js/controls/OrbitControls.js',
    ];

    if (dependencies.length === 0) {
        return done();
    }

    return gulp
        .src(dependencies)
        .pipe(gulp.dest('./dist/'));
}

function build() {
    return ru({
        input:    'src/js/axiom.js',
        plugins:  [pug()],
        cache,
        external: [],
    }).then(bundle => bundle.write({
        file:      'dist/app.js',
        sourcemap: true,
        format:    'iife',
        globals:   { },
    }));
}

function lint() {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['src/js/**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
}

export default gulp.series(
    copyDependencies,
    build,
    lint,
);
