import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Button, Column, Table} from '../../model/ui';
import {Header} from '../../model/header';
import {removeElement} from '../../model/function';
import {DHeaderComponent} from './d-header.component';


@Component({
    selector: 'd-table',
    template: `
        <div class="box-group">
            <d-form [form]="table.queryForm"></d-form>

            <ul class="d-buttons">
                <li>
                    <nz-switch [(ngModel)]="table.bordered" [nzCheckedChildren]="'显示边框'" [nzUnCheckedChildren]="'隐藏边框'"></nz-switch>
                </li>
                <li>
                    <ng-container *ngFor="let button of table.buttons">
                        <d-button [button]="button" [removeable]="true" (onDelete)="deleteTopButton($event)"></d-button>
                    </ng-container>
                    <button class="hover-show" nz-button [nzType]="'dashed'" (click)="addTopButton()" title="添加按钮"><i class="anticon anticon-plus"></i></button>
                </li>
            </ul>

            <nz-table [nzData]="[1]" [nzShowPagination]="table.showPagination" [nzBordered]="table.bordered" [nzScroll]="{x: '100%'}" >
                <thead>
                <tr *ngFor="let row of headers; let i = index; let first = first">
                    <ng-container *ngFor="let header of row; let j = index;">
                        <th *ngIf="header.show"
                            class="movable"
                            [attr.rowspan]="header.rowspan"
                            [attr.colspan]="header.colspan"

                            draggable="true"
                            (dragstart)="dragstart(j, $event)"
                            (dragover)="dragover($event)"
                            (drop)="drop(j, header, $event)">

                            <d-header [header]="header" (onEnter)="focusChild($event)"> </d-header>
                        </th>
                    </ng-container>
                    <th *ngIf="first" colspan="1" style="min-width: 200px" nzRight="0px" [attr.rowspan]="headers.length">
                        <nz-popover [nzTitle]="'选择隐藏的列'" [nzTrigger]="'click'">
                            操作<i style="cursor: pointer" class="anticon anticon-down" nz-popover ></i>
                            <ng-template #nzTemplate>
                                <d-column-list [columns]="table.columns"></d-column-list>
                            </ng-template>
                        </nz-popover>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <ng-container *ngFor="let column of dataColumns" >
                        <td *ngIf="!column.hide"></td>
                    </ng-container>
                    <td nzRight="0px">
                        <div class="d-buttons">
                            <ng-container *ngFor="let button of table.operationColumnButtons">
                                <d-button [button]="button" [removeable]="true" (onDelete)="deleteOperationColumnButton($event)"></d-button>
                            </ng-container>
                            <button class="hover-show" nz-button [nzType]="'dashed'" (click)="addOperationColumnButton()"  title="添加按钮"><i class="anticon anticon-plus"></i></button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </nz-table>
        </div>
    `,
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
