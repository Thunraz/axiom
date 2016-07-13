'use strict';
define(function() {
    return class NoiseType {
        static get Perlin2D()  { return 0; }
        static get Perlin3D()  { return 1; }
        static get Simplex2D() { return 2; }
        static get Simplex3D() { return 3; }
    }
});