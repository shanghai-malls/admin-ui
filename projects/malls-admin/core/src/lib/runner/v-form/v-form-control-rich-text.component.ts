import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, RichText} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <textarea nz-input [formControlName]="item.field" [placeholder]="item.description || item.label" [nzAutosize]="item.auto || item.size" ></textarea>
        </div>
    `,
})
export class VFormControlRichTextComponent implements AbstractFormControlComponent<RichText>{
    @Input()
    item: RichText;

    @Input()
    formGroup: FormGroup;

    initComponent(item: RichText, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
