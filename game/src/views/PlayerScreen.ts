class PlayerScreen extends ViewBase {

    d_canvas: HTMLCanvasElement;
    d_ctx: CanvasRenderingContext2D;

    d_imageIndex = 0;

    d_images = new Array();

    public constructor(aCanvas: HTMLCanvasElement) {
        super(aCanvas);

        // for (let idx = 0; idx != 18; ++idx) {
        //     this.d_images.push('Goblin/Idle/0_Goblin_Idle_0' + ((idx < 10) ? '0' : '') + idx + '.png')
        // }
        for (let idx = 0; idx != 12; ++idx) {
//            this.d_images.push('Goblin/Kicking/0_Goblin_Kicking_0' + ((idx < 10) ? '0' : '') + idx + '.png')
             this.d_images.push('Goblin/Running/0_Goblin_Running_0' + ((idx < 10) ? '0' : '') + idx + '.png')
//             this.d_images.push('Goblin/Slashing in The Air/0_Goblin_Slashing in The Air_0' + ((idx < 10) ? '0' : '') + idx + '.png')
        }

        this.AddPlayer(aCanvas, this.d_images[this.d_imageIndex]);

        const keyb = cKeyboardInput.Instance();

        keyb.addKeyDownCallback('ArrowRight', () => this.GoRight());
        keyb.addKeyDownCallback('ArrowLeft', () => this.GoLeft());
        // keyb.addKeyDownCallback('ArrowDown', () => this.MoveDown());
    }

    pos: number = 0;

    private GoRight() {
        this.pos += 4;
    }

    private GoLeft() {
        this.pos -= 4;
    }

    private AddPlayer(aParent: HTMLCanvasElement, aImage: string): void {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = aParent.width;
        canvas.height = aParent.height;
        canvas.id = 'PlayerCanvas';
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '50';

        this.d_canvas = canvas;
        this.d_ctx = canvas.getContext('2d');

        this.DrawImage(aImage);

        document.body.appendChild(canvas);
    }

    public Render(): void {
        this.d_canvasHelper.Clear();
        // this.d_canvasHelper.writeTextCenterToCanvas("ParallaxScreen",40);
        this.Animate();
    }

    private DrawImage(aImage: string, offset: number = 0) {
        offset = offset / 5; // smoother experience
        const ctx = this.d_canvas.getContext('2d');
        const img = new Image();
        img.src = './assets/' + aImage;
        img.alt = 'noimg';
        // Make sure the image is loaded first otherwise nothing will draw.
        ctx.save();
        ctx.clip();
        img.addEventListener('load', () => {

            let w = img.width / 3;
            let h = img.height / 3;

            ctx.clearRect(0, 0, this.d_canvas.width, this.d_canvas.height);
            ctx.drawImage(img, ((this.d_canvas.width - w) / 2.0) + this.pos, this.d_canvas.height - h, w, h);
        });
        ctx.restore();

    }

    running: boolean = false;
    offset: number = 0;

    fps: number = 20;
    fpsInterval: number = 1000 / this.fps;
    now: number = 0;
    then: number = Date.now();
    elapsed: number = 0;

    private Animate() {
        requestAnimationFrame(() => this.Animate());

        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fpsInterval) {
            this.then = this.now - (this.elapsed % this.fpsInterval);

            this.d_imageIndex = ++this.d_imageIndex % this.d_images.length;
            this.DrawImage(this.d_images[this.d_imageIndex]);
        }
    }
}