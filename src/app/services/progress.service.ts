import { Injectable } from "@angular/core";
import { Progress } from "../models/progress.model";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/internal/Observable";
import { tap } from "rxjs";



@Injectable({ providedIn: 'root' })
export class ProgressService {

    private progressId: string | undefined = undefined;

    constructor(private http: HttpClient) {}

    saveProgress(progress: Progress):  Observable<Progress>  {
        progress.id = this.progressId;
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        return this.http.post<Progress>('http://localhost:8080/progress', progress, { headers }).pipe(
        tap((savedProgress: Progress) => {
          
          this.progressId = savedProgress.id ? undefined : savedProgress.id;
        }));
    }
    async loadProgress(bookId: string): Promise<Progress | null> {
    const res = await fetch(`http://localhost:8080/progress/${bookId}`);
    if (!res.ok) {
        throw new Error(`Failed to load progress: ${res.status} ${res.statusText}`);
    }
    const text = await res.text();
    if (!text) {
        return null;
    }

    return JSON.parse(text) as Progress;
    }
      
}