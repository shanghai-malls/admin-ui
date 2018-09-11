import {Component, Input, OnChanges, OnInit, Optional, SimpleChanges, ViewChild} from '@angular/core';
import {ViewService} from '../../public/service/view.service';
import {ModalService} from '../../public/service/modal.service';

import {AbstractComponent, Button, List, Page} from '../../public/model';
import {RouterService} from '../../public/service/router.service';
import {ComponentLifecycleListenerDelegate} from '../../public/service/component-lifecycle-listener';
import {AbstractListComponent} from '../abstract.list.component';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
    selector: 'v-list',
    templateUrl: './v-list.component.html',
    styleUrls: ['./v-list.component.less']
})
export class VListComponent extends AbstractListComponent implements OnInit, OnChanges, AbstractComponent<List> {
    @Input()
    list: List;

    @Input()
    path?: string;

    @Input()
    route: string;


    constructor(delegate: ComponentLifecycleListenerDelegate,
                viewService: ViewService,
                modalService: ModalService,
                routerService: RouterService,
                @Optional() modalRef: NzModalRef) {
        super(delegate, viewService,modalService, routerService, modalRef);
    }

    ngOnInit() {
        this.delegate.preInit(this);
        this.initCommonProperties(this.list, this.path, this.route);
        this.delegate.postInit(this);
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
}
