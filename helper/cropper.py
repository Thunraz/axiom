#!/usr/bin/env python

import argparse
import os

import cv2

def write_image(i, f, p, o):
    'writes image to file with prefix'
    file_name = "%s%s.png" % (p, f)
    cv2.imwrite(os.path.join(o, file_name), i)

def is_power2(num):
    'states if a number is a power of two'
    return num != 0 and ((num & (num - 1)) == 0)

parser = argparse.ArgumentParser(description='Cut up a panoramic image into single images')
parser.add_argument('-i', help='The input file')
parser.add_argument('-o', help='The output directory')
parser.add_argument('-p', help='A prefix to use for the output files')
args = parser.parse_args()

prefix = args.p or ''
output_dir = args.o or '.'

img = cv2.imread(args.i)
height, width, channels = img.shape

size = height / 3
if width / 4 != size:
    raise ValueError('Wrong image format: expected aspect ratio 4/3')

if not is_power2(size):
    raise ValueError('Wrong image format: face size must be power of two')



# Top
py = img[0:size, size:size * 2]
write_image(py, "py", prefix, output_dir)
# Bottom
ny = img[size * 2:size * 3, size:size * 2]
write_image(ny, "ny", prefix, output_dir)
# Left
nx = img[size:size * 2, 0:size]
write_image(nx, "nx", prefix, output_dir)
# Front
pz = img[size:size * 2, size:size * 2]
write_image(pz, "pz", prefix, output_dir)
# Right
px = img[size:size * 2, size * 2:size * 3]
write_image(px, "px", prefix, output_dir)
# Back
nz = img[size:size * 2, size * 3:size * 4]
write_image(nz, "nz", prefix, output_dir)