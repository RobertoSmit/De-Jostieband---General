class App
{
    //readonly attributes must be initialized in the constructor
    private readonly d_canvasHelper : CanvasHelper;
    private d_currentScreen : ViewBase;

    public constructor(canvasId: HTMLCanvasElement) {
        //construct all canvas
        this.d_canvasHelper = CanvasHelper.Instance(canvasId);

        // create initial screen.
        // this.ChangeView(new StartScreen(canvasId));
        //  this.ChangeView(new BackgroundScreen(canvasId));
        // this.ChangeView(new ParallaxScreen(canvasId));
        this.ChangeView(new PlayerScreen(canvasId));
    }

    private ChangeView = (aNewView : ViewBase): void => {
        this.d_currentScreen = aNewView;
        this.d_currentScreen.Render();
    }

}

// this will get a HTML element which needs to be cast to the right type.
let init = function () {
    console.log('function');
    const MyAwesomeGame = new App(<HTMLCanvasElement>document.getElementById('canvas'));
}

window.addEventListener('load',init);