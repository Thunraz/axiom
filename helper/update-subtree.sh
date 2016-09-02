#!/bin/sh

PREFIX=src/js/lib/three
REPOSITORY=https://github.com/mrdoob/three.js.git
TAG=r80

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
(cd $DIR/.. && git subtree add --prefix $PREFIX $REPOSITORY $TAG --squash)