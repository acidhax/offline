import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

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