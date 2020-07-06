import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalFormModule } from '../../shared/modules/modal-form/modal-form.module';
import { PaginatorComponent } from '../../shared/modules/paginator/paginator.component';
import { TranslateModule } from '@ngx-translate/core';
import { CursosRoutingModule } from './cursos-routing.module';
import { PageHeaderModule } from '../../shared/modules/page-header/page-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CursosService } from './cursos.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';

import { CursoFormComponent } from './curso-form/curso-form.component';
import { CursosComponent } from './cursos.component';
import { PaginatorModule } from '../../shared/modules/paginator/paginator.module';

@NgModule({
    declarations: [
        CursosComponent
        // , CursoFormComponent
    ],
    imports: [
        ModalFormModule,
        CommonModule,
        CursosRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        PaginatorModule
    ],
    providers: [
        // ModalConModeloService
       //  , CursosService
    ]
})
export class CursosModule { }
