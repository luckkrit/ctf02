import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { MaterialuiModule } from '../materialui/materialui.module';
import { CoreModule } from '../core/core.module';
import { PdconsultantModule } from '../pdconsultant/pdconsultant.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, CoreModule, MaterialuiModule, PdconsultantModule],
})
export class DashboardModule {}
