class StartScreen extends ViewBase {
    public constructor(aCanvas: HTMLCanvasElement) {
        super(aCanvas);
    }
    public Render() : void
    {
        this.d_canvasHelper.Clear();
        this.d_canvasHelper.writeTextCenterToCanvas("StartScreen",40);
    }
}
