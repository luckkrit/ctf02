import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Symptom } from './symptom';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SymptomService {
  private readonly _symptomsSource = new BehaviorSubject<Symptom[]>([]);

  private _setSymptomsSource(symptoms: Symptom[]): void {
    this._symptomsSource.next(symptoms);
  }

  private url = `${environment.apiUrl}/api/symptoms`;

  symptoms = this._symptomsSource.asObservable();

  constructor(private httpClient: HttpClient) {}

  public getSymptoms(): Observable<Symptom[]> {
    return this.httpClient
      .get<Symptom[]>(this.url)
      .pipe(tap((symptoms: Symptom[]) => this._setSymptomsSource(symptoms)));
  }
}
