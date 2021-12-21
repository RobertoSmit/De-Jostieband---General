abstract class ViewBase {
    protected readonly d_canvasHelper : CanvasHelper;
    protected constructor(canvasId: HTMLCanvasElement) {
//construct all canvas
        this.d_canvasHelper = CanvasHelper.Instance(canvasId);
    }
    public abstract Render() : void;
}