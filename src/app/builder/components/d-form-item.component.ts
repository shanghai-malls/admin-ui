import {Component, Input} from '@angular/core';
import {FormItem} from '../../model/ui';

@Component({
    selector: 'd-form-item',
    template: `
        <nz-form-item nzFlex >
            <nz-form-label [nzSpan]="24 - item.width" [nzRequired]="item.required" (click)="edit=true" *ngIf="!edit">{{item.label || item.field || 'label'}}</nz-form-label>
            <nz-form-control [nzSpan]="24 - item.width" *ngIf="edit">
                <input nz-input [(ngModel)]="item.label" placeholder="请输入label" (blur)="edit=false"/>
            </nz-form-control>
            <nz-form-control [nzSpan]="item.width" >
                <ng-content></ng-content>
            </nz-form-control>
        </nz-form-item>
    `,
    styles: [`
        :host {
            display: block;
        }
    `]
})
export class DesignableFormItemComponent {
    @Input() item: FormItem;
    edit: boolean;


}
