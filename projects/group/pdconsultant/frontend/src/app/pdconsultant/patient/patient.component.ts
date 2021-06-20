import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TokenStorageService } from '../../core/shared/token-storage.service';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class PatientComponent implements OnInit {
  isLoading: boolean = false;
  user: any;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
  }

  onLoading($event: boolean) {
    const subject = new Subject<boolean>();
    subject.pipe(delay(0)).subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    subject.next($event);
  }
}
