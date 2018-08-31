import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, DataPicker} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <data-picker [formControlName]="item.field" [viewPath]="item.viewPath" [objectPath]="item.objectPath"></data-picker>
        </div>
    `,
})
export class VFormControlDataPickerComponent implements AbstractFormControlComponent<DataPicker>{
    @Input()
    item: DataPicker;

    @Input()
    formGroup: FormGroup;

    initComponent(item: DataPicker, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }


}
