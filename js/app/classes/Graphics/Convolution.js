'use strict';
define(
    [],
    function() {
        return class Convolution {

            // ##############################################
            // # Public functions ###########################
            // ##############################################

            static convolve(imageData, width, matrix, divisor, offset) {
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
            } // convolve

            // ##############################################

            static meanRemoval(imageData, width, divisor, offset) {
                let matrix = [
                    [-1, -1, -1],
                    [-1,  9, -1],
                    [-1, -1, -1]
                ];

                Convolution.convolve(imageData, width, matrix, divisor, offset || 0);
            }

            // ##############################################

            static sharpen(imageData, width, divisor, offset) {
                let matrix = [
                    [0,  -2,  0],
                    [-2, 11, -2],
                    [0,  -2,  0]
                ];

                Convolution.convolve(imageData, width, matrix, divisor, offset || 0);
            }

            // ##############################################

            static blur(imageData, width, divisor, offset) {
                let matrix = [
                    [1,  2,  1],
                    [2,  4,  2],
                    [1,  2,  1]
                ];

                Convolution.convolve(imageData, width, matrix, divisor, offset || 0);
            }

            // ##############################################

            static emboss(imageData, width, divisor, offset) {
                let matrix = [
                    [2,  0,  0],
                    [0, -1,  0],
                    [0,  0, -1]
                ];

                Convolution.convolve(imageData, width, matrix, divisor, offset || 0);
            }

            // ##############################################

            static embossSubtle(imageData, width, divisor, offset) {
                let matrix = [
                    [1,  1, -1],
                    [1,  3, -1],
                    [1, -1, -1]
                ];

                Convolution.convolve(imageData, width, matrix, divisor, offset || 0);
            }

            // ##############################################

            static edgeDetect(imageData, width, divisor, offset) {
                let matrix = [
                    [1,  1,  1],
                    [1, -7,  1],
                    [1,  1,  1]
                ];

                Convolution.convolve(imageData, width, matrix, divisor, offset || 0);
            }

            // ##############################################

            static edgeDetect2(imageData, width, divisor, offset) {
                let matrix = [
                    [-5, 0, 0],
                    [0,  0, 0],
                    [0,  0, 5]
                ];

                Convolution.convolve(imageData, width, matrix, divisor, offset || 0);
            }

            // ##############################################
        }
    }
)