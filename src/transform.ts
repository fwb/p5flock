import p5 from 'p5';

export class Transform {
    pos: p5.Vector;
    vel: p5.Vector;
    acc: p5.Vector;

    constructor(
        pos: p5.Vector,
        vel: p5.Vector,
        acc: p5.Vector
    ) {
        this.pos = pos;
        this.vel = vel;
        this.acc = acc;
    }

    heading(): number {
        return this.vel.heading();
    }
}
