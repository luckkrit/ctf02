import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card } from './card.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private url = `${environment.apiUrl}/api/cards`;

  constructor(private httpClient: HttpClient) {}

  public removeCard(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.url + `/${id}`);
  }

  public addCard(card: Card): Observable<Card> {
    return this.httpClient.post<Card>(this.url, card);
  }

  public updateCard(id: number, card: Card): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, card);
  }

  public moveCard(
    todoId: number,
    prev: number,
    current: number
  ): Observable<void> {
    return this.httpClient.put<void>(
      this.url + `/move/${todoId}/${prev}/${current}`,
      null
    );
  }

  public transferCard(
    id: string,
    todoId: string,
    todoId2: string,
    prev: number,
    current: number
  ): Observable<void> {
    return this.httpClient.put<void>(
      this.url + `/transfer/${id}/${todoId}/${todoId2}/${prev}/${current}`,
      null
    );
  }
}
