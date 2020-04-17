import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer : any;
  constructor(private http: HttpClient, private router : Router) {

  }

  getIsAuth(){
    return this.isAuth;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getToken() {
    return this.token;
  }

  createUser(nom:string, prenom:string, email:string, password:string){
    const authData: AuthData = {email:email, password: password};
    const profileData = {authData:authData, nom:nom, prenom:prenom};
    this.http.post("http://localhost:3000/api/user/signup", profileData).subscribe( ()=>{
      this.login(email, password);
    }, error => {
      this.authStatusListener.next(false);
    }) ;

  };

  login(email:string, password:string) {
    const authData: AuthData = {email:email, password: password};
    this.http.post<{token:string, expiresIn : number}>("http://localhost:3000/api/user/login", authData)
      .subscribe(response=>{
        if(response.token) {
          this.token = response.token;
          this.isAuth = true;
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);

          const now = new Date();
          const expiration =new Date( now.getTime() + (expiresInDuration*1000))
          this.saveAuthData(this.token, expiration)
          this.authStatusListener.next(true);
          this.router.navigate(['/']);
        }

      }, error => {
        this.authStatusListener.next(false);
      })
  }

  autoAuthUser(){
    const authInformation =  this.getAuthData()
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
      this.token = authInformation.token;
      this.isAuth = true;
      this.authStatusListener.next(true);
      this.setAuthTimer(expiresIn/1000);
    }
  }
  logout() {
    this.token = null;
    this.isAuth = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAithData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    } , duration * 1000);
  }

  private saveAuthData (token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }
  private clearAithData () {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    if (!token || !expirationDate ){
      return;
    }
    return {
      token: token,
      expirationDate : new Date(expirationDate),
    };
  }


}
