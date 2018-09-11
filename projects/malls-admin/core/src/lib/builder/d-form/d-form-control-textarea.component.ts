import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, TextArea} from '../../public/model';
import {TextAreaSettingComponent} from '../settings/text-area-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <textarea nz-input [(ngModel)]="item.value" [placeholder]="item.description || item.label" [nzAutosize]="item.auto || item.size" ></textarea>
    `,
})
export class DFormControlTextareaComponent implements AbstractDesignerFormControlComponent<TextArea>{
    @Input()
    item: TextArea;

    initComponent(item: TextArea) {
        this.item = item;
    }


    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(TextAreaSettingComponent, this.item);
    }

}
