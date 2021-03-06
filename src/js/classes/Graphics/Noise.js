import * as THREE from 'three';

import Grad      from './Grad';
import NoiseType from '../../enums/NoiseType';

import config from '../../config';

class Noise {
    // Based on noisejs by Joseph Gentle (https://github.com/josephg/noisejs)

    // ##############################################
    // # Constructor ################################
    // ##############################################

    constructor(width, height, scale, noiseType, convolution) {
        this.width       = width;
        this.height      = height;
        this.scale     = scale;
        this.noiseType   = noiseType || NoiseType.Perlin2D;
        this.convolution = convolution;

        this.grad3 = [
            new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
            new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
            new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1),
        ];

        this.p = [
            151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30,
            69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94,
            252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136,
            171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229,
            122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
            63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116,
            188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202,
            38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28,
            42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
            172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
            246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145,
            235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115,
            121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141,
            128, 195, 78, 66, 215, 61, 156, 180,
        ];

        // To remove the need for index wrapping, double the permutation table length
        this.perm  = new Array(512);
        this.gradP = new Array(512);

        // Skewing and unskewing factors for 2, 3, and 4 dimensions
        this.F2 = 0.5 * (Math.sqrt(3) - 1);
        this.G2 = (3 - Math.sqrt(3)) / 6;

        this.F3 = 1 / 3;
        this.G3 = 1 / 6;

        this.seed(0);
    }

    // ##############################################

    seed(s) {
        let seed = s;
        if (seed > 0 && seed < 1) {
            // Scale the seed out
            seed *= 65536;
        }

        seed = Math.floor(seed);
        if (seed < 256) {
            seed |= seed << 8;
        }

        for (let i = 0; i < 256; i++) {
            let v = 0;
            if (i & 1) {
                v = this.p[i] ^ (seed & 255);
            } else {
                v = this.p[i] ^ ((seed >> 8) & 255);
            }

            this.perm[i]       = v;
            this.perm[i + 256] = v;

            this.gradP[i]       = this.grad3[v % 12];
            this.gradP[i + 256] = this.grad3[v % 12];
        }
    }

    // ##############################################

    // eslint-disable-next-line class-methods-use-this
    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // ##############################################

    // eslint-disable-next-line class-methods-use-this
    lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    // ##############################################

    simplex2d(xin, yin) {
        // Noise contributions from the three corners
        let n0 = 0;
        let n1 = 0;
        let n2 = 0;
        
        // Skew the input space to determine which simplex cell we're in
        // Hairy factor for 2D
        const s = (xin + yin) * this.F2;
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        
        const t = (i + j) * this.G2;
        
        // The x,y distances from the cell origin, unskewed.
        const x0 = xin - i + t;
        const y0 = yin - j + t;
        
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.

        // Offsets for second (middle) corner of simplex in (i,j) coords
        let i1 = 0;
        let j1 = 0;
        
        if (x0 > y0) {
            // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 1;
            j1 = 0;
        } else {
            // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            i1 = 0;
            j1 = 1;
        }

        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6

        // Offsets for middle corner in (x,y) unskewed coords
        const x1 = x0 - i1 + this.G2;
        const y1 = y0 - j1 + this.G2;
        // Offsets for last corner in (x,y) unskewed coords
        const x2 = x0 - 1 + 2 * this.G2;
        const y2 = y0 - 1 + 2 * this.G2;
        
        // Work out the hashed gradient indices of the three simplex corners
        i &= 255;
        j &= 255;

        const gi0 = this.gradP[i +      this.perm[j]];
        const gi1 = this.gradP[i + i1 + this.perm[j + j1]];
        const gi2 = this.gradP[i + 1  + this.perm[j +  1]];
        
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) {
            n0 = 0;
        } else {
            t0 *= t0;
            // (x,y) of grad3 used for 2D gradient
            n0 = t0 * t0 * gi0.dot2(x0, y0);
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }

        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    }

    // eslint-disable-next-line class-methods-use-this
    adjustContrast(imageData, contrast) {
        const [data] = imageData.data;
        const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < data.length; i += 4) {
            data[i]     = factor * (data[i]     - 128) + 128;
            data[i + 1] = factor * (data[i + 1] - 128) + 128;
            data[i + 2] = factor * (data[i + 2] - 128) + 128;
        }

        return imageData;
    }

    // ##############################################

    perlin2d(xIn, yIn) {
        let x = xIn;
        let y = yIn;

        // Find unit grid cell containing point
        let X = Math.floor(x);
        let Y = Math.floor(y);

        // Get relative xy coordinates of point within that cell
        x = xIn - X;
        y = yIn - Y;

        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X &= 255;
        Y &= 255;

        // Calculate noise contributions from each of the four corners
        /* eslint-disable computed-property-spacing, space-in-parens */
        const n00 = this.gradP[X +     this.perm[Y    ]].dot2(x,     y    );
        const n01 = this.gradP[X +     this.perm[Y + 1]].dot2(x,     y - 1);
        const n10 = this.gradP[X + 1 + this.perm[Y    ]].dot2(x - 1, y    );
        const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
        /* eslint-enable computed-property-spacing, space-in-parens */
        
        // Compute the fade curve value for x
        const u = this.fade(x);

        // Interpolate the four results
        return this.lerp(
            this.lerp(n00, n10, u),
            this.lerp(n01, n11, u),
            this.fade(y),
        );
    }

    // ##############################################
    // # Public functions ###########################
    // ##############################################

    get Texture() {
        this.canvas        = document.createElement('canvas');
        this.canvas.width  = this.width;
        this.canvas.height = this.height;

        this.context  = this.canvas.getContext('2d');
        this.context.fillStyle = '#ffffff';
        this.context.fillRect(0, 0, this.width, this.height);
        let imageData = this.context.getImageData(0, 0, this.width, this.height);

        for (let index, x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                // Index of the pixel in the array
                index = (x + y * this.width) * 4;

                // normalize
                const x1    = x / this.width;
                const y1    = y / this.height;
                let noise = 0;
                
                switch (this.noiseType) {
                case NoiseType.Perlin2D:
                    noise = (this.perlin2d(this.scale * x1, this.scale * y1) + 1) / 2;
                    break;
                case NoiseType.Simplex2D:
                    noise = (this.simplex2d(this.scale * x1, this.scale * y1) + 1) / 2;
                    break;
                default:
                    break;
                }

                noise = Math.round(noise * 255);

                imageData.data[index + 0] = noise;
                imageData.data[index + 1] = noise;
                imageData.data[index + 2] = noise;
            }
        }

        if (this.convolution) {
            imageData = this.convolution(imageData, this.context, this.width, 1);
        }

        imageData = this.adjustContrast(imageData, -200);

        this.context.putImageData(imageData, 0, 0);

        const texture       = new THREE.Texture(this.canvas);
        texture.anisotropy  = config.maxAnisotropy;
        texture.needsUpdate = true;

        return texture;
    }

    // ##############################################
}

export default Noise;
