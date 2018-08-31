import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, DisplayText} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        {{formGroup.value[item.field] || '无'}}
    `,
})
export class VFormControlDisplayTextComponent implements AbstractFormControlComponent<DisplayText>{
    @Input()
    item: DisplayText;

    @Input()
    formGroup: FormGroup;

    initComponent(item: DisplayText, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
