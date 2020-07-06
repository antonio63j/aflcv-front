import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProyectosComponent } from './proyectos.component';
import { ProyectoFormComponent } from './proyecto-panel/proyecto-form/proyecto-form.component';

const routes: Routes = [
    { path: '', component: ProyectosComponent },
    // { path: 'form', component: HerramientaFormComponent }
    {path: 'idCliente/:idCliente/:nombre', component: ProyectosComponent},


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ProyectosRoutingModule {}
