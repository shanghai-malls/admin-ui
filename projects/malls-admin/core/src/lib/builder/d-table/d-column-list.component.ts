import {Component, Input} from '@angular/core';
import {Column} from '../../public/model';

@Component({
    selector: 'd-column-list',
    template: `
        <ul class="v-list fields-list">
            <li *ngFor="let column of columns; let i = index" [ngClass]="{selected: i == selectedIndex}">
                <label nz-checkbox [(ngModel)]="column.hide">{{column.title}}</label>
                <i class="anticon anticon-down" [ngClass]="" *ngIf="column.columns" (click)="selectedIndex = i"></i>
                <div class="d-child">
                    <d-column-list *ngIf="column.columns" [columns]="column.columns"></d-column-list>
                </div>
            </li>
        </ul>
    `,
    styles: [`
        :host{
            display: block;
        }
        .d-child {
            margin-left: 16px;
            display: none;
            
        }
        .selected > .d-child {
            display: block;
        }
    `],
})
export class DColumnListComponent {
    @Input()
    columns: Column[];
    selectedIndex: number;
}
