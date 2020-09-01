import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Like } from '../models/like';
@Injectable({
  providedIn: 'root'
})
export class LikeService {
  likes$ = new Subject<Like[]>();
  constructor(private http: HttpClient) { }

getLikes() {
  return new Promise((resolve, reject) => {
      this.http.get('http://localhost:8080/api/blogs/votes').subscribe(
          (like: Like) => {
            resolve(like);
          },
          (error) => {
            reject(error);
        }
      )
    })
  }
}
