import { SideNavInterface } from '../../interfaces/side-nav.type';
export const ROUTES: SideNavInterface[] = [
    {
        path: 'dashboard',
        title: 'Ballina',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'dashboard',
        submenu: []
    },
    {
        path: 'residences',
        title: 'Vendbanimet',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'home',
        submenu: []
    },
    {
        path: 'users',
        title: 'Përdoruesit',
        iconType: 'nzIcon',
        iconTheme: 'outline',
        icon: 'user',
        submenu: []
    }
]
