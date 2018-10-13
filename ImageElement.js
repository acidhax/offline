class ImageElement {
    constructor(file) {
        this.file = file

        this.element = $("div").loadTemplate("#image-element", {
            
        })
    }
}