import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Text} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <input nz-input [formControlName]="item.field"/>
        </div>
    `,
})
export class VFormControlTextComponent implements AbstractFormControlComponent<Text>{
    @Input()
    item: Text;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Text, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
