import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { SignUpInfo } from '../auth/signup-info';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any = {};
  signupInfo: SignUpInfo;
  isSignedUp = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  onSubmit() {
    console.log(this.form);

    this.signupInfo = new SignUpInfo(
      this.form.name,
      this.form.username,
      this.form.email,
      this.form.password);

    this.authService.signUp(this.signupInfo).subscribe(
      data => {
        console.log(data);
        this.isSignedUp = true;
        this.isSignUpFailed = false;
      },
      error => {
        console.log(error);
        if (error.error.error){
          if(error.error.error.includes('"password" with value')){
            this.errorMessage =`${'error ' + error.status}: ${error.statusText} ==> *Password must be at least 8 characters, 1 lowercase alphabetical character, 1 uppercase alphabetical character, 1 numeric character, one special character [!@#$%^&*]`
            this.isSignUpFailed = true;
          }else{
            this.errorMessage =  `${'error ' + error.status}: ${error.statusText} ==>${error.error.error}`;
            this.isSignUpFailed = true;
          }
        } else{
          this.errorMessage =`${'error ' + error.status}: ${error.statusText} ==>${error.error}`
          this.isSignUpFailed = true;
        }
      }
    );
  }
}
