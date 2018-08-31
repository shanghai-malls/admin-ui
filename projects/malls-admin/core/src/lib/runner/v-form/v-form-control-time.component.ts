import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, TimePicker} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-time-picker [formControlName]="item.field" [nzFormat]="item.format" ></nz-time-picker>
        </div>
    `,
})
export class VFormControlTimeComponent implements AbstractFormControlComponent<TimePicker>{
    @Input()
    item: TimePicker;

    @Input()
    formGroup: FormGroup;

    initComponent(item: TimePicker, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
