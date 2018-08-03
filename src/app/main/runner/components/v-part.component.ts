import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'v-part',
    template: `
        <ng-container *ngIf="data.type ==='form'">
            <v-form [path]="path" [route]="route" [form]="data" [onActions]="onActions" [value]="initValue"></v-form>
        </ng-container>

        <ng-container *ngIf="data.type ==='table'">
            <v-table [path]="path" [route]="route" [table]="data" [onActions]="onActions"></v-table>
        </ng-container>

        <ng-container *ngIf="data.type ==='detail-panel'">
            <v-detail [path]="path" [route]="route" [detailPanel]="data" [onActions]="onActions"></v-detail>
        </ng-container>

        <ng-container *ngIf="data.type ==='tab'">
            <nz-tab></nz-tab>
        </ng-container>
        <ng-container *ngIf="data.type ==='card'">
            <nz-card>
                <v-part [data]="data.content"></v-part>
            </nz-card>
        </ng-container>
    `,
    styleUrls: ['../../../base.less'],
})
export class VPartComponent implements OnInit{

    @Input()
    data: any;

    @Input()
    path: string;

    @Input()
    route: string;

    @Input()
    initValue?: any;

    @Input()
    @Output()
    onActions?: EventEmitter<any> = new EventEmitter();

    ngOnInit(): void {

    }


}
