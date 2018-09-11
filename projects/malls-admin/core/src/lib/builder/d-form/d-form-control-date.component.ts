import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, DatePicker} from '../../public/model';
import {DatePickerSettingComponent} from '../settings/date-picker-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-date-picker [(ngModel)]="item.value" [nzShowTime]="item.showTime" [nzFormat]="item.format" [nzDisabledDate]="item.disabledDate"></nz-date-picker>
    `,
})
export class DFormControlDateComponent implements AbstractDesignerFormControlComponent<DatePicker> {
    @Input()
    item: DatePicker;

    initComponent(item: DatePicker) {
        this.item = item;
    }



    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(DatePickerSettingComponent, this.item);
    }

}
