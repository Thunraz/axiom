'use strict';
(function() {
    requirejs.config({
        paths: {
            'three': 'lib/three.min',
            'stats': 'lib/stats.min'
        },

        shim: {
            'three': {
                exports: 'THREE'
            },
            'stats': {
                exports: 'Stats'
            }
        }
    });

    require(['app/axiom']);
})();