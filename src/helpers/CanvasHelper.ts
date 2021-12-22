class CanvasHelper {

    private readonly d_canvas : HTMLCanvasElement;
    private readonly d_context : CanvasRenderingContext2D;

    private static s_instance: CanvasHelper = null;

    public static Instance(aCanvas: HTMLCanvasElement = null): CanvasHelper {
        if (this.s_instance == null)
        {
            if (aCanvas == null)
            {
                throw new DOMException("The first time the instance is created a Canvas must be given.");
            }
            this.s_instance = new CanvasHelper(aCanvas);
        }
        return this.s_instance;
    }

    private constructor(aCanvas: HTMLCanvasElement) {
        this.d_canvas = aCanvas;
        this.d_canvas.width = window.innerWidth; // add /2 to allow two games side-by-side horizontal
        this.d_canvas.height = window.innerHeight;// add /2 to allow two games side-by-side vertical

        this.d_context = this.d_canvas.getContext('2d');
    }

    public writeTextToCanvas(
        text : string,
        fontSize : number,
        xCoordinate : number,
        yCoordinate : number,
        color : string = "white",
        alignment : CanvasTextAlign = "center"
    )  {
        this.d_context.font = `${fontSize}px Tahoma`;
        this.d_context.fillStyle = color;
        this.d_context.textAlign = alignment;
        this.d_context.fillText(text,xCoordinate,yCoordinate);
    }

    public writeTextCenterToCanvas(
        text : string,
        fontSize : number,
        color : string = "white",
        alignment : CanvasTextAlign = "center"
    )  {
        const horizontalCenter = this.GetWidth() / 2;
        const verticalCenter = this.GetHeight() / 2;

        this.d_context.font = `${fontSize}px Tahoma`;
        this.d_context.fillStyle = color;
        this.d_context.textAlign = alignment;
        this.d_context.fillText(text,horizontalCenter,verticalCenter);
    }

    /**
     * Clear
     * @AccessModifier {public}
     * Clears the canvas
     */
    public Clear(): void {
        // clear the screen
        this.d_context.clearRect(0, 0, this.GetWidth(), this.GetHeight());
    }

    /**
     * GetHeight
     * @AccessModifier {public}
     * returns Height of the canvas
     */
    public GetHeight() : number {
        // return the height of the canvas
        return this.d_canvas.height;
    }

    /**
     * GetWidth
     * @AccessModifier {public}
     * returns the Width of the canvas
     */
    public GetWidth() : number {
        // return the width of the canvas
        return this.d_canvas.width;
    }


}