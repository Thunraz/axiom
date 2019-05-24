class Convolution {
    // ##############################################
    // # Public functions ###########################
    // ##############################################

    static convolve(imageData, context, width, matrix, divisor, offset) {
        const m = [].concat(matrix[0], matrix[1], matrix[2]);
        
        // No divisor? Sum up the matrix values
        const div = divisor || m.reduce((a, b) => a + b) || 1;

        const oldData   = imageData;
        const oldPixels = oldData.data;

        const newData   = context.createImageData(oldData);
        const newPixels = newData.data;

        const len = newPixels.length;
        let   res = 0;
        const w   = width;
        
        for (let i = 0; i < len; i++) {
            if ((i + 1) % 4 === 0) {
                newPixels[i] = oldPixels[i];
            } else {
                res = 0;
                const these = [
                    oldPixels[i - w * 4 - 4] || oldPixels[i],
                    oldPixels[i - w * 4]     || oldPixels[i],
                    oldPixels[i - w * 4 + 4] || oldPixels[i],
                    oldPixels[i - 4]         || oldPixels[i],
                    oldPixels[i],
                    oldPixels[i + 4]         || oldPixels[i],
                    oldPixels[i + w * 4 - 4] || oldPixels[i],
                    oldPixels[i + w * 4]     || oldPixels[i],
                    oldPixels[i + w * 4 + 4] || oldPixels[i],
                ];

                for (let j = 0; j < 9; j++) {
                    res += these[j] * m[j];
                }

                res /= div;
                if (offset) {
                    res += offset;
                }
                newPixels[i] = res;
            }
        }

        return newData;
    } // convolve

    // ##############################################

    static meanRemoval(imageData, context, width, divisor, offset) {
        const matrix = [
            [-1, -1, -1],
            [-1,  9, -1],
            [-1, -1, -1],
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static sharpen(imageData, context, width, divisor, offset) {
        const matrix = [
            [0,  -2,  0],
            [-2, 11, -2],
            [0,  -2,  0],
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static blur(imageData, context, width, divisor, offset) {
        const matrix = [
            [1,  2,  1],
            [2,  4,  2],
            [1,  2,  1],
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static emboss(imageData, context, width, divisor, offset) {
        const matrix = [
            [2,  0,  0],
            [0, -1,  0],
            [0,  0, -1],
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static embossSubtle(imageData, context, width, divisor, offset) {
        const matrix = [
            [1,  1, -1],
            [1,  3, -1],
            [1, -1, -1],
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static edgeDetect(imageData, context, width, divisor, offset) {
        const matrix = [
            [1,  1,  1],
            [1, -7,  1],
            [1,  1,  1],
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static edgeDetect2(imageData, context, width, divisor, offset) {
        const matrix = [
            [-5, 0, 0],
            [0,  0, 0],
            [0,  0, 5],
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################
}

export default Convolution;
