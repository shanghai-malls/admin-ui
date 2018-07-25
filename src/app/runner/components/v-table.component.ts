import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Button, Table} from '../../model/ui';
import {Header} from '../../model/header';
import {DataColumn} from '../../model/data-column';
import {HttpService, Page} from '../../model/http.service';
import {extractUriParameters, formatPath} from '../../model/function';
import {ViewService} from '../../model/view.service';
import {Router} from '@angular/router';
import {ModalService} from '../../model/modal.service';
import {VPartComponent} from './v-part.component';
import {VFormComponent} from './v-form.component';


@Component({
    selector: 'v-table',
    templateUrl: 'v-table.component.html',
    styleUrls: ['v-table.component.less']
})
export class VTableComponent implements OnInit , OnChanges {
    @Input()
    table: Table;

    @Input()
    path?: string;


    @Input()
    route: string;

    uriParameters: {[p:string]:string};

    @Input()
    @Output()
    onActions?: EventEmitter<any> = new EventEmitter();

    @Output()
    onSelect: EventEmitter<any> = new EventEmitter();


    page: Page;
    headers: Header[][];
    dataColumns: DataColumn[];


    @ViewChild("queryForm")
    queryForm: VFormComponent;

    constructor(private http: HttpService, private viewService: ViewService, private modalService: ModalService, private router: Router) {
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        }
    }

    ngOnInit(): void {
        this.page = new Page();
        this.processHeaders();
        this.uriParameters = extractUriParameters(this.path, this.route);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(this.headers) {
            this.ngOnInit();
        }
    }


    processHeaders(){
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

    getDataColumns(columns: DataColumn[]): DataColumn[]{
        let dataColumns = [];
        for(let column of columns) {
            if(!column.hide) {
                if(!column.columns) {
                    dataColumns.push(column);
                } else {
                    dataColumns.push(...this.getDataColumns(<DataColumn[]>column.columns));
                }
            }
        }
        return dataColumns;
    }

    query(){
        //提交查询表单
        this.queryForm.submit({size: this.page.size, page: this.page.number});
    }

    receive = (action) => {
        if (action.eventType == 'submitted') {
            if (action.data instanceof Array) {
                this.page = new Page(action.data);
            } else {
                this.page = action.data;
            }
        } else if (action.eventType === 'canceled' || action.eventType === 'init') {
            this.query();
        }
    };
    triggerButton(button: Button, data?: any) {
        if(button.triggerType === 'modal') {
            this.viewService.getCompatibleView(button.path).then(v=>{
                let path = formatPath(v.path, data);
                if(this.uriParameters) {
                    path = formatPath(path, this.uriParameters);
                }
                let route = v.path;
                let agent = this.modalService.create({
                    nzTitle: null,
                    nzContent: VPartComponent,
                    nzFooter: null,
                    nzComponentParams: {path, route, data: v.data, initValue: data},
                    nzBodyStyle: {
                        padding: 0
                    },
                    channels: {
                        onActions: ()=>{
                            agent.destroy();
                            this.query();
                        }
                    },
                });
            })
        }
        else if(button.triggerType === 'confirm') {
            let modalAgent = this.modalService.confirm({
                nzTitle: button.description,
                nzOnOk: () => {
                    this.http.request(button.method, formatPath(button.path, data)).then(() => {
                        modalAgent.destroy();
                        this.query();
                    });
                }
            })
        }
        else if(button.triggerType === 'link') {
            let path = formatPath(button.path, data);
            if(this.uriParameters) {
                path = formatPath(path, this.uriParameters);
            }
            this.router.navigateByUrl(path);
        }
    }

}
