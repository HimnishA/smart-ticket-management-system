import { Routes } from '@angular/router';
import { MainLayoutComponent } from '../layout/main-layout.component';
import { ManagerDashboardComponent } from './features/dashboard/manager-dashboard.component';
import { AgentDashboardComponent } from './features/dashboard/agent-dashboard.component';
import { UserDashboardComponent } from './features/dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard.component';


import { ManagerTicketQueueComponent } from './features/tickets/manager-ticket-queue/manager-ticket-queue.component';
import { TicketDetailsComponent } from './features/tickets/ticket-details/ticket-details.component';



import { ReportsComponent } from './features/reports/reports.component';
import { MyTicketsComponent } from './features/tickets/my-tickets.component';
import { CategoriesComponent } from './features/admin/categories/categories.component';
import { PrioritiesComponent } from './features/admin/priorities/priorities.component';
import { SlaPoliciesComponent } from './features/admin/sla-policies/sla-policies.component';
import { AdminUsersComponent } from './features/admin/users/users.component';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: ManagerDashboardComponent,
        canActivate: [roleGuard(['SupportManager'])]
      },
      {
        path: 'agent-dashboard',
        component: AgentDashboardComponent,
        canActivate: [roleGuard(['SupportAgent'])]
      },
      {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [roleGuard(['SupportManager'])]
      },
      {
        path: 'tickets',
        component: MyTicketsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'tickets/:id',
        component: TicketDetailsComponent,
        canActivate: [authGuard]
      },
      {
        path: 'user-dashboard',
        component: UserDashboardComponent,
        canActivate: [roleGuard(['EndUser'])]
      },
      {
        path: 'admin-dashboard',
        component: AdminDashboardComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'admin/users',
        component: AdminUsersComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'admin/categories',
        component: CategoriesComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'admin/priorities',
        component: PrioritiesComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'admin/sla-policies',
        component: SlaPoliciesComponent,
        canActivate: [roleGuard(['Admin'])]
      },
      {
        path: 'manager/ticket-queue',
        component: ManagerTicketQueueComponent,
        canActivate: [roleGuard(['SupportManager'])]
      },
      {
        path: 'manager/tickets/:id',
        component: TicketDetailsComponent,
        canActivate: [authGuard, roleGuard(['SupportManager'])]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'tickets'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
