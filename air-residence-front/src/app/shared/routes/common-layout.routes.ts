import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import {ProfileComponent} from '../../profile/profile.component';

export const CommonLayout_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule),
        canLoad: [AuthGuard]
    },
    {
        path: 'residences',
        data: {
          title: 'Vendbanimet'
        },
        loadChildren: () => import('../../residences/residences.module').then(_ => _.ResidencesModule),
        canLoad: [AuthGuard],
    },
    {
        path: 'profile',
        data: {
          title: 'Profili'
        },
        component: ProfileComponent
    }
];
