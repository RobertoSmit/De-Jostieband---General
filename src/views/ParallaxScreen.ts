class ParallaxScreen extends ViewBase {

    // to use parallax backgrounds we need additional layers
    d_parallax = new Map<number, HTMLCanvasElement>();

    // d_images = [
    //     'style1/layer06_sky.png',
    //     'style1/layer05_rocks.png',
    //     'style1/layer04_clouds.png',
    //     'style1/layer03_trees.png',
    //     'style1/layer02_cake.png',
    //     'style1/layer01_ground.png'
    // ]
    d_images = [
        'style2/layer09_Sky.png',
        'style2/layer08_Stars_1.png',
        'style2/layer07_Stars_2.png',
        'style2/layer06_Stars_3.png',
        'style2/layer05_Castle.png',
        'style2/layer04_Path.png',
        'style2/layer03_Clouds_3.png',
        'style2/layer02_Clouds_2.png',
        'style2/layer01_Clouds_1.png'
    ]
    // d_images = [
    //     'style3/layer07_Sky.png',
    //     'style3/layer06_Rocks.png',
    //     'style3/layer05_Clouds.png',
    //     'style3/layer04_Hills_2.png',
    //     'style3/layer03_Hills_1.png',
    //     'style3/layer02_Trees.png',
    //     'style3/layer01_Ground.png'
    // ]
    // d_images = [
    //     'style4/layer07_Sky.png',
    //     'style4/layer06_Rocks.png',
    //     'style4/layer05_Hills.png',
    //     'style4/layer04_Clouds.png',
    //     'style4/layer03_Hills_Castle.png',
    //     'style4/layer02_Trees_rocks.png',
    //     'style4/layer01_Ground.png'
    // ]

    public constructor(aCanvas: HTMLCanvasElement) {
        super(aCanvas);

        for (let img of this.d_images) {
            this.AddCanvas(aCanvas, img);
        }

        const keyb = cKeyboardInput.Instance();
        keyb.addKeyDownCallback('ArrowUp', () => this.MoveUp());
        keyb.addKeyDownCallback('ArrowDown', () => this.MoveDown());
    }

    speed: number = 0.5;

    private MoveUp()
    {
        console.log('MoveUp');
        this.speed += 0.25;
    }

    private MoveDown()
    {
        console.log('MoveDown');
        this.speed -= 0.25;
    }

    private AddCanvas(aParent: HTMLCanvasElement, aImage: string): void {
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = aParent.width;
        canvas.height = aParent.height;
        canvas.id = 'parallax' + this.d_parallax.size;
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '' + this.d_parallax.size * 10;

        this.DrawImage(canvas, aImage);

        document.body.appendChild(canvas);
        this.d_parallax.set(this.d_parallax.size, canvas);
    }

    public Render(): void {
        this.d_canvasHelper.Clear();
        // this.d_canvasHelper.writeTextCenterToCanvas("ParallaxScreen",40);
        this.Animate();
    }

    private DrawImage(canvas: HTMLCanvasElement, aImage: string, offset: number = 0) {
        offset = offset / 5; // smoother experience
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = './assets/' + aImage;
        img.alt = 'noimg';
        // Make sure the image is loaded first otherwise nothing will draw.
        ctx.save();
        ctx.clip();
        img.addEventListener('load', () => {
            const offs = offset % canvas.width;
            const sx = offs; // set the offset
            const sWidth = canvas.width - offs; // the amount of image to use is the canvas.width - offset
            const sHeight = canvas.height; // height does not change

            const dx = 0;
            const dWidth = canvas.width;
            const dHeight = canvas.height;

            // console.log('offset: ' + offs + ' sx: ' + sx + ' sWidth: ' + sWidth + ' sHeight: ' + sHeight);
            // console.log('offset: ' + offs + ' dx: ' + dx + ' dWidth: ' + dHeight + ' sHeight: ' + dHeight);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, sx, 0, sWidth, sHeight, 0, 0, sWidth, dHeight);
            if (sWidth < dWidth) // if the image does not cover all we need to add a part
            {
                const ex = dWidth - sWidth; // ex is missing xpos and xwidth

                ctx.drawImage(img, 0, 0, ex, sHeight, sWidth, 0, ex, dHeight);
            }
        });
        ctx.restore();

    }

    running: boolean = false;
    offset: number = 0;

    fps: number = 60;
    fpsInterval: number = 1000 / this.fps;
    now: number = 0;
    then: number = Date.now();
    elapsed: number = 0;

    private Animate() {
        requestAnimationFrame(() => this.Animate());

        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fpsInterval && (this.offset != 0 || this.speed != 0)) {
            this.then = this.now - (this.elapsed % this.fpsInterval);

            this.d_parallax.forEach((canvas, idx) => {
                //const ctx = canvas.getContext('2d');

                //if (idx == 5)
                this.DrawImage(canvas, this.d_images[idx], this.offset * idx)

            });
            this.offset += this.speed;
            console.log('animate');
            console.log(this.offset);
        }
    }
}