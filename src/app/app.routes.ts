// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeFormComponent } from './employee-form.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: 'employees', pathMatch: 'full' },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'add-employee', component: EmployeeFormComponent },
  { path: 'edit-employee/:id', component: EmployeeFormComponent }
];
