import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  userInfo: any;
  board: string;
  errorMessage: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAdminBoard().subscribe(
      data => {
        this.userInfo = {
          name: data.user.name,
          email: data.user.email
        };
        this.board = data.description;
      },
      error => {
        this.errorMessage = `${error.status}: ${error.error}`;
      }
    );
  }

}
