const State = Object.freeze({
    initializing: Symbol("initializing"),
    idle: Symbol("idle"),
    generatingPalette: Symbol("generatingPalette"),
    generatingImage: Symbol("generatingImage"),
    complete: Symbol("complete")
});

class VideoWorker extends EventEmitter {
    constructor(file) {
        super()
        this.creatingPalette = false
        this.creatingGif = false
        this.file = file
        this.fileReader = new FileReader();
        
        this.worker = new Worker('./ffmpeg-worker-mp4.js');

        this.fileReader.onload = event => {
            this.fileData = new Uint8Array(this.fileReader.result)
            this.createPalette()
        };
        this.fileReader.readAsArrayBuffer(file);

        this.setupWorker()

        // this.state = new BehaviorSubject(State.idle)
        this.state = State.idle
        this.duration = new BehaviorSubject(0)
        this.progress = new BehaviorSubject(0)
        this.element = $("<div></div>")
    }

    onReady() {
        this.emitEvent("ready", ["reeeeady"])
    }

    onRunning() {

    }

    onDone(msg) {
        if (msg.MEMFS && msg.MEMFS.length == 1 && msg.MEMFS[0].name.indexOf("palette.png") > -1) {
            this.onPaletteCreated(msg)
          } else if (msg.MEMFS && msg.MEMFS.length == 1 && msg.MEMFS[0].name == "output.gif") {
            this.onCreatedGif(msg.MEMFS[0])
          }
    }

    onMessage(data) {

    }

    onError(data) {
        console.log(`FFMPEG.js stderr: ${data}`);
    }

    onProgress(event) {
        this.progress.next(ffTimestampToSeconds(event.time))
        this.emitEvent("progress", [ffTimestampToSeconds(event.time)])
    }

    setupWorker() {
        this.worker.onmessage = e => {
            const msg = e.data;
            switch (msg.type) {
              case 'ready':
                // console.log('ready')
                this.onReady(msg)
                break;
              case 'stdout':
                // console.log(`FFMPEG.js stdout: ${msg.data}`);
                this.onmessage(msg.data)
                break;
              case 'stderr': // ffmpeg prints to stderr, stdout is used for piping
                if (msg.data.indexOf("frame=") == 0) {
                    // console.log(parseProgressLine(msg.data))
                    var progress = parseProgressLine(msg.data)
                    if (progress) {
                        this.onProgress(progress)
                    }
                } else if (msg.data.indexOf("Duration:") > -1) {
                    let messages = msg.data.split(",")
                    let duration = messages[0].split("Duration:")
                    this.onDuration(duration[1].trim())
                }
                else {
                //   console.log(`FFMPEG.js stderr: ${msg.data}`);
                  this.onError(msg.data)
                }
                break;
              case 'run':
                console.log('running')
                this.onRunning()
                break;
              case 'done':
                console.log('done', msg.data);
                this.onDone(msg.data)
                break;
              case 'exit':
                console.log('closed');
                worker.terminate();
                break;
            }
          }; 
    }

    onDuration(duration) {
        if (duration != "N/A") {
            let seconds = ffTimestampToSeconds(duration)
            if (seconds) {
                this.duration.next(seconds)
                this.emitEvent("duration", [seconds])
            }
        }
    }

    createPalette() {
        this.state = State.generatingPalette
        this.creatingPalette = true
        this.emitEvent("paletteGenerateStarted")
        this.worker.postMessage({
            type: 'run',
            mounts: [{type: "MEMFS", opts: {root: "."}, mountpoint: "/data"}],
            MEMFS: [{name: "input", data: this.fileData}, {name: 'null', data: null}],
            arguments: [
                "-y",
                "-i",
                "input",
                "-vf",
                "fps=10,scale=320:-1:flags=lanczos,palettegen",
                "palette.png"
            ]
        });
    }

    createGif(paletteMemfs) {
        this.state = State.generatingImage
        this.creatingGif = true
        this.emitEvent("createStarted")
        this.worker.postMessage({
            type: 'run',
            mounts: [{type: "MEMFS", opts: {root: "."}, mountpoint: "/data"}],
            MEMFS: [{name: 'input', data: this.fileData}, {name: 'null', data: null}, paletteMemfs],
            arguments: [
                "-i",
                "input",
                "-i",
                "palette.png",
                "-filter_complex",
                "fps=10,scale=320:-1:flags=lanczos[x];[x][1:v]paletteuse",
                "output.gif"
            ]
        });
    }

    onPaletteCreated(msg) {
        this.creatingPalette = false
        this.emitEvent("palette", [msg.MEMFS[0].data])
        this.createGif(msg.MEMFS[0])
    }

    onCreatedGif(data) {
        this.state = State.complete
        this.creatingGif = false
        this.emitEvent("create", [data])
    }
}

function ffTimestampToSeconds(duration) {
    var a = duration.split(':'); // split it at the colons
    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

    return seconds
}