import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { BookService } from '../services/book.service';
import { Choice } from '../models/book.model';
import { ProgressService } from '../services/progress.service';
import { Progress } from '../models/progress.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  hearts = computed(() =>
    Array.from({ length: 10 }, (_, i) => i < this.bookService.health())
  );

  private dialog = inject(MatDialog);


  isDead = computed(() => this.bookService.health() === 0);

  isEnding = computed(() => this.bookService.currentSection()?.type === 'END');

  constructor(public bookService: BookService, private progressService: ProgressService, private router: Router) {}

  makeChoice(choice: Choice): void {
    this.bookService.makeChoice(choice.goToId, choice.consequence);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }


  saveProgress(): void {
    const progress: Progress = {
      sectionId: this.bookService.currentSection()?.id ?? 0,
      bookId: this.bookService.activeBook()?.id ?? '',
      life: this.bookService.health(),
    };
     this.progressService.saveProgress(progress).subscribe({
        next: (data) => {
           this.dialog.open(ConfirmDialogComponent, {
                  data: {
                    title: 'Success',
                    message: "Progress saved successfully.", 
                  } as ConfirmDialogData,
                });
        },
        error: (err) => {
            this.dialog.open(ConfirmDialogComponent, {
                  data: {
                    title: 'Error',
                    message: "Failed to save progress.", 
                  } as ConfirmDialogData,
                });
        }
    });
  }
}