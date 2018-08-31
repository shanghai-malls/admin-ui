import {Component, Input, OnChanges, OnInit, Optional, SimpleChanges, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {VPartComponent} from '../v-part/v-part.component';
import {VQueryFormComponent} from '../v-form/v-query-form.component';

import {AbstractComponent, Button, DataColumn, extractUriParameters, formatPath, Header, Page, Table,} from '../../public/model';
import {ModalService} from '../../public/service/modal.service';
import {ViewService} from '../../public/service/view.service';
import {NzModalRef} from 'ng-zorro-antd';
import {MacComponent} from '../../mac.component';
import {RouterService} from '../../public/service/router.service';

@Component({
    selector: 'v-table',
    templateUrl: './v-table.component.html',
    styleUrls: ['./v-table.component.less'],
})
export class VTableComponent implements OnInit, OnChanges, AbstractComponent<Table> {
    @Input()
    table: Table;

    @Input()
    path?: string;


    @Input()
    route: string;

    uriParameters: { [p: string]: string };

    page: Page;
    headers: Header[][];
    dataColumns: DataColumn[];



    @ViewChild('queryForm')
    queryForm: VQueryFormComponent;

    constructor(
        private viewService: ViewService,
        private modalService: ModalService,
        private routerService: RouterService,
        @Optional() public modalRef: NzModalRef) {
    }

    ngOnInit(): void {
        this.page = new Page();
        this.processHeaders();
        this.uriParameters = extractUriParameters(this.path, this.route);
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

    processHeaders() {
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

    query() {
        let pageRequest = {size: this.page.size, page: this.page.number - 1};
        this.queryForm.query(pageRequest);
    }

    receive = (data) => {
        if (data === 'cleared') {
            this.query();
        } else {
            if(data instanceof Array) {
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
                this.modalService.create({
                    nzTitle: null,
                    nzContent: VPartComponent,
                    nzFooter: null,
                    nzComponentParams: {path, route, component: v.data},
                    nzOnOk: () => this.query(),
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

    emit(data: any) {
        if(this.modalRef) {
            this.modalRef.destroy(data);
        }
    }

}
