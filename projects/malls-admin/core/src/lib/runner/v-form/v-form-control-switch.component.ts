import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Switch} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-switch          *ngIf="item.mode == 'switch'"   [formControlName]="item.field"></nz-switch>
            <label nz-checkbox  *ngIf="item.mode == 'checkbox'" [formControlName]="item.field"></label>
        </div>
    `,
})
export class VFormControlSwitchComponent implements AbstractFormControlComponent<Switch>{
    @Input()
    item: Switch;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Switch, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
