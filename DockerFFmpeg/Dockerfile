#Download base image ubuntu 16.04
FROM ubuntu:16.04
SHELL ["/bin/bash", "-c"]

RUN apt-get update
RUN apt-get -y install wget python git automake libtool build-essential cmake libglib2.0-dev closure-compiler

RUN wget https://s3.amazonaws.com/mozilla-games/emscripten/releases/emsdk-portable.tar.gz
RUN tar xzvf emsdk-portable.tar.gz
RUN ./emsdk-portable/emsdk update
RUN ./emsdk-portable/emsdk install emscripten-1.37.40
RUN ./emsdk-portable/emsdk install clang-e1.37.40-64bit
RUN ./emsdk-portable/emsdk install node-8.9.1-64bit
RUN ./emsdk-portable/emsdk activate clang-e1.37.40-64bit
RUN ./emsdk-portable/emsdk activate emscripten-1.37.40
RUN ./emsdk-portable/emsdk activate node-8.9.1-64bit
RUN source ./emsdk-portable/emsdk_env.sh

RUN git clone https://github.com/Kagami/ffmpeg.js.git
RUN cd ffmpeg.js && git submodule init && git submodule update --recursive
ADD Makefile ./ffmpeg.js/Makefile

RUN git clone https://github.com/emscripten-ports/zlib

ADD buildzlib.sh /
RUN chmod +x /buildzlib.sh
RUN /buildzlib.sh

ADD buildffmpeg.sh /
RUN chmod +x /buildffmpeg.sh
RUN /buildffmpeg.sh