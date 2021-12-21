class ViewBase {
    constructor(canvasId) {
        this.d_canvasHelper = CanvasHelper.Instance(canvasId);
    }
}
class CanvasHelper {
    constructor(aCanvas) {
        this.d_canvas = aCanvas;
        this.d_canvas.width = window.innerWidth;
        this.d_canvas.height = window.innerHeight;
        this.d_context = this.d_canvas.getContext('2d');
    }
    static Instance(aCanvas = null) {
        if (this.s_instance == null) {
            if (aCanvas == null) {
                throw new DOMException("The first time the instance is created a Canvas must be given.");
            }
            this.s_instance = new CanvasHelper(aCanvas);
        }
        return this.s_instance;
    }
    writeTextToCanvas(text, fontSize, xCoordinate, yCoordinate, color = "white", alignment = "center") {
        this.d_context.font = `${fontSize}px Tahoma`;
        this.d_context.fillStyle = color;
        this.d_context.textAlign = alignment;
        this.d_context.fillText(text, xCoordinate, yCoordinate);
    }
    writeTextCenterToCanvas(text, fontSize, color = "white", alignment = "center") {
        const horizontalCenter = this.GetWidth() / 2;
        const verticalCenter = this.GetHeight() / 2;
        this.d_context.font = `${fontSize}px Tahoma`;
        this.d_context.fillStyle = color;
        this.d_context.textAlign = alignment;
        this.d_context.fillText(text, horizontalCenter, verticalCenter);
    }
    Clear() {
        this.d_context.clearRect(0, 0, this.GetWidth(), this.GetHeight());
    }
    GetHeight() {
        return this.d_canvas.height;
    }
    GetWidth() {
        return this.d_canvas.width;
    }
}
CanvasHelper.s_instance = null;
class StartScreen extends ViewBase {
    constructor(aCanvas) {
        super(aCanvas);
    }
    Render() {
        this.d_canvasHelper.Clear();
        this.d_canvasHelper.writeTextCenterToCanvas("StartScreen", 40);
    }
}
class SecondScreen extends ViewBase {
    constructor(aCanvas) {
        super(aCanvas);
    }
    Render() {
        this.d_canvasHelper.Clear();
        this.d_canvasHelper.writeTextCenterToCanvas("SecondScreen", 40);
    }
}
//# sourceMappingURL=app.js.map