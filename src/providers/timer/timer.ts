import { Injectable } from '@angular/core';


@Injectable()
export class TimerProvider {

  public funct;
  private timerHandler = null;
  private time:number;
  private tmp:number;
  private el:string;

  constructor(public completionTriggerFunction:any, public timeLimit:any) {
    this.timeLimit = timeLimit;
    //this.funct = completionTriggerFunction;
  }

  ngOnInit() {
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
        debugger;
        setTimeout(() => {
          this.complete();
          this.clear();
          this.time = 0;
        });
      }
      this.tmp--;
    },1000);
    debugger;
  }

  pause() {
    debugger;
    this.clear();
  }

  resume() {
    debugger;
    this.start()
  }

  complete() {
    debugger;
    this.completionTriggerFunction();
  }

  clear() {
    debugger;
    clearInterval(this.timerHandler);
  }

}
