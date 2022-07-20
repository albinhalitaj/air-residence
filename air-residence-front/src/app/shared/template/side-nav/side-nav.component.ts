import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';

@Component({
  selector: 'app-sidenav',
  template: ` <perfect-scrollbar class="side-nav" sideNav>
    <ul
      class="ant-menu ant-menu-root ant-menu-inline side-nav-menu"
      [ngClass]="{
        'ant-menu-inline-collapsed': isFolded,
        'ant-menu-dark': isSideNavDark
      }"
    >
      <li
        [ngClass]="
          item.submenu.length > 0
            ? 'ant-menu-submenu ant-menu-submenu-inline'
            : 'ant-menu-item'
        "
        *ngFor="let item of menuItems"
        [routerLinkActive]="
          item.submenu.length > 0
            ? 'ant-menu-submenu-open'
            : 'ant-menu-item-selected'
        "
        [routerLinkActiveOptions]="{ exact: true }"
      >
        <a
          href="javascript:void(0);"
          class="ant-menu-submenu-title"
          *ngIf="item.submenu.length > 0"
        >
          <i
            *ngIf="item.iconType == 'nzIcon'"
            nz-icon
            [nzType]="item.icon"
            [theme]="item.iconTheme"
          ></i>
          <i
            *ngIf="item.iconType == 'fontawesome'"
            class="m-r-10"
            [ngClass]="[item.iconTheme, item.icon]"
          ></i>
          <span>{{ item.title }}</span>
          <i class="ant-menu-submenu-arrow"></i>
        </a>
        <a
          [routerLink]="item.path"
          (click)="closeMobileMenu()"
          *ngIf="item.submenu.length === 0"
        >
          <i
            *ngIf="item.iconType == 'nzIcon'"
            nz-icon
            [nzType]="item.icon"
            [theme]="item.iconTheme"
          ></i>
          <i
            *ngIf="item.iconType == 'fontawesome'"
            class="m-r-10"
            [ngClass]="[item.iconTheme, item.icon]"
          ></i>
          <span>{{ item.title }}</span>
        </a>
      </li>
    </ul>
  </perfect-scrollbar>`,
})
export class SideNavComponent {
  public menuItems: any[];
  isFolded: boolean;
  isSideNavDark: boolean;
  isExpand: boolean;

  constructor(private themeService: ThemeConstantService) {}

  ngOnInit(): void {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
    this.themeService.isSideNavDarkChanges.subscribe(
      (isDark) => (this.isSideNavDark = isDark)
    );
  }

  closeMobileMenu(): void {
    if (window.innerWidth < 992) {
      this.isFolded = false;
      this.isExpand = !this.isExpand;
      this.themeService.toggleExpand(this.isExpand);
      this.themeService.toggleFold(this.isFolded);
    }
  }
}
