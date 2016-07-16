'use strict';
(function() {
    requirejs.config({
        paths: {
            'three'            : 'lib/three',
            'OrbitControls'    : 'lib/OrbitControls',
            'TrackballControls': 'lib/TrackballControls',
            'stats'            : 'lib/stats.min'
        },

        shim: {
            'three': {
                exports: 'THREE'
            },
            
            'OrbitControls': {
                deps: ['three'],
                exports: 'OrbitControls'
            },
            
            'TrackballControls': {
                deps: ['three'],
                exports: 'TrackballControls'
            },

            'stats': {
                exports: 'Stats'
            }
        }
    });

    require(['app/axiom']);
})();