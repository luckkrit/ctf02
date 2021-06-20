import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TokenStorageService } from '../../core/shared/token-storage.service';
import { QueueService } from '../shared/queue.service';
import { RxStompService } from '@stomp/ng2-stompjs';
import { Observable, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-screening-point',
  templateUrl: './screening-point.component.html',
  styleUrls: ['./screening-point.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ScreeningPointComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  user: any;
  allQueuesSubscription!: Subscription;
  queueSubscription!: Subscription;
  roomNameSubscription!: Subscription;
  safeUrl!: any;

  constructor(
    private tokenStorageService: TokenStorageService,
    private queueService: QueueService,
    private rxStompService: RxStompService,
    private _sanitizer: DomSanitizer
  ) {
    this.user = this.tokenStorageService.getUser();
  }

  async ngOnInit(): Promise<void> {
    this.getRoomName();
    this.getAllQueues();
    this.getQueue(1);
  }

  getAllQueues(): void {
    if (!this.allQueuesSubscription || this.allQueuesSubscription.closed) {
      this.allQueuesSubscription = this.rxStompService
        .watch('/topic/queues')
        .subscribe((response: any) => {
          console.log('all', JSON.parse(response.body));
        });
    }
    this.rxStompService.publish({ destination: '/app/queues', body: '' });
  }

  getQueue(id: number) {
    if (!this.queueSubscription || this.queueSubscription.closed) {
      this.queueSubscription = this.rxStompService
        .watch(`/topic/queues/${id}`)
        .subscribe((response: any) => {
          console.log('single', JSON.parse(response.body));
        });
    }
    this.rxStompService.publish({
      destination: `/app/queues/${id}`,
      body: '',
    });
  }

  getRoomName() {
    if (!this.queueSubscription || this.queueSubscription.closed) {
      this.queueSubscription = this.rxStompService
        .watch(`/topic/getRoomName`)
        .subscribe((response: any) => {
          this.safeUrl = new Observable<SafeResourceUrl>((subscriber) => {
            const url = this._sanitizer.bypassSecurityTrustResourceUrl(
              `https://meet.jit.si/${JSON.parse(response.body)}`
            );
            subscriber.next(url);
          });
        });
    }
    this.rxStompService.publish({
      destination: `/app/getRoomName`,
      body: '',
    });
  }

  ngOnDestroy(): void {
    if (this.allQueuesSubscription) {
      this.allQueuesSubscription.unsubscribe();
    }
    if (this.queueSubscription) {
      this.queueSubscription.unsubscribe();
    }
    if (this.roomNameSubscription) {
      this.roomNameSubscription.unsubscribe();
    }
  }
}
