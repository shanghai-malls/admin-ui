import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Checkbox} from '../../public/model';
import {ChoiceSettingComponent} from '../settings/choice-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-checkbox-group [(ngModel)]="item.value" ></nz-checkbox-group>
    `,
})
export class DFormControlCheckboxComponent implements AbstractDesignerFormControlComponent<Checkbox>{
    @Input()
    item: Checkbox;

    initComponent(item: Checkbox) {
        this.item = item;
    }

    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openDesignSetting('设置表单字段' + this.item.label, ChoiceSettingComponent, {value: this.item});
    }

}
