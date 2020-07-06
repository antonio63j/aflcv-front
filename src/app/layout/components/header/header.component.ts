import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../usuarios/auth.service';

import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FileSaverService } from 'ngx-filesaver';

import { DownloadCvService } from '../../../download-cv/download-cv.service';
import { HttpParams } from '@angular/common/http';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfiguracionCvPdf} from '../../../shared/modelos/configuracion-cv-pdf';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public pushRightClass: string;

    // public dropdownList = [];
    // public selectedItems = [];
    // public dropdownSettings: IDropdownSettings = {};
    configuracionCvPdf: ConfiguracionCvPdf =  new(ConfiguracionCvPdf);

    private observ$: Subscription = null;
    private unsubscribe$ = new Subject();
    // public placeholder = 'Configuración del CV para download';

    // public dropdownSettings: any = {};

    constructor(
        private translate: TranslateService,
        public router: Router,
        public authService: AuthService,
        public downloadCvService: DownloadCvService,
        private fileSaverService: FileSaverService
    ) {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd && window.innerWidth <= 992 && this.isToggled()) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        this.pushRightClass = 'push-right';
    }

    onItemSelect(item: any) {
        console.log(item);
    }
    onSelectAll(items: any) {
        console.log(items);
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

    onLoggedout() {
        // localStorage.removeItem('isLoggedin');
        this.authService.logout();
        this.router.navigate(['\dashboard']);
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    public downloadPdf() {
        const filename = 'Curriculum_Vitae.pdf';

        // const p: {} = {};
        // this.selectedItems.forEach (element => {
        //   p[element.item_text] = 'yes';
        // } );
        // const parametros = new HttpParams({fromObject: p});

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
