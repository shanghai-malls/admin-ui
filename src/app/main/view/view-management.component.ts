import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {View, ViewService} from '../../model/view.service';
import {LANG} from '../../model/message-source';
import {I18nService} from '../../model/i18n.service';
import {ModalService} from '../../model/modal.service';
import {Selectable} from '../../model/Selectable';

@Component({
    templateUrl: 'view-management.component.html',
    styleUrls: ['view-management.component.less']
})
export class ViewManagementComponent implements OnInit,Selectable {

    @Output()
    onSelect: EventEmitter<any> = new EventEmitter();

    @Input()
    mode: 'select' | 'view' = 'view';

    views: View[] = [];
    displayViews: View[];
    languages = LANG;

    filter: { path?: string; name?: string; } = {};


    constructor(private viewService: ViewService, private i18n: I18nService, private modalService: ModalService) {

    }

    ngOnInit(): void {
        this.viewService.getViews().then(views => {
            this.views = views;
            this.displayViews = [...this.views];
        });
        this.i18n.subscribe(language => {
            this.viewService.getViews(language).then(views => {
                this.views = views;
                this.displayViews = [...this.views];
            });
        });
    }


    search() {
        this.displayViews = this.views.filter((v, i) => {
            let filtered = true;
            if (this.filter.name) {
                filtered = v.name.indexOf(this.filter.name) != -1;
            }
            if (this.filter.path) {
                filtered = filtered && v.path.indexOf(this.filter.path) != -1;
            }
            return filtered;
        });
    }

    reset() {
        this.filter = {};
        this.displayViews = [...this.views];
    }

    emit(view: any) {
        this.onSelect.next(view);
    }

    delete(path: string) {
        let modalAgent = this.modalService.confirm({
            nzContent: `确定删除视图？`,
            nzOnOk: () => {
                this.viewService.deleteView(path).then(() => {
                    let index = this.views.findIndex(v => v.path === path);
                    this.views.splice(index, 1);

                    let displayIndex = this.displayViews.findIndex(v => v.path === path);
                    this.displayViews.splice(displayIndex, 1);

                    modalAgent.destroy();
                });
            }
        }, 'warning');
    }

}
