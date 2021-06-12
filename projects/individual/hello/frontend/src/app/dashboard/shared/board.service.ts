import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Board } from './board.interface';
import { tap } from 'rxjs/operators';
import { Todo } from './todo.interface';
import { Card } from './card.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private readonly _boardsSource = new BehaviorSubject<Board[]>([]);
  private readonly _boardSource = new BehaviorSubject<Board>({
    id: '',
    title: '',
    todos: [],
    userId: 0,
  });

  private _setBoardSource(board: Board): void {
    this._boardSource.next(board);
  }

  private _setBoardsSource(boards: Board[]): void {
    this._boardsSource.next(boards);
  }

  boards = this._boardsSource.asObservable();
  board = this._boardSource.asObservable();

  private getBoards(): Board[] {
    return this._boardsSource.getValue();
  }

  private _addBoard(board: Board): void {
    const boards = [...this.getBoards(), board];
    this._setBoardsSource(boards);
  }

  private _removeBoard(board: Board): void {
    const boards = this.getBoards().filter((b) => b.id !== board.id);
    this._setBoardsSource(boards);
  }

  private url = `${environment.apiUrl}/api/boards`;

  constructor(private httpClient: HttpClient) {}

  public getInitialBoard(): Board {
    const board = {
      id: '',
      title: '',
      todos: [],
      userId: 0,
    };
    this._setBoardSource(board);
    return board;
  }

  public getInitialBoards(): Board[] {
    const boards: Board[] = [];
    this._setBoardsSource(boards);
    return boards;
  }

  public getAllBoards(userId: number): Observable<Board[]> {
    return this.httpClient.get<Board[]>(this.url + `/user/${userId}`).pipe(
      tap((boards: Board[]) => {
        this._setBoardsSource(boards);
      })
    );
  }

  public getBoard(id: number): Observable<Board> {
    return this.httpClient.get<Board>(this.url + `/${id}`).pipe(
      tap((board: Board) => {
        board.todos.sort((todo1: Todo, todo2: Todo) => {
          if (todo1.ordinal < todo2.ordinal) {
            return -1;
          } else if (todo1.ordinal > todo2.ordinal) {
            return 1;
          } else {
            return 0;
          }
        });
        board.todos.forEach((todo: Todo) => {
          todo.cards.sort((card1: Card, card2: Card) => {
            if (card1.ordinal < card2.ordinal) {
              return -1;
            } else if (card1.ordinal > card2.ordinal) {
              return 1;
            } else {
              return 0;
            }
          });
        });
        this._setBoardSource(board);
      })
    );
  }

  public updateBoard(id: number, board: Partial<Board>): Observable<void> {
    return this.httpClient.put<void>(this.url + `/${id}`, board);
  }

  public removeBoard(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.url + `/${id}`).pipe(
      tap(() => {
        const boards = this.getBoards().filter((board) => board.id !== `${id}`);
        this._setBoardsSource(boards);
      })
    );
  }

  public addBoard(board: Partial<Board>): Observable<Board> {
    return this.httpClient.post<Board>(this.url, board);
  }
}
