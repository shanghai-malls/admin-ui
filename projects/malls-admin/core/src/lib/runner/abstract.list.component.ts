import {Button, extractUriParameters, formatPath, List, Page, Table} from '../public/model';
import {VPartComponent} from './v-part/v-part.component';
import {ViewChild} from '@angular/core';
import {VQueryFormComponent} from './v-form/v-query-form.component';
import {RouterService} from '../public/service/router.service';
import {ModalService} from '../public/service/modal.service';
import {ViewService} from '../public/service/view.service';
import {ComponentLifecycleListenerDelegate} from '../public/service/component-lifecycle-listener';
import {NzModalRef} from 'ng-zorro-antd';

export abstract class AbstractListComponent {

    @ViewChild('queryForm')
    queryForm: VQueryFormComponent;

    uriParameters: { [p: string]: string };

    page: Page;

    component: List | Table;

    path?: string;

    route: string;

    buttonsRows: Button[][];

    protected constructor(protected delegate: ComponentLifecycleListenerDelegate, protected viewService: ViewService,
                          protected modalService: ModalService, protected routerService: RouterService, public modalRef: NzModalRef) {
    }

    initCommonProperties(component: List | Table, path: string, route: string): void {
        this.component = component;
        this.path = path;
        this.route = route;
        this.page = new Page();
        this.uriParameters = extractUriParameters(this.path, this.route);
    }


    query() {
        let pageRequest = {size: this.page.size, page: this.page.number - 1};
        this.queryForm.query(pageRequest);
    }

    receive = (data) => {
        if (data === 'cleared') {
            this.query();
            return;
        }

        if (data instanceof Array) {
            this.page = new Page(data);
        } else {
            this.page = data;
            this.page.number += 1;
        }

        let btns = this.component.operationButtons;

        if (this.page.content && btns && btns.length > 0) {
            this.buttonsRows = [];
            for (let i = 0; i < this.page.content.length; i++) {
                let rowBtns = [];
                for (let btn of btns) {
                    rowBtns.push(new Button(btn));
                }
                this.buttonsRows.push(rowBtns);
            }
        }
        this.delegate.postQuery(data, this);
    };

    triggerButton(button: Button, data?: any) {
        if (button.onclick) {
            button.onclick(data);
        }

        else if (button.triggerType === 'modal') {
            this.viewService.getCompatibleView(button.path).then(v => {
                let path = formatPath(v.path, data);
                if (this.uriParameters) {
                    path = formatPath(path, this.uriParameters);
                }
                let route = v.path;
                let agent = this.modalService.create({
                    nzTitle: null,
                    nzContent: VPartComponent,
                    nzFooter: null,
                    nzComponentParams: {path, route, component: v.data},
                    nzBodyStyle: {
                        padding: 0
                    },
                    channels: {
                        onActions: () => {
                            agent.destroy();
                            this.query();
                        }
                    },
                });
            });
        }

        else if (button.triggerType === 'link') {
            let path = formatPath(button.path, data);
            if (this.uriParameters) {
                path = formatPath(path, this.uriParameters);
            }
            this.routerService.navigate(path);
        }
    }

    emitData(data: any) {
        if(this.modalRef) {
            this.modalRef.destroy(data);
        }
    }

}
