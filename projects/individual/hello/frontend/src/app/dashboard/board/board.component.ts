import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BoardService } from '../shared/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Board } from '../shared/board.interface';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TodoService } from '../shared/todo.service';
import { Observable } from 'rxjs';
import { Todo } from '../shared/todo.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from '../shared/card.interface';
import { CardService } from '../shared/card.service';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class BoardComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private boardService: BoardService,
    private todoService: TodoService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  isLoading = false;
  board: Board = this.boardService.getInitialBoard();
  board$: Observable<Board> = this.boardService.board;
  static BOARD_NOT_FOUND = 'Board not found!';
  transferCardToAnotherTodo: string[] = [];
  minHeight = 30;

  @ViewChild('deleteDialog') deleteDialog!: TemplateRef<any>;
  deleteDialogRef!: MatDialogRef<any>;

  @ViewChild('addEditDialog') addEditDialog!: TemplateRef<any>;
  addEditDialogRef!: MatDialogRef<any>;

  ngOnInit(): void {
    this.snackBar.dismiss();
    this.boardService.getInitialBoard();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isLoading = true;
    this.board$.subscribe(
      (board: Board) => {
        this.board = board;
        this.transferCardToAnotherTodo = [];
        this.board.todos.forEach((todo: Todo) => {
          this.transferCardToAnotherTodo.push('todo-' + todo.id);
        });
      },
      (error) => {
        this.isLoading = false;
        this.showError(error.status + ': ' + error.statusText);
      }
    );
    this.getBoard(id);
  }

  getBoard(id: number) {
    this.boardService.getBoard(id).subscribe(
      (board) => {
        if (board) {
          this.isLoading = false;
          this.board = board;
        } else {
          this.isLoading = false;
          this.showError(BoardComponent.BOARD_NOT_FOUND, true);
        }
      },
      (error) => {
        this.isLoading = false;
        this.showError(error.status + ': ' + error.statusText);
      }
    );
  }

  showError(title: string, redirect = false) {
    this.snackBar
      .open(title, 'DISMISS')
      .afterDismissed()
      .subscribe(async () => {
        if (redirect) {
          this.snackBar.dismiss();
          await this.router.navigate(['/dashboard']);
        }
      });
  }

  openBoardDialog(dialogTitle: string) {
    this.addEditDialogRef = this.dialog.open(this.addEditDialog, {
      width: '250px',
      data: {
        title: this.board?.title,
        dialogTitle: dialogTitle,
        type: 'Board',
      },
    });

    this.addEditDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        if (this.board) {
          const id = Number(this.board.id);
          this.board.title = result;
          this.boardService.updateBoard(id, { title: result }).subscribe(
            () => {
              this.getBoard(id);
            },
            (error) => {
              this.isLoading = false;
              this.showError(error.status + ': ' + error.statusText);
            }
          );
        } else {
          this.isLoading = false;
          this.showError('Board not found!');
        }
      }
    });
  }

  openTodoDialog(dialogTitle: string, todo: Todo | null) {
    this.addEditDialogRef = this.dialog.open(this.addEditDialog, {
      width: '250px',
      data: {
        title: todo ? todo.title : '',
        dialogTitle: dialogTitle,
        type: 'Todo',
      },
    });

    this.addEditDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.board) {
          this.isLoading = true;
          const id = Number(this.board.id);
          if (todo == null) {
            this.todoService
              .addTodo({
                title: result,
                boardId: this.board.id,
                ordinal: this.board.todos.length,
              })
              .subscribe(
                () => {
                  this.getBoard(id);
                },
                (error) => {
                  this.isLoading = false;
                  this.showError(error.status + ': ' + error.statusText);
                }
              );
          } else {
            todo.title = result;
            this.todoService
              .updateTodo(Number(todo.id), { title: result })
              .subscribe(
                () => {
                  this.getBoard(id);
                },
                (error) => {
                  this.isLoading = false;
                  this.showError(error.status + ': ' + error.statusText);
                }
              );
          }
        } else {
          this.isLoading = false;
          this.showError('Board not found!');
        }
      }
    });
  }

  openCardDialog(dialogTitle: string, todo: Todo | null, card: Card | null) {
    this.addEditDialogRef = this.dialog.open(this.addEditDialog, {
      width: '250px',
      data: {
        title: card ? card.title : '',
        dialogTitle: dialogTitle,
        type: 'Card',
      },
    });

    this.addEditDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (todo) {
          if (this.board) {
            this.isLoading = true;
            const id = Number(this.board.id);
            if (card == null) {
              this.cardService
                .addCard({
                  title: result,
                  todoId: todo.id,
                  ordinal: todo.cards.length,
                })
                .subscribe(
                  (card) => {
                    todo.cards.push(card);
                    this.getBoard(id);
                  },
                  (error) => {
                    this.isLoading = false;
                    this.showError(error.status + ': ' + error.statusText);
                  }
                );
            } else {
              card.title = result;
              this.cardService.updateCard(Number(card.id), card).subscribe(
                () => {
                  this.boardService.getBoard(id).subscribe(
                    () => {
                      this.isLoading = false;
                    },
                    (error) => {
                      this.isLoading = false;
                      this.showError(error.status + ': ' + error.statusText);
                    }
                  );
                },
                (error) => {
                  this.isLoading = false;
                  this.showError(error.status + ': ' + error.statusText);
                }
              );
            }
          } else {
            this.isLoading = false;
            this.showError('Board not found!');
          }
        }
      }
    });
  }

  openDeleteBoardDialog(title: string): void {
    this.deleteDialogRef = this.dialog.open(this.deleteDialog, {
      width: '250px',
      data: { dialogTitle: title },
    });
    this.deleteDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isLoading = true;
        if (this.board) {
          const id = Number(this.board.id);
          this.boardService.removeBoard(id).subscribe(
            async () => {
              this.isLoading = false;
              await this.router.navigate(['/dashboard']);
            },
            (error) => {
              this.isLoading = false;
              this.showError(error.status + ': ' + error.statusText);
            }
          );
        } else {
          this.isLoading = false;
          this.showError(BoardComponent.BOARD_NOT_FOUND, true);
        }
      }
    });
  }

  openDeleteTodoDialog(title: string, todo: Todo): void {
    this.deleteDialogRef = this.dialog.open(this.deleteDialog, {
      width: '250px',
      data: { dialogTitle: title },
    });
    this.deleteDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isLoading = true;
        if (this.board) {
          const id = Number(this.board.id);
          this.todoService.removeTodo(Number(todo.id)).subscribe(
            async () => {
              this.boardService.getBoard(id).subscribe(
                () => {
                  this.isLoading = false;
                },
                (error) => {
                  this.isLoading = false;
                  this.showError(error.status + ': ' + error.statusText);
                }
              );
            },
            (error) => {
              this.isLoading = false;
              this.showError(error.status + ': ' + error.statusText);
            }
          );
        } else {
          this.isLoading = false;
          this.showError('Board not found!');
        }
      }
    });
  }

  openDeleteCardDialog(title: string, todo: Todo, card: Card): void {
    this.deleteDialogRef = this.dialog.open(this.deleteDialog, {
      width: '250px',
      data: { dialogTitle: title },
    });
    this.deleteDialogRef.afterClosed().subscribe(
      (result: boolean) => {
        if (result) {
          this.isLoading = true;
          if (this.board) {
            const id = Number(this.board.id);
            this.cardService.removeCard(Number(card.id)).subscribe(
              async () => {
                todo.cards = todo.cards.filter((c: any) => c.id !== card.id);
                this.getBoard(id);
              },
              (error) => {
                this.isLoading = false;
                this.showError(error.status + ': ' + error.statusText);
              }
            );
          } else {
            this.isLoading = false;
            this.showError(BoardComponent.BOARD_NOT_FOUND, true);
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.showError(error.status + ': ' + error.statusText);
      }
    );
  }

  onDeleteCancelClick() {
    this.deleteDialogRef.close();
  }

  onAddEditCancelClick() {
    this.addEditDialogRef.close();
  }

  dropCard(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      // Move card
      console.log('move card: ', event.previousIndex, event.currentIndex);
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (this.board) {
        const id = Number(this.board.id);
        this.isLoading = true;
        this.cardService
          .moveCard(
            Number(event.container.id.replace('todo-', '')),
            event.previousIndex,
            event.currentIndex
          )
          .subscribe(
            () => {
              this.isLoading = false;
              this.getBoard(id);
            },
            (error) => {
              this.isLoading = false;
              this.showError(error.status + ': ' + error.statusText);
            }
          );
      } else {
        this.showError(BoardComponent.BOARD_NOT_FOUND, true);
      }
    } else {
      //transfer card
      console.log(
        'transfer card',
        event.item.data.id,
        event.previousContainer.id,
        event.container.id,
        event.previousIndex,
        event.currentIndex
      );
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      if (this.board) {
        const id = Number(this.board.id);
        this.cardService
          .transferCard(
            event.item.data.id,
            event.previousContainer.id.replace('todo-', ''),
            event.container.id.replace('todo-', ''),
            event.previousIndex,
            event.currentIndex
          )
          .subscribe(
            () => {
              this.isLoading = false;
              this.getBoard(id);
            },
            (error) => {
              this.isLoading = false;
              this.showError(error.status + ': ' + error.statusText);
            }
          );
      } else {
        this.showError(BoardComponent.BOARD_NOT_FOUND, true);
      }
    }
  }

  dropTodo(event: CdkDragDrop<Todo[]>) {
    console.log('move todo: ', event.previousIndex, event.currentIndex);
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    if (this.board) {
      const id = Number(this.board.id);
      this.isLoading = true;
      this.todoService
        .moveTodo(
          Number(this.board.id),
          event.previousIndex,
          event.currentIndex
        )
        .subscribe(
          () => {
            this.isLoading = false;
            this.getBoard(id);
          },
          (error) => {
            this.isLoading = false;
            this.showError(error.status + ': ' + error.statusText);
          }
        );
    } else {
      this.showError(BoardComponent.BOARD_NOT_FOUND, true);
    }
  }

  mouseEnter($event: MouseEvent) {
    this.minHeight = 30;
  }

  mouseLeave($event: MouseEvent) {
    this.minHeight = 10;
  }
}
