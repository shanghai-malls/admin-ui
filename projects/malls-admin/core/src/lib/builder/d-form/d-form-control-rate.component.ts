import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, Rate} from '../../public/model';
import {RateSettingComponent} from '../settings/rate-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-rate [(ngModel)]="item.value" [nzAllowHalf]="item.half" [nzCount]="item.count" ></nz-rate>
    `,
})
export class DFormControlRateComponent implements AbstractDesignerFormControlComponent<Rate>{
    @Input()
    item: Rate;

    initComponent(item: Rate) {
        this.item = item;
    }



    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openFormItemDesignSetting(RateSettingComponent, this.item);
    }

}
