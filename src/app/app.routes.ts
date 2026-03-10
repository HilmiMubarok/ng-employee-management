import { Routes } from '@angular/router';

import { Login } from './features/login/login';
import { EmployeeList } from './features/employee-list/employee-list';
import { EmployeeAdd } from './features/employee-add/employee-add';
import { EmployeeDetail } from './features/employee-detail/employee-detail';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'employee-list', component: EmployeeList, canActivate: [authGuard] },
  { path: 'employee-add', component: EmployeeAdd, canActivate: [authGuard] },

  { path: 'employee-detail/:username', component: EmployeeDetail, canActivate: [authGuard] },

  { path: '**', redirectTo: '/login' },
];
