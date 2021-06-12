import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialuiModule } from '../materialui/materialui.module';
import { DashboardComponent } from './dashboard.component';
import { BoardComponent } from './board/board.component';
import { SubMenuComponent } from '../core/sub-menu/sub-menu.component';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DashboardComponent, BoardComponent, SubMenuComponent],
  imports: [
    CommonModule,
    MaterialuiModule,
    FormsModule,
    CoreModule,
    RouterModule,
  ],
})
export class DashboardModule {}
