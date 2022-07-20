import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs/operators';
import { IBreadcrumb } from '../../shared/interfaces/breadcrumb.type';
import { ThemeConstantService } from '../../shared/services/theme-constant.service';

@Component({
  selector: 'app-common-layout',
  template: `
    <div
      class="common-layout {{ 'is-' + selectedHeaderColor }}"
      [ngClass]="{
        'is-folded': isFolded,
        'is-side-nav-dark': isSideNavDark,
        'is-expand': isExpand
      }"
    >
      <app-header></app-header>
      <app-sidenav></app-sidenav>
      <div class="page-container">
        <div class="main-content">
          <div
            class="main-content-header"
            *ngIf="contentHeaderDisplay !== 'none'"
          >
            <h4
              class="page-title"
              *ngIf="breadcrumbs$ | async; let breadcrumbs"
            >
              {{ breadcrumbs[breadcrumbs.length - 1].label }}
            </h4>
            <nz-breadcrumb nzSeparator=">">
              <i class="m-r-5 text-gray" nz-icon nzType="home"></i>
              <nz-breadcrumb-item
                *ngFor="let breadcrumb of breadcrumbs$ | async"
              >
                <a [routerLink]="breadcrumb.url">
                  {{ breadcrumb.label }}
                </a>
              </nz-breadcrumb-item>
            </nz-breadcrumb>
          </div>
          <router-outlet></router-outlet>
        </div>
        <app-footer></app-footer>
      </div>
    </div>
  `,
})
export class CommonLayoutComponent {
  breadcrumbs$: Observable<IBreadcrumb[]>;
  contentHeaderDisplay: string;
  isFolded: boolean;
  isSideNavDark: boolean;
  isExpand: boolean;
  selectedHeaderColor: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private themeService: ThemeConstantService
  ) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child) {
            if (child.firstChild) {
              child = child.firstChild;
            } else if (
              child.snapshot.data &&
              child.snapshot.data.headerDisplay
            ) {
              return child.snapshot.data.headerDisplay;
            } else {
              return null;
            }
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        this.contentHeaderDisplay = data;
      });
  }

  ngOnInit() {
    this.breadcrumbs$ = this.router.events.pipe(
      startWith(new NavigationEnd(0, '/', '/')),
      filter((event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map((data) => this.buildBreadCrumb(this.activatedRoute.root))
    );
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isSideNavDarkChanges.subscribe(
      (isDark) => (this.isSideNavDark = isDark)
    );
    this.themeService.selectedHeaderColor.subscribe(
      (color) => (this.selectedHeaderColor = color)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
  }

  private buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadcrumb[] = []
  ): IBreadcrumb[] {
    let label = '',
      path = '/',
      display = null;

    if (route.routeConfig) {
      if (route.routeConfig.data) {
        label = route.routeConfig.data.title;
        path += route.routeConfig.path;
      }
    } else {
      label = 'Ballina';
      path += 'dashboard';
    }

    const nextUrl = path && path !== '/dashboard' ? `${url}${path}` : url;
    const breadcrumb = {
      label,
      url: nextUrl,
    } as IBreadcrumb;

    const newBreadcrumbs = label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
