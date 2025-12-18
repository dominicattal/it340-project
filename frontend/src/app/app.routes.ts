import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Home } from './home/home';
import { Test } from './test/test';
import { Kits } from './kits/kits';
import { Profile } from './profile/profile';
import { Logout } from './logout/logout';
import { Bookmarks } from './bookmarks/bookmarks';


export const routes: Routes = [
    {
        path: '',
        redirectTo:'/home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'test',
        component: Test
    },
    {
        path: 'kits',
        component: Kits
    },
    {
        path: 'profile',
        component: Profile
    },
    {
        path: 'bookmarks',
        component: Bookmarks
    },
    {
        path: 'logout',
        component: Logout
    }
];
