import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {


  isLoading = false;
  private authStatusSub: Subscription;
  constructor(private authService : AuthService) { }

  ngOnInit(): void {
    this.authStatusSub =
       this.authService
       .getAuthStatusListener()
       .subscribe((isAuth)=>{
          if(!isAuth){
            this.isLoading = false;
          }
       })
  }

  onSignup(form: NgForm) {
    if (form.invalid){
      return;
    }
    this.authService.createUser(form.value.email, form.value.password);
    this.isLoading= true;
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
