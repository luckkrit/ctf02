import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Queue } from './queue';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private url = `${environment.apiUrl}/api/queues`;

  constructor(private httpClient: HttpClient) {}

  public addQueue(
    userId: number,
    symptomId?: number,
    doctorId?: number
  ): Observable<Queue> {
    return this.httpClient.post<Queue>(this.url, {
      userId: userId,
      symptomId: symptomId,
      doctorId: doctorId,
    });
  }
}
