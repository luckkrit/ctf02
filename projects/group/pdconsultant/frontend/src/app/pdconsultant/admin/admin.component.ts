import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TokenStorageService } from '../../core/shared/token-storage.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class AdminComponent implements OnInit {
  isLoading: boolean = false;
  user: any;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {
    this.user = this.tokenStorageService.getUser();
  }
}
