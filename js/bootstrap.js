'use strict';
(function() {
    requirejs.config({
        paths: {
            'three': 'lib/three.min'
        },

        shim: {
            three: {
                exports: 'THREE'
            }
        }
    });

    require(['app/3']);
})();