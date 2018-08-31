import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, Slider} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-slider [formControlName]="item.field" [nzStep]="item.stride" [nzMax]="item.max" [nzMin]="item.min" ></nz-slider>
        </div>
    `,
})
export class VFormControlSliderComponent implements AbstractFormControlComponent<Slider>{
    @Input()
    item: Slider;

    @Input()
    formGroup: FormGroup;

    initComponent(item: Slider, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
