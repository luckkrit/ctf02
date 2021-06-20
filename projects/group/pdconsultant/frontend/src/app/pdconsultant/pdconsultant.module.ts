import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientComponent } from './patient/patient.component';
import { DoctorComponent } from './doctor/doctor.component';
import { ScreeningPointComponent } from './screening-point/screening-point.component';
import { CoreModule } from '../core/core.module';
import { MaterialuiModule } from '../materialui/materialui.module';
import { QueueComponent } from './patient/queue/queue.component';
import { QueueHistoryComponent } from './patient/queue-history/queue-history.component';
import { TreatmentComponent } from './patient/treatment/treatment.component';
import { SymptomService } from './shared/symptom.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiWsRxStompConfig } from './shared/ApiWsRxStompConfig';
import {
  InjectableRxStompConfig,
  RxStompService,
  rxStompServiceFactory,
} from '@stomp/ng2-stompjs';
import { TokenStorageService } from '../core/shared/token-storage.service';
import { NurseComponent } from './nurse/nurse.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './admin/user/user.component';

@NgModule({
  declarations: [
    PatientComponent,
    DoctorComponent,
    ScreeningPointComponent,
    QueueComponent,
    QueueHistoryComponent,
    TreatmentComponent,
    NurseComponent,
    AdminComponent,
    UserComponent,
  ],
  imports: [CommonModule, CoreModule, MaterialuiModule, ReactiveFormsModule],
  providers: [
    SymptomService,
    {
      provide: InjectableRxStompConfig,
      useClass: ApiWsRxStompConfig,
      deps: [TokenStorageService],
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig],
    },
  ],
  exports: [PatientComponent, DoctorComponent, ScreeningPointComponent],
})
export class PdconsultantModule {}
