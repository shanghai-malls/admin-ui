import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Checkbox} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-checkbox-group [formControlName]="item.field" ></nz-checkbox-group>
        </div>
    `,
})
export class VFormControlCheckboxComponent implements AbstractFormControlComponent<Checkbox>{
    @Input()
    item: Checkbox;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Checkbox, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }

}
