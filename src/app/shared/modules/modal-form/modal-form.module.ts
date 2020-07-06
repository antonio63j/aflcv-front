import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule} from '@angular/material/button';
import { CursoFormComponent } from '../../../layout/cursos/curso-form/curso-form.component';
import { HerramientaFormComponent } from '../../../layout/herramientas/herramienta-form/herramienta-form.component';
import { ProyectoPanelComponent } from '../../../layout/proyectos/proyecto-panel/proyecto-panel.component';
import { ClienteFormComponent } from '../../../layout/clientes/cliente-form/cliente-form.component';

import { ClienteDetalleComponent } from '../../../layout/clientes/cliente-detalle/cliente-detalle.component';

import { MatExpansionModule } from '@angular/material/expansion';
import { ProyectoHerramientasComponent} from '../../../layout/proyectos/proyecto-panel/proyecto-herramientas/proyecto-herramientas.component';
import { ProyectoDescripcionComponent} from '../../../layout/proyectos/proyecto-panel/proyecto-descripcion/proyecto-descripcion.component';
import { ProyectoFormComponent } from '../../../layout/proyectos/proyecto-panel/proyecto-form/proyecto-form.component';
import { ProyectoEstadoVisorComponent } from '../../../layout/proyectos/proyecto-panel/proyecto-estado-visor/proyecto-estado-visor.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,

        AngularEditorModule,
        MatCheckboxModule,
        // FormsModule,
        // ReactiveFormsModule,
        MatExpansionModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatCardModule
        
        // MatExpansionModule
    ],

    declarations: [
       CursoFormComponent,
       ClienteFormComponent,
       ClienteDetalleComponent,

    //    ClienteDetalleComponent,
       
       HerramientaFormComponent,
       ProyectoPanelComponent,
       ProyectoFormComponent,
       ProyectoDescripcionComponent,
       ProyectoHerramientasComponent,
       ProyectoEstadoVisorComponent,

    ],
    exports: [
        CursoFormComponent,
        HerramientaFormComponent,
        ProyectoPanelComponent,
        ClienteFormComponent,
        ClienteDetalleComponent,
        FormsModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSortModule,
        MatCardModule

    ],
    providers: [

    ],
})
export class ModalFormModule { }
