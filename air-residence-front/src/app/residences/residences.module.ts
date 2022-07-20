import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResidencesRoutingModule } from './residences-routing.module';
import {ResidencesComponent} from './residences.component';
import { AddResidenceComponent } from './add-residence/add-residence.component';
import {ReactiveFormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import { ResidenceDetailsComponent } from './residence-details/residence-details.component';
import {SharedModule} from '../shared/shared.module';
import {NzMessageServiceModule} from 'ng-zorro-antd/message';
import {TemplateModule} from '../shared/template/template.module';


@NgModule({
  declarations: [
    ResidencesComponent,
    AddResidenceComponent,
    ResidenceDetailsComponent,
  ],
    imports: [
        CommonModule,
        ResidencesRoutingModule,
        ReactiveFormsModule,
        SharedModule,
        NzMessageServiceModule,
        QuillModule.forRoot(),
        TemplateModule,
    ]
})
export class ResidencesModule { }
