import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="row" style="padding:30px;">
      <div class="col-md-4">
        <nz-card nzTitle="Statistikë">
          <nz-statistic
            [nzValue]="(3 | number: '1.0-2')!"
            [nzTitle]="'Të lira'"
            [nzPrefix]="prefixTplOne"
            [nzSuffix]="'%'"
            [nzValueStyle]="{ color: '#3F8600' }"
          ></nz-statistic>
          <ng-template #prefixTplOne
            ><i nz-icon nzType="arrow-up"></i
          ></ng-template>
        </nz-card>
      </div>
      <div class="col-md-4">
        <nz-card nzTitle="Statistikë">
          <nz-statistic
            [nzValue]="(0 | number: '1.0-2')!"
            [nzTitle]="'Jo të lira'"
            [nzPrefix]="prefixTplTwo"
            [nzSuffix]="'%'"
            [nzValueStyle]="{ color: '#3F8600' }"
          ></nz-statistic>
          <ng-template #prefixTplTwo
            ><i nz-icon nzType="arrow-down" nzTheme="outline"></i
          ></ng-template>
        </nz-card>
      </div>
      <div class="col-md-4">
        <nz-card nzTitle="Statistikë">
          <nz-statistic
            [nzValue]="(1 | number: '1.0-2')!"
            [nzTitle]="'Përdorues'"
            [nzValueStyle]="{ color: '#3F8600' }"
          ></nz-statistic>
        </nz-card>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
