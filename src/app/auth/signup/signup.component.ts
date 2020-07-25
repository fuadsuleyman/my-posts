import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{

  signupForm: FormGroup;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  isLoading = false;

  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }

  ngOnInit(){
    this.signupForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)])
    });

    this.authStatusSub = this.authService.getAuthStatusListener()
    .subscribe(authStatus => {
      this.isLoading = false;
    })
  }

  onSignup(){
    if(this.signupForm.invalid){
      return;
    }
    this.isLoading = true;
    this.authService.createUser(this.signupForm.value.email, this.signupForm.value.password);
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter a email!';
    } else if (this.email.hasError('email')){
      return 'Wrong email address'
    }
   }

   getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'You must enter a password!';
    } else if (this.password.hasError('minlength')){
      return 'Minimum length must be 6 simvol';
    }
   }

   ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

}
