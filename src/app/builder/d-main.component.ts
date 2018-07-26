import {NavigationEnd, Router} from '@angular/router';
import {View, ViewService} from '../model/view.service';
import {Component, OnDestroy} from '@angular/core';
import {RouterEvent} from '@angular/router/src/events';
import {Subscription} from 'rxjs';
import {Row} from '../model/ui';
import {I18nService} from '../model/i18n.service';

@Component({
    selector: 'd-main',
    template: `
        <d-part *ngIf="view?.data" [view]="view?.data"></d-part>
    `
})
export class DMainComponent implements OnDestroy {

    view: View;


    un: Subscription;

    constructor(private router: Router,
                private i18nService: I18nService,
                private viewService: ViewService) {
        this.un = this.router.events.subscribe(this.initResource);

    }

    ngOnDestroy(): void {
        this.un.unsubscribe();
    }


    initResource = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            let path = event.url.substring(2); //remove`/d`prefix
            let i1 = this.router.url.indexOf('?');
            let i2 = this.router.url.indexOf(';');
            let i3 = this.router.url.indexOf('#');
            let indexes = [i1, i2, i3].filter(v => v > 0);
            if(indexes.length > 0) {
                let index = Math.min(...indexes);
                path = path.substring(0, index);
            }
            if(path) {
                this.viewService.getCompatibleView(path).then(view => this.view = view);
            } else{
                this.view = {language: this.i18nService.getLocale(), path: '/please-input-unique-path', name: 'view name', data: new Row()};
            }
        }

    };



}
