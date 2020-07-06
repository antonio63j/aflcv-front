import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalFormModule } from '../../shared/modules/modal-form/modal-form.module';
import { PaginatorComponent } from '../../shared/modules/paginator/paginator.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProyectosRoutingModule } from './proyectos-routing.module';
import { PageHeaderModule } from '../../shared/modules/page-header/page-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from '../../shared/modules/paginator/paginator.module';

import { ProyectosService } from './proyectos.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';

import { ProyectosComponent } from './proyectos.component';

@NgModule({
    declarations: [
        ProyectosComponent
    ],
    imports: [
        ModalFormModule,
        CommonModule,
        ProyectosRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        PaginatorModule

    ],
    providers: [

    ]
})
export class ProyectosModule { }
