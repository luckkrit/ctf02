import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BoardService } from './shared/board.service';
import { Observable } from 'rxjs';
import { Board } from './shared/board.interface';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenStorageService } from '../core/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.Emulated,
})
export class DashboardComponent implements OnInit {
  boards$: Observable<Board[]> = this.boardService.boards;
  isLoading = false;

  @ViewChild('addEditDialog') addEditDialog!: TemplateRef<any>;
  addEditDialogRef!: MatDialogRef<any>;

  constructor(
    private dialog: MatDialog,
    private boardService: BoardService,
    private snackBar: MatSnackBar,
    private router: Router,
    private tokenStorageService: TokenStorageService
  ) {}

  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    this.snackBar.dismiss();
    this.isLoading = true;
    this.boardService.getInitialBoards();
    this.boardService.getAllBoards(user.id).subscribe(
      () => {
        this.isLoading = false;
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

  openDialog() {
    this.addEditDialogRef = this.dialog.open(this.addEditDialog, {
      width: '250px',
      data: { title: '', dialogTitle: 'New Board', type: 'Board' },
    });

    this.addEditDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const user = this.tokenStorageService.getUser();
        this.isLoading = true;
        this.boardService
          .addBoard({ title: result, userId: user.id })
          .subscribe(async (board: Board) => {
            this.isLoading = false;
            await this.openBoard(board);
          });
      }
    });
  }

  async openBoard(board: Board) {
    await this.router.navigate([`/board/${board.id}`]);
  }

  onAddEditCancelClick() {
    this.addEditDialogRef.close();
  }
}
