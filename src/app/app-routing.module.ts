import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './usuarios/guards/role.guard';

const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./layout/layout.module').then((m) => m.LayoutModule),
        // canActivate: [AuthGuard]
    },
    { path: 'login', loadChildren: () => import('./usuarios/login/login.module').then((m) => m.LoginModule) },
    { path: 'signup', loadChildren: () => import('./usuarios/signup/signup.module').then((m) => m.SignupModule) },
    { path: 'admin-roles',  canActivate: [RoleGuard], data: {role: 'ROLE_ADMIN'},
      loadChildren: () => import('./usuarios/admin-roles/admin-roles.module').then((m) => m.AdminRolesModule) },
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { enableTracing: false }) ,

             ],
    exports: [RouterModule]
})
export class AppRoutingModule {}
