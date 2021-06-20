import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/shared/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from '../../core/shared/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class LoginComponent implements OnInit {
  userNameOrEmail = '';
  userName = '';
  email = '';
  password = '';
  formData: FormGroup;
  isLoading = false;
  isDisabled = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private tokenStorageService: TokenStorageService
  ) {
    this.formData = new FormGroup({
      userNameOrEmail: new FormControl(this.userNameOrEmail, [
        Validators.required,
      ]),
      password: new FormControl(this.password, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnInit() {
    this.snackBar.dismiss();
  }

  showError(title: string, redirect = false) {
    this.snackBar
      .open(title, 'DISMISS')
      .afterDismissed()
      .subscribe(async () => {
        if (redirect) {
          this.snackBar.dismiss();
          await this.redirect();
        }
      });
  }

  async redirect(): Promise<void> {
    console.log('redirect');
    if (this.tokenStorageService.isAdmin()) {
      await this.router.navigate(['/dashboard']);
    } else if (this.tokenStorageService.isNurse()) {
      await this.router.navigate(['/dashboard/nurse']);
    } else if (this.tokenStorageService.isPatient()) {
      await this.router.navigate(['/dashboard/patient']);
    } else if (this.tokenStorageService.isDoctor()) {
      await this.router.navigate(['/dashboard/doctor']);
    } else {
      await this.router.navigate(['/login']);
    }
  }

  onClickSubmit(data: any) {
    this.userNameOrEmail = data.userNameOrEmail;
    this.password = data.password;
    this.isLoading = true;
    this.isDisabled = true;
    if (data.userNameOrEmail.indexOf('@') > -1) {
      this.email = data.userNameOrEmail;
      this.authService.loginWithEmail(this.email, this.password).subscribe(
        async (data) => {
          this.isLoading = false;
          this.isDisabled = false;
          if (data.valid) await this.redirect();
          else this.showError('Username or Password is incorrect');
        },
        (error) => {
          this.isLoading = false;
          this.isDisabled = false;
          this.showError(error.status + ': ' + error.statusText);
        }
      );
    } else {
      this.userName = data.userNameOrEmail;
      this.authService
        .loginWithUsername(this.userName, this.password)
        .subscribe(
          async (data) => {
            this.isLoading = false;
            this.isDisabled = false;
            if (data.valid) await this.redirect();
            else this.showError('Username or Password is incorrect');
          },
          (error) => {
            this.isLoading = false;
            this.isDisabled = false;
            this.showError(error.status + ': ' + error.statusText);
          }
        );
    }
  }
}
