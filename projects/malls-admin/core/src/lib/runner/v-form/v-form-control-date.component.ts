import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, DatePicker} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-date-picker [formControlName]="item.field" [nzShowTime]="item.showTime" [nzFormat]="item.format" [nzDisabledDate]="item.disabledDate"></nz-date-picker>
        </div>
    `,
})
export class VFormControlDateComponent implements AbstractFormControlComponent<DatePicker> {
    @Input()
    item: DatePicker;

    @Input()
    formGroup: FormGroup;

    initComponent(item: DatePicker, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }


}
