import {NavigationEnd, RouterEvent, Router} from '@angular/router';
import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {View, Row, Component as UIComponent} from '../public/model';
import {I18nService} from '../public/service/i18n.service';
import {ViewService} from '../public/service/view.service';
import {RouterService} from '../public/service/router.service';

@Component({
    selector: 'd-main',
    template: `
        <d-part *ngIf="view?.data" [component]="view?.data"></d-part>
    `
})
export class DMainComponent implements OnDestroy {

    view: View;

    rawData: any;


    un: Subscription;

    constructor(private router: Router,
                private routerService: RouterService,
                private i18nService: I18nService,
                private viewService: ViewService) {
        this.un = this.router.events.subscribe(this.initResource);
    }

    ngOnDestroy(): void {
        this.un.unsubscribe();
    }


    initResource = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            let path = this.routerService.getContentComponentPath().substring(2); //remove`/d`prefix
            if(path) {
                this.viewService.getCompatibleView(decodeURIComponent(path)).then(view => {
                    this.view = view;
                    this.rawData = view.data;
                    this.view.data = UIComponent.create(view.data);
                });
            } else{
                this.view = {language: this.i18nService.getLocale(), path: '/please-input-unique-path', name: 'view name', data: new Row()};
            }
        }

    };

    revert() {
        this.view.data = UIComponent.create(this.rawData);
    }

}
