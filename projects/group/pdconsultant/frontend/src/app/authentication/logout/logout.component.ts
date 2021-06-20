import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../core/shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.logout().subscribe(async () => {
      await this.router.navigate(['/']);
    });
  }
}
