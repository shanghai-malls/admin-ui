import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, DataPicker} from '../../public/model';
import {DataPickerSettingComponent} from '../settings/data-picker-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <data-picker [(ngModel)]="item.value" [viewPath]="item.viewPath" [objectPath]="item.objectPath"></data-picker>
    `,
})
export class DFormControlDataPickerComponent implements AbstractDesignerFormControlComponent<DataPicker>{
    @Input()
    item: DataPicker;


    initComponent(item: DataPicker) {
        this.item = item;
    }



    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(DataPickerSettingComponent, this.item);
    }
}
