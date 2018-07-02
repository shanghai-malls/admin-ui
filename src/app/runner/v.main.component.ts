import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {View, ViewService} from '../model/view.service';
import {Component} from '@angular/core';
import {RouterEvent} from '@angular/router/src/events';

@Component({
    selector: 'v-main',
    templateUrl: 'v.main.component.html'
})
export class MainComponent {

    data: any;

    constructor(private route: ActivatedRoute, private router: Router, private viewService: ViewService) {
        router.events.subscribe(this.initResource);
    }


    initResource = (event: RouterEvent) => {
        if (event instanceof NavigationEnd) {
            console.log(this.route);
            let segments = this.route.snapshot.url.map(s => s.path);
            if(segments.length > 0) {
                this.viewService.getCompatibleView('/'+segments.join('/')).then(this.setData);
            }
        }
    };

    setData = (view: View) => {
        this.data = view.data;
    };
}
