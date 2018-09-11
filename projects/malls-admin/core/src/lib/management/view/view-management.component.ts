import {Component, OnDestroy, OnInit, Optional} from '@angular/core';
import {ViewService} from '../../public/service/view.service';
import {View} from '../../public/model';
import {I18nService} from '../../public/service/i18n.service';
import {ModalService} from '../../public/service/modal.service';
import {NzModalRef} from 'ng-zorro-antd';
import {RouterService} from '../../public/service/router.service';
import {Route} from '@angular/router';
import {ViewGenerator} from '../../public/service/view-generator';
import {Subscription} from 'rxjs';


@Component({
    templateUrl: 'view-management.component.html',
    styleUrls: ['../../base.less']
})
export class ViewManagementComponent implements OnInit {


    page = 1;
    size = 50;
    total = 0;

    views: View[] = [];
    displayViews: View[];
    languages: any;

    params: { path?: string; name?: string; } = {};

    tabIndex: number = 0;

    staticViews: Route[];

    inBuilding: boolean;


    constructor(private viewGenerator: ViewGenerator,
                private viewService: ViewService,
                private i18n: I18nService,
                private router: RouterService,
                private modalService: ModalService,
                @Optional() public modalRef: NzModalRef) {
    }

    ngOnInit(): void {
        this.languages = this.i18n.getLocales();
        this.staticViews = this.router.deepestRoutes.filter(i => i.path && i.path.indexOf('*') === -1);
        this.viewService.getViews(this.i18n.getLocale()).then(this.initViews);
    }


    initViews = (views: View[]) => {
        this.views = views;
        this.filter();
    };


    isAccessible(viewPath: string) {
        return viewPath.indexOf('{') === -1;
    }


    getStartEnd() {
        let start = this.page * this.size - this.size;
        let end = start + this.size;
        return {start, end};
    }

    filter() {
        let filtered = this.views.filter((v, i) => {
            let filtered = true;
            if (this.params.name) {
                filtered = v.name.indexOf(this.params.name) != -1;
            }
            if (this.params.path) {
                filtered = filtered && v.path.indexOf(this.params.path) != -1;
            }
            return filtered;
        });
        this.total = filtered.length;

        let {start, end} = this.getStartEnd();
        this.displayViews = filtered.slice(start, end);
    }

    reset() {
        this.params = {};
        this.displayViews = [...this.views];
    }

    emit(view: View | Route) {
        if (this.modalRef) {
            this.modalRef.destroy(view);
        }
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

    buildViewsFromRaml() {
        this.inBuilding = true;
        this.viewGenerator.generateViews()
            .then(() => this.inBuilding = false)
            .catch(error => {
                this.inBuilding = false;
                console.error(error);
            });

    }

    oneClickUpdate(){

    }
}
