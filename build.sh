#!/bin/bash
set -e

sh build-site.sh SeaORM SeaORM
sh build-site.sh SeaORM-X SeaORM-X
sh build-site.sh Blog blog
sh build-site.sh Seaography Seaography
sh build-site.sh SeaStreamer SeaStreamer
