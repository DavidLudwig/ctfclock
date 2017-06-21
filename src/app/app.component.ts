import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MenuController, Events } from 'ionic-angular';

import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { SettingsPage } from '../pages/settings/settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = HomePage;
  aboutPage:any = AboutPage;
  settingsPage:any = SettingsPage;

  /** Default goal-time */
  static readonly DefaultTimeGoalMS : number = 5 * 60 * 1000;

  static StringPadLeft(str, padStr, length) {
    while (str.length < length) {
      str = padStr + str;
    }
    return str;
  }

  constructor(
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    public events: Events
    )
  {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // Initialize default settings, if need be
      MyApp.initDefaults(this.events);

      // this.nav.push(this.aboutPage);
      // this.nav.push(this.settingsPage);
    });
  }

  static saveSetting(key, value, events) {
    console.log("saveSetting(" + key + "," + value + ")");
    localStorage.setItem(key, value);
    events.publish('saveSetting', key);
  }

  static initDefaults(events) {
    if ( ! localStorage.getItem('leftStartTimeMS')) {
      MyApp.saveSetting('leftStartTimeMS', MyApp.DefaultTimeGoalMS.toString(), events);
    }
    if ( ! localStorage.getItem('rightStartTimeMS')) {
      MyApp.saveSetting('rightStartTimeMS', MyApp.DefaultTimeGoalMS.toString(), events);
    }
  }

  about() {
    console.log("about()");
    this.menuCtrl.close();
    this.nav.push(this.aboutPage);
  }

  settings() {
    console.log("settings()");
    this.menuCtrl.close();
    this.nav.push(this.settingsPage);
  }
}

