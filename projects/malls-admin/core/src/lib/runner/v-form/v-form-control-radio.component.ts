import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Radio} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-radio-group [formControlName]="item.field" >
                <label *ngFor="let option of item.options" nz-radio [nzValue]="option.value">{{option.label}}</label>
            </nz-radio-group>
        </div>
    `,
})
export class VFormControlRadioComponent implements AbstractFormControlComponent<Radio>{
    @Input()
    item: Radio;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Radio, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
