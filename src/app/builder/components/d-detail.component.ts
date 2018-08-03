import {Component, Input, OnInit} from '@angular/core';
import {DetailPanel, Form, Tab, TabSet} from '../../model/ui';
import {ViewService} from '../../model/view.service';
import {removeElement} from '../../model/function';


@Component({
    selector: 'd-detail',
    template: `
        <div class="box-group">
            <d-form [form]="resultForm"></d-form>
            <nz-card *ngIf="tabset" [nzBordered]="false" >
                <nz-card-tab>
                    <ng-template #addTabTpl>
                        <div style="margin-top:8px"><a style="font-size: 16px;"><i class="anticon anticon-plus"></i></a></div>
                    </ng-template>
                    <nz-tabset nzSize="large" [(nzSelectedIndex)]="tabIndex" [nzTabBarExtraContent]="addTabTpl">
                        <nz-tab *ngFor="let tab of tabset.children;" [nzTitle]="title">
                            <ng-template #title>
                                <div class="detail-tab-title" (click)="focus(input, tab)">
                                    <span [class.hide]="tab['focused']">
                                        <span>{{tab.title}}</span>
                                        <i class="anticon anticon-close small-icon btn-icon" (click)="doDelete(tab)"></i>
                                    </span>
                                    <input #input [class.hide]="!tab['focused']" nz-input [(ngModel)]="tab.title" (blur)="blur(input, tab)"/>
                                </div>
                            </ng-template>
                        </nz-tab>
                    </nz-tabset>
                </nz-card-tab>
                <div *ngFor="let tab of tabset.children; let i = index;" [class.hide]="tabIndex !== i">
                    <d-part *ngIf="tab.content" [view]="tab.content"></d-part>
                </div>
            </nz-card>
        </div>
    `,
    styleUrls:['../../base.less']
})
export class DDetailComponent implements OnInit {
    @Input()
    detailPanel: DetailPanel;

    resultForm: Form;

    tabset: TabSet;
    tabIndex: number = 0;

    constructor(private viewService: ViewService) {
    }

    ngOnInit(): void {
        this.resultForm = this.detailPanel.resultForm;
        this.tabset = this.detailPanel.tabset;
        if(this.tabset) {
            for (let tab of this.tabset.children) {
                let {content,path} = tab;
                if(!content) {
                    this.viewService.getCompatibleView(path).then(v => tab.content = v.data);
                }
            }
        }
    }


    focus(input: HTMLInputElement, tab: Tab) {
        tab.focused = true;
        setTimeout(() => input.focus(), 50);
    }

    blur(title: HTMLInputElement, tab: Tab) {
        tab.focused = false;
        title.blur();
    }

    doDelete(tab: any){
        removeElement(this.tabset.children, tab);
    }

}
