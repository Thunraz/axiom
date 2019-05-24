import gulp              from 'gulp';

// eslint-disable-next-line sort-imports
import cleanTask         from './tasks/clean';
import compileMarkupTask from './tasks/compileMarkup';
import compileScriptTask from './tasks/compileScript';
import compileStyleTask  from './tasks/compileStyle';
import copyAssetsTask    from './tasks/copyAssets';
import publishTask       from './tasks/publish';
import serverTask        from './tasks/server';
import watchTask         from './tasks/watch';

const clean         = done => cleanTask(done);

const compileMarkup = done => compileMarkupTask(done);
const compileScript = done => compileScriptTask(done);
const compileStyle  = done => compileStyleTask(done);

const copyAssets    = done => copyAssetsTask(done);
const server        = done => serverTask(done);
const watch         = done => watchTask(done);
const publish       = done => publishTask(done);

const compile = gulp.series(
    clean,
    gulp.parallel(
        compileMarkup,
        compileScript,
        compileStyle,
        copyAssets,
    ),
    publish,
);
compile.description = 'compile all sources';

const serve = gulp.series(compile, server);
serve.description = 'serve compiled source on local server at port 3000';

const defaultTasks = gulp.parallel(serve, watch);

export {
    clean,
    compile,
    
    watch,
};
  
export default defaultTasks;
