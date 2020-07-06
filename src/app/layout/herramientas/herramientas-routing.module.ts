import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HerramientasComponent } from './herramientas.component';

const routes: Routes = [
    { path: '', component: HerramientasComponent },
    { path: 'tipo/:tipo', component: HerramientasComponent },


];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HerramientasRoutingModule {}
