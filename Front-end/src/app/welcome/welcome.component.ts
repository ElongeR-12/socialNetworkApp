import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../auth/token-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  username: string;
  constructor( private tokenStorage: TokenStorageService) { }
  ngOnInit(): void {
    this.username = this.tokenStorage.getUsername();
  }
}
