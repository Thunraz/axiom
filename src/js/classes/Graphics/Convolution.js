export class Convolution {

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    static convolve(imageData, context, width, matrix, divisor, offset) {
        let m = [].concat(matrix[0], matrix[1], matrix[2]);
        if(!divisor) {
            // No divisor? Sum up the matrix values
            divisor = m.reduce(function(a, b) { return a + b; }) || 1;
        }

        let oldData   = imageData,
            oldPixels = oldData.data;

        let newData   = context.createImageData(oldData),
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

    static meanRemoval(imageData, context, width, divisor, offset) {
        let matrix = [
            [-1, -1, -1],
            [-1,  9, -1],
            [-1, -1, -1]
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static sharpen(imageData, context, width, divisor, offset) {
        let matrix = [
            [0,  -2,  0],
            [-2, 11, -2],
            [0,  -2,  0]
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static blur(imageData, context, width, divisor, offset) {
        let matrix = [
            [1,  2,  1],
            [2,  4,  2],
            [1,  2,  1]
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static emboss(imageData, context, width, divisor, offset) {
        let matrix = [
            [2,  0,  0],
            [0, -1,  0],
            [0,  0, -1]
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static embossSubtle(imageData, context, width, divisor, offset) {
        let matrix = [
            [1,  1, -1],
            [1,  3, -1],
            [1, -1, -1]
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static edgeDetect(imageData, context, width, divisor, offset) {
        let matrix = [
            [1,  1,  1],
            [1, -7,  1],
            [1,  1,  1]
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################

    static edgeDetect2(imageData, context, width, divisor, offset) {
        let matrix = [
            [-5, 0, 0],
            [0,  0, 0],
            [0,  0, 5]
        ];

        return Convolution.convolve(imageData, context, width, matrix, divisor, offset || 0);
    }

    // ##############################################
}

export default Convolution;