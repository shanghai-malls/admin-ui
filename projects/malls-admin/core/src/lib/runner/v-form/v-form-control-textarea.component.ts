import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, TextArea} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <textarea nz-input [formControlName]="item.field" [placeholder]="item.description || item.label" [nzAutosize]="item.auto || item.size" ></textarea>
        </div>
    `,
})
export class VFormControlTextareaComponent implements AbstractFormControlComponent<TextArea>{
    @Input()
    item: TextArea;

    @Input()
    formGroup: FormGroup;

    initComponent(item: TextArea, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
