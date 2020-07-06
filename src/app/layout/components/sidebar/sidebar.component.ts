import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../usuarios/auth.service';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FileSaverService } from 'ngx-filesaver';

import { DownloadCvService } from '../../../download-cv/download-cv.service';
import { HttpParams } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TiposHerramientasService } from '../../../shared/services/tipos-herramientas.service';
import { TipoHerramienta } from '../../../shared/modelos/tipo-herramienta';
import { ConfiguracionCvPdf} from '../../../shared/modelos/configuracion-cv-pdf';

interface SubMenu {
    routLink: string;
    key: string;
    class: string;
    keyView: string;
  }

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})


export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    subMenusHerramientas: TipoHerramienta [];
    configuracionCvPdf: ConfiguracionCvPdf =  new(ConfiguracionCvPdf);
    private observ$: Subscription = null;
    private unsubscribe$ = new Subject();

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(
        private translate: TranslateService,
        public router: Router,
        public tiposHerramientasService: TiposHerramientasService,
        public authService: AuthService,
        public downloadCvService: DownloadCvService,
        private fileSaverService: FileSaverService
        ) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        this.subMenusHerramientas = tiposHerramientasService.getTipoHerramientas();

        });
    }

    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        // localStorage.removeItem('isLoggedin');
        this.authService.logout();
        this.router.navigate(['\dashboard']);
    }
    onSelectAll(items: any) {
    }

    public downloadPdf() {
        const filename = 'Curriculum_Vitae.pdf';
        let parametros = new HttpParams();
        this.configuracionCvPdf.selectedItems.forEach(element => {
            parametros = parametros.set(element.item_text, 'yes');
        });

        this.observ$ = this.downloadCvService.downloadPdfCv(filename, parametros).pipe(
            takeUntil(this.unsubscribe$)
        )
            .subscribe(
                res => {
                    this.fileSaverService.save(res.body, filename);
                }
                , err => {
                    console.log(`error=${JSON.stringify(err)}`);
                }

            );
    }


}
