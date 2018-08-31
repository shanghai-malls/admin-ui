import {Component, Input} from '@angular/core';
import {AbstractFormControlComponent, UploadPicker} from '../../public/model';
import {FormGroup} from '@angular/forms';

@Component({
    template: `
        <div [formGroup]="formGroup">
            <nz-upload nzAction="/api/settings/aliyun-oss" [nzListType]="item.listType" [nzShowButton]="item.multiple">
                <i class="anticon anticon-plus"></i>
                <div class="ant-upload-text">Upload</div>
            </nz-upload>
        </div>
    `,
})
export class VFormControlUploadComponent implements AbstractFormControlComponent<UploadPicker>{
    @Input()
    item: UploadPicker;

    @Input()
    formGroup: FormGroup;

    initComponent(item: UploadPicker, group: FormGroup) {
        this.item = item;
        this.formGroup = group;
    }
}
