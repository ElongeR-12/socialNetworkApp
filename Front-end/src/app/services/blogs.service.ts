import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BlogCreation } from '../models/blog-creation';
import { LikeInfo } from '../models/like-info';
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
  private likeBlogUrl = 'http://localhost:8080/api/blogs/';
  private baseUrl = 'http://localhost:8080/api/create/show/blogs';
  private blogDeletionUrl = 'http://localhost:8080/api/create/delete/';

  constructor(private http: HttpClient) {}

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
  getBlogById(id: number) {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8080/api/create/' + id).subscribe(
        (blog: BlogCreation) => {
          resolve(blog);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
  getBlogAssociationWithConnectedLikers(id: number) {
    return new Promise((resolve, reject) => {
        this.http.get('http://localhost:8080/api/create/test/postAsso/'+ id).subscribe(
            (blogs: BlogCreation) => {
              resolve(blogs);
            },
            (error) => {
              reject(error);
          }
        )
      })
  }
  likeBlog(id: number, likeInfo: LikeInfo) {
    return this.http.post<string>(this.likeBlogUrl + id + '/vote', likeInfo, httpOptions);
  }

  dislikeBlog(id: number, likeInfo: LikeInfo) {
    return this.http.post<string>(this.likeBlogUrl + id + '/vote', likeInfo, httpOptions);
  }

  getAll(params: any): Observable<any> {
    return this.http.get(this.baseUrl, { params });
  }
  
}