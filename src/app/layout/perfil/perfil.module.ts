import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';
import { ModalFormModule } from '../../shared/modules/modal-form/modal-form.module';

@NgModule({
    declarations: [
        PerfilComponent,
        

        // , CursoFormComponent
    ],
    imports: [
        CommonModule,
        ModalFormModule,
        PerfilRoutingModule

    ],
    providers: [
        // ModalConModeloService
       //  , CursosService
    ]
})
export class PerfilModule { }
