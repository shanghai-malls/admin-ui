import {Component, Input, OnChanges, OnInit, Optional, SimpleChanges, ViewChild} from '@angular/core';
import {VQueryFormComponent} from '../v-form/v-query-form.component';

import {AbstractComponent, DataColumn, Header, Table,} from '../../public/model';
import {ModalService} from '../../public/service/modal.service';
import {ViewService} from '../../public/service/view.service';
import {NzModalRef} from 'ng-zorro-antd';
import {RouterService} from '../../public/service/router.service';
import {ComponentLifecycleListenerDelegate} from '../../public/service/component-lifecycle-listener';
import {AbstractListComponent} from '../abstract.list.component';

@Component({
    selector: 'v-table',
    templateUrl: './v-table.component.html',
    styleUrls: ['./v-table.component.less'],
})
export class VTableComponent extends AbstractListComponent implements OnInit, OnChanges, AbstractComponent<Table> {
    @Input()
    table: Table;

    @Input()
    path?: string;

    @Input()
    route: string;

    headers: Header[][];
    dataColumns: DataColumn[];

    @ViewChild('queryForm')
    queryForm: VQueryFormComponent;

    constructor(delegate: ComponentLifecycleListenerDelegate, viewService: ViewService,
                modalService: ModalService, routerService: RouterService, @Optional() modalRef: NzModalRef) {
        super(delegate,viewService,modalService,routerService, modalRef);
    }

    ngOnInit(): void {
        this.delegate.preInit(this);

        this.initCommonProperties(this.table, this.path, this.route);
        this.initHeaders();

        this.delegate.postInit(this);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.headers) {
            this.ngOnInit();
        }
    }

    initComponent(component: Table, path: string, route: string) {
        this.table = component;
        this.path = path;
        this.route = route;
    }

    initHeaders() {
        let headers: Header[][] = [];
        let firstRow = this.table.columns.map(c => new Header(c));

        let secondRow = [];
        for (let header of firstRow) {
            if (header.children) {
                secondRow.push(...header.children);
            }
        }
        headers.push(firstRow);

        while (secondRow.length > 0) {
            headers.push(secondRow);
            let thirdRow = [];
            for (let column of secondRow) {
                if (column.children) {
                    thirdRow.push(...column.children);
                }
            }
            secondRow = thirdRow;
        }

        let dataColumns = [];
        let maxRowspan = headers.length;
        for (let row of headers) {
            for (let header of row) {
                if (!header.children) {
                    header.rowspan = maxRowspan - header.parentsRowspan;
                    dataColumns.push(header.column);
                } else {
                    header.rowspan = 1;
                }
            }
        }
        this.headers = headers;

        this.dataColumns = this.getDataColumns(this.table.columns.map(c => new DataColumn(c)));

    }

    getDataColumns(columns: DataColumn[]): DataColumn[] {
        let dataColumns = [];
        for (let column of columns) {
            if (!column.hide) {
                if (!column.columns) {
                    dataColumns.push(column);
                } else {
                    dataColumns.push(...this.getDataColumns(<DataColumn[]>column.columns));
                }
            }
        }
        return dataColumns;
    }


}
