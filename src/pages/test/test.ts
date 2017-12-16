import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  public frameClass:string = null;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.frameClass = 'some-css-class';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

}
