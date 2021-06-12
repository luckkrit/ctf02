import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'HELLO!';
  isUserLoggedIn$ = this.authService.isUserLoggedIn;
  usernameLoggedIn$ = this.authService.usernameLoggedIn;

  constructor(
    private authService: AuthService // private backEndMockService: BackendMockService
  ) {}

  ngOnInit(): void {
    this.authService.checkLogin();
    // this.backEndMockService.createServer().then(() => {
    //   this.authService.checkLogin();
    // });
  }
}
