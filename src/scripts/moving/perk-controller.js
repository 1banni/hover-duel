import Perk from "./perk";
import { MAP, PERK } from "../game-params";
import { Util } from "../still/util";
const HEART_IMG = new Image();
HEART_IMG.src = './assets/heart.png';
const DISC_IMG = new Image();
DISC_IMG.src = './assets/red-bars.png';
const LIGHTNING_IMG = new Image();
DISC_IMG.src = './assets/red-bars.png';

export default class PerkController {
  perks = [];

  constructor(option) {
    this.numMedpaks = option.MEDPAKS;
    this.numProjectiles = option.AMMO;
    this.lightning = option.LIGHTNING;
    this.generatePerks();
  }

  generatePerks () {
    let params = [this.numMedpaks, this.numProjectiles, this.numNos];
    params.forEach( (param, idx) => {
      let tik = 0;
      while (tik++ < param) this.addPerk(idx);
    });
  }

  update() {
    this.perks = this.perks.filter((perk) => perk.decrFrames() > 0);
  }

  delete (perk) {
    this.perks.splice(this.perks.indexOf(perk), 1);
  }

  deleteAtIndex (idx) {
    this.perks.splice(idx, 1);
  }

  collideWith(player) {
    this.perks = _.reject(this.perks, (perk) => {
      if (perk.collideWith(player)) {
        player.givePerk(perk.type);
        return true;
      } else {
        return false;
      }
    });
  }

  addPerk(type) {
    let x1 = MAP.BORDER_WIDTH;
    let y1 = MAP.BORDER_WIDTH;
    let width = MAP.DIM_X - MAP.BORDER_WIDTH * 2;
    let height = MAP.DIM_Y - MAP.BORDER_WIDTH * 2;
    let spacing = (type === 0
      ? PERK.HEART.SIZE
      : (type === 1
        ? PERK.PROJ.SIZE
        : PERK.LIGHTNING.SIZE)
    );

    let [x,y] = Util.randomCoords(x1, y1, width, height, spacing);;

    while (((x >= MAP.PLATFORM_POS[0][0] - spacing && x <= MAP.PLATFORM_POS[0][0] + MAP.PLATFORM_WIDTH + spacing) || (x >= MAP.PLATFORM_POS[2][0] - spacing && x <= MAP.PLATFORM_POS[2][0] + MAP.PLATFORM_WIDTH + spacing))
      && ((y >= MAP.PLATFORM_POS[0][1] - spacing && y <= MAP.PLATFORM_POS[0][1] + MAP.PLATFORM_HEIGHT) || (y >= MAP.PLATFORM_POS[1][1] - spacing && y <= MAP.PLATFORM_POS[1][1] + MAP.PLATFORM_WIDTH)))
    {
      Util.randomCoords(x1, y1, width, height, spacing);
    }

    this.perks.push(new Perk(x, y, type));
  }

  addProj () {
    let [x, y] = Util.generateCoords(PERK.PROJ.SIZE);
    this.perks.push(new Perk(x, y, 1));
  }

  addHeart () {
    let [x, y] = Util.generateCoords(PERK.HEART.SIZE);
    this.perks.push(new Perk(x, y, 0));
  }

  draw(ctx) {
    this.perks.forEach( (perk) => {
      if (perk.type === 0) { // medpak / heart
        ctx.drawImage.bind(ctx)(HEART_IMG, perk.x, perk.y, PERK.HEART.SIZE, PERK.HEART.SIZE);
      } else if (perk.type === 1) { // reload
        ctx.drawImage.bind(ctx)(DISC_IMG, perk.x, perk.y, PERK.PROJ.SIZE, PERK.PROJ.SIZE);
      } else if (perk.type === 2) { // lightning
        ctx.drawImage.bind(ctx)(LIGHTNING_IMG, perk.x, perk.y, PERK.LIGHTNING.SIZE, PERK.LIGHTNING.SIZE);
      }
    });
  }

}
