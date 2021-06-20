import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TokenStorageService } from '../shared/token-storage.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class ToolbarComponent implements OnInit {
  @Input()
  isLogin: boolean | null = false;
  @Input()
  title: any;
  @Input()
  username: any;

  constructor(private tokenStorageService: TokenStorageService) {}

  ngOnInit(): void {}

  isNurse(): boolean {
    return this.tokenStorageService.isNurse();
  }

  isPatient(): boolean {
    return this.tokenStorageService.isPatient();
  }

  isDoctor(): boolean {
    return this.tokenStorageService.isDoctor();
  }

  isAdmin(): boolean {
    return this.tokenStorageService.isAdmin();
  }
}
