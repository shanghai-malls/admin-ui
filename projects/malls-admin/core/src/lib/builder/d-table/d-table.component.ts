import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Button, Column, Header, removeElement, Table} from '../../public';
import {DHeaderComponent} from './d-header.component';


@Component({
    selector: 'd-table',
    templateUrl: './d-table.component.html',
    styleUrls:['../../base.less']
})
export class DTableComponent implements OnInit {
    @Input() table: Table;
    headers: Header[][];
    dataColumns: Column[];
    startDraggingElement: Element;

    ngOnInit(): void {
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
        this.dataColumns = dataColumns;
    }


    addTopButton(){
        this.table.buttons.push(new Button({
            text: '按钮'
        }));
    }

    deleteTopButton(button:Button){
        removeElement(this.table.buttons, button);
    }

    addOperationColumnButton(){
        this.table.operationColumnButtons.push(new Button({
            text: '按钮'
        }));
    }

    deleteOperationColumnButton(button:Button){
        removeElement(this.table.operationColumnButtons, button);
    }


    dragstart(i:number, event:DragEvent) {
        this.startDraggingElement = event.srcElement;
        event.dataTransfer.setData("index", i + "");
        event.stopPropagation();
    }

    dragover(event:DragEvent){
        event.preventDefault();
        event.stopPropagation();
    }

    drop(x:number, header:Header, event:DragEvent){
        event.stopPropagation();
        if(this.startDraggingElement === event.toElement) {
            return;
        }
        let y = parseInt(event.dataTransfer.getData("index"));
        if(y === x) {
            return;
        }
        if(header.parent) {
            let parent = header.parent;
            parent.column.columns[x] = parent.column.columns[y];
            parent.column.columns[y] = header.column;
        } else {
            this.table.columns[x] = this.table.columns[y];
            this.table.columns[y] = header.column;
        }
        this.ngOnInit();
    }

    @ViewChildren(DHeaderComponent)
    viewChildren: QueryList<DHeaderComponent>;

    focusChild(child: DHeaderComponent){
        let children = this.viewChildren.toArray();
        let index = children.findIndex(item=>item===child);
        if (index < children.length - 1) {
            children[index + 1].focus();
        }
    }
}
