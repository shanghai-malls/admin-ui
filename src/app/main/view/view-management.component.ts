import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {View, ViewService} from '../../model/view.service';
import {NzModalService} from 'ng-zorro-antd';
import {modalZIndex} from '../../model/function';
import {Router} from '@angular/router';
import {LANG} from '../../model/message-source';
import {I18nService} from '../../model/i18n.service';

@Component({
    templateUrl: 'view-management.component.html',
    styleUrls: ['view-management.component.less']
})
export class ViewManagementComponent implements OnInit {
    @Input() subject?: Subject<any>;
    views: View[] = [];
    displayViews: View[];
    languageFilters: { text: string; value: string }[];
    languages = LANG;
    searchValue: string;

    constructor(private viewService: ViewService, private i18n: I18nService, private modalService: NzModalService, private router: Router) {
        this.viewService.subscribe(views=>{
            this.views = views;
            this.displayViews = [...this.views];
        })
    }

    ngOnInit(): void {
        this.languageFilters = [];
        for (let lang in this.languages) {
            this.languageFilters.push({value: lang, text: this.languages[lang]})
        }
    }


    filter(params: any) {
        this.displayViews = this.views.filter((v,i)=>{
            let filter = true;
            if(params.language) {
                filter = v.language == params.language;
            }
            if(params.name) {
                filter = filter && v.name.indexOf(params.name) != -1;
            }
            return filter;
        });
    }

    select(view: any) {
        if (this.subject) {
            this.subject.next(view);
        }
    }

    delete(viewId: number, index: number, content: any[]) {
        let modalAgent = this.modalService.confirm({
            nzContent: `确定删除视图？`,
            nzZIndex: modalZIndex(),
            nzOnCancel: () => {
                modalAgent.destroy();
            },
            nzOnOk: () => {
                this.viewService.deleteView(viewId).then(() => {
                    content.splice(index, 1);
                    modalAgent.destroy();
                });
            }
        }, 'warning');
    }

    edit(viewId?: number) {
        let extras;
        if (viewId != null) {
            extras = {queryParams: {id: viewId}};
        }
        this.router.navigate(["/views/design"], extras);
    }
}
