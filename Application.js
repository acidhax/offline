const { BehaviorSubject, of, fromEvent, from } = rxjs;
const { map, filter, flatMap, merge } = rxjs.operators;

class Application {
    constructor(form, workerSpace) {
        this.form = form
        this.workerSpace = workerSpace
        this.workers = new BehaviorSubject([])
        this.setupHandlers()

        this.setupWorkerSpace()
    }

    setupWorkerSpace() {
        this.workers.pipe(
            flatMap((event) => {
                return from(event)
            })
            ,filter(event => {
                console.log("event", event)
                return event.element == null
            }),
            flatMap(worker => {
                worker.element = $('<div class="worker"></div>')
                return worker.state()
            })
        )
        .subscribe((worker) => {
            console.log("OnNext", worker)
            this.workerSpace.append(worker.element)
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

            let myworker = new VideoWorker(droppedFiles[0], $('<div class="worker"></div>'))
            let newArray = this.workers.value
            newArray.push(myworker)
            this.workers.next(newArray)
            
            myworker.addListener('progress', event => {
              console.log(event)
            })
            myworker.addListener('paletteGenerateStarted', event => {
              // palette started, show palette generating mode
              this.form.addClass('palette-generating');
            })
            myworker.addListener('palette', event => {
              // palette created, set palette mode
              this.form.addClass('palette-created');
            })
            myworker.addListener('createStarted', event => {
              // create started, set progress mode
              this.form.addClass('gif-generating');
            })
            myworker.addListener("create", msg => {
                this.form.addClass('gif-created');
                console.log(msg)
                var myArray = msg.data; //= your data in a UInt8Array
                var blob = new Blob([myArray], {'type': 'image/gif'});
                var url = URL.createObjectURL(blob);
                var image = document.createElement('img');
                image.src = url;
                document.body.appendChild(image)
                let fileReader = new FileReader()
                fileReader.readAsDataURL(blob)
                var existingCache = JSON.parse(localStorage.getItem("imageCache"))
                console.log(existingCache)
                fileReader.onload = evt => {
                    var result = evt.target.result;
                    existingCache.push(result)
                    localStorage.setItem("imageCache", JSON.stringify(existingCache))
                }
            })
            myworker.addListener("onReady", ready => {
              console.log(ready)
            })
          });
    }
}