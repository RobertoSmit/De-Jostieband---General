class App {
    constructor(canvasId) {
        this.ChangeView = (aNewView) => {
            this.d_currentScreen = aNewView;
            this.d_currentScreen.Render();
        };
        this.d_canvasHelper = CanvasHelper.Instance(canvasId);
        this.ChangeView(new PlayerScreen(canvasId));
    }
}
let init = function () {
    console.log('function');
    const MyAwesomeGame = new App(document.getElementById('canvas'));
};
window.addEventListener('load', init);
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
class cKeyboardInput {
    constructor() {
        this.keyPressCallback = new Map();
        this.keyUpCallback = new Map();
        this.keyDownCallback = new Map();
        this.keyboardDown = (event) => {
            if (this.keyDownCallback.has(event.key)) {
                event.preventDefault();
                let callback = this.keyDownCallback.get(event.key);
                if (callback != null) {
                    callback();
                }
            }
        };
        this.keyboardUp = (event) => {
            if (this.keyUpCallback.has(event.key)) {
                event.preventDefault();
                let callback = this.keyUpCallback.get(event.key);
                if (callback != null) {
                    callback();
                }
            }
            if (this.keyPressCallback.has(event.key)) {
                event.preventDefault();
                let callback = this.keyPressCallback.get(event.key);
                if (callback != null) {
                    callback();
                }
            }
        };
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }
    static Instance() {
        if (this.instance == null) {
            this.instance = new cKeyboardInput();
        }
        return this.instance;
    }
    addKeyPressCallback(key, fn) {
        this.keyPressCallback.set(key, fn);
    }
    addKeyUpCallback(key, fn) {
        this.keyUpCallback.set(key, fn);
    }
    addKeyDownCallback(key, fn) {
        this.keyDownCallback.set(key, fn);
    }
    clearKeyCallbacks(key) {
        this.keyPressCallback.set(key, null);
        this.keyUpCallback.set(key, null);
        this.keyDownCallback.set(key, null);
    }
}
cKeyboardInput.instance = null;
class BackgroundScreen extends ViewBase {
    constructor(aCanvas) {
        super(aCanvas);
        this.d_imageIndex = 0;
        this.d_images = [
            'game_background_1.png',
            'game_background_2.png',
            'game_background_3.png',
            'game_background_4.png'
        ];
        this.AddBackground(aCanvas, this.d_images[this.d_imageIndex]);
        const keyb = cKeyboardInput.Instance();
        keyb.addKeyDownCallback('ArrowRight', () => this.Next());
        keyb.addKeyDownCallback('ArrowLeft', () => this.Previous());
    }
    Next() {
        this.d_imageIndex = ++this.d_imageIndex % this.d_images.length;
        this.DrawImage(this.d_images[this.d_imageIndex]);
    }
    Previous() {
        this.d_imageIndex = --this.d_imageIndex % this.d_images.length;
        this.DrawImage(this.d_images[this.d_imageIndex]);
    }
    AddBackground(aParent, aImage) {
        const canvas = document.createElement('canvas');
        canvas.width = aParent.width;
        canvas.height = aParent.height;
        canvas.id = 'level1';
        canvas.style.position = 'absolute';
        canvas.style.left = '0';
        canvas.style.top = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.zIndex = '50';
        this.d_background = canvas;
        this.d_ctx = canvas.getContext('2d');
        this.DrawImage(aImage);
        document.body.appendChild(canvas);
    }
    Render() {
        this.d_canvasHelper.Clear();
    }
    DrawImage(aImage, offset = 0) {
        offset = offset / 5;
        const img = new Image();
        img.src = './assets/' + aImage;
        img.alt = 'noimg';
        this.d_ctx.save();
        this.d_ctx.clip();
        img.addEventListener('load', () => {
            this.d_ctx.clearRect(0, 0, this.d_background.width, this.d_background.height);
            this.d_ctx.drawImage(img, 0, 0, this.d_background.width, this.d_background.height);
        });
        this.d_ctx.restore();
    }
}
class ParallaxScreen extends ViewBase {
    constructor(aCanvas) {
        super(aCanvas);
        this.d_parallax = new Map();
        this.d_images = [
            'style2/layer09_Sky.png',
            'style2/layer08_Stars_1.png',
            'style2/layer07_Stars_2.png',
            'style2/layer06_Stars_3.png',
            'style2/layer05_Castle.png',
            'style2/layer04_Path.png',
            'style2/layer03_Clouds_3.png',
            'style2/layer02_Clouds_2.png',
            'style2/layer01_Clouds_1.png'
        ];
        this.speed = 0.5;
        this.running = false;
        this.offset = 0;
        this.fps = 60;
        this.fpsInterval = 1000 / this.fps;
        this.now = 0;
        this.then = Date.now();
        this.elapsed = 0;
        for (let img of this.d_images) {
            this.AddCanvas(aCanvas, img);
        }
        const keyb = cKeyboardInput.Instance();
        keyb.addKeyDownCallback('ArrowUp', () => this.MoveUp());
        keyb.addKeyDownCallback('ArrowDown', () => this.MoveDown());
    }
    MoveUp() {
        console.log('MoveUp');
        this.speed += 0.25;
    }
    MoveDown() {
        console.log('MoveDown');
        this.speed -= 0.25;
    }
    AddCanvas(aParent, aImage) {
        const canvas = document.createElement('canvas');
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
    Render() {
        this.d_canvasHelper.Clear();
        this.Animate();
    }
    DrawImage(canvas, aImage, offset = 0) {
        offset = offset / 5;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = './assets/' + aImage;
        img.alt = 'noimg';
        ctx.save();
        ctx.clip();
        img.addEventListener('load', () => {
            const offs = offset % canvas.width;
            const sx = offs;
            const sWidth = canvas.width - offs;
            const sHeight = canvas.height;
            const dx = 0;
            const dWidth = canvas.width;
            const dHeight = canvas.height;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, sx, 0, sWidth, sHeight, 0, 0, sWidth, dHeight);
            if (sWidth < dWidth) {
                const ex = dWidth - sWidth;
                ctx.drawImage(img, 0, 0, ex, sHeight, sWidth, 0, ex, dHeight);
            }
        });
        ctx.restore();
    }
    Animate() {
        requestAnimationFrame(() => this.Animate());
        this.now = Date.now();
        this.elapsed = this.now - this.then;
        if (this.elapsed > this.fpsInterval && (this.offset != 0 || this.speed != 0)) {
            this.then = this.now - (this.elapsed % this.fpsInterval);
            this.d_parallax.forEach((canvas, idx) => {
                this.DrawImage(canvas, this.d_images[idx], this.offset * idx);
            });
            this.offset += this.speed;
            console.log('animate');
            console.log(this.offset);
        }
    }
}
class PlayerScreen extends ViewBase {
    constructor(aCanvas) {
        super(aCanvas);
        this.d_imageIndex = 0;
        this.d_images = new Array();
        this.pos = 0;
        this.running = false;
        this.offset = 0;
        this.fps = 20;
        this.fpsInterval = 1000 / this.fps;
        this.now = 0;
        this.then = Date.now();
        this.elapsed = 0;
        for (let idx = 0; idx != 12; ++idx) {
            this.d_images.push('Goblin/Running/0_Goblin_Running_0' + ((idx < 10) ? '0' : '') + idx + '.png');
        }
        this.AddPlayer(aCanvas, this.d_images[this.d_imageIndex]);
        const keyb = cKeyboardInput.Instance();
        keyb.addKeyDownCallback('ArrowRight', () => this.GoRight());
        keyb.addKeyDownCallback('ArrowLeft', () => this.GoLeft());
    }
    GoRight() {
        this.pos += 4;
    }
    GoLeft() {
        this.pos -= 4;
    }
    AddPlayer(aParent, aImage) {
        const canvas = document.createElement('canvas');
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
    Render() {
        this.d_canvasHelper.Clear();
        this.Animate();
    }
    DrawImage(aImage, offset = 0) {
        offset = offset / 5;
        const ctx = this.d_canvas.getContext('2d');
        const img = new Image();
        img.src = './assets/' + aImage;
        img.alt = 'noimg';
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
    Animate() {
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
class StartScreen extends ViewBase {
    constructor(aCanvas) {
        super(aCanvas);
    }
    Render() {
        this.d_canvasHelper.Clear();
        this.d_canvasHelper.writeTextCenterToCanvas("StartScreen", 40);
    }
}
//# sourceMappingURL=app.js.map