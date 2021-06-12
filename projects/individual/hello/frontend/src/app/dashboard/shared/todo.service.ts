import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from './todo.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private url = `${environment.apiUrl}/api/todos`;

  constructor(private httpClient: HttpClient) {}

  public removeTodo(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.url + `/${id}`);
  }

  public addTodo(todo: Partial<Todo>): Observable<Todo> {
    return this.httpClient.post<Todo>(this.url, todo);
  }

  public updateTodo(id: number, todo: Partial<Todo>): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, todo);
  }

  moveTodo(boardId: number, prev: number, current: number): Observable<void> {
    return this.httpClient.put<void>(
      this.url + `/move/${boardId}/${prev}/${current}`,
      null
    );
  }
}
