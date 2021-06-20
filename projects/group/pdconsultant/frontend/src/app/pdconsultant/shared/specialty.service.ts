import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Specialty } from './specialty';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService {
  private readonly _specialtySources = new BehaviorSubject<Specialty[]>([]);

  private _setSpecialtiesSource(specialties: Specialty[]): void {
    this._specialtySources.next(specialties);
  }

  private url = `${environment.apiUrl}/api/specialties`;

  specialties = this._specialtySources.asObservable();

  constructor(private httpClient: HttpClient) {}

  public getSpecialties(): Observable<Specialty[]> {
    return this.httpClient
      .get<Specialty[]>(this.url)
      .pipe(
        tap((symptoms: Specialty[]) => this._setSpecialtiesSource(symptoms))
      );
  }
}
