import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Component as UIComponent, DetailPanel, extractUriParameters, Form, formatPath, ViewService} from '../../public';

@Component({
    selector: 'v-detail',
    templateUrl: './v-detail.component.html',
    styleUrls: ['./v-detail.component.less']
})
export class VDetailComponent implements OnInit {

    @Input()
    detailPanel: DetailPanel;

    @Input()
    path?: string;

    @Input()
    route: string;

    @Input()
    @Output()
    onActions?: EventEmitter<any> = new EventEmitter();

    resultForm: Form;
    tabs: { content?: UIComponent, title: string; route: string; path: string; }[];

    tabIndex = 0;

    result: any;


    constructor(private viewService: ViewService, private router: Router) {
    }

    ngOnInit(): void {
        this.resultForm = this.detailPanel.resultForm;
        if (this.detailPanel.tabset) {
            this.tabs = [];
            let uriParameters = extractUriParameters(this.path, this.route);

            for (let tab of this.detailPanel.tabset.children) {
                let {content, title} = tab;
                let route = tab.path;
                let path = formatPath(route, uriParameters);
                let item = {path, route, title, content};
                if (!content) {
                    this.viewService.getCompatibleView(path).then(v => item.content = v.data);
                }
                this.tabs.push(item);
            }
        }
    }

    receive(action: any) {
        this.result = action.data;
    }

    navigate(url: string) {
        this.router.navigate([url]);
    }
}
