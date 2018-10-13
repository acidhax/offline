const { Subject } = rxjs

class TranscodingElement {
    constructor(worker) {
        this.worker = worker
        this.subject = new Subject()
        this.startListeningForEvents()
        this.element = $("<div></div>");
        this.loadTemplate($("#processing-template"), {
            filename: worker.file.name
        })
    }

    startListeningForEvents() {
        combineLatest(this.worker.duration, this.worker.progress)
            .subscribe(([duration, progress]) => {
                let percentage = Math.min((progress / duration) * 100, 100)
                this.subject.next(percentage)
            })

        this.worker.addListener("create", msg => {
            console.log(msg)
            this.file = msg.data
            this.subject.complete()
        })
    }

    stopListeningForEvents() {

    }
}