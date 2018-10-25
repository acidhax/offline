#!/bin/bash
source /emsdk-portable/emsdk_env.sh
cd zlib
emconfigure ./configure --prefix="/ffmpeg.js/build/lame/dist"
emmake make
emmake make install