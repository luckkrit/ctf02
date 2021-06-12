import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { ContainerComponent } from './container/container.component';
import { AvatarComponent } from './avatar/avatar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BackendMockService } from './backend-mock.service';
import { authInterceptorProviders } from './auth.interceptor';
import { TokenStorageService } from './token-storage.service';

@NgModule({
  declarations: [ContainerComponent, AvatarComponent, PageNotFoundComponent],
  imports: [CommonModule],
  providers: [
    AuthService,
    BackendMockService,
    authInterceptorProviders,
    TokenStorageService,
  ],
  exports: [ContainerComponent, AvatarComponent],
})
export class CoreModule {}
