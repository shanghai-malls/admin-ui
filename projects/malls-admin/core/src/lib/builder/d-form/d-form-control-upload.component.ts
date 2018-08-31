import {Component, Input} from '@angular/core';
import {AbstractDesignerFormControlComponent, UploadPicker} from '../../public/model';
import {UploadPickerSettingComponent} from '../settings/upload-picker-setting.component';
import {ModalService} from '../../public/service/modal.service';

@Component({
    template: `
        <nz-upload nzAction="/api/settings/aliyun-oss" [nzListType]="item.listType" [nzShowButton]="item.multiple">
            <i class="anticon anticon-plus"></i>
            <div class="ant-upload-text">Upload</div>
        </nz-upload>
    `,
})
export class DFormControlUploadComponent implements AbstractDesignerFormControlComponent<UploadPicker>{
    @Input()
    item: UploadPicker;

    initComponent(item: UploadPicker) {
        this.item = item;
    }


    constructor(private modalService: ModalService) {
    }

    doSetting(event: any) {
        this.modalService.openDesignSetting('设置表单字段' + this.item.label, UploadPickerSettingComponent, {value: this.item});
    }

}
