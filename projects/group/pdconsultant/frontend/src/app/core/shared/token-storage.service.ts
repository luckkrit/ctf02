import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor() {}

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  public getRoles(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user).roles;
    }

    return null;
  }

  public isString(data: any): boolean {
    return typeof data === 'string';
  }

  public someRole(role: any, roleName: string): boolean {
    if (this.isString(role)) {
      return role === roleName;
    } else return role.title === roleName;
  }

  public isAdmin(): any {
    const roles = this.getRoles();
    return !!(
      roles && roles.some((role: any) => this.someRole(role, 'ROLE_ADMIN'))
    );
  }

  public isPatient(): any {
    const roles = this.getRoles();
    return !!(
      roles && roles.some((role: any) => this.someRole(role, 'ROLE_PATIENT'))
    );
  }

  public isDoctor(): any {
    const roles = this.getRoles();
    return !!(
      roles && roles.some((role: any) => this.someRole(role, 'ROLE_DOCTOR'))
    );
  }

  public isNurse(): any {
    const roles = this.getRoles();
    return !!(
      roles && roles.some((role: any) => this.someRole(role, 'ROLE_NURSE'))
    );
  }
}
