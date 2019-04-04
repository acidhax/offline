const { BehaviorSubject, of, fromEvent, from, combineLatest } = rxjs;
const { map, filter, flatMap, merge } = rxjs.operators;

class Application {
    constructor(form, workerSpace) {
        this.form = form
        this.workerSpace = workerSpace
        // this.workerSpace.append($("<div></div>").loadTemplate("#encoding-template", {}))
        this.setupHandlers()
    }

    setupWorker(worker) {
        this.workerSpace.append(worker.element)
        worker.element.loadTemplate("#processing-template", {
            filename: worker.file.name
        })

        worker.addListener('progress', progress => {
            if (worker.state == State.generatingPalette) {
                // state updates are useless
            } else if (worker.state == State.generatingImage) {
                // state updates hell yes
            }
        })

        combineLatest(worker.duration, worker.progress)
            .subscribe(([duration, progress]) => {
                let percentage = Math.min((progress / duration) * 100, 100)
                // console.log(worker.state == State.generatingPalette, worker.state == State.generatingImage, duration, progress, percentage)
                if (worker.state == State.generatingPalette) {
                    // state updates are useless
                } else if (worker.state == State.generatingImage) {
                    // state updates yesh
                    console.log("Encoding progress", progress)
                    // worker.element.remove()
                    worker.element.loadTemplate($("#encoding-template"), {
                        filename: worker.file.name,
                        percentage: percentage
                    })
                    // console.log("worker.element", worker.element)
                    // $(".completed-conversions").append(worker.element)
                    worker.element.find(".meter span").css("width", percentage+"%");
                }
            })

        worker.addListener('duration', progress => {
            
        })

        worker.addListener('paletteGenerateStarted', event => {
            // palette started, show palette generating mode
            worker.element.addClass('palette-generating');
        })
        worker.addListener('palette', event => {
            // palette created, set palette mode
            worker.element.removeClass('palette-generating');
            worker.element.addClass('palette-created');
            worker.element.loadTemplate("#processed-template", {
                filename: worker.file.name
            })
        })
        worker.addListener('createStarted', event => {
            // create started, set progress mode
            worker.element.removeClass('palette-created');
            worker.element.addClass('gif-generating');
        })

        worker.addListener("create", msg => {
            worker.element.removeClass('gif-generating');
            worker.element.addClass('gif-created');
            console.log(msg)
            var myArray = msg.data; // is a UInt8Array
            var blob = new Blob([myArray], {'type': 'image/gif'});
            var url = URL.createObjectURL(blob);
            worker.element.remove()
            worker.element.loadTemplate("#image-element", {
                image: url,
                filename: worker.file.name
            })
            $(".completed-conversions").append(worker.element)
        })
    }

    setupHandlers() {
        this.form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
          })
          .on('dragover dragenter', () => {
            this.form.addClass('is-dragover');
          })
          .on('dragleave dragend drop', () => {
            this.form.removeClass('is-dragover');
          })
          .on('drop', (e) => {
            var droppedFiles = e.originalEvent.dataTransfer.files;
            console.log(droppedFiles)
            for (let i in droppedFiles) {
                if (droppedFiles[i] instanceof Blob == false) {
                    continue
                }
                let file = droppedFiles[i]
                console.log(file)
                this.setupWorker(new VideoWorker(file, $('<div class="worker"></div>')))
            }
          });
    }
}