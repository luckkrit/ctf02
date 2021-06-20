import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialuiModule } from '../materialui/materialui.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';

@NgModule({
  declarations: [LoginComponent, LogoutComponent, RegisterComponent],
  imports: [
    CommonModule,
    MaterialuiModule,
    ReactiveFormsModule,
    CoreModule,
    RouterModule,
  ],
  providers: [],
})
export class AuthenticationModule {}
