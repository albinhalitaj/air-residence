import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {JwtHelperService} from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private router: Router,private jwtHelper: JwtHelperService) { }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (route.path === 'dashboard' || route.path === 'residences') {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser?.token && !this.jwtHelper.isTokenExpired(currentUser.token)){
        return true;
      }
      this.router.navigate(['auth/login']).then();
      return false;
    }
    else {
      if (localStorage.getItem('currentUser')){
        this.router.navigate(['dashboard']).then();
        return false;
      }
      return true;
    }
  }
}
