'use strict';
define(
    ['three'],
    function(THREE) {
        return class PerlinNoise {
            
            // ##############################################
            // # Public functions ###########################
            // ##############################################

            Noise(x, y) {
                return this._noise(x, y, 0.8);
            }

            NoiseTexture(w, h) {
                let canvas    = document.createElement('canvas');
                canvas.width  = w;
                canvas.height = h;

                let context   = canvas.getContext('2d');
                context.fillStyle = '#0000ff';
                context.fillRect(0, 0, w, h);

                let imageData = context.getImageData(0, 0, w, h);
                for (let idx, x = 0; x < w; x++) {
                    for (let y = 0; y < h; y++) {
                        // Index of the pixel in the array
                        idx = (x + y * w) * 4;

                        // The RGB values
                        let r = imageData.data[idx + 0];
                        let g = imageData.data[idx + 1];
                        let b = imageData.data[idx + 2];
            
                        //let pixel = this.Noise(x, y);

                        let pixel = [
                            Math.random() * 255,
                            Math.random() * 255,
                            Math.random() * 255
                        ];

                        if(!this.counter) {
                            this.counter = 0;
                        }

                        if(this.counter < 100) {
                            //console.log(pixel[0]);
                            this.counter++;
                        }

                        imageData.data[idx + 0] = pixel[0];
                        imageData.data[idx + 1] = pixel[1];
                        imageData.data[idx + 2] = pixel[2];
                    }
                }
                context.putImageData(imageData, 0, 0);
                console.log(context);

                let texture         = new THREE.Texture(canvas);
                texture.needsUpdate = true;

                return texture;
            }

            // ##############################################
            // # Private functions ##########################
            // ##############################################

            _noise(x, y, z) {
                let permutation = [
                    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
                    8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,
                    35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,
                    134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,
                    55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,
                    169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,
                    250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,
                    189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,
                    172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,
                    228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
                    107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,
                    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
                ];

                let p = new Array(512);

                for(let i = 0; i < 256; i++) {
                    p[256 + i] = p[i] = permutation[i];

                    // Find unit cube that contains point
                    let X = Math.floor(x) & 0xff;
                    let Y = Math.floor(y) & 0xff;
                    let Z = Math.floor(z) & 0xff;

                    // Find relative x, y, z of point in cube
                    x -= Math.floor(x);
                    y -= Math.floor(y);
                    z -= Math.floor(z);

                    // Compute fade curves for each of x, y, z
                    let u = this._fade(x);
                    let v = this._fade(y);
                    let w = this._fade(z);

                    // Hash coordinates of the 8 cube corners
                    let A = p[X    ] + Y, AA = p[A] + Z, AB = p[A + 1] + Z,
                        B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;

                    // and add blended results from 8 corners of cube
                    return this._scale(
                        this._lerp(
                            w,
                            this._lerp(
                                v,
                                this._lerp(u, this._grad(p[AA], x, y,     z), this._grad(p[BA], x - 1, y,     z)),
                                this._lerp(u, this._grad(p[AB], x, y - 1, z), this._grad(p[BB], x - 1, y - 1, z))
                            ),
                            this._lerp(
                                v,
                                this._lerp(u, this._grad(p[AA + 1], x, y, z - 1),     this._grad(p[BA + 1], x - 1, y,     z - 1 )),
                                this._lerp(u, this._grad(p[AB + 1], x, y - 1, z - 1), this._grad(p[BB + 1], x - 1, y - 1, z - 1))
                            )
                        )
                    );
                }
            }

            // ##############################################

            _fade(t) {
                return t * t * t * (t * (t * 6 - 15) + 10);
            }

            // ##############################################

            _lerp(t, a, b) {
                return a + t * (b - a);
            }

            // ##############################################

            _grad(hash, x, y, z) {
                // Convert lo 4 bits of hash code
                // into 12 gradient directions
                let h = hash & 15;

                let u = h < 8 ? x : y;
                let v = h < 4 ? y : h == 12 || h == 14 ? x : z;

                return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
            }

            // ##############################################

            _scale(n) {
                return (1 + n) / 2;
            }
        }
    }
);