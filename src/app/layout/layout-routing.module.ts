import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../usuarios/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'prefix' },
            {
                path: 'dashboard',
                loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'clientes',
                loadChildren: () => import('./clientes/clientes.module').then((m) => m.ClientesModule),
            },
            {
                path: 'cursos',
                loadChildren: () => import('./cursos/cursos.module').then((m) => m.CursosModule),
            },
            {
                path: 'herramientas', canActivate: [AuthGuard],
                loadChildren: () => import('./herramientas/herramientas.module').then((m) => m.HerramientasModule),
            },
            {
                path: 'proyectos',
                loadChildren: () => import('./proyectos/proyectos.module').then((m) => m.ProyectosModule),
            },
            {
                path: 'perfil',
                loadChildren: () => import('./perfil/perfil.module').then((m) => m.PerfilModule),
            },

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
