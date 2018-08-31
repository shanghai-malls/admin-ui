import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, InputNumber} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-input-number [formControlName]="item.field" [nzStep]="item.stride" [nzMax]="item.max" [nzMin]="item.min" ></nz-input-number>
        </div>
    `,
})
export class VFormControlNumberComponent implements AbstractFormControlComponent<InputNumber>{
    @Input()
    item: InputNumber;

    @Input()
    formGroup: FormGroup;

    initComponent(item: InputNumber, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
