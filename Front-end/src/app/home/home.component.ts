import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  message: string;
  constructor(private token: TokenStorageService,
              private usersService: UserService) { }
  info: any;
  ngOnInit(): void {
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      userId: this.token.getUserId(),
      authorities: this.token.getAuthorities(),
    };
  }

  logout() {
    this.token.signOut();
    window.location.reload();
  }

  delete(): void {
    if(confirm("Do you realy want to continue this process?")){
      this.usersService.deleteUser(parseInt(this.token.getUserId())).subscribe(
        (response) => {
          console.log(response);
          alert("Unsubscribe success, seen you next time");
          this.token.signOut();
          window.location.reload();
        }
      )
    }
  }
}
