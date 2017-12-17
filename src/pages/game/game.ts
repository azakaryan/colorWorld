import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import {Platform} from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage {
  private ctx = null;
  private canvas = null;
  public level = null;
  public currentLevel = 0;
  public levels = [
    {
      requiredColor: "rgb(0,255,255)",
      timeLimit: 150,
      numberOfSections: 1,
      currentLevel: 1,
      initialColor: 'white'
    },
    {
      requiredColor: "rgb(255,255, 0)",
      timeLimit: 10,
      numberOfSections: 1,
      currentLevel: 2
    },
    {
      requiredColor: "rgb(255,0,255)",
      timeLimit: 10,
      numberOfSections: 1,
      currentLevel: 3
    },
    {
      requiredColor: "rgb(0,127,255)",
      timeLimit: 20,
      numberOfSections: 2,
      currentLevel: 4
    },
  ];



  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {}

  ionViewDidLoad() {
    // window.aa = this;
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.platform.width();
    this.canvas.height = this.platform.height();
    this.level = new Level(this.canvas, this.ctx, this.levels[this.currentLevel], this.completionTriggerFunction.bind(this));
  }

  goHome () {
    this.cleanUp();
    this.navCtrl.push(HomePage);
  }

  cleanUp() {
    this.ctx = null;
    this.canvas = null;
    this.level = null;
    this.currentLevel = 0;
  }

  completionTriggerFunction(status) {
    if (status) {
      debugger;
      // Go To next level
      this.currentLevel++;
      this.level.isSuccess = true;
    } else {
      this.level.isFail = true;
      // Repeat with the same level
    }
    // this.level = new Level(this.canvas, this.ctx, this.levels[this.currentLevel], this.completionTriggerFunction);
  }
}







class Level {
  public box:Box = null;
  public timer:Timer = null;
  public requiredColor:string;
  public timeLimit:number;
  public numberOfSections:number;
  public currentLevel:number;
  public isPaused: boolean;
  public isSuccess: boolean;
  public isFail: boolean;

  constructor(public canvas, public ctx, opt, public completionTriggerFunction){
    this.requiredColor = opt.requiredColor || 'white';
    this.timeLimit = opt.timeLimit || 25;
    this.numberOfSections = opt.numberOfSections || 25;
    this.currentLevel = opt.currentLevel || 25;
    this.isPaused = false;
    this.isSuccess = false;
    this.isFail = false;
    this.timer = new Timer(completionTriggerFunction, this.timeLimit);

    this.box = new Box(canvas, ctx, {});
    this.box.update({color: opt.initialColor});
    this.box.drawSmile();
  }

  pause() {
    debugger;
    this.isPaused = true;
    this.timer.pause();
  }

  resume() {
    debugger;
    this.isPaused = false;
    this.timer.resume();
  }

  complete() {
    debugger;
    if (this.isRequiredColorPicked()){

    }
  }

  colorChanged() {
    this.box.updateColor();
    if (this.isRequiredColorPicked()){
      this.completionTriggerFunction(true);
    }
  }

  isRequiredColorPicked(){
    return this.box.getCurrentPickedColor() === this.requiredColor;
  }

  private cleanUp() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}


export class Timer {
  private timerHandler = null;
  private time:number;
  private tmp:number;
  private el:string;

  constructor(public completionTriggerFunction:any, public timeLimit:any) {
    this.tmp = this.time = this.timeLimit;
    this.start();
  }

  start() {
    this.timerHandler = setInterval(() => {
      let c = this.tmp;
      let m=(c/60)>>0;
      let s=(c-m*60)+'';
      this.el = ''+m+':'+(s.length>1?'':'0')+s;

      if (this.tmp === 0) {
        setTimeout(() => {
          this.complete();
          this.clear();
          this.time = 0;
        });
      }
      this.tmp--;
    },1000);
  }
  pause() {
    this.clear();
  }
  resume() {
    this.start()
  }
  complete() {
    this.completionTriggerFunction(false);
  }
  clear() {
    clearInterval(this.timerHandler);
  }
}

class Box {
  public color:string = null;
  public x:number;
  public y:number;
  public w:number;
  public h:number;
  public xDir:number;
  public yDir:number;
  public speed:number;
  public redValue;
  public greenValue;
  public blueValue;


  constructor(public canvas, public ctx:any, opt){
    this.w = opt.w || 150;
    this.h = opt.h || 150;
    this.x = opt.x || (canvas.width-this.w)/2;
    this.y = opt.y || (canvas.height - 196 - this.h)/2;
    this.redValue = opt.redValue || 255;
    this.greenValue = opt.greenValue || 255;
    this.blueValue = opt.blueValue || 255;

    this.xDir = opt.xDir || 0;
    this.yDir = opt.yDir || 2;
    this.speed = opt.speed || 2;
  }

  updateColor() {
    const color = this.getCurrentPickedColor();
    this.update({color});
    this.drawSmile();
  }
  getCurrentPickedColor() {
    return `rgb(${this.redValue},${this.greenValue},${this.blueValue})`;
  }

  update(opt) {
    this.ctx.fillStyle = opt.color || this.ctx.fillStyle;
    this.x = opt.x || this.x;
    this.y = opt.y || this.y;
    this.w = opt.w || this.w;
    this.h = opt.h || this.h;

    this.xDir = opt.xDir || this.xDir;
    this.yDir = opt.yDir || this.yDir;
    this.speed = opt.speed || this.speed;
  }

  drawRectangle() {
    this.ctx.fillRect(this.x, this.y, this.w, this.h);
  }

  drawSmile () {
    const x = this.x + 35;
    const y = this.y + 35;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 99,0,Math.PI*2); // head

    this.ctx.stroke();
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(x + 70, y);
    this.ctx.arc(x, y, 70,0,Math.PI);   // Mouth
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.fillStyle = 'black';
    this.ctx.moveTo(x-40, y-35);
    this.ctx.arc(x-40, y-35,12,0,Math.PI*2);  // Left eye
    this.ctx.fill();

    this.ctx.beginPath();
    this.ctx.moveTo(x+40, y-35);
    this.ctx.arc(x+40, y-35,12,0,Math.PI*2);  // Right eye
    this.ctx.fill();
  }
}
