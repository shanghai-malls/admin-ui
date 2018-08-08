import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AfterViewInit} from '@angular/core/src/metadata/lifecycle_hooks';
import {I18nService, LANG, ModalService, Selectable, View, ViewService} from '../../public';

@Component({
    templateUrl: 'view-management.component.html',
    styleUrls: ['../../base.less']
})
export class ViewManagementComponent implements OnInit, AfterViewInit, Selectable {

    @Output()
    onSelect: EventEmitter<any> = new EventEmitter();

    @Input()
    mode: 'select' | 'view' = 'view';

    page = 1;
    size = 50;
    total = 0;

    views: View[] = [];
    displayViews: View[];
    languages = LANG;

    filter: { path?: string; name?: string; } = {};


    constructor(private viewService: ViewService, private i18n: I18nService, private modalService: ModalService) {

    }

    ngOnInit(): void {
        // console.time('timing')
        this.viewService.getViews().then(views => {
            this.views = views;
            let {start, end} = this.getStartEnd();
            this.displayViews = this.views.slice(start, end);
        });
        this.i18n.subscribe(language => {
            this.viewService.getViews(language).then(views => {
                this.views = views;
                let {start, end} = this.getStartEnd();
                this.displayViews = this.views.slice(start, end);
            });
        });
    }

    ngAfterViewInit(): void {
        console.timeEnd('timing')
    }



    getStartEnd(){
        let start = this.page * this.size - this.size;
        let end = start + this.size;
        return {start, end};
    }

    search() {
        let {start, end} = this.getStartEnd();
        this.displayViews = this.views.filter((v, i) => {
            let filtered = true;
            if (this.filter.name) {
                filtered = v.name.indexOf(this.filter.name) != -1;
            }
            if (this.filter.path) {
                filtered = filtered && v.path.indexOf(this.filter.path) != -1;
            }
            return filtered;
        }).slice(start,end)
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
