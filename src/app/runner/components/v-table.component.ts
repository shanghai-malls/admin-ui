import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Button, Table} from '../../model/ui';
import {Header} from '../../model/header';
import {FormHelper} from '../../model/form';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {DataColumn} from '../../model/data-column';
import {HttpService,Page} from '../../model/http.service';
import {
    AfterContentChecked, AfterContentInit, AfterViewChecked,
    AfterViewInit, DoCheck
} from '@angular/core/src/metadata/lifecycle_hooks';
import {NzModalService} from 'ng-zorro-antd';
import {modalZIndex} from '../../model/function';
import {ViewablePartComponent} from './v-part.component';
import {ViewService} from '../../model/view.service';


@Component({
    selector: 'v-table',
    templateUrl: 'v-table.component.html',
    styleUrls: ['v-table.component.less']
})
export class ViewableTableComponent implements OnInit, OnChanges, AfterViewInit, AfterContentInit{
    @Input() table: Table;
    @Input() subject?: Subject<any>;
    page: Page = new Page();

    headers: Header[][];
    dataColumns: DataColumn[];
    queryParameters:any = {};
    markCollapseIndex:number;
    panelWidth:number;

    constructor(private http: HttpService, private viewService: ViewService, private modalService: NzModalService) {
    }


    ngOnChanges(changes: SimpleChanges): void {
        console.log("ngOnChanges", new Date().getTime() % 100000);
    }

    ngAfterViewInit(): void {
        console.log("ngAfterViewInit", new Date().getTime() % 100000);
    }


    ngAfterContentInit(): void {
        console.log("ngAfterContentInit", new Date().getTime() % 100000);
    }

    ngOnInit(): void {
        console.log("ngOnInit", new Date().getTime() % 100000);
        this.processHeaders();
        this.processQueryForm();
        this.query();
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
                if (column.headers) {
                    thirdRow.push(...column.headers);
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

    processQueryForm(){
        if(this.table.queryForm) {
            this.table.queryForm = FormHelper.valueBindForm(this.table.queryForm, this.queryParameters);
            this.markCollapseIndex = this.table.queryForm.children.length; // 折叠查询表单
            this.toggleCollapse();
        }
    }

    query(){
        this.queryParameters.size = this.page.size;
        this.queryParameters.page = this.page.number - 1;
        this.http.getPage(this.table.url, this.queryParameters)
            .then(page => this.page = page);
    }

    clear() {
        for (const prop of Object.keys(this.queryParameters)) {
            delete this.queryParameters[prop];
        }
        this.query();
    }

    toggleCollapse() {
        let doCollapse = this.markCollapseIndex === this.table.queryForm.children.length;
        let sum = 0;
        if(doCollapse) {
            for (let i=0; i < this.table.queryForm.children.length; i++) {
                let cell = this.table.queryForm.children[i];
                sum += cell.width;
                if(sum >= 16){
                    this.markCollapseIndex = i;
                    this.panelWidth = 24 - sum;
                    break;
                }
            }
        } else {
            this.markCollapseIndex = this.table.queryForm.children.length;
            for (let i=0; i < this.table.queryForm.children.length; i++) {
                let cell = this.table.queryForm.children[i];
                sum += cell.width;
            }
            this.panelWidth = 24 - sum % 24;
        }
    }


    triggerButton(button: Button) {
        if(button.triggerType === 'modal') {
            this.viewService.getCompatibleView(button.path).then(v=>{
                let view = v.data;
                this.modalService.create({
                    nzWidth: '61.8%',
                    nzZIndex: modalZIndex(),
                    nzTitle: button.description,
                    nzContent: ViewablePartComponent,
                    nzComponentParams: {view}
                });
            })

        }
        else if(button.triggerType === 'confirm') {

        }
        else if(button.triggerType === 'link') {

        }
    }

}
