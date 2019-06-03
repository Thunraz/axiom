const colors = require('ansi-colors');
const http   = require('http');
const log    = require('fancy-log');
const path   = require('path');
const st     = require('st');

export default (done) => {
    const port = process.env.GULP_PORT || 8080;

    log('Starting server on port', colors.magenta(port));
    
    http.createServer(
        st({
            path:  path.join(__dirname, '..', 'dist'),
            index: 'index.html',
            cache: false,
        }),
    ).listen(port);

    done();
};
