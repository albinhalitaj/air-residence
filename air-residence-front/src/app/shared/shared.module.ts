import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ThemeConstantService } from './services/theme-constant.service';
import {JwtInterceptor} from './interceptor/token.interceptor';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzRateModule} from 'ng-zorro-antd/rate';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {NzNotificationModule} from 'ng-zorro-antd/notification';
import {NzImageModule} from 'ng-zorro-antd/image';
import {TemplateModule} from './template/template.module';

export function tokenGetter(): string {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  return currentUser.token;
}

const nzModules = [
  NzFormModule,
  NzButtonModule,
  NzSelectModule,
  NzCardModule,
  NzTableModule,
  NzBadgeModule,
  NzAvatarModule,
  NzInputModule,
  NzTabsModule,
  NzIconModule,
  NzToolTipModule,
  NzUploadModule,
  NzModalModule,
  NzRateModule,
  NzTagModule,
  FormsModule,
  NzSkeletonModule,
  NzNotificationModule,
  NzImageModule,
]

@NgModule({
    exports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        NzIconModule,
        PerfectScrollbarModule,
      ...nzModules
    ],
    imports: [
        RouterModule,
        CommonModule,
        NzIconModule,
        NzToolTipModule,
        PerfectScrollbarModule,
      ...nzModules
    ],
    providers: [
        ThemeConstantService,
      {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }
    ]
})

export class SharedModule { }
