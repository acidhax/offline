#!/bin/bash
source /emsdk-portable/emsdk_env.sh
cd ffmpeg.js
emconfigure ./configure
# emmake make -j8
make ffmpeg-worker-mp4.js
# emmake make install