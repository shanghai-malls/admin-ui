import {NavigationEnd, Router} from '@angular/router';
import {Component, OnDestroy, Optional} from '@angular/core';
import {RouterEvent} from '@angular/router/src/events';
import {Subscription} from 'rxjs';
import {ViewService} from '../public/service/view.service';
import {NzModalRef} from 'ng-zorro-antd';
import {RouterService} from '../public/service/router.service';
import {Component as UIComponent} from '../public/model';
@Component({
    selector: 'v-main',
    template: `
        <v-part *ngIf="component" [component]="component" [path]="$path" [route]="route"></v-part>
    `
})
export class VMainComponent implements OnDestroy {

    component: any;

    $path: string;

    route: string;

    un: Subscription;

    constructor(private router: Router, private viewService: ViewService,
                private routerService: RouterService, @Optional() private modalRef: NzModalRef) {
        //如果不是模态框模式就注册路由监听
        if(!this.modalRef) {
            this.un = this.router.events.subscribe(this.initResource);
        }
    }

    ngOnDestroy(): void {
        if(this.un) {
            this.un.unsubscribe();
        }
    }


    initResource = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            this.path = this.routerService.getContentComponentPath();
        }
    };


    set path(path: string){
        this.$path = path;
        if (this.$path && this.$path !== '/') {
            this.viewService.getCompatibleView(this.$path).then(this.initViewData);
        }
    }

    initViewData = (view) => {
        this.component = UIComponent.create(view.data);
        this.route = view.path;
    };



}
