class BackgroundScreen extends ViewBase {

    d_background: HTMLCanvasElement;
    d_ctx: CanvasRenderingContext2D;

    d_imageIndex = 0;

    d_images = [
        'game_background_1.png',
        'game_background_2.png',
        'game_background_3.png',
        'game_background_4.png'
    ]

    public constructor(aCanvas: HTMLCanvasElement) {
        super(aCanvas);

        this.AddBackground(aCanvas, this.d_images[this.d_imageIndex]);

        const keyb = cKeyboardInput.Instance();
        keyb.addKeyDownCallback('ArrowRight', () => this.Next());
        keyb.addKeyDownCallback('ArrowLeft', () => this.Previous());
    }

    private Next() {
        this.d_imageIndex = ++this.d_imageIndex % this.d_images.length;
        this.DrawImage(this.d_images[this.d_imageIndex]);
    }
    private Previous() {
        this.d_imageIndex = --this.d_imageIndex % this.d_images.length;
        this.DrawImage(this.d_images[this.d_imageIndex]);
    }


    private AddBackground(aParent: HTMLCanvasElement, aImage: string): void {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = aParent.width;
        canvas.height = aParent.height;
        canvas.id = 'level1';
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '50';

        this.d_background =  canvas;
        this.d_ctx = canvas.getContext('2d');

        this.DrawImage(aImage);

        document.body.appendChild(canvas);
    }

    public Render(): void {
        this.d_canvasHelper.Clear();
        // this.d_canvasHelper.writeTextCenterToCanvas("ParallaxScreen",40);
        //this.Animate();
    }

    private DrawImage(aImage: string, offset: number = 0) {
        offset = offset / 5; // smoother experience

        const img = new Image();
        img.src = './assets/' + aImage;
        img.alt = 'noimg';
        // Make sure the image is loaded first otherwise nothing will draw.
        this.d_ctx.save();
        this.d_ctx.clip();
        img.addEventListener('load', () => {
            this.d_ctx.clearRect(0, 0, this.d_background.width, this.d_background.height);
            this.d_ctx.drawImage(img, 0, 0, this.d_background.width, this.d_background.height);
        });
        this.d_ctx.restore();

    }
}