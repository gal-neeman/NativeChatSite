import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { UserGuard } from './guards/user.guard';

export const routes: Routes = [
    {
        path: "login", 
        component: LoginComponent
    },
    {
        path: "register",
        loadComponent: () => import('./components/pages/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: "app", 
        loadComponent: () => import('./components/pages/app/app.component').then(m => m.AppComponent),
        canActivate: [UserGuard]
    },
    {
        path: "**",
        loadComponent: () => import('./components/pages/app/app.component').then(m => m.AppComponent),
        canActivate: [UserGuard]
    }
];
