import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Radio} from '../../public/model';
import {ChoiceSettingComponent} from '../settings/choice-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-radio-group [(ngModel)]="item.value" >
            <label *ngFor="let option of item.options" nz-radio [nzValue]="option.value">{{option.label}}</label>
        </nz-radio-group>
    `,
})
export class DFormControlRadioComponent implements AbstractDesignerFormControlComponent<Radio>{
    @Input()
    item: Radio;

    initComponent(item: Radio) {
        this.item = item;
    }


    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(ChoiceSettingComponent, this.item);
    }

}
