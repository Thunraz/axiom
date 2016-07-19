'use strict';
(function() {
    requirejs.config({
        baseUrl: 'src/classes',

        paths: {
            'three'         : '../../lib/three',
            'OrbitControls' : '../../lib/OrbitControls',
            'stats'         : '../../lib/stats.min',
            'config'        : '../config',
            'inputHandler'  : '../InputHandler',

            'enums/Constants'               : '../enums/Constants',
            'enums/AstronomicalObjectType'  : '../enums/AstronomicalObjectType',
            'enums/NoiseType'  : '../enums/NoiseType'
        },

        shim: {
            'three': {
                exports: 'THREE'
            },
            
            'OrbitControls': {
                deps: ['three'],
                exports: 'OrbitControls'
            },

            'stats': {
                exports: 'Stats'
            }
        }
    });

    require(['../axiom']);
})();