import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddResidenceComponent } from './add-residence/add-residence.component';
import { ResidencesComponent } from './residences.component';
import { ResidenceDetailsComponent } from './residence-details/residence-details.component';

const routes: Routes = [
  {
    path: '',
    component: ResidencesComponent,
  },
  {
    path: 'new',
    component: AddResidenceComponent,
    data: {
      title: "Shto vendbanim të ri"
    }
  },
  {
    path: ':id/details',
    component: ResidenceDetailsComponent,
    data: {
      title: 'Detajet e vendbanimit'
    }
  },
  {
    path: ':id/edit',
    component: AddResidenceComponent,
    data: {
      title: 'Edito vendbanimin'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResidencesRoutingModule { }
