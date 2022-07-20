import { Component } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user.type';

@Component({
  selector: 'app-header',
  template: `
    <div class="header">
      <div
        style="display: flex;justify-content: center;align-items: center"
        class="logo logo-dark"
      >
        <a href="">
          <img src="assets/images/logo/logo-air.png" alt="Logo" />
          <img
            style="width: 40px;height: 40px"
            class="logo-fold"
            src="assets/images/logo/logo-air-fold.png"
            alt="Logo"
          />
        </a>
      </div>
      <div class="logo logo-white">
        <a href="">
          <img src="assets/images/logo/logo-white.png" alt="Logo" />
          <img
            class="logo-fold"
            src="assets/images/logo/logo-fold-white.png"
            alt="Logo"
          />
        </a>
      </div>
      <div class="nav-wrap">
        <ul class="nav-left">
          <li class="desktop-toggle">
            <a (click)="toggleFold()">
              <i
                nz-icon
                [nzType]="isFolded ? 'menu-unfold' : 'menu-fold'"
                theme="outline"
              ></i>
            </a>
          </li>
          <li class="mobile-toggle">
            <a (click)="toggleExpand()">
              <i
                nz-icon
                [nzType]="isExpand ? 'menu-fold' : 'menu-unfold'"
                theme="outline"
              ></i>
            </a>
          </li>
        </ul>
        <ul class="nav-right">
          <div *ngIf="currentUser$ | async as user">
            <a nz-dropdown nzTrigger="click" [nzDropdownMenu]="menu">
              <nz-avatar
                nzSize="large"
                [nzText]="user.name[0].toUpperCase()"
                [ngStyle]="{
                  'background-color': '#308af1',
                  'margin-right': '16px'
                }"
              >
              </nz-avatar>
            </a>
            <nz-dropdown-menu #menu="nzDropdownMenu">
              <ul nz-menu>
                <li [routerLink]="['profile']" nz-menu-item>Profili</li>
                <li (click)="onLogout()" nz-menu-item>Dil</li>
              </ul>
            </nz-dropdown-menu>
          </div>
        </ul>
      </div>
    </div>
  `,
  styles: ['.ant-dropdown-menu {margin-top: 20px}'],
})
export class HeaderComponent {
  isFolded: boolean;
  isExpand: boolean;
  currentUser$: Observable<User> = this.auth.currentUser;

  constructor(
    private themeService: ThemeConstantService,
    private auth: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
  }

  toggleFold() {
    this.isFolded = !this.isFolded;
    this.themeService.toggleFold(this.isFolded);
  }

  toggleExpand() {
    this.isFolded = false;
    this.isExpand = !this.isExpand;
    this.themeService.toggleExpand(this.isExpand);
    this.themeService.toggleFold(this.isFolded);
  }

  onLogout() {
    this.auth.logout();
    this.router.navigate(['auth/login']).then();
  }
}
