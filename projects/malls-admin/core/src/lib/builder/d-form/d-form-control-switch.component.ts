import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Switch} from '../../public/model';
import {SwitchSettingComponent} from '../settings/switch-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-switch          *ngIf="item.mode == 'switch'"   [(ngModel)]="item.value"></nz-switch>
        <label nz-checkbox  *ngIf="item.mode == 'checkbox'" [(ngModel)]="item.value"></label>
    `,
})
export class DFormControlSwitchComponent implements AbstractDesignerFormControlComponent<Switch>{
    @Input()
    item: Switch;


    initComponent(item: Switch) {
        this.item = item;
    }

    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openDesignSetting('设置表单字段' + this.item.label, SwitchSettingComponent, {value: this.item});
    }

}
