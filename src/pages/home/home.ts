import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GamePage } from '../game/game';
import { TestPage } from '../test/test';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public testData:string = null;

  constructor(public navCtrl: NavController) {
    this.testData = "Hello E Collors";
  }

  startGame () {
      debugger;
  }

  goTo (page) {
    if (page === 'GAME_PAGE') {
      this.navCtrl.push(GamePage);
    } else if (page === 'TEST_PAGE') {
      this.navCtrl.push(TestPage);
    } else {
      // TODO;
    }
  }

}
