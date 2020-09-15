import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../auth/token-storage.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'http://localhost:8080/api/test/user';
  private pmUrl = 'http://localhost:8080/api/test/pm';
  private adminUrl = 'http://localhost:8080/api/test/admin';
  private userDeletionUrl = 'http://localhost:8080/api/auth/';

  constructor(private http: HttpClient,
              private token: TokenStorageService) { }

  getUserBoard(): Observable<any> {
    return this.http.get(this.userUrl);
  }

  getPMBoard(): Observable<any> {
    return this.http.get(this.pmUrl);
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(this.adminUrl);
  }

  deleteUser(id: number) {
    return this.http.delete<string>(this.userDeletionUrl + id, httpOptions);
  }
}
