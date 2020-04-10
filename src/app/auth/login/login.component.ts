import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  private authStatusSub: Subscription;
  isLoading = false;
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

  onLogin(form: NgForm) {
    if (form.invalid){
      return;
    }
    this.authService.login(form.value.email, form.value.password);
    this.isLoading= true;

  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
