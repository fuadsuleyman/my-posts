import { Injectable } from '@angular/core';
import { User } from './user.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'
const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;

  private authStatusListener = new Subject<boolean>();

  private isAuthenticated = false;

  private tokenTimer: any;

  private userId: string;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getToken() {
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getUserId(){
    return this.userId;
  }

  createUser(email: string, password: string){
    const authData: User = {email: email, password: password};
    return this.http
      .post(
        BACKEND_URL + '/signup', authData)
        .subscribe(() => {
          this.router.navigate(['/']);
        }, error => {
          this.authStatusListener.next(false);
        })
  }

  login(email: string, password: string){
    const authData: User = {email: email, password: password};
    this.http
      .post<{token: string, expiresIn: number, userId: string}>(
        BACKEND_URL + '/login',
        authData).subscribe(responseData =>{
          const token = responseData.token;
          this.token = token;
          if(token){
            const expiresInDuration = responseData.expiresIn;
            console.log(expiresInDuration);
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);

            // we take userId, in our app only why create than can delete or edit
            this.userId = responseData.userId;

            // generate expiration date and save in localstorage
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate, this.userId)
            console.log(expirationDate);
            this.router.navigate(['/']);
          }
        }, error => {
          this.authStatusListener.next(false);
        })
  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    //bunu elemesek ashibka verir
    if (!authInformation){
      return;
    }
    const now = new Date();

    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number){
    console.log(`Setting timer: ${duration}`);

    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000)
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;

    // temizlemesek yenisi kohne ile qalacaq
    clearTimeout(this.tokenTimer);
    this.clearData();

    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId)
  }

  private clearData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate){
      return;
    }
    return{
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
