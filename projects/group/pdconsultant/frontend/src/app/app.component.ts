import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/shared/auth.service';
import { Backend2MockService } from './core/shared/backend2-mock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PD CONSULTANT';
  isUserLoggedIn$ = this.authService.isUserLoggedIn;
  usernameLoggedIn$ = this.authService.usernameLoggedIn;

  constructor(
    private authService: AuthService,
    private backEndMockService: Backend2MockService
  ) {}

  ngOnInit(): void {
    this.authService.checkLogin();
    // this.backEndMockService.createServer().then(() => {
    //   this.authService.checkLogin();
    // });
  }
}
