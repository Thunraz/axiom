'use strict';
(function() {
    requirejs.config({
        paths: {
            'three': 'lib/three',
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