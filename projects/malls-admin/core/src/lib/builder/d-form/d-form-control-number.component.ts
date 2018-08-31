import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, InputNumber} from '../../public/model';
import {InputNumberSettingComponent} from '../settings/input-number-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-input-number [(ngModel)]="item.value" [nzStep]="item.stride" [nzMax]="item.max" [nzMin]="item.min" ></nz-input-number>
    `,
})
export class DFormControlNumberComponent implements AbstractDesignerFormControlComponent<InputNumber>{
    @Input()
    item: InputNumber;

    initComponent(item: InputNumber) {
        this.item = item;
    }

    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openDesignSetting('设置表单字段' + this.item.label, InputNumberSettingComponent, {value: this.item});
    }

}
