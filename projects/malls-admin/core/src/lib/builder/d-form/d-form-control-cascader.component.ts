import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Cascader} from '../../public/model';
import {ChoiceSettingComponent} from '../settings/choice-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-cascader [(ngModel)]="item.value" [nzOptions]="item.options"></nz-cascader>
    `,
})
export class DFormControlCascaderComponent implements AbstractDesignerFormControlComponent<Cascader> {
    @Input()
    item: Cascader;

    initComponent(item: Cascader) {
        this.item = item;
    }

    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(ChoiceSettingComponent, this.item);
    }

}
