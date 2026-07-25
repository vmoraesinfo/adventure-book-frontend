import { inject, Injectable, signal } from '@angular/core';
import { Book, ResponseBook, Section } from '../models/book.model';
import { Progress } from '../models/progress.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';

  

const books: ResponseBook = await fetch('http://localhost:8080/books').then(
      (res) => res.json() as Promise<ResponseBook>
    );

@Injectable({ providedIn: 'root' })
export class BookService {
  private _books = signal<Book[]>(books.content);
  private _activeBook = signal<Book | null>(null);
  private _currentSection = signal<Section | null>(null);
  private _health = signal<number>(10);

   private dialog = inject(MatDialog);


  readonly books = this._books.asReadonly();
  readonly activeBook = this._activeBook.asReadonly();
  readonly currentSection = this._currentSection.asReadonly();
  readonly health = this._health.asReadonly();


  startGame(book: Book,progress: Progress | null): void {
    console.log('Starting game with book:', book, 'and progress:', progress);
    if (progress) {
      this._health.set(progress.life);
      const section = book.sections.find((s) => s.id === progress.sectionId) ?? book.sections[0];
      this._currentSection.set(section);
    } else {
      const begin = book.sections.find((s) => s.type === 'BEGIN') ?? book.sections[0];
      this._currentSection.set(begin);
      this._health.set(10);
    }
     this._activeBook.set(book);
  }

  makeChoice(gotoId: number | null, consequence?: { type: string; value: number; text: string }): void {
    if (consequence?.type === 'LOSE_HEALTH') {
      this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Warning',
          message: "You lost " + consequence.value + " health points. " + consequence.text, 
        } as ConfirmDialogData,
      });
      this._health.update((h) => Math.max(0, h - consequence.value));
    } else if (consequence?.type === 'GAIN_HEALTH') {
     this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Good news',
          message: "You gained " + consequence.value + " health points. " + consequence.text,
        } as ConfirmDialogData,
      });
      this._health.update((h) => Math.min(10, h + consequence.value));
    }

    if (this._health() === 0) return; 

    const book = this._activeBook();
    if (!book || gotoId === null) return;
    const next = book.sections.find((s) => s.id === gotoId);
    if (next) this._currentSection.set(next);
  }
}