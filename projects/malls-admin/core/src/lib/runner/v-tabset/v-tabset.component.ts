import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AbstractComponent, Component as UIComponent, extractUriParameters, formatPath, TabSet,} from '../../public/model';
import {Router} from '@angular/router';
import {ViewService} from '../../public/service/view.service';
import {RouterService} from '../../public/service/router.service';

@Component({
    selector: 'v-tabset',
    templateUrl: './v-tabset.component.html',
    styleUrls: ['./v-tabset.component.less']
})
export class VTabsetComponent implements OnInit, OnChanges, AbstractComponent {

    @Input()
    tabset: TabSet;

    @Input()
    path?: string;

    @Input()
    route: string;

    tabs: { content?: UIComponent, title: string; route: string; path: string; }[];

    tabIndex = 0;

    constructor(private viewService: ViewService, private routerService: RouterService) {
    }

    ngOnInit() {
        if (this.tabset) {
            this.tabs = [];
            let uriParameters = extractUriParameters(this.path, this.route);

            for (let tab of this.tabset.children) {
                let {content, title} = tab;
                let route = tab.viewPath;
                let path = formatPath(route, uriParameters);
                let item = {path, route, title, content};
                if (!content) {
                    this.viewService.getCompatibleView(path).then(v => item.content = v.data);
                }
                this.tabs.push(item);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.tabs) {
            this.ngOnInit();
        }
    }

    initComponent(component: TabSet, path: string, route: string) {
        this.tabset = component;
        this.path = path;
        this.route = route;
    }

    navigate(path: string) {
        this.routerService.navigate(path);
    }
}
