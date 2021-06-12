import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from './token-storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _isLoginSource = new BehaviorSubject<boolean>(false);
  private readonly _usernameSource = new BehaviorSubject<string>('');
  private loginUrl = `${environment.apiUrl}/api/login`;
  private registerUrl = `${environment.apiUrl}/api/register`;

  private _setIsLogin(isLogin: boolean): void {
    this._isLoginSource.next(isLogin);
  }

  private _setUsername(username: string): void {
    this._usernameSource.next(username);
  }

  isUserLoggedIn = this._isLoginSource.asObservable();
  usernameLoggedIn = this._usernameSource.asObservable();

  loginWithUsername(username: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(this.loginUrl, {
        username,
        password,
      })
      .pipe(
        tap((val) => {
          if (val.valid) {
            this.tokenStorageService.saveToken(val.token);
            this.tokenStorageService.saveUser(val.user);
          }
          this._setIsLogin(val.valid);
          this._setUsername(username);
        })
      );
  }

  loginWithEmail(email: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(this.loginUrl + '/email', {
        email,
        password,
      })
      .pipe(
        tap((val) => {
          if (val.valid) {
            this.tokenStorageService.saveToken(val.token);
            this.tokenStorageService.saveUser(val.user);
          }
          this._setIsLogin(val.valid);
          this._setUsername(val.user.username);
        })
      );
  }

  logout(): Observable<boolean> {
    this.tokenStorageService.signOut();
    return of(false).pipe(
      delay(0), // Prevent Angular Error
      tap(() => {
        this._setIsLogin(false);
        this._setUsername('');
      })
    );
  }

  checkLogin() {
    let token = this.tokenStorageService.getToken();
    let user = this.tokenStorageService.getUser();

    if (user != null) {
      this._setUsername(user.username);
    }

    if (token != null) {
      this._setIsLogin(true);
    } else {
      this._setIsLogin(false);
    }
  }

  register(username: string, password: string, email: string): Observable<any> {
    return this.httpClient.post<boolean>(this.registerUrl, {
      username,
      password,
      email,
    });
  }

  constructor(
    private httpClient: HttpClient,
    private tokenStorageService: TokenStorageService
  ) {}
}
