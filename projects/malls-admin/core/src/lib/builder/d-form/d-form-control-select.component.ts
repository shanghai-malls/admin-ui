import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Select} from '../../public/model';
import {ChoiceSettingComponent} from '../settings/choice-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-select [nzPlaceHolder]="item.description" [(ngModel)]="item.value">
            <nz-option *ngFor="let option of item.options" [nzValue]="option.value" [nzLabel]="option.label"></nz-option>
        </nz-select>
    `,
})
export class DFormControlSelectComponent implements AbstractDesignerFormControlComponent<Select>{
    @Input()
    item: Select;

    initComponent(item: Select) {
        this.item = item;
    }


    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openDesignSetting('设置表单字段' + this.item.label, ChoiceSettingComponent, {value: this.item});
    }

}
