import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { SymptomService } from '../../shared/symptom.service';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Symptom } from '../../shared/symptom';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { SpecialtyService } from '../../shared/specialty.service';
import { Specialty } from '../../shared/specialty';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Doctor } from '../../shared/doctor';
import { QueueService } from '../../shared/queue.service';
import { TokenStorageService } from '../../../core/shared/token-storage.service';
import { Queue } from '../../shared/queue';

@Component({
  selector: 'app-queue',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class QueueComponent implements OnInit {
  @Output()
  isLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  symptoms$!: Observable<Symptom[]>;
  specialties$!: Observable<Specialty[]>;
  doctor: Doctor | null = null;
  symptom: Symptom | null = null;
  symptomFormGroup: FormGroup = this.formBuilder.group({
    symptom: [null, Validators.required],
  });
  doctorFormGroup: FormGroup = this.formBuilder.group({
    doctor: [{ value: null, disabled: true }, Validators.required],
  });
  isNotChooseDoctor: boolean = true;

  constructor(
    private symptomService: SymptomService,
    private specialtyService: SpecialtyService,
    private formBuilder: FormBuilder,
    private queueService: QueueService,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.symptoms$ = this.symptomService.symptoms;
    this.specialties$ = this.specialtyService.specialties;
    this.getSymptoms();
    this.getSpecialties();
  }

  getSymptoms(): void {
    this.isLoading.emit(true);
    this.symptomService
      .getSymptoms()
      .pipe(delay(0))
      .subscribe(
        () => {
          this.isLoading.emit(false);
        },
        (error) => {
          this.isLoading.emit(false);
        }
      );
  }

  getSpecialties(): void {
    this.isLoading.emit(true);
    this.specialtyService
      .getSpecialties()
      .pipe(delay(0))
      .subscribe(
        () => {
          this.isLoading.emit(false);
        },
        (error) => {
          this.isLoading.emit(false);
        }
      );
  }

  onSelectionChanges($event: MatSelectionListChange) {
    $event.source.deselectAll();
    $event.options.forEach((option) => (option.selected = true));
  }

  onStepperChange($event: StepperSelectionEvent) {
    if ($event.selectedIndex === 2 || $event.selectedIndex === 1) {
      if (this.symptomFormGroup.get('symptom')?.value?.length > 0) {
        const symptoms = this.symptomFormGroup.get('symptom')?.value;
        if (symptoms && symptoms.length > 0) {
          this.symptom = symptoms[0];
        }
      }
      if (this.doctorFormGroup.get('doctor')?.value?.length > 0) {
        const doctors = this.doctorFormGroup.get('doctor')?.value;
        if (doctors && doctors.length > 0) {
          this.doctor = doctors[0];
        }
      }
    }
  }

  onSelectDoctorChanges($event: MatSelectionListChange) {
    $event.source.deselectAll();
    $event.options.forEach((option) => (option.selected = true));
  }

  toggleChooseDoctor($event: MatCheckboxChange) {
    this.isNotChooseDoctor = $event.checked;
    if (!$event.checked) {
      this.doctorFormGroup.get('doctor')?.enable();
    } else {
      this.doctorFormGroup.get('doctor')?.disable();
      this.doctorFormGroup.get('doctor')?.setValue(null);
    }
  }

  addQueue() {
    this.queueService
      .addQueue(
        this.tokenStorageService.getUser().id,
        this.symptom?.id,
        this.doctor?.id
      )
      .subscribe(
        (queue: Queue) => {
          console.log(queue);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  reset() {
    this.doctorFormGroup.get('doctor')?.disable();
    this.isNotChooseDoctor = true;
  }
}
