import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { MyApp } from '../../app/app.component';  // WORKS

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alerCtrl: AlertController,
    public events: Events)
  {
  }

  formatTimeMS(timeMSString: string) {
    let timeMS = parseInt(timeMSString);
    // console.log("timeMS: " + timeMS);
    let hours   = Math.floor(((timeMS / 1000) / 60) / 60);
    let minutes = Math.floor(((timeMS / 1000) / 60) % 60);
    let seconds = Math.floor((timeMS / 1000) % 60);
    // console.log("hours: " + hours);
    // console.log("minutes: " + minutes);
    // console.log("seconds: " + seconds);
    return "" +
      MyApp.StringPadLeft(hours.toString(), "0", 2) +
      ":" +
      MyApp.StringPadLeft(minutes.toString(), "0", 2) +
      ":" +
      MyApp.StringPadLeft(seconds.toString(), "0", 2);
  }

  parseTimeFormatted(timeFormatted: string) {
    let hours = parseInt(timeFormatted.slice(0,2))
    let minutes = parseInt(timeFormatted.slice(3,5))
    let seconds = parseInt(timeFormatted.slice(6,8))
    // console.log("hours: <" + hours + ">");
    // console.log("minutes: <" + minutes + ">");
    // console.log("seconds: <" + seconds + ">");
    let totalMS = ((((hours * 60) + minutes) * 60) + seconds) * 1000;
    // console.log("totalMS: <" + totalMS + ">");
    return totalMS;
  }

  get leftStartTimeFormatted() {
    return this.formatTimeMS(localStorage.getItem('leftStartTimeMS').toString());
  }

  set leftStartTimeFormatted(value:any) {
    let totalMS = this.parseTimeFormatted(value);
    MyApp.saveSetting('leftStartTimeMS', totalMS.toString(), this.events);
  }

  get rightStartTimeFormatted() {
    return this.formatTimeMS(localStorage.getItem('rightStartTimeMS').toString());
  }

  set rightStartTimeFormatted(value:any) {
    let totalMS = this.parseTimeFormatted(value);
    MyApp.saveSetting('rightStartTimeMS', totalMS.toString(), this.events);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  /* reset, but first ask the user if this is really what they wanted */
  askResetSettings() {
    console.log("askResetSettings")
    let confirm = this.alerCtrl.create({
      title: 'Reset all settings?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('askResetSettings: yes');
            this.resetSettings();
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('askResetSettings: no');
          }
        }
      ]
    });
    confirm.present()
  }

  resetSettings() {
    console.log("resetSettings")
    localStorage.clear();
    MyApp.initDefaults(this.events);
  }
}
