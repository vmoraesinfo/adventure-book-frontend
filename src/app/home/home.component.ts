import { Component, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';
import { ProgressService } from '../services/progress.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgClass],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  search = signal('');
  activeFilters = signal<string[]>([]);

 

  difficultyColors: Record<string, string> = {
    EASY: 'badge-easy',
    MEDIUM: 'badge-medium',
    HARD: 'badge-hard',
  };

  categoryColors: Record<string, string> = {
      Fantasy: 'badge-fantasy',
      Adventure: 'badge-adventure',
      'High Fantasy': 'badge-high-fantasy',
  };

  get allFilters(): string[] {
        const books = this.bookService.books();
        const filters = books.flatMap((b) =>{
            const t = b.tags.map((t: { name: string }) => t.name);
            const c = b.category.name;
            const diff = b.difficulty;
            return [...t, c, diff];
      });

        return Array.from(new Set(filters)).sort() as string[];
  }



   filteredBooks = computed(() => {
      const q = this.search().toLowerCase();
      const filters = this.activeFilters();
      return this.bookService.books().filter((b) => {
        const matchSearch = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
        const matchFilter = filters.length === 0 || filters.some((f) => b.difficulty.includes(f) || b.tags.map((tag: { name: string }) => tag.name).includes(f) || b.category.name.includes(f));
        return matchSearch && matchFilter;
      });
    });

  constructor(private bookService: BookService,private progressService: ProgressService, private router: Router) {}

  toggleFilter(tag: string): void {
    this.activeFilters.update((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  isFilterActive(tag: string): boolean {
    return this.activeFilters().includes(tag);
  }

  startGame(book: Book): void {
    this.progressService.loadProgress(book.id).then((progress) => {
      this.bookService.startGame(book,progress);
      this.router.navigate(['/game']);
    });
    
  }

  get bookCount(): number {
    return this.bookService.books().length;
  }
}