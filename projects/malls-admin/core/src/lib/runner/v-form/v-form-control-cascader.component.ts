import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Cascader} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-cascader 
                [formControlName]="item.field" [nzOptions]="item.options" ></nz-cascader>
        </div>
    `,
})
export class VFormControlCascaderComponent implements AbstractFormControlComponent<Cascader>{
    @Input()
    item: Cascader;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Cascader, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }

}
