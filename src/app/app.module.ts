import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatInputModule } from '@angular/material/input';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';

import { ModalService } from './shared/services/modal.service';
import { ModalConModeloService } from './shared/services/modal-con-modelo.service';

import { CursosService } from './layout/cursos/cursos.service';
import { CursoFormComponent } from './layout/cursos/curso-form/curso-form.component';
import { ModalFormModule } from './shared/modules/modal-form/modal-form.module';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatExpansionModule } from '@angular/material/expansion';
import { TokenInterceptor} from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { LoggingInterceptor } from './usuarios/interceptors/logging.interceptor';

// create our cost var with the information about the format that we want
export const MY_FORMATS = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MM YYYY',
    },
};


@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        LanguageTranslationModule,
        AppRoutingModule,
        ModalFormModule,
        // AngularEditorModule,
        // FormsModule,
        // ReactiveFormsModule,
        // MatExpansionModule

    ],

    // exports: [FormsModule, MatDatepickerModule, MatNativeDateModule],
    declarations: [
        AppComponent,
        // CursoFormComponent
    ],

    providers: [

        ModalService,
        ModalConModeloService,

        {provide: MAT_DATE_LOCALE, useValue: 'es'},
        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
    ],

    bootstrap: [AppComponent],

})
export class AppModule { }
