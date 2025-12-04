import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Register } from './register/register';
import { Home } from './home/home';
import { Test } from './test/test';
import { Kits } from './kits/kits';
import { Paints } from './paints/paints';
import { Tools } from './tools/tools';
import { Profile } from './profile/profile';


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
        path: 'paints',
        component: Paints
    },
    {
        path: 'tools',
        component: Tools
    },
    {
        path: 'profile',
        component: Profile
    }
];
