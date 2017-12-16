import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the GamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  public redValue = 0;
  public greenValue = 0;
  public blueValue = 0;
  private ctx = null;
  private canvas = null;
  private boxMethods = null;
  private box = {
    x     : 40,
    y     : 20,
    w     : 100,
    h     : 100,
    xdir  : 1,
    ydir  : 0,
    speed : 2
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    console.log('ionViewDidLoad GamePage');

    this.canvas.width = 500;
    this.canvas.height = 400;

    this.boxMethods = {
      draw   : (box, color='white') => {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(box.x, box.y, box.w, box.h);
      },
      update : box => {
        box.x += box.xdir * box.speed;
        box.y += box.ydir * box.speed;

        if(box.x + box.w >= this.canvas.width)
          box.xdir = -1;
        else if(box.x <= 0)
          box.xdir = 1;
      }
    };

    // const loop = () => {
    //   requestAnimationFrame(loop);
    // };

    this.draw();
    this.update();
    // debugger;
    // loop();
  }

  goHome () {
    debugger;
    this.navCtrl.push(HomePage);
  }

  colorChange(color) {
   // debugger;
    this.updateColor();
    // if (color === "RED") {
    //   this.updateColor({red: this.redValue});
    // } else if (color === "GREEN") {
    //   this.updateColor({green: this.greenValue});
    // } else if (color === "BLUE") {
    //   this.updateColor({blue: this.blueValue});
    // }

    return false;
  }


  /*
  * Helper Function
  * */
  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.boxMethods.draw(this.box);
  };

  private update() {
    this.boxMethods.update(this.box);
  };

  private updateColor() {
    const color = `rgb(${this.redValue}, ${this.greenValue}, ${this.blueValue})`;
    // debugger;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.boxMethods.draw(this.box, color);
    this.update();
  }

}
