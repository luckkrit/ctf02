import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TokenStorageService } from '../../core/shared/token-storage.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DoctorComponent implements OnInit {
  isLoading: boolean = false;
  user: any;

  constructor(private tokenStorageService: TokenStorageService) {
    this.user = this.tokenStorageService.getUser();
  }

  ngOnInit(): void {}
}
