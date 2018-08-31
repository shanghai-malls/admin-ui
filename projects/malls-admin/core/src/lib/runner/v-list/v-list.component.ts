import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {ViewService} from '../../public/service/view.service';
import {ModalService} from '../../public/service/modal.service';

import {AbstractComponent, Button, extractUriParameters, formatPath, List, Page} from '../../public/model';
import {VPartComponent} from '../v-part/v-part.component';
import {VQueryFormComponent} from '../v-form/v-query-form.component';
import {Router} from '@angular/router';
import {RouterService} from '../../public/service/router.service';

@Component({
    selector: 'v-list',
    templateUrl: './v-list.component.html',
    styleUrls: ['./v-list.component.less']
})
export class VListComponent implements OnInit, OnChanges, AbstractComponent<List> {
    @Input()
    list: List;

    @Input()
    path?: string;


    @Input()
    route: string;

    uriParameters: { [p: string]: string };


    @ViewChild('queryForm')
    queryForm: VQueryFormComponent;


    page: Page;

    constructor(private viewService: ViewService, private modalService: ModalService, private routerService: RouterService) {
    }

    ngOnInit() {
        this.uriParameters = extractUriParameters(this.path, this.route);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.uriParameters) {
            this.ngOnInit();
        }
    }


    initComponent(component: List, path: string, route: string) {
        this.list = component;
        this.path = path;
        this.route = route;
    }


    query() {
        let pageRequest = {size: this.page.size, page: this.page.number - 1};
        this.queryForm.query(pageRequest);
    }

    receive = (data) => {
        if (data === 'cleared') {
            this.query();
        } else {
            if (data instanceof Array) {
                this.page = new Page(data);
            } else {
                this.page = data;
                this.page.number += 1;
            }
        }
    };

    triggerButton(button: Button, data?: any) {
        if (button.triggerType === 'modal') {
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
}
