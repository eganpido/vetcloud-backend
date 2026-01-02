import { Routes } from '@angular/router';
// Siguraduha nga husto ang folder path (e.g., kon naa sila sa sulod sa 'components' folder)
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';

export const routes: Routes = [
    {
        path: '',
        component: LandingPageComponent
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'customers',
        component: CustomerListComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];