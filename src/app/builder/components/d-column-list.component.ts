import {Component, Input} from '@angular/core';
import {Column} from '../../model/ui';

@Component({
    selector: 'd-column-list',
    template: `
        <ul >
            <li *ngFor="let column of columns; let i = index" [ngClass]="{selected: i == selectedIndex}">
                <label nz-checkbox [(ngModel)]="column.hide">
                    {{column.title}}
                </label>
                <i class="anticon anticon-down" [ngClass]="" *ngIf="column.columns" (click)="selectedIndex = i"></i>
                <d-column-list *ngIf="column.columns" [columns]="column.columns"></d-column-list>
            </li>
        </ul>
    `,
    styles: [`
        :host:hover {
            display: block;
        }

        :host > ul {
            line-height: 1.7;
            list-style: none;
            padding-left: 6px;
        }
        ul {
            max-height:500px;
            overflow-y: auto;
        }

        .selected > d-column-list {
            display: block;
        }

        li > d-column-list {
            margin-left: 16px;
            display: none;
        }
    `],
})
export class DesignableColumnListComponent {
    @Input() columns: Column[];
    selectedIndex: number;
}
