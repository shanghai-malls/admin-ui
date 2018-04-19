import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {StartupService} from '../../model/startup.service';
import {ListView, View} from '../../model/model';
import {NzMessageService} from 'ng-zorro-antd';


@Component({
    selector: 'app-main',
    templateUrl: 'main.component.html',
})
export class MainComponent {

    type: string;
    path: string;
    view: View;

    constructor(private route: ActivatedRoute, private router: Router, private startupService: StartupService) {
        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.initResource();
            }
        });
    }

    initResource(): void {
        this.path = this.route.snapshot.url.join('/') || null;

        if (this.path) {
            this.startupService.getView(this.path).then(view => {
                this.view = view;
                this.type = view instanceof ListView? 'list':'detail'
            });
        } else {
            this.type = 'welcome';
        }
    }

}
