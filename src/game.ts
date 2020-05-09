import p5 from 'p5';

import { Boid } from './boid';

export class Game {
    sketch: p5;
    canvas: p5.Element;
    sldAlign: p5.Element;
    sldCohere: p5.Element;
    sldAvoid: p5.Element;
    sldBoids: p5.Element;
    flock: Boid[];

    static DefaultBackground = 51;
    static FrameRate = 30;

    constructor(sketch: p5) {
        this.sketch = sketch;
    }

    setup() {
        const { sketch } = this;
        const { windowWidth: w, windowHeight: h } = sketch;

        this.canvas = sketch.createCanvas(w, h);
        this.canvas.style('display', 'block');
        this.canvas.parent('canvas-container');

        sketch.background(Game.DefaultBackground);
        sketch.frameRate(Game.FrameRate);

        const boidCount = w * h / 16384;
        console.log({ w, h, boidCount });

        this.sldBoids = sketch.createSlider(10, 150, boidCount, 5);
        this.sldBoids.parent('control-container');
        this.sldAlign = sketch.createSlider(0, 5, 1, 0.1);
        this.sldAlign.parent('control-container');
        this.sldCohere = sketch.createSlider(0, 5, 1, 0.1);
        this.sldCohere.parent('control-container');
        this.sldAvoid = sketch.createSlider(0, 2, 1, 0.1);
        this.sldAvoid.parent('control-container');

        this.resizeCanvas();

        this.flock = new Array<Boid>();
        this.resizeFlock();
    }

    resizeFlock() {
        const d = (this.sldBoids.value() as number) - this.flock.length;
        if (d > 0) {
            console.log(`Spawning ${d} boids`);
            for (let i = 0; i < d; i++) {
                const b = new Boid(this);
                b.setup();
                this.flock.push(b);
            }
        } else if (d < 0) {
            console.log(`Removing ${-d} boids`)
            this.flock.splice(0, -d);
        }
    }

    update() {
        this.resizeFlock();
        this.flock.forEach(b => {
            b.edges();
            b.flock(this.flock,
                this.sldAlign.value() as number,
                this.sldCohere.value() as number,
                this.sldAvoid.value() as number);
            b.update();
        });
    }

    draw() {
        this.update();

        this.resizeCanvas();
        this.sketch.background(Game.DefaultBackground);
        this.flock.forEach(b => b.draw());
    }

    keyPressed() {
        console.log(`Key pressed: ${this.sketch.key}`);
    }

    resizeCanvas() {
        const { sketch } = this;
        const { width, height } = sketch.select('#canvas-container').size() as any;

        sketch.resizeCanvas(width, height);
        sketch.background(Game.DefaultBackground);
    }

    touchEnded(): boolean {
        return true;
    }

    touchMoved(): boolean {
        return true;
    }

    windowResized() {
        this.resizeCanvas();
    }
}
