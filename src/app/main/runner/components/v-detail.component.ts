import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Component as UIComponent, DetailPanel, Form} from '../../../model/ui';
import {ViewService} from '../../../model/view.service';
import {extractUriParameters, formatPath} from '../../../model/function';
import {Router} from '@angular/router';


@Component({
    selector: 'v-detail',
    template: `
        <div class="box-group">
            <v-form [form]="resultForm" [value]="result" [route]="route" [path]="path"></v-form>
            <nz-card *ngIf="tabs" [nzBordered]="false" >
                <nz-card-tab>
                    <nz-tabset nzSize="large" [(nzSelectedIndex)]="tabIndex">
                        <nz-tab *ngFor="let tab of tabs;" [nzTitle]="title">
                            <ng-template #title>
                                <div class="detail-tab-title">
                                    <span>{{tab.title}}</span>
                                    <i class="anticon anticon-eye-o small-icon btn-icon" (click)="navigate(tab.path)"></i>
                                </div>
                            </ng-template>
                        </nz-tab>
                    </nz-tabset>
                </nz-card-tab>
                <div *ngFor="let tab of tabs; let i = index;" [class.hide]="tabIndex !== i">
                    <v-part *ngIf="tab.content" [path]="tab.path" [route]="tab.route" [data]="tab.content"></v-part>
                </div>
            </nz-card>
        </div>
    `,
    styleUrls: ['../../../base.less'],
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


    constructor(private viewService: ViewService,private router:Router) {
    }

    ngOnInit(): void {
        this.resultForm = this.detailPanel.resultForm;
        if(this.detailPanel.tabset) {
            this.tabs = [];
            let uriParameters = extractUriParameters(this.path, this.route);

            for (let tab of this.detailPanel.tabset.children) {
                let {content,title} = tab;
                let route = tab.path;
                let path = formatPath(route, uriParameters);
                let item = {path, route ,title, content};
                if(!content) {
                    this.viewService.getCompatibleView(path).then(v => item.content = v.data);
                }
                this.tabs.push(item);
            }
        }
    }

    receive(action: any) {
        this.result = action.data;
    }

    navigate(url: string){
        this.router.navigate([url]);
    }
}
