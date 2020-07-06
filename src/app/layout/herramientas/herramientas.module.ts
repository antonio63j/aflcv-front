import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalFormModule } from '../../shared/modules/modal-form/modal-form.module';
import { PaginatorComponent } from '../../shared/modules/paginator/paginator.component';
import { TranslateModule } from '@ngx-translate/core';
import { HerramientasRoutingModule } from './herramientas-routing.module';
import { PageHeaderModule } from '../../shared/modules/page-header/page-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from '../../shared/modules/paginator/paginator.module';

import { HerramientasService } from './Herramientas.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';

import { HerramientaFormComponent } from './herramienta-form/herramienta-form.component';
import { HerramientasComponent } from './herramientas.component';

@NgModule({
    declarations: [
        HerramientasComponent
        // , HerramientaFormComponent
    ],
    imports: [
        ModalFormModule,
        CommonModule,
        HerramientasRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        PaginatorModule
    ],
    providers: [

    ]
})
export class HerramientasModule { }
