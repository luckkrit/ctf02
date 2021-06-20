import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './shared/auth.service';
import { AvatarComponent } from './avatar/avatar.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { authInterceptorProviders } from './shared/auth.interceptor';
import { TokenStorageService } from './shared/token-storage.service';
import { Backend2MockService } from './shared/backend2-mock.service';
import { ContainerComponent } from './container/container.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { MaterialuiModule } from '../materialui/materialui.module';

@NgModule({
  declarations: [
    AvatarComponent,
    PageNotFoundComponent,
    ContainerComponent,
    SubMenuComponent,
  ],
  imports: [CommonModule, MaterialuiModule],
  providers: [
    AuthService,
    Backend2MockService,
    authInterceptorProviders,
    TokenStorageService,
  ],
  exports: [
    AvatarComponent,
    PageNotFoundComponent,
    ContainerComponent,
    SubMenuComponent,
  ],
})
export class CoreModule {}
