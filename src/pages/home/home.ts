import { Component } from '@angular/core';
//import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/** Overall app state */
enum State {
  /** Left side running */
  Left,

  /** Right side running */
  Right,

  /** We are paused */
  Paused,
};

function StringPadLeft(str, padStr, length) {
  while (str.length < length) {
    str = padStr + str;
  }
  return str;
}

/** Converts a time duration in milliseconds, to a human-friendly string value */
function FormatTimeDurationMS(timeMS: number) {
  let minutes;
  let seconds;
  let milliseconds;

  if (timeMS < 0) {
    minutes = 0;
    seconds = 0;
    milliseconds = 0;
  } else {
    minutes = Math.floor((timeMS / 1000) / 60);
    seconds = Math.floor((timeMS / 1000) % 60);
    milliseconds = (timeMS % 1000);
  }

  return "" +
    StringPadLeft(minutes.toString(), "0", 1) +
    ":" +
    StringPadLeft(seconds.toString(), "0", 2) +
    "." +
    StringPadLeft(milliseconds.toString().substr(0,2), "0", 2);
}

/** Default goal-time */
const DefaultTimeGoalMS = 5 * 60 * 1000;
// const DefaultTimeGoalMS = 5 * 1000;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  /** app state */
  state : State = State.Paused;

  /** id from setInterval() */
  timerID = 0;

  /** Date.now() from last update */
  timerPreviousMS = 0;

  /** time remaining for left-side */
  timeRemainingLeftMS = DefaultTimeGoalMS;
  timeRemainingLeftFormatted = "...";

  /** time remaining for right-side */
  timeRemainingRightMS = DefaultTimeGoalMS;
  timeRemainingRightFormatted = "...";

  constructor(public alerCtrl: AlertController) {}

  ionViewDidLoad() {
    // Make sure up-to-date values get displayed, initially
    this.reset();
  }

  /** updates time-dependent app-state (timers, UI, etc.);
      This is alled periodically when timers are running.
    */
  update() {
    let now = Date.now();

    // Figure out elapsed time
    let elapsedTimeMS = 0;
    if (this.timerPreviousMS > 0) {
      elapsedTimeMS = now - this.timerPreviousMS;
    }

    // Update state-specific stuff
    switch (this.state) {
      case State.Left: {
        this.timeRemainingLeftMS -= elapsedTimeMS;
      } break;
      case State.Right: {
        this.timeRemainingRightMS -= elapsedTimeMS;
      } break;
    }

    // Update UI
    this.timeRemainingLeftFormatted = FormatTimeDurationMS(this.timeRemainingLeftMS);
    this.timeRemainingRightFormatted = FormatTimeDurationMS(this.timeRemainingRightMS);

    // Setup for next update() call
    if (this.timerPreviousMS > 0) {
      this.timerPreviousMS = now;
    }

    // Pause if a side is complete
    switch (this.state) {
      case State.Left: {
        if (this.timeRemainingLeftMS <= 0) {
          this.pause();
        }
      } break;
      case State.Right: {
        if (this.timeRemainingRightMS <= 0) {
          this.pause();
        }
      } break;
    }
  }

  /* called when left-side has it! */
  left(src?) {
    console.log("left("+src+")");
    if (this.state == State.Left) {
      return;
    }
    this.state = State.Left;
    this.run();
  }

  /* called when right-side has it! */
  right(src?) {
    console.log("right("+src+")")
    if (this.state == State.Right) {
      return;
    }
    this.state = State.Right;
    this.run();
  }

  /* pauses the timer */
  pause(src?) {
    console.log("pause("+src+")")
    if (this.state == State.Paused) {
      return;
    }
    clearInterval(this.timerID);
    this.timerID = 0;
    this.timerPreviousMS = 0;
    this.state = State.Paused;
  }

  /* starts the timer */
  run() {
    if (this.timerID != 0) {
      return;
    }
    this.timerPreviousMS = Date.now();
    this.timerID = setInterval(() => { this.update(); }, 1000 / 60);
  }

  /* reset everything */
  reset() {
    console.log("reset")
    this.pause();
    this.timeRemainingLeftMS = DefaultTimeGoalMS;
    this.timeRemainingRightMS = DefaultTimeGoalMS;
    this.update();
  }

  /* reset, but first ask the user if this is really what they wanted */
  askReset() {
    console.log("askReset")
    let confirm = this.alerCtrl.create({
      title: 'Reset?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            console.log('askReset: yes');
            this.reset();
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log('askReset: no');
          }
        }
      ]
    });
    confirm.present()
  }
}
