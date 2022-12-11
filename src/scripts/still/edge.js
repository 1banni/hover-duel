

export default class Edge {
  constructor(x1, y1, x2, y2, layers, color, lineWidth=10) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.layers = layers;
    this.color = color;
    this.lineWidth = lineWidth;
    // rounding below may not be necessary
    this.vertical = (Math.floor(this.x1 * 1) === Math.floor(this.x2 * 1) ? true : false);
  }

  draw(ctx) {
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
  }

  intersects (particle) {
    if (!this.layers.includes(particle.layer)) return false; // Optimization - check layer first

    let radi = particle.radius;
    let edgeX = 0;
    let edgeY = 0;
    let gap = 0.1;

    if (this.vertical) {
      if (Math.abs(particle.x - this.x1) < radi) { // is distance greater < radius
        if (particle.y <= this.y2 && particle.y >= this.y1) {
          edgeX = (particle.x < this.x1 ? this.x1 - radi - gap : this.x1 + radi + gap);
          particle.handleIntersect(-1, 1, edgeX, edgeY);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else { // Horizontal
      if (Math.abs(particle.y - this.y1) < radi) { // is distance greater < radius
        if (particle.x <= this.x2 + 1 && particle.x >= this.x1 - 1) {
          edgeY = (particle.y < this.y1 ? this.y1 - radi - gap : this.y1 + radi + gap);
          particle.handleIntersect(1, -1, edgeX, edgeY);
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  inboundParticle(particle) {
    this.vertical ? this.resetParticleX(particle) : this.resetParticleY(particle)
  }

  resetParticleY(particle) {
    let radi = particle.radius;
    // checks which side of object particle is on and pushes to that side
    let newY = (particle.y < this.y ? this.y - radi - 1 : this.y + radi + 1 );
    particle.resetPos(particle.x, newY);
  }

  resetParticleX(particle) {
    let cushion = 0.1;
    let radi = particle.radius;

    if (particle.x < this.x) {
      particle.resetPos(this.x - radi - cushion, particle.y);
    } else {
      particle.resetPos(this.x + radi + cushion, particle.y);
    }
  }

  // Checks if object is in layer zero
  static inLayerZero(x, y, spacing) {
    return ((x >= MAP.PLATFORM_POS[0][0] - spacing && x <= MAP.PLATFORM_POS[0][0] + MAP.PLATFORM_WIDTH + spacing)
         || (x >= MAP.PLATFORM_POS[2][0] - spacing && x <= MAP.PLATFORM_POS[2][0] + MAP.PLATFORM_WIDTH + spacing))
        && ((y >= MAP.PLATFORM_POS[0][1] - spacing && y <= MAP.PLATFORM_POS[0][1] + MAP.PLATFORM_HEIGHT)
         || (y >= MAP.PLATFORM_POS[1][1] - spacing && y <= MAP.PLATFORM_POS[1][1] + MAP.PLATFORM_WIDTH));
  }

  static inLayerOne(x, y, spacing) {
    return !this.inLayerZero(x, y, spacing);
  }
}
