import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/shared/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class RegisterComponent implements OnInit {
  userName = '';
  password = '';
  email = '';
  confirmPassword = '';
  formData: FormGroup;
  isLoading = false;
  isDisabled = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formData = new FormGroup({
      userName: new FormControl(this.userName, [Validators.required]),
      email: new FormControl(this.email, [
        Validators.email,
        Validators.required,
      ]),
      password: new FormControl(this.password, [
        Validators.required,
        Validators.minLength(8),
      ]),
      confirmPassword: new FormControl(this.confirmPassword, [
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
          await this.router.navigate(['/dashboard']);
        }
      });
  }

  onClickSubmit(data: any) {
    this.userName = data.userName;
    this.password = data.password;
    this.confirmPassword = data.confirmPassword;
    this.email = data.email;
    this.isLoading = true;
    this.isDisabled = true;
    this.authService
      .register(this.userName, this.password, this.email)
      .subscribe(
        async (response) => {
          this.isLoading = false;
          this.isDisabled = false;
          if (response.valid) await this.router.navigate(['/login']);
          else {
            this.formData
              .get(response.message.key)
              ?.setErrors({ incorrect: true });
          }
        },
        (error) => {
          this.isLoading = false;
          this.isDisabled = false;
          this.showError(error.status + ': ' + error.statusText);
        }
      );
  }

  matchPassword(data: any) {
    return data.password !== data.confirmPassword;
  }
}
