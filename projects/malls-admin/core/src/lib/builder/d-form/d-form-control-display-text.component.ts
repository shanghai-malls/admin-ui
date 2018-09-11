import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, DisplayText} from '../../public/model';
import {DisplayTextSettingComponent} from '../settings/display-text-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        {{item.value}}
    `,
})
export class DFormControlDisplayTextComponent implements AbstractDesignerFormControlComponent<DisplayText>{
    @Input()
    item: DisplayText;


    initComponent(item: DisplayText) {
        this.item = item;
    }

    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(DisplayTextSettingComponent, this.item);
    }

}
