import {Component, Input} from '@angular/core';
import {Cell, FormItem} from '../../../model/ui';
import {removeElement} from '../../../model/function';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col [nzSpan]="12" *ngFor="let item of items">
                    <nz-form-item>
                        <nz-form-label [nzSpan]="8" [nzOffset]="2">{{item.content.label}}</nz-form-label>
                        <nz-form-control [nzSpan]="4">
                            <i class="anticon anticon-minus-circle-o large-icon" (click)="doRemove(item)"></i>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `,
})
export class HideFormItemsSettingComponent {
    @Input()
    items: Cell[];


    doRemove(item: Cell) {
        item.width = 8;
        (<FormItem>item.content).hide = false;

        removeElement(this.items, item);
    }
}
