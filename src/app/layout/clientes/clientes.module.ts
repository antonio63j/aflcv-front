import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PaginatorComponent } from '../../shared/modules/paginator/paginator.component';
import { TranslateModule } from '@ngx-translate/core';
import { ClientesRoutingModule } from './clientes-routing.module';
import { PageHeaderModule } from '../../shared/modules/page-header/page-header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from '../../shared/modules/paginator/paginator.module';
import { ModalFormModule } from '../../shared/modules/modal-form/modal-form.module';

import { ClientesService } from './clientes.service';
import { ModalConModeloService } from '../../shared/services/modal-con-modelo.service';
import { ModalService } from '../../shared/services/modal.service';

import { ClienteDetalleComponent } from './cliente-detalle/cliente-detalle.component';
import { ClientesComponent } from './clientes.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';

@NgModule({
    declarations: [
        ClientesComponent,
        // ClienteDetalleComponent
    ],
    imports: [
        CommonModule,
        ClientesRoutingModule,
        PageHeaderModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        ModalFormModule
    ],
    providers: [

    ]
})
export class ClientesModule { }
