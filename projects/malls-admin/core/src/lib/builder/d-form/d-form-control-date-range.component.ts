import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, DatePicker} from '../../public/model';
import {DatePickerSettingComponent} from '../settings/date-picker-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-range-picker [(ngModel)]="item.value" [nzShowTime]="item.showTime" [nzFormat]="item.format" [nzDisabledDate]="item.disabledDate"></nz-range-picker>
    `,
})
export class DFormControlDateRangeComponent implements AbstractDesignerFormControlComponent<DatePicker>{
    @Input()
    item: DatePicker;

    initComponent(item: DatePicker) {
        this.item = item;
    }

    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openDesignSetting('设置表单字段' + this.item.label, DatePickerSettingComponent, {value: this.item});
    }

}
