import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IStopWatch} from "./models/stopWatch";
import {StopWatchService} from "./shared/stopwatch.service";
import {fromEvent, Subscription} from "rxjs";
import {bufferCount, filter, map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  startBtn: boolean = true;
  stopWatch: IStopWatch;
  private subscription: Subscription = new Subscription();
  private dblClickSubscription: Subscription = new Subscription();
  private watchBtn: ElementRef;

  @ViewChild('watchBtn')
  set watchBtnRef(content: ElementRef) {
    if (content) {
      this.watchBtn = content;
      this.dblClickSubscription = fromEvent(this.watchBtn.nativeElement, 'click').pipe(
        map(() => new Date().getTime()),
        bufferCount(2, 1),
        filter(timestamps => {
          return timestamps[0] > new Date().getTime() - 500;
        })
      )
        .subscribe(() => {
          this.waitTimer();
        }, error => console.error(error))
    }
  }

  constructor(
    private stopWatchService: StopWatchService
  ) {
  }

  ngOnInit() {
    this.subscription.add(
      this.stopWatchService.stopWatch$.subscribe((value: IStopWatch) => {
        this.stopWatch = value;
      })
    );
  }

  startStopWatch() {
    this.startBtn = !this.startBtn;
    this.stopWatchService.start();
    this.dblClickSubscription.unsubscribe();
  }

  stopTimer() {
    this.startBtn = true;
    this.stopWatchService.reset();
  }

  resetTimer() {
    this.stopWatchService.reset();
    this.stopWatchService.start();
  }

  waitTimer() {
    this.stopWatchService.stop();
    this.startBtn = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dblClickSubscription.unsubscribe();
  }

}
