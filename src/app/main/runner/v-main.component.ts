import {NavigationEnd, Router} from '@angular/router';
import {View, ViewService} from '../../model/view.service';
import {Component, OnDestroy} from '@angular/core';
import {RouterEvent} from '@angular/router/src/events';
import {Subscription} from 'rxjs';

@Component({
    selector: 'v-main',
    template: `
        <v-part *ngIf="data" [data]="data" [path]="path" [route]="route"></v-part>
    `
})
export class VMainComponent implements OnDestroy {

    data: any;

    path: string;

    route: string;

    un: Subscription;

    constructor(private router: Router, private viewService: ViewService) {
        this.un = this.router.events.subscribe(this.initResource);

    }

    ngOnDestroy(): void {
        this.un.unsubscribe();
    }


    initResource = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            this.path = event.url;
            let i1 = this.router.url.indexOf('?');
            let i2 = this.router.url.indexOf(';');
            let i3 = this.router.url.indexOf('#');
            let indexes = [i1, i2, i3].filter(v => v > 0);
            if(indexes.length > 0) {
                let index = Math.min(...indexes);
                this.path = this.path.substring(0, index);
            }
            if (this.path && this.path !== '/') {
                this.viewService.getCompatibleView(this.path).then(this.initViewData);
            }
        }
    };


    initViewData = (view) => {
        this.data = view.data;
        this.route = view.path;
    };



}
