import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Slider} from '../../public/model';
import {InputNumberSettingComponent} from '../settings/input-number-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-slider [(ngModel)]="item.value" [nzStep]="item.stride" [nzMax]="item.max" [nzMin]="item.min" ></nz-slider>
    `,
})
export class DFormControlSliderComponent implements AbstractDesignerFormControlComponent<Slider>{
    @Input()
    item: Slider;

    initComponent(item: Slider) {
        this.item = item;
    }



    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openDesignSetting('设置表单字段' + this.item.label, InputNumberSettingComponent, {value: this.item});
    }

}
