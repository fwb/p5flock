import p5 from 'p5';

import { Game } from './game';
import { Transform } from "./transform";

export class Boid {
    game: Game;
    tf: Transform;

    static PERCEPTION_RADIUS = 50;
    static MAX_FORCE = 0.02;
    static MAX_SPEED = 4;
    static SIZE = 8;
    static ACCEL = 0.1;

    constructor(game: Game) {
        this.game = game;
    }

    setup() {
        const { sketch } = this.game;

        const pos = sketch.createVector(
            sketch.random(sketch.width),
            sketch.random(sketch.height)
        );

        const vel = p5.Vector.random2D();
        vel.setMag(sketch.random(2, 4));

        const acc = sketch.createVector();

        this.tf = new Transform(pos, vel, acc);
    }

    update() {
        this.tf.acc.normalize();
        this.tf.acc.mult(Boid.ACCEL);
        this.tf.vel.add(this.tf.acc);
        this.tf.vel.limit(Boid.MAX_SPEED);
        this.tf.pos.add(this.tf.vel);

        this.tf.acc.mult(0);
    }

    draw() {
        const { sketch } = this.game;
        sketch.push();

        sketch.strokeWeight(0);
        sketch.translate(this.tf.pos);
        sketch.fill('white');
        sketch.ellipse(0, 0, 3);
        sketch.rotate(this.tf.heading());
        sketch.fill('orange');
        sketch.triangle(0, 0, -11, 3, -11, -3);

        sketch.pop();
    }

    flock(boids: Boid[], align: number, cohere: number, avoid: number) {
        this.tf.acc.add(this.align(boids).mult(align));
        this.tf.acc.add(this.cohere(boids).mult(cohere));
        this.tf.acc.add(this.avoid(boids).mult(avoid));
    }

    align(boids: Boid[]): p5.Vector {
        let total = 0;
        let steer = this.game.sketch.createVector();
        boids.forEach(other => {
            const dist = this.game.sketch.dist(
                this.tf.pos.x,
                this.tf.pos.y,
                other.tf.pos.x,
                other.tf.pos.y
            );

            if (other != this && dist < Boid.PERCEPTION_RADIUS) {
                steer.add(other.tf.vel);
                total++;
            }
        });

        if (total > 0) {
            steer.div(total);
            steer.setMag(Boid.MAX_SPEED);
            steer.sub(this.tf.vel);
            steer.limit(Boid.MAX_FORCE);
        }

        return steer;
    }

    cohere(boids: Boid[]) {
        let total = 0;
        let steer = this.game.sketch.createVector();
        boids.forEach(other => {
            const dist = this.game.sketch.dist(
                this.tf.pos.x,
                this.tf.pos.y,
                other.tf.pos.x,
                other.tf.pos.y
            );

            if (other != this && dist < Boid.PERCEPTION_RADIUS) {
                steer.add(other.tf.pos);
                total++;
            }
        });

        if (total > 0) {
            steer.div(total);
            steer.sub(this.tf.pos);
            steer.setMag(Boid.MAX_SPEED);
            steer.sub(this.tf.vel);
            steer.limit(Boid.MAX_FORCE);
        }

        return steer;
    }

    avoid(boids: Boid[]) {
        let total = 0;
        let steer = this.game.sketch.createVector();
        boids.forEach(other => {
            const dist = this.game.sketch.dist(
                this.tf.pos.x,
                this.tf.pos.y,
                other.tf.pos.x,
                other.tf.pos.y
            );

            if (other != this && dist < Boid.PERCEPTION_RADIUS) {
                let target = p5.Vector.sub(this.tf.pos, other.tf.pos);
                target.div(dist);
                steer.add(target);
                total++;
            }
        });

        if (total > 0) {
            steer.div(total);
            steer.setMag(Boid.MAX_SPEED);
            steer.sub(this.tf.vel);
            steer.limit(Boid.MAX_FORCE);
        }

        return steer;
    }

    edges() {
        const { width, height } = this.game.sketch;

        if (this.tf.pos.x > width) {
            this.tf.pos.x = 0;
        } else if (this.tf.pos.x < 0) {
            this.tf.pos.x = width;
        }

        if (this.tf.pos.y > height) {
            this.tf.pos.y = 0;
        } else if (this.tf.pos.y < 0) {
            this.tf.pos.y = height;
        }
    }
}
