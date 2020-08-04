import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogCreation } from '../models/blog-creation';
import { Subject } from 'rxjs';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class BlogsService {
  blogs$ = new Subject<BlogCreation[]>();
  private createBlogUrl = 'http://localhost:8080/api/create/post'; 

  constructor(private http: HttpClient) {
  }

  createBlog(blog: BlogCreation): Observable<string> {
    return this.http.post<string>(this.createBlogUrl, blog, httpOptions);
  }

  getBlogs() {
    this.http.get(this.createBlogUrl).subscribe(
      (blogs: BlogCreation[]) => {
        this.blogs$.next(blogs);
      },
      (error) => {
        this.blogs$.next([]);
        console.error(error);
      }
    );
  }
}