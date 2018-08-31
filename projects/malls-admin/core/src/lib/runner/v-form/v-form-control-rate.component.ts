import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Rate} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-rate [formControlName]="item.field" [nzAllowHalf]="item.half" [nzCount]="item.count" ></nz-rate>
        </div>
    `,
})
export class VFormControlRateComponent implements AbstractFormControlComponent<Rate>{
    @Input()
    item: Rate;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Rate, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
