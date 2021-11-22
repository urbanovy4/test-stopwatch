import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable, Subscription, timer} from "rxjs";
import {IStopWatch} from "../models/stopWatch";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class StopWatchService {

  private timer$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private lastStopedTime: number = 0;
  private timerSubscription: Subscription = new Subscription();

  get stopWatch$(): Observable<IStopWatch> {
    return this.timer$
      .pipe(
        map((seconds: number): IStopWatch => this.toStopWatchFormat(seconds))
      )
  }

  start() {
    this.timerSubscription = timer(0, 1000)
      .pipe(
        map(value => value + this.lastStopedTime)
      )
      .subscribe(val => {
        this.timer$.next(val);
      }, err => console.error(err))
  }

  stop() {
    this.lastStopedTime = this.timer$.value;
    this.timerSubscription.unsubscribe();
  }

  reset() {
    this.timerSubscription.unsubscribe();
    this.lastStopedTime = 0;
    this.timer$.next(0);
  }

  private toStopWatchFormat(sec: number): IStopWatch {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return {
      minutes: this.convertValues(minutes),
      seconds: this.convertValues(seconds)
    }
  }


  private convertValues(value: number): string {
    return `${value < 10 ? '0' + value : value}`;
  }
}
