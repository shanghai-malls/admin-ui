import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Text} from '../../public/model';
import {TextSettingComponent} from '../settings/text-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <input nz-input [(ngModel)]="item.value"/>
    `,
})
export class DFormControlTextComponent implements AbstractDesignerFormControlComponent<Text>{
    @Input()
    item: Text;


    initComponent(item: Text) {
        this.item = item;
    }


    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(TextSettingComponent, this.item);
    }

}
