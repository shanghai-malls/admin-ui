import {Component, Input} from '@angular/core';
import {UploadPicker} from '../../public/model';

@Component({
    template: `
        <div nz-form>
            <div nz-row nzGutter="12" nzType="flex" nzJustify="start" nzAlign="top">
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">字段描述</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <input nz-input [(ngModel)]="value.description"/>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">文件类型</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-select [(ngModel)]="value.fileType" style="width: 100%;" nzMode="multiple">
                                <nz-option nzLabel="image/*" nzValue="image/*"></nz-option>
                                <nz-option nzLabel="audio/*" nzValue="audio/*"></nz-option>
                                <nz-option nzLabel="video/*" nzValue="video/*"></nz-option>
                            </nz-select>
                        </nz-form-control>
                    </nz-form-item>
                </div>

                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">是否必填</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch [(ngModel)]="value.required"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>


                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">列表样式</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-select [(ngModel)]="value.listType" style="width: 100%;">
                                <nz-option nzLabel="text" nzValue="text"></nz-option>
                                <nz-option nzLabel="picture" nzValue="picture"></nz-option>
                                <nz-option nzLabel="picture-card" nzValue="picture-card"></nz-option>
                            </nz-select>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">文件尺寸</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.size" [nzFormatter]="formatterPercent" [nzParser]="parserPercent"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">允许上传多个文件</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-switch [(ngModel)]="value.multiple"></nz-switch>
                        </nz-form-control>
                    </nz-form-item>
                </div>
                <div nz-col nzSpan="8" *ngIf="value.multiple">
                    <nz-form-item>
                        <nz-form-label nzSpan="8">单次最大上传文件数</nz-form-label>
                        <nz-form-control nzSpan="16">
                            <nz-input-number [(ngModel)]="value.limit"></nz-input-number>
                        </nz-form-control>
                    </nz-form-item>
                </div>
            </div>
        </div>
    `
})
export class UploadPickerSettingComponent {
    @Input()
    value: UploadPicker;

    formatterPercent = value => `${value} KB`;
    parserPercent = value => value.replace(' KB', '');
}
