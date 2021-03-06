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
  public currentLevel = 1;
  public levels = [
    {
      requiredColor: "rgb(0,255,255)",
      timeLimit: 15,
      numberOfSections: 1,
      currentLevel: 1,
      initialColor: 'white'
    },
    {
      requiredColor: "rgb(255,255,0)",
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
      requiredColor: "rgb(0,128,255)",
      timeLimit: 20,
      numberOfSections: 2,
      currentLevel: 4
    },
    {
      requiredColor: "rgb(255,128,0)",
      timeLimit: 18,
      numberOfSections: 2,
      currentLevel: 5
    },
    {
      requiredColor: "rgb(0,128,0)",
      timeLimit: 15,
      numberOfSections: 2,
      currentLevel: 6
    },
    {
      requiredColor: "rgb(128,128,255)",
      timeLimit: 12,
      numberOfSections: 2,
      currentLevel: 7
    },
    {
      requiredColor: "rgb(0,128,128)",
      timeLimit: 10,
      numberOfSections: 2,
      currentLevel: 8
    }
  ];



  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {}

  ionViewDidLoad() {
    // window.aa = this;
    this.canvas = document.getElementById('background');
    this.ctx = document.getElementById('chameleon');
    this.canvas.width = this.platform.width();
    this.canvas.height = this.platform.height();
    this.level = new Level(this.canvas, this.ctx, this.levels[this.currentLevel-1], this.completionTriggerFunction.bind(this), this.tikTriggerFunction.bind(this));
  }

  goHome () {
    this.cleanUp();
    this.navCtrl.push(HomePage);
    window.location.reload();
  }

  startNextLevel() {
    if (this.level.currentLevel < this.levels.length) {
      debugger;
      this.cleanUp();
      return this.level = new Level(this.canvas, this.ctx, this.levels[this.currentLevel-1], this.completionTriggerFunction.bind(this), this.tikTriggerFunction.bind(this));
    }
    alert("GAME OVER");
  }

  cleanUp() {
    debugger;
    this.level.cleanUp();
  }

  completionTriggerFunction(status) {
    this.level.isPausVisible = false;
    if (status) {
      setTimeout(() => {
        // Go To next level
        this.currentLevel++;
        this.level.isSuccess = true;
        this.level.cleanUp();
      }, 800);
    } else {
      this.level.isFail = true;
      // Repeat with the same level
    }
  }

  tikTriggerFunction(time) {
    // this.level.heightDropSizePerSecondInitial = parseInt(this.level.heightDropSizePerSecondInitial) + parseInt(this.level.heightDropSizePerSecond);
    // document.getElementById("background").style.marginTop = this.level.heightDropSizePerSecondInitial + 'px';
    // const element = document.getElementById("background");
    // // element.style.width = element.style.width -
    // // = document.getElementById("background").style.margin;
    //
    // console.log(this.level.heightDropSizePerSecondInitial, this.level.heightDropSizePerSecond);
    // console.log(this.level.heightDropSizePerSecondInitial);
    // // console.log(document.getElementById("background").style.margin);
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
  public isPausVisible: boolean;
  public isSuccess: boolean;
  public isFail: boolean;
  public heightDropSizePerSecond: number;
  public heightDropSizePerSecondInitial: number;

  constructor(public canvas, public ctx, opt, public completionTriggerFunction, public tikTriggerFunction){
    this.requiredColor = opt.requiredColor || 'white';
    this.timeLimit = opt.timeLimit || 25;
    this.numberOfSections = opt.numberOfSections || 25;
    this.currentLevel = opt.currentLevel || 25;
    this.isPausVisible = false;
    this.isPaused = false;
    this.isSuccess = false;
    this.isFail = false;
    this.timer = new Timer(completionTriggerFunction, tikTriggerFunction, this.timeLimit);
    this.box = new Box(canvas, ctx, {});
    this.box.update(opt.initialColor);
    this.canvas.style.backgroundColor = opt.requiredColor;
    this.heightDropSizePerSecond = 1.2 * this.box.x/opt.timeLimit;
    this.heightDropSizePerSecondInitial = 0;
    this.isPausVisible = true;
  }

  pause() {
    this.isPausVisible = this.isPaused = true;
    this.timer.pause();
  }

  resume() {
    debugger;
    this.isPaused = false;
    this.timer.resume();
  }

  complete() {
    if (this.isRequiredColorPicked()){}
  }

  colorChanged() {
    this.box.updateColor();
    if (this.isRequiredColorPicked()){
      this.completionTriggerFunction(true);
    }
  }

  isRequiredColorPicked(){
    const t = this.box.getCurrentPickedColor() === this.requiredColor;

    console.log("REQUIRED", this.requiredColor);
    console.log("Choosed Colores are: ", t);
    return t;
  }

  private cleanUp() {
    this.timer.cleanUp();
    this.heightDropSizePerSecondInitial = 0;
  };
}


export class Timer {
  private timerHandler = null;
  private time:number;
  private tmp:number;
  private el:string;

  constructor(public completionTriggerFunction:any, public tikTriggerFunction:any, public timeLimit:any) {
    this.tmp = this.time = this.timeLimit;
    this.start();
  }

  start() {
    this.timerHandler = setInterval(() => {
      let c = this.tmp;
      let m=(c/60)>>0;
      let s=(c-m*60)+'';
      this.el = ''+m+':'+(s.length>1?'':'0')+s;
      this.tikTriggerFunction(c);
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
  cleanUp() {
    this.clear();
    this.timerHandler = null;
    this.time = null;
    this.tmp = null;
    this.el = null;
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

    // this.xDir = opt.xDir || 0;
    // this.yDir = opt.yDir || 2;
    // this.speed = opt.speed || 2;
  }

  updateColor() {
    const color = this.getCurrentPickedColor();
    this.update(color);
  }
  getCurrentPickedColor() {
    return `rgb(${this.redValue},${this.greenValue},${this.blueValue})`;
  }

  update(color) {
    // this.ctx.fillStyle = opt.color || this.ctx.fillStyle;
    // this.x = opt.x || this.x;
    // this.y = opt.y || this.y;
    // this.w = opt.w || this.w;
    // this.h = opt.h || this.h;

    // this.xDir = opt.xDir || this.xDir;
    // this.yDir = opt.yDir || this.yDir;
    // this.speed = opt.speed || this.speed;
    this.ctx.style.backgroundColor = color;
  }

  // drawRectangle() {
  //   this.ctx.fillRect(this.x, this.y, this.w, this.h);
  // }

  // drawSmile () {
  //   const x = this.x + 35;
  //   const y = this.y + 35;
  //   this.ctx.beginPath();
  //   this.ctx.arc(x, y, 99,0,Math.PI*2); // head

  //   this.ctx.stroke();
  //   this.ctx.fill();

  //   this.ctx.beginPath();
  //   this.ctx.moveTo(x + 70, y);
  //   this.ctx.arc(x, y, 70,0,Math.PI);   // Mouth
  //   this.ctx.stroke();

  //   this.ctx.beginPath();
  //   this.ctx.fillStyle = 'black';
  //   this.ctx.moveTo(x-40, y-35);
  //   this.ctx.arc(x-40, y-35,12,0,Math.PI*2);  // Left eye
  //   this.ctx.fill();

  //   this.ctx.beginPath();
  //   this.ctx.moveTo(x+40, y-35);
  //   this.ctx.arc(x+40, y-35,12,0,Math.PI*2);  // Right eye
  //   this.ctx.fill();
  // }
}
