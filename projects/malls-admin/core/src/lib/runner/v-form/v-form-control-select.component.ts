import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Select} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-select [nzPlaceHolder]="item.description" [formControlName]="item.field">
                <nz-option *ngFor="let option of item.options" [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
            </nz-select>
        </div>
    `,
})
export class VFormControlSelectComponent implements AbstractFormControlComponent<Select>{
    @Input()
    item: Select;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Select, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
