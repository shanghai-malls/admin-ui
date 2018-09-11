import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, TimePicker} from '../../public/model';
import {TimePickerSettingComponent} from '../settings/time-picker-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-time-picker [(ngModel)]="item.value" [nzFormat]="item.format" ></nz-time-picker>
    `,
})
export class DFormControlTimeComponent implements AbstractDesignerFormControlComponent<TimePicker>{
    @Input()
    item: TimePicker;

    initComponent(item: TimePicker) {
        this.item = item;
    }


    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(TimePickerSettingComponent, this.item);
    }
}
