#!/usr/bin/env python

import cv2
import argparse
import os

parser = argparse.ArgumentParser(description='Cut up a panoramic image into single images')
parser.add_argument('-i', help='The input file')
parser.add_argument('-o', help='The output directory')
parser.add_argument('-p', help='A prefix to use for the output files')
args = parser.parse_args()

prefix = args.p or ''
output_dir = args.o or '.'

img = cv2.imread(args.i)

def write_image(f, img):
    file_name = "%s%s.png" % (prefix, f)
    cv2.imwrite(os.path.join(output_dir, file_name), img)

# Top
py = img[   0:1024, 1024:2048]
write_image("py", py)
# Bottom
ny = img[2048:3072, 1024:2048]
write_image("ny", ny)
# Left
nx = img[1024:2048,    0:1024]
write_image("nx", nx)
# Front
pz = img[1024:2048, 1024:2048]
write_image("pz", pz)
# Right
px = img[1024:2048, 2048:3072]
write_image("px", px)
# Back
nz = img[1024:2048, 3072:4096]
write_image("nz", nz)

#print "%snz.png" % prefix

#imwrite(