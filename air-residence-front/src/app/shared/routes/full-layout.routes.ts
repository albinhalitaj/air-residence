import { Routes } from '@angular/router';
import {AuthGuard } from '../guards/auth.guard';

export const FullLayout_ROUTES: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('../../auth/auth.module').then(m => m.AuthModule),
        canLoad: [AuthGuard]
    }
];
