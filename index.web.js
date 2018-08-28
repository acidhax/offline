(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var stdout = "";
var stderr = "";
// var worker = new Worker('./ffmpeg-worker-mp4.js');
// worker.onmessage = e => {
//   const msg = e.data;
//   switch (msg.type) {
//     case 'ready':
//     console.log('ready')
//     worker.postMessage({type: "run", arguments: ["-codecs"]});
//       break;
//     case 'stdout':
//       console.log(`FFMPEG.js stdout: ${msg.data}`);
//       break;
//     case 'stderr':
//       console.log(`FFMPEG.js stderr: ${msg.data}`);
//       break;
//     case 'run':
//       console.log('running')
//       break;
//     case 'done':
//       console.log('done');
//       console.log(msg.data)
//       break;
//     case 'exit':
//       console.log('closed');
//       worker.terminate();
//       break;
//   }
// };

// worker.onerror = function(e) {
//   console.error(e)
// }

// window.worker = worker
},{}]},{},[1]);
