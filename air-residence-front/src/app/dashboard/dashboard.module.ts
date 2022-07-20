import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

const antdModule = [NzButtonModule, NzStatisticModule];

@NgModule({
  imports: [SharedModule, DashboardRoutingModule, ...antdModule],
  exports: [],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
