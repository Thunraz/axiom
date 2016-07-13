'use strict';
define(
    ['three'],
    function(THREE) {
        return class PerlinNoise {

            // ##############################################
            // # Constructor ################################
            // ##############################################

            constructor() {
                this.p = [
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

                for (let i = 0; i < 256 ; i ++) {
                    this.p[256 + i] = this.p[i];
                }
            }

            // ##############################################
            // # Private functions ##########################
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
                let h = hash & 15;
                let u = h < 8 ? x : y, v = h < 4 ? y : h == 12 || h == 14 ? x : z;
                return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
            }

            // ##############################################

            _noise(x, y, z) {
                let floorX = ~~x,
                    floorY = ~~y,
                    floorZ = ~~z;

                let X = floorX & 255,
                    Y = floorY & 255,
                    Z = floorZ & 255;

                x -= floorX;
                y -= floorY;
                z -= floorZ;

                let xMinus1 = x - 1,
                    yMinus1 = y - 1,
                    zMinus1 = z - 1;

                let u = this._fade(x),
                    v = this._fade(y),
                    w = this._fade(z);

                let A = this.p[X    ] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z,
                    B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;

                return this._lerp(w, this._lerp(v, this._lerp(u, this._grad(this.p[AA], x, y, z),
                            this._grad(this.p[BA], xMinus1, y, z)),
                        this._lerp(u, this._grad(this.p[AB], x, yMinus1, z),
                            this._grad(this.p[BB], xMinus1, yMinus1, z))),
                    this._lerp(v, this._lerp(u, this._grad(this.p[AA + 1], x, y, zMinus1),
                            this._grad(this.p[BA + 1], xMinus1, y, z - 1)),
                        this._lerp(u, this._grad(this.p[AB + 1], x, yMinus1, zMinus1),
                            this._grad(this.p[BB + 1], xMinus1, yMinus1, zMinus1))));
            }

            // ##############################################

            _adjustContrast(imageData, contrast) {
                let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

                for(let i = 0; i < imageData.data.length; i += 4)
                {
                    imageData.data[i    ] = factor * (imageData.data[i    ] - 128) + 128;
                    imageData.data[i + 1] = factor * (imageData.data[i + 1] - 128) + 128;
                    imageData.data[i + 2] = factor * (imageData.data[i + 2] - 128) + 128;
                }
                return imageData;
            }

            // ##############################################

            _convolve(imageData, width, matrix, divisor, offset) {
                let m = [].concat(matrix[0], matrix[1], matrix[2]);
                if(!divisor) {
                    // No divisor? Sum up the matrix values
                    divisor = m.reduce(function(a, b) { return a + b; }) || 1;
                }

                let oldData   = imageData,
                    oldPixels = oldData.data;

                let newData   = this.context.createImageData(oldData),
                    newPixels = newData.data;

                let len = newPixels.length,
                    res = 0,
                    w   = width;
                
                for (let i = 0; i < len; i++) {
                    if ((i + 1) % 4 === 0) {
                        newPixels[i] = oldPixels[i];
                        continue;
                    }
                
                    res = 0;
                    var these = [
                        oldPixels[i - w * 4 - 4] || oldPixels[i],
                        oldPixels[i - w * 4]     || oldPixels[i],
                        oldPixels[i - w * 4 + 4] || oldPixels[i],
                        oldPixels[i - 4]         || oldPixels[i],
                        oldPixels[i],
                        oldPixels[i + 4]         || oldPixels[i],
                        oldPixels[i + w * 4 - 4] || oldPixels[i],
                        oldPixels[i + w * 4]     || oldPixels[i],
                        oldPixels[i + w * 4 + 4] || oldPixels[i]
                    ];

                    for (var j = 0; j < 9; j++) {
                        res += these[j] * m[j];
                    }

                    res /= divisor;
                    if (offset) {
                        res += offset;
                    }
                    newPixels[i] = res;
                }

                return newData;
            }

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            NoiseTexture(w, h) {
                this.canvas        = document.createElement('canvas');
                this.canvas.width  = w;
                this.canvas.height = h;

                this.context  = this.canvas.getContext('2d');
                this.context.fillStyle = '#ffffff';
                this.context.fillRect(0, 0, w, h);
                let imageData = this.context.getImageData(0, 0, w, h);

                for (let idx, x = 0; x < w; x++) {
                    for (let y = 0; y < h; y++) {
                        // Index of the pixel in the array
                        idx = (x + y * w) * 4;
            
                        //let pixel = this.Noise(x, y);

                        let noise = this._noise(x, y, 0) * 255;

                        imageData.data[idx + 0] = noise;
                        imageData.data[idx + 1] = noise;
                        imageData.data[idx + 2] = noise;
                    }
                }

                //imageData = this._adjustContrast(imageData, 40);
                let matrix = [
                    [1, 2, 1],
                    [2, 4, 2],
                    [1, 2, 1]
                ];
                //imageData = this._convolve(imageData, w, matrix, 1/9, -255);
                this.context.putImageData(imageData, 0, 0);

                document.getElementById('debugStuff').appendChild(this.canvas);

                let texture         = new THREE.Texture(this.canvas);
                texture.needsUpdate = true;

                return texture;
            }

            // ##############################################
        };
    }
);